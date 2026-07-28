import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import { PassThrough } from 'stream';
import { FULL_GALLERY_BACKUP } from './src/constants/fullGalleryBackup.js';

dotenv.config();

const app = express();
const PORT = 3000;
const SPREADSHEET_ID = '1vZsYmZzxu653U4T6O-_S0i2dazAU_VJKBRYwdgAmXSw';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logger and Vercel URL normalization middleware
app.use((req, res, next) => {
  // Extract original invoke path on Vercel
  const invokePath = (req.headers['x-invoke-path'] as string) || (req.headers['x-forwarded-uri'] as string);
  if (invokePath && invokePath.startsWith('/api')) {
    req.url = invokePath;
  }
  
  if (req.url.startsWith('/api') || req.url.includes('gallery') || req.url.includes('server-date')) {
    console.log(`[API REQUEST] ${req.method} ${req.url}`);
  }
  next();
});

// Move API Routes to the top with multi-path support
app.get(['/api/server-date', '/server-date'], (req, res) => {
  res.json({ 
    date: new Date().toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    year: new Date().getFullYear()
  });
});

app.get(['/api/health', '/health'], (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(), 
    queueSize: syncQueue.length,
    lastSync: lastSyncTime > 0 ? new Date(lastSyncTime).toISOString() : 'initial_in_progress'
  });
});

app.get(['/api/test', '/test'], (req, res) => {
  res.json({ message: 'Server is alive', timestamp: new Date().toISOString() });
});

app.get(['/api/gallery', '/gallery'], async (req, res) => {
  try {
    if (!cachedGallery || !cachedGallery.items || cachedGallery.items.length === 0) {
      console.log('[API] cachedGallery is empty or uninitialized');
      if (process.env.VERCEL === '1') {
        cachedGallery = JSON.parse(JSON.stringify(FALLBACK_DATA));
      } else {
        await runInitialSync();
      }
    }
    if (!cachedGallery) {
      cachedGallery = JSON.parse(JSON.stringify(FALLBACK_DATA));
    }
    res.json(cachedGallery);
  } catch (err) {
    console.error('[API] Gallery route error:', err);
    res.json(FALLBACK_DATA);
  }
});

app.post(['/api/order', '/order'], async (req, res) => {
  try {
    const { name, deliveryDate, flavor, weight, message, requirements } = req.body;
    
    // Use Server-side API key for appending orders if available
    const auth = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    const sheets = google.sheets({ version: 'v4', auth: auth as any });
    
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Orders!A:G',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            new Date().toLocaleString(), 
            name, 
            deliveryDate, 
            flavor, 
            weight, 
            message, 
            requirements
          ]],
        },
      });
    } catch (sheetErr: any) {
      console.warn('Sheet append skipped:', sheetErr.message);
    }

    res.json({ status: 'success', message: 'Order processed' });
  } catch (error: any) {
    console.error('Order API error:', error);
    res.status(500).json({ status: 'error', message: error.toString() });
  }
});

// Route matcher for /api/index when Vercel rewrites to /api/index
app.all('/api/index', (req, res, next) => {
  const targetPath = (req.query.path as string) || (req.headers['x-invoke-path'] as string) || '';
  if (targetPath.includes('gallery') || req.url.includes('gallery')) {
    return res.json(cachedGallery || FALLBACK_DATA);
  }
  if (targetPath.includes('server-date') || req.url.includes('server-date')) {
    return res.json({ 
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      year: new Date().getFullYear()
    });
  }
  res.json(cachedGallery || FALLBACK_DATA);
});

// Fallback for missing API routes to prevent HTML response
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

