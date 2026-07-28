import fs from 'fs';
import path from 'path';

const SPREADSHEET_ID = '1vZsYmZzxu653U4T6O-_S0i2dazAU_VJKBRYwdgAmXSw';

const ALL_SHEET_NAMES = [
  'Menu Database', 'YouTube Video', 'Facebook Video', 'Story Section', 'Hero Section', 'Header', 'Footer', 'FAQ',
  'Chocolate Cakes', 'Butterscotch Cakes', 'Vanilla Cakes', 'Chocolate Truffle',
  'Pineapple Cakes', 'Mango Cakes', 'Strawberry Cakes', 'Red Velvet Cakes',
  'Fresh Fruit Cake', 'Forest Range', 'Oreo Cakes', 'Alcohol base Cake',
  'Coffee Mocha', 'Rasmalai Cake', 'Orange Cake', 'KitKat Cakes',
  'Birthday Cakes', 'Anniversary Cakes', "Teacher's Day", 'Customised Chocolates',
  "Father's Day Cake", "Mother's Day Cake", 'Christmas Cake', 'Baby Shower Cake',
  'Rice Ceremomy cakes', 'Fresh Flower Cake', 'Doll Cakes', 'Half Cakes',
  'Tier Cakes', 'Number Cakes', 'Kids Cakes', 'Fondant and Semi Fondant Cakes',
  'Glitter Cake', 'Customize Theme Cake', 'Cheesecakes', 'Photo Cakes',
  'Bento Cakes', 'Mousse', 'Jar and Glass Cakes', 'Pinata Cakes',
  'Cupcakes and Muffins', 'Pizza & Patties', 'Brownies', 'Combos'
];

function convertImageUrl(url) {
  if (!url) return '';
  let cleaned = String(url).trim();
  if (cleaned.includes('drive.google.com') || cleaned.includes('docs.google.com/uc')) {
    const fileIdMatch = cleaned.match(/\/d\/([a-zA-Z0-9_-]+)/) || cleaned.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return 'https://lh3.googleusercontent.com/d/' + fileIdMatch[1];
    }
  }
  return cleaned;
}

function getYoutubeThumbnail(url) {
  if (!url) return '';
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match && match[1]) {
    return 'https://img.youtube.com/vi/' + match[1] + '/hqdefault.jpg';
  }
  return '';
}

function formatEmbedUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (trimmed.match(/\.(gif|GIF)($|\?)/)) return trimmed;
  const ytMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return 'https://www.youtube.com/embed/' + ytMatch[1] + '?autoplay=1&rel=0&showinfo=0&controls=1';
  }
  if (trimmed.includes('facebook.com')) {
    return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(trimmed) + '&show_text=0&autoplay=1&mute=1';
  }
  if (trimmed.includes('vimeo.com')) {
    const vimeoMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return 'https://player.vimeo.com/video/' + vimeoMatch[1] + '?autoplay=1';
    }
  }
  return trimmed;
}

async function fetchSheetRows(sheetName) {
  const url = 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/gviz/tq?tqx=out:json&sheet=' + encodeURIComponent(sheetName);
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!match || !match[1]) return [];
    const json = JSON.parse(match[1]);
    const table = json.table;
    if (!table || !table.rows) return [];
    return table.rows.map(row => {
      const cells = row.c ? row.c.map(cell => cell ? (cell.v !== null ? (typeof cell.v === 'object' ? cell.f || '' : String(cell.v)) : '') : '') : [];
      return cells.map(c => String(c).trim());
    });
  } catch (e) {
    return [];
  }
}

