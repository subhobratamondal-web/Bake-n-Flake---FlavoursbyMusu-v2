import { GalleryData, Product, VideoItem } from '../types';

const SPREADSHEET_ID = '1vZsYmZzxu653U4T6O-_S0i2dazAU_VJKBRYwdgAmXSw';

export const CATEGORY_SHEET_NAMES = [
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

export function convertImageUrl(url: string): string {
  if (!url) return '';
  let cleaned = url.trim();
  if (cleaned.includes('drive.google.com') || cleaned.includes('docs.google.com/uc')) {
    const fileIdMatch = cleaned.match(/\/d\/([a-zA-Z0-9_-]+)/) || cleaned.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }
  return cleaned;
}

export function getOptimizedImageUrl(url: string, width = 500, quality = 75): string {
  if (!url) return 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png';
  let cleaned = convertImageUrl(url.trim());

  // Preserve GIFs, SVGs, Data URIs, and animated media so they never get broken or frozen
  if (
    cleaned.startsWith('data:') ||
    cleaned.match(/\.(gif|GIF|svg|SVG)($|\?)/i) ||
    cleaned.includes('ezgif') ||
    cleaned.includes('giphy.com') ||
    cleaned.includes('tenor.com') ||
    cleaned.includes('format=gif')
  ) {
    return cleaned;
  }

  // Google Drive CDN
  if (cleaned.includes('lh3.googleusercontent.com')) {
    if (!cleaned.includes('=w')) {
      return `${cleaned}=w${width}`;
    }
    return cleaned;
  }

  // Direct CDN links (ImgBB, Imgur, Weserv)
  if (cleaned.includes('i.ibb.co') || cleaned.includes('i.imgur.com') || cleaned.includes('images.weserv.nl')) {
    return cleaned;
  }

  // Fallback weserv proxy for raw external HTTP/HTTPS images
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(cleaned)}&w=${width}&q=${quality}&output=webp`;
  }

  return cleaned;
}

function getYoutubeThumbnail(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return '';
}

function formatEmbedUrl(url: string): string {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (trimmed.match(/\.(gif|GIF)($|\?)/)) return trimmed;
  const ytMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&showinfo=0&controls=1`;
  }
  if (trimmed.includes('facebook.com')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=0&autoplay=1&mute=1`;
  }
  if (trimmed.includes('vimeo.com')) {
    const vimeoMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
  }
  return trimmed;
}

async function fetchSheetRows(sheetName: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    if (!text || text.includes('Rate exceeded') || text.startsWith('Rate exceeded') || text.toLowerCase().includes('doctype html')) {
      return [];
    }
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!match || !match[1]) return [];
    try {
      const json = JSON.parse(match[1]);
      const table = json.table;
      if (!table || !table.rows) return [];

      return table.rows.map((row: any) => {
        const cells = row.c ? row.c.map((cell: any) => cell ? (cell.v !== null ? (typeof cell.v === 'object' ? cell.f || '' : String(cell.v)) : '') : '') : [];
        return cells.map((c: string) => c.trim());
      });
    } catch (e) {
      return [];
    }
  } catch (err) {
    return [];
  }
}

export async function fetchGalleryDataDirectFromSheets(): Promise<GalleryData | null> {
  try {
    const result: GalleryData = {
      items: [],
      'YouTube Video': [],
      'Facebook Video': [],
      'Story Section': [],
      'Hero Section': []
    };

    // 1. Fetch main structured sheets in parallel
    const [menuRows, ytRows, fbRows, storyRows, heroRows] = await Promise.all([
      fetchSheetRows('Menu Database'),
      fetchSheetRows('YouTube Video'),
      fetchSheetRows('Facebook Video'),
      fetchSheetRows('Story Section'),
      fetchSheetRows('Hero Section')
    ]);

    // Parse Menu Database
    if (menuRows && menuRows.length > 1) {
      const dataRows = menuRows.slice(1);
      dataRows.forEach((row, idx) => {
        const section = row[0] || 'Signature Menu';
        const nameEn = row[1] || '';
        const nameBn = (row[2] && !row[2].startsWith('http')) ? row[2] : nameEn;
        let img = '';
        for (let i = 3; i < row.length; i++) {
          if (row[i] && (row[i].startsWith('http') || row[i].includes('drive.google.com') || row[i].includes('ibb.co'))) {
            img = convertImageUrl(row[i]);
            break;
          }
        }
        if (nameEn) {
          result.items.push({ nameEn, nameBn, section, img });
        }
      });
    }

    // Parse YouTube Video
    if (ytRows && ytRows.length > 1) {
      const dataRows = ytRows.slice(1);
      dataRows.forEach((row, idx) => {
        const titleEn = row[0] || `Video ${idx + 1}`;
        const rawVid = row[1] || '';
        const fallbackImg = row[2] || '';
        const titleBn = (row[3] && !row[3].startsWith('http')) ? row[3] : titleEn;
        let finalImg = fallbackImg ? convertImageUrl(fallbackImg) : '';
        if (!finalImg) {
          finalImg = getYoutubeThumbnail(rawVid || fallbackImg);
        }
        if (!finalImg) {
          finalImg = 'https://i.ibb.co/XkYN11bL/PROFILE.jpg';
        }
        const isVideo = rawVid.includes('youtube.com') || rawVid.includes('youtu.be') || rawVid.includes('facebook.com') || rawVid.includes('vimeo.com') || rawVid.match(/\.mp4($|\?)/);
        if (titleEn || rawVid || fallbackImg) {
          (result['YouTube Video'] as VideoItem[]).push({
            vid: isVideo ? formatEmbedUrl(rawVid) : formatEmbedUrl(fallbackImg),
            nameEn: titleEn,
            nameBn: titleBn,
            url: isVideo ? rawVid : (fallbackImg || rawVid),
            img: finalImg
          });
        }
      });
    }

    // Parse Facebook Video
    if (fbRows && fbRows.length > 1) {
      const dataRows = fbRows.slice(1);
      dataRows.forEach((row, idx) => {
        const titleEn = row[0] || `Video ${idx + 1}`;
        const rawVid = row[1] || '';
        const fallbackImg = row[2] || '';
        const titleBn = (row[3] && !row[3].startsWith('http')) ? row[3] : titleEn;
        let finalImg = fallbackImg ? convertImageUrl(fallbackImg) : '';
        if (!finalImg) {
          finalImg = getYoutubeThumbnail(rawVid || fallbackImg);
        }
        if (!finalImg) {
          finalImg = 'https://i.ibb.co/XkYN11bL/PROFILE.jpg';
        }
        const isVideo = rawVid.includes('youtube.com') || rawVid.includes('youtu.be') || rawVid.includes('facebook.com') || rawVid.includes('vimeo.com') || rawVid.match(/\.mp4($|\?)/);
        if (titleEn || rawVid || fallbackImg) {
          (result['Facebook Video'] as VideoItem[]).push({
            vid: isVideo ? formatEmbedUrl(rawVid) : formatEmbedUrl(fallbackImg),
            nameEn: titleEn,
            nameBn: titleBn,
            url: isVideo ? rawVid : (fallbackImg || rawVid),
            img: finalImg
          });
        }
      });
    }

    // Parse Story Section
    if (storyRows && storyRows.length > 1) {
      const storyImages: string[] = [];
      storyRows.slice(1).forEach(row => {
        row.forEach(cell => {
          if (cell && (cell.startsWith('http://') || cell.startsWith('https://') || cell.includes('drive.google.com') || cell.includes('ibb.co'))) {
            const converted = convertImageUrl(cell);
            if (converted && !storyImages.includes(converted)) {
              storyImages.push(converted);
            }
          }
        });
      });
      result['Story Section'] = storyImages;
    }

    // Parse Hero Section
    if (heroRows && heroRows.length > 1) {
      const heroImages: string[] = [];
      heroRows.slice(1).forEach(row => {
        row.forEach(cell => {
          if (cell && (cell.startsWith('http://') || cell.startsWith('https://') || cell.includes('drive.google.com') || cell.includes('ibb.co'))) {
            const converted = convertImageUrl(cell);
            if (converted && !heroImages.includes(converted)) {
              heroImages.push(converted);
            }
          }
        });
      });
      result['Hero Section'] = heroImages;
    }

    // 2. Fetch category sub-sheets in parallel batches
    const BATCH_SIZE = 5;
    for (let i = 0; i < CATEGORY_SHEET_NAMES.length; i += BATCH_SIZE) {
      const chunk = CATEGORY_SHEET_NAMES.slice(i, i + BATCH_SIZE);
      const categoryRowsList = await Promise.all(chunk.map(sheetName => fetchSheetRows(sheetName)));

      chunk.forEach((sheetName, index) => {
        const catRows = categoryRowsList[index];
        if (catRows && catRows.length > 0) {
          const catImages: string[] = [];
          catRows.forEach(row => {
            row.forEach(cell => {
              if (cell && (cell.startsWith('http://') || cell.startsWith('https://') || cell.includes('drive.google.com') || cell.includes('ibb.co'))) {
                const converted = convertImageUrl(cell);
                if (converted && !catImages.includes(converted)) {
                  catImages.push(converted);
                }
              }
            });
          });
          if (catImages.length > 0) {
            result[sheetName] = catImages;
          }
        }
      });

      // Small delay between batches to avoid gviz rate limiting
      if (i + BATCH_SIZE < CATEGORY_SHEET_NAMES.length) {
        await new Promise(r => setTimeout(r, 100));
      }
    }

    return result;
  } catch (err) {
    console.error('Error in fetchGalleryDataDirectFromSheets:', err);
    return null;
  }
}

export const BAKERY_WHATSAPP_NUMBER = '919875563329';
export const TARGET_GOOGLE_SHEET_ID = '1vZsYmZzxu653U4T6O-_S0i2dazAU_VJKBRYwdgAmXSw';
export const DEFAULT_GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwooZcsYkCYbzPORtVsU40Mmi8pxT2tFTItb9WKqns7Mk-0WFsx4k_t1kc3tQ7nDN_yjA/exec';

export async function sendOrderToGoogleSheet(order: any, isUpdate: boolean = false): Promise<boolean> {
  try {
    // Build human-readable items string for Google Sheet cell
    let itemsString = '';
    if (Array.isArray(order.items)) {
      itemsString = order.items.map((item: any, i: number) => {
        const name = item.productNameEn || item.nameEn || item.title || 'Cake Item';
        const weight = item.weight ? ` (${item.weight})` : '';
        const qty = item.quantity ? ` x${item.quantity}` : '';
        const note = item.customNote ? ` [Note: ${item.customNote}]` : '';
        return `${i + 1}. ${name}${weight}${qty}${note}`;
      }).join('\n');
    } else if (typeof order.items === 'string') {
      itemsString = order.items;
    } else {
      itemsString = JSON.stringify(order.items || '');
    }

    const payload = {
      orderId: order.id || '#BNF-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: order.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      customerName: order.customerName || order.name || 'Valued Customer',
      customerPhone: order.customerPhone || order.phone || '',
      customerEmail: order.customerEmail || '',
      items: itemsString,
      subtotal: order.subtotal || order.total || 0,
      total: order.total || order.price || 0,
      deliveryAddress: order.deliveryAddress || order.address || 'Kolkata',
      deliveryDate: order.deliveryDate || '',
      status: order.status || 'Pending',
      paymentMethod: order.paymentMethod || 'Cash on Delivery',
      notes: order.notes || order.message || order.requirements || '',
      sheetName: 'order info',
      sheetGid: '1527393898',
      isUpdate: isUpdate
    };

    // 1. Backend server proxy sync
    fetch('/api/sync-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('Backend proxy sync notice:', err));

    // 2. Direct Apps Script webhook call
    fetch(DEFAULT_GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('Direct Apps Script sync notice:', err));

    return true;
  } catch (e) {
    console.error('Sheet sync error:', e);
    return false;
  }
}

export function generateWhatsAppOrderLink(order: any): string {
  const itemsList = order.items.map((item: any, i: number) => 
    `${i + 1}. *${item.productNameEn}* (${item.weight}) x${item.quantity}${item.customNote ? `\n   Note: "${item.customNote}"` : ''}`
  ).join('\n');

  const text = `🎂 *NEW ORDER - Bake n' Flake (~Flavours by Musu)* 🍰

*Order ID:* ${order.id}
*Customer:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Delivery Address:* ${order.deliveryAddress}
*Preferred Delivery Date:* ${order.deliveryDate}

--------------------------
*ORDERED ITEMS:*
${itemsList}

--------------------------
*Payment Method:* ${order.paymentMethod}
*Total Estimated:* ₹${order.total}

Please confirm my order. Thank you!`;

  return `https://wa.me/${BAKERY_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function generateWhatsAppConfirmationLink(order: any): string {
  return generateWhatsAppStatusUpdateLink(order, order.status || 'Confirmed');
}