function driveToDirectLink(url: string, thumbnail = false) {
  if (!url) return '';
  const trimmed = String(url).trim();
  const match = trimmed.match(/id=([^&]+)/) || 
                trimmed.match(/\/d\/([^/]+)/) || 
                trimmed.match(/uc\?id=([^&]+)/) ||
                trimmed.match(/open\?id=([^&]+)/);
                
  if (match && match[1] && (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com/uc'))) {
    return `https://lh3.googleusercontent.com/d/${match[1]}${thumbnail ? '=s400' : ''}`;
  }
  return trimmed;
}

function formatEmbedUrl(url: string) {
  if (!url) return '';
  const trimmed = String(url).trim();
  
  // Check if it's a direct GIF URL first
  if (trimmed.match(/\.(gif|GIF)($|\?)/)) {
    return trimmed;
  }

  const ytMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&showinfo=0&controls=1`;
  }

  if (trimmed.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=0&autoplay=1&mute=1`;
  }

  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com/uc') || trimmed.includes('lh3.googleusercontent.com')) {
    return driveToDirectLink(trimmed);
  }

  const vimeoMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  return trimmed;
}

function optimizeImageUrl(url: string, thumbnail = false) {
  let optimized = url;
  if (!url) return '';
  if (url.includes('drive.google.com') || url.includes('docs.google.com/uc') || url.includes('lh3.googleusercontent.com')) {
    optimized = driveToDirectLink(url, thumbnail);
  } else if (thumbnail && url.includes('i.pinimg.com')) {
    // Compress Pinterest images
    optimized = url.replace(/\/originals\//, '/736x/').replace(/\/1200x\//, '/736x/');
  }
  return optimized;
}

const FALLBACK_DATA: any = FULL_GALLERY_BACKUP;

// Global state for gallery data
let cachedGallery: any = JSON.parse(JSON.stringify(FALLBACK_DATA));
let sheetCache: Record<string, { data: any, timestamp: number }> = {};
let isSyncing = false;
let lastSyncTime = 0;

async function fetchWithRetry(url: string, signal: AbortSignal, maxRetries = 5): Promise<Response> {
  let lastError: any;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, { signal });
      if (response.status === 429) {
        const delay = Math.pow(2, i * 2) * 5000 + Math.random() * 2000;
        console.warn(`[RATE LIMIT] 429 for ${url}. Retrying...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      if (response.status >= 500 && response.status < 600) {
        const delay = Math.pow(2, i) * 3000 + Math.random() * 1000;
        console.warn(`[SERVER ERROR] ${response.status} for ${url}. Retrying...`);
        lastError = new Error(`HTTP ${response.status}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return response;
    } catch (error: any) {
      lastError = error;
      if (error.name === 'AbortError') throw error;
      const delay = Math.pow(2, i) * 3000 + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw lastError || new Error('Max retries reached');
}

async function fetchPublicSheet(sheetName: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased to 60s
  const startTime = Date.now();
  
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
    const response = await fetchWithRetry(url, controller.signal);
    clearTimeout(timeoutId);

    if (response.status === 404) {
      console.warn(`[SYNC] Sheet NOT FOUND: "${sheetName}"`);
      return null;
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const text = await response.text();
    const duration = Date.now() - startTime;
    
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) return null;
    
    const jsonStr = text.substring(start, end + 1);
    const data = JSON.parse(jsonStr);
    
    if (!data.table || !data.table.rows) return null;

    const rows = data.table.rows.map((row: any) => {
      const cells = row.c ? row.c.map((cell: any) => cell ? (cell.v !== null ? (typeof cell.v === 'object' ? cell.f || '' : String(cell.v)) : '') : '') : [];
      return Array.from({ length: 30 }, (_, i) => String(cells[i] || '').trim());
    });
    console.log(`[SYNC] Loaded "${sheetName}" (${rows.length} rows) in ${duration}ms`);
    return rows;
  } catch (error: any) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    console.error(`[SYNC] Error fetching "${sheetName}" after ${duration}ms:`, error.message);
    return null;
  }
}