async function generateBackup() {
  console.log('Fetching all sheets from Google Sheets...');
  const results = {};
  
  const allData = await Promise.all(ALL_SHEET_NAMES.map(s => fetchSheetRows(s)));
  
  const sheetMap = {};
  ALL_SHEET_NAMES.forEach((name, idx) => {
    sheetMap[name] = allData[idx];
  });

  // 1. Menu Database
  const menuRows = sheetMap['Menu Database'] || [];
  results.items = [];
  if (menuRows.length > 1) {
    menuRows.slice(1).forEach(row => {
      const section = row[0] || 'Signature Menu';
      const nameEn = row[1] || '';
      const nameBn = row[2] || nameEn;
      let img = '';
      for (let i = 3; i < row.length; i++) {
        if (row[i] && (row[i].startsWith('http') || row[i].includes('drive.google.com') || row[i].includes('ibb.co'))) {
          img = convertImageUrl(row[i]);
          break;
        }
      }
      if (nameEn) {
        results.items.push({ nameEn, nameBn, section, img });
      }
    });
  }

  // 2. YouTube Video
  const ytRows = sheetMap['YouTube Video'] || [];
  results['YouTube Video'] = [];
  if (ytRows.length > 1) {
    ytRows.slice(1).forEach((row, idx) => {
      const labelEn = row[0] || `Video ${idx + 1}`;
      const rawVid = row[1] || '';
      const fallbackImg = row[2] || '';
      const labelBn = row[3] || labelEn;
      let finalImg = fallbackImg ? convertImageUrl(fallbackImg) : '';
      if (!finalImg) {
        finalImg = getYoutubeThumbnail(rawVid || fallbackImg);
      }
      if (!finalImg) {
        finalImg = 'https://i.ibb.co/XkYN11bL/PROFILE.jpg';
      }
      const isVideo = rawVid.includes('youtube.com') || rawVid.includes('youtu.be') || rawVid.includes('facebook.com') || rawVid.includes('vimeo.com') || rawVid.match(/\.mp4($|\?)/);
      results['YouTube Video'].push({
        nameEn: labelEn,
        nameBn: labelBn,
        vid: isVideo ? formatEmbedUrl(rawVid) : formatEmbedUrl(fallbackImg),
        url: isVideo ? rawVid : (fallbackImg || rawVid),
        img: finalImg
      });
    });
  }

  // 3. Facebook Video
  const fbRows = sheetMap['Facebook Video'] || [];
  results['Facebook Video'] = [];
  if (fbRows.length > 1) {
    fbRows.slice(1).forEach((row, idx) => {
      const labelEn = row[0] || `Video ${idx + 1}`;
      const rawVid = row[1] || '';
      const fallbackImg = row[2] || '';
      const labelBn = row[3] || labelEn;
      let finalImg = fallbackImg ? convertImageUrl(fallbackImg) : '';
      if (!finalImg) {
        finalImg = getYoutubeThumbnail(rawVid || fallbackImg);
      }
      if (!finalImg) {
        finalImg = 'https://i.ibb.co/XkYN11bL/PROFILE.jpg';
      }
      const isVideo = rawVid.includes('youtube.com') || rawVid.includes('youtu.be') || rawVid.includes('facebook.com') || rawVid.includes('vimeo.com') || rawVid.match(/\.mp4($|\?)/);
      results['Facebook Video'].push({
        nameEn: labelEn,
        nameBn: labelBn,
        vid: isVideo ? formatEmbedUrl(rawVid) : formatEmbedUrl(fallbackImg),
        url: isVideo ? rawVid : (fallbackImg || rawVid),
        img: finalImg
      });
    });
  }

  // 4. Story Section
  const storyRows = sheetMap['Story Section'] || [];
  results['Story Section'] = [];
  if (storyRows.length > 1) {
    storyRows.slice(1).forEach(row => {
      row.forEach(cell => {
        if (cell && (cell.startsWith('http') || cell.includes('drive.google.com') || cell.includes('ibb.co'))) {
          const img = convertImageUrl(cell);
          if (img && !results['Story Section'].includes(img)) {
            results['Story Section'].push(img);
          }
        }
      });
    });
  }

  // 5. Hero Section
  const heroRows = sheetMap['Hero Section'] || [];
  results['Hero Section'] = [];
  if (heroRows.length > 1) {
    heroRows.slice(1).forEach(row => {
      row.forEach(cell => {
        if (cell && (cell.startsWith('http') || cell.includes('drive.google.com') || cell.includes('ibb.co'))) {
          const img = convertImageUrl(cell);
          if (img && !results['Hero Section'].includes(img)) {
            results['Hero Section'].push(img);
          }
        }
      });
    });
  }

  // 6. All Category sheets
  ALL_SHEET_NAMES.forEach(sName => {
    if (['Menu Database', 'YouTube Video', 'Facebook Video', 'Story Section', 'Hero Section', 'FAQ', 'Header', 'Footer'].includes(sName)) return;
    const catRows = sheetMap[sName] || [];
    if (catRows.length > 0) {
      const imgs = [];
      catRows.forEach(row => {
        row.forEach(cell => {
          if (cell && (cell.startsWith('http') || cell.includes('drive.google.com') || cell.includes('ibb.co') || cell.includes('pinimg.com'))) {
            const img = convertImageUrl(cell);
            if (img && !imgs.includes(img)) imgs.push(img);
          }
        });
      });
      if (imgs.length > 0) {
        results[sName] = imgs;
      }
    }
  });

  console.log('Summary of generated backup:');
  console.log('- Items count:', results.items.length);
  console.log('- YT videos count:', results['YouTube Video'].length);
  console.log('- FB videos count:', results['Facebook Video'].length);
  console.log('- Story images:', results['Story Section'].length);
  console.log('- Hero images:', results['Hero Section'].length);
  console.log('- Total sections in backup:', Object.keys(results).length);

  const fileContent = `// Auto-generated full static gallery backup from Google Sheet\nexport const FULL_GALLERY_BACKUP = ${JSON.stringify(results, null, 2)};\n`;
  const targetPath = path.join(process.cwd(), 'src', 'constants', 'fullGalleryBackup.ts');
  fs.writeFileSync(targetPath, fileContent, 'utf-8');
  console.log('Successfully updated src/constants/fullGalleryBackup.ts!');
}

generateBackup();