export function generateWhatsAppStatusUpdateLink(order: any, status: string): string {
  const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  let statusText = '';
  switch (status) {
    case 'Pending':
      statusText = `Hi *${order.customerName}*! 👋 We received your order *${order.id}* at *Bake n' Flake*. Status: *PENDING REVIEW* ⏳ We will confirm shortly!`;
      break;
    case 'Confirmed':
      statusText = `Hi *${order.customerName}*! 👋 Your order *${order.id}* at *Bake n' Flake ~ Flavours by Musu* has been *CONFIRMED*! 🎂✨\n\n*Order Details:*\n- Delivery Date: ${order.deliveryDate}\n- Address: ${order.deliveryAddress}\n- Total Amount: ₹${order.total}\n\nThank you for choosing Bake n' Flake! ❤️`;
      break;
    case 'Preparing':
      statusText = `Hi *${order.customerName}*! 👩‍🍳 Great news! We are now *PREPARING & BAKING* your cake for order *${order.id}*! Handcrafted with love and fresh ingredients! 🎂🧁✨`;
      break;
    case 'Out for Delivery':
      statusText = `Hi *${order.customerName}*! 🚚 Exciting news! Your order *${order.id}* is *OUT FOR DELIVERY* right now! Get ready for your delicious treats! 🎉🎂`;
      break;
    case 'Delivered':
      statusText = `Hi *${order.customerName}*! 🎉 Your order *${order.id}* has been successfully *DELIVERED*! We hope you love every single bite! ❤️✨\n\nPlease let us know your feedback in the app! ⭐️`;
      break;
    case 'Cancelled':
      statusText = `Hi *${order.customerName}*, regarding order *${order.id}*, it has been *CANCELLED*. Please message us if you have any questions or would like to re-order.`;
      break;
    default:
      statusText = `Hi *${order.customerName}*! Update for order *${order.id}*: Status is now *${status}*.`;
  }

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(statusText)}`;
}

export function generateWhatsAppCustomerThanksLink(order: any): string {
  const text = `Hi Musu! 👋 Thank you so much! I received my order *${order.id}* from *Bake n' Flake*! 🎂✨\n\nIt was super fresh and delicious! ❤️🍰`;
  return `https://wa.me/${BAKERY_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