// Queue system for smart syncing
const syncQueue: string[] = [];
// Define priority sheets that must be loaded first
let priorityList = [
  'Menu Database', 
  'Subsheet B2',
  'B2 IMAGE LINK',
  'Image URL',
  'Header', 
  'Hero Section', 
  'Story Section', 
  'YouTube Video', 
  'Facebook Video', 
  'Footer', 
  'FAQ',
  // User's requested categories - Signature
  'Chocolate Cakes', 'Butterscotch Cakes', 'Vanilla Cakes', 'Chocolate Truffle', 
  'Pineapple Cakes', 'Mango Cakes', 'Strawberry Cakes', 'Red Velvet Cakes', 
  'Fresh Fruit Cake', 'Forest Range', 'Oreo Cakes', 'Alcohol base Cake', 
  'Coffee Mocha', 'Rasmalai Cake', 'Orange Cake', 'KitKat Cakes',
  // Gifting
  'Birthday Cakes', 'Anniversary Cakes', "Teacher's Day", 'Customised Chocolates', 
  "Father's Day Cake", "Mother's Day Cake", 'Christmas Cake', 'Baby Shower Cake', 
  'Rice Ceremomy cakes',
  // More Items
  'Fresh Flower Cake', 'Doll Cakes', 'Half Cakes', 'Tier Cakes', 'Number Cakes', 
  'Kids Cakes', 'Fondant and Semi Fondant Cakes', 'Glitter Cake', 
  'Customize Theme Cake', 'Cheesecakes', 'Photo Cakes', 'Bento Cakes', 
  'Mousse', 'Jar and Glass Cakes', 'Pinata Cakes', 'Cupcakes and Muffins', 
  'Pizza & Patties', 'Brownies'
];

async function runInitialSync() {
  try {
    console.log('[SYNC] Starting Critical Initial Sync...');
    for (let i = 0; i < priorityList.length; i++) {
      const name = priorityList[i];
      const rows = await fetchPublicSheet(name);
      if (rows && rows.length > 0) {
        sheetCache[name] = { data: rows, timestamp: Date.now() };
        if (name === 'Menu Database' || name === 'Subsheet B2') rebuildGallery();
      }
      // Delay to respect rate limits and prevent 500 errors
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    rebuildGallery();
    console.log('[SYNC] Critical Initial Sync Complete.');
  } catch (err) {
    console.error('[SYNC] Critical Sync ERROR:', err);
  }
}

async function processQueue() {
  if (isSyncing) return;
  
  // Ensure background sync doesn't lag too much
  const now = Date.now();
  isSyncing = true;

  try {
    // Attempt dynamic sheet discovery
    try {
      const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
      if (apiKey) {
        const sheetsAuth = google.sheets({ version: 'v4', auth: apiKey });
        const res = await sheetsAuth.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
        const allSheetTitles = (res.data.sheets || []).map(s => s.properties?.title).filter(Boolean) as string[];
        allSheetTitles.forEach(title => {
          if (!priorityList.includes(title)) {
            priorityList.push(title);
            syncQueue.push(title);
          }
        });
      }
    } catch (e: any) {
      console.warn('[SYNC] Dynamic discovery skipped:', e.message);
    }

    // 1. Prioritize critical sheets in parallel every cycle
    const criticalSheets = ['Menu Database', 'Subsheet B2', 'B2 IMAGE LINK', 'Image URL'];
    for (const sName of criticalSheets) {
      const rows = await fetchPublicSheet(sName);
      if (rows && rows.length > 1) { // Require at least one data row + header
        sheetCache[sName] = { data: rows, timestamp: now };
      }
      // Small delay between critical sheets to be extremely safe
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    // 2. Rebuild so UI updates immediately after critical sheets
    rebuildGallery();

    // 3. Process a small BATCH of sheets from the background queue to speed up sync
    if (syncQueue.length === 0) {
      // Re-populate queue
      const allPossible = Array.from(new Set(priorityList));
      allPossible.forEach(name => {
        if (!criticalSheets.includes(name)) syncQueue.push(name);
      });
    }

    if (syncQueue.length > 0) {
      // Fetch up to 5 sheets per background cycle (reduced from 10)
      const batch = syncQueue.splice(0, 5);
      let changed = false;
      for (const name of batch) {
        const rows = await fetchPublicSheet(name);
        if (rows && rows.length > 0) {
          sheetCache[name] = { data: rows, timestamp: now };
          changed = true;
        }
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      if (changed) rebuildGallery();
      lastSyncTime = now;
    }
  } catch (err) {
    console.error('[SYNC] Global Queue Error:', err);
  } finally {
    isSyncing = false;
  }
}

function getYoutubeThumbnail(url: string) {
  if (!url) return '';
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return '';
}

function rebuildGallery() {
  const newGallery: any = JSON.parse(JSON.stringify(FALLBACK_DATA));
  
  // 1. Create a global image map from "Image URL" and "B2 IMAGE LINK"
  const imageMap: Record<string, string> = {};
  const imgSheets = ['Image URL', 'B2 IMAGE LINK'];
  imgSheets.forEach(sheetName => {
    const cached = sheetCache[sheetName];
    if (cached && cached.data.length > 0) {
      cached.data.forEach((row: any) => {
        const key = String(row[0] || '').trim().toLowerCase();
        let imgUrl = '';
        for (let i = 1; i < row.length; i++) {
          const val = String(row[i] || '').trim();
          if (val && (val.startsWith('http') || val.includes('drive.google.com') || val.includes('ibb.co'))) {
            imgUrl = optimizeImageUrl(val, true); // Use thumbnails for map
            break;
          }
        }
        if (key && imgUrl) imageMap[key] = imgUrl;
      });
    }
  });

  // 2. Rebuild Items from Menu Database or Subsheet B2 cache
  const menuSources = ['Menu Database', 'Subsheet B2'];
  let menuRows: any[] = [];
  for (const src of menuSources) {
    const cached = sheetCache[src];
    if (cached && cached.data.length > 1) {
      menuRows = cached.data.slice(1);
      break;
    }
  }

  if (menuRows.length > 0) {
    newGallery.items = [];
    menuRows.forEach((row: any) => {
      const section = String(row[0] || 'Signature').trim();
      const nameEn = String(row[1] || '').trim();
      const nameBn = String(row[2] || row[1] || '').trim();
      
      // Look for image in row first
      let img = '';
      for (let i = 0; i < row.length; i++) {
        const val = String(row[i] || '').trim();
        if (val && (val.startsWith('http') || val.includes('drive.google.com') || val.includes('ibb.co'))) {
          const direct = optimizeImageUrl(val, true); // Use thumbnails for menu items
          if (direct.length > 15 && (direct.startsWith('http') || direct.includes('drive'))) {
             if (direct !== nameEn && direct !== nameBn) {
               img = direct;
               break;
             }
          }
        }
      }

      // Fallback to global image map
      if (!img) {
        img = imageMap[nameEn.toLowerCase()] || imageMap[nameBn.toLowerCase()] || '';
      }
      
      const rounded = String(row[4] || '').toLowerCase() === 'true' || String(row[4] || '').toLowerCase() === 'yes';
      if (nameEn) {
        newGallery.items.push({ nameEn, nameBn, section, img, rounded });
        if (!priorityList.includes(nameEn)) {
          priorityList.push(nameEn);
          syncQueue.unshift(nameEn); // Add to the front of the queue to sync immediately
        }
      }
    });
  }

  // 3. Map all cached sheets to the gallery
  Object.keys(sheetCache).forEach(name => {
    if (menuSources.includes(name) || imgSheets.includes(name)) return;
    const cached = sheetCache[name];
    const dataRows = cached.data.slice(1);

    if (name === 'FAQ') {
      newGallery[name] = dataRows.map((row: any, idx: number) => {
        const qEn = String(row[0] || '').trim();
        const aEn = String(row[1] || '').trim();
        const qBn = String(row[2] || qEn).trim();
        const aBn = String(row[3] || aEn).trim();
        const category = String(row[4] || 'General').trim();
        if (!qEn && !aEn) return null;
        let images: string[] = [];
        const imgField = String(row[5] || '').trim();
        if (imgField.includes('http') || imgField.includes('drive')) {
          images = imgField.split(',').map(u => optimizeImageUrl(u.trim(), true)).filter(Boolean);
        }
        let links: any[] = [];
        const linksField = String(row[6] || '').trim();
        if (linksField) {
          links = linksField.split(',').map(l => {
            const parts = l.split('|');
            if (parts.length >= 2) return { label: parts[0].trim(), url: parts[1].trim() };
            return null;
          }).filter(Boolean);
        }
        return {
          id: 4000 + idx,
          questionEn: qEn,
          answerEn: aEn,
          questionBn: qBn,
          answerBn: aBn,
          category,
          images,
          links
        };
      }).filter(Boolean);
    } else if (['YouTube Video', 'Facebook Video'].includes(name)) {
      newGallery[name] = dataRows.map((row: any) => {
        const labelEn = String(row[0] || '').trim();
        const rawVid = String(row[1] || '').trim();
        const fallbackImg = String(row[2] || '').trim();
        const labelBn = String(row[3] || labelEn).trim();
        
        if (!labelEn && !rawVid && !fallbackImg) return null;

        // Determine thumbnail
        let finalImg = fallbackImg ? optimizeImageUrl(fallbackImg, false) : '';
        if (!finalImg || finalImg.includes('youtube.com') || finalImg.includes('youtu.be')) {
          const ytThumb = getYoutubeThumbnail(rawVid || fallbackImg);
          if (ytThumb) finalImg = ytThumb;
        }

        if (!finalImg) {
          finalImg = imageMap[labelEn.toLowerCase()] || imageMap[labelBn.toLowerCase()] || "https://i.ibb.co/XkYN11bL/PROFILE.jpg";
        }

        // Detect if the video link is actually a video or just an image link
        const isVideo = rawVid.includes('youtube.com') || rawVid.includes('youtu.be') || rawVid.includes('facebook.com') || rawVid.includes('vimeo.com') || rawVid.match(/\.mp4($|\?)/);

        return {
          nameEn: labelEn,
          nameBn: labelBn,
          vid: isVideo ? formatEmbedUrl(rawVid) : formatEmbedUrl(fallbackImg),
          url: isVideo ? rawVid : (fallbackImg || rawVid),
          img: finalImg
        };
      }).filter(Boolean);
    } else {
      const imgs = dataRows.map((row: any) => {
        const itemName = String(row[0] || '').trim();
        // High-tolerance column scanning
        const candidates = [row[1], row[0], row[2], row[3], row[4], ...row.slice(5)];
        for (const val of candidates) {
          const v = String(val || '').trim();
          if (v && (v.startsWith('http') || v.includes('drive.google.com') || v.includes('ibb.co') || v.includes('pinimg.com'))) {
            return optimizeImageUrl(v, true); // Use low-res thumbnails to fix slow loading and black images
          }
        }
        // Fallback to image map
        if (itemName) return imageMap[itemName.toLowerCase()];
        return null;
      }).filter(Boolean);
      
      if (imgs.length > 0) {
        newGallery[name] = Array.from(new Set(imgs));
      }
    }
  });

  newGallery.totalImageCount = Object.keys(imageMap).length;
  
  // High-value safety check: Don't override with empty data if we already had data
  if (newGallery.items && newGallery.items.length > 0) {
    cachedGallery = newGallery;
  } else if (!cachedGallery || !cachedGallery.items || cachedGallery.items.length === 0) {
     cachedGallery = newGallery; // Initial setup
  } else {
    console.warn('[SYNC] rebuildGallery produced empty items, keeping old cache');
  }
}

// Note: runInitialSync and background workers are now started within startServer()


// Google Sheets & Drive API Setup Helper
async function getAuthenticatedClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return oauth2Client;
}

async function uploadToDrive(accessToken: string, base64Image: string, fileName: string) {
  const auth = await getAuthenticatedClient(accessToken);
  const drive = google.drive({ version: 'v3', auth });

  // Convert base64 to buffer
  const base64Data = base64Image.split(';base64,').pop();
  if (!base64Data) return null;
  
  const buffer = Buffer.from(base64Data, 'base64');
  const bufferStream = new PassThrough();
  bufferStream.end(buffer);

  try {
    const fileMetadata = {
      name: fileName,
      parents: [] // Optionally specify a folder ID if needed
    };
    const media = {
      mimeType: 'image/png',
      body: bufferStream
    };
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink'
    });
    return response.data;
  } catch (err) {
    console.error('Drive upload error:', err);
    return null;
  }
}

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Start syncing after server is up to avoid startup blocking
    runInitialSync().catch(err => console.error('Initial sync failed:', err));
    // Background workers
    setInterval(processQueue, 3000); // Check every 3s for updates
  });
}

if (process.env.VERCEL !== '1') {
  startServer();
}

export default app;
export { app };
