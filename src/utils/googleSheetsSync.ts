import { GalleryData, MenuItem, VideoItem } from '../types';

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

function convertImageUrl(url: string): string {
  if (!url) return '';
  let cleaned = url.trim();
  if (cleaned.includes('drive.google.com')) {
    const fileIdMatch = cleaned.match(/\/d\/([a-zA-Z0-9_-]+)/) || cleaned.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
    }
  }
  return cleaned;
}

async function fetchSheetRows(sheetName: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);/);
    if (!match || !match[1]) return [];
    const json = JSON.parse(match[1]);
    const table = json.table;
    if (!table || !table.rows) return [];

    return table.rows.map((row: any) => {
      const cells = row.c ? row.c.map((cell: any) => cell ? (cell.v !== null ? (typeof cell.v === 'object' ? cell.f || '' : String(cell.v)) : '') : '') : [];
      return cells.map((c: string) => c.trim());
    });
  } catch (err) {
    console.warn(`Failed fetching sheet "${sheetName}":`, err);
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
        const nameBn = row[2] || nameEn;
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
        const titleBn = titleEn;
        const videoUrl = row[1] || '';
        const imgUrl = convertImageUrl(row[2] || '');
        if (videoUrl || imgUrl) {
          (result['YouTube Video'] as VideoItem[]).push({
            vid: `yt_${idx + 1}`,
            nameEn: titleEn,
            nameBn: titleBn,
            url: videoUrl,
            img: imgUrl
          });
        }
      });
    }

    // Parse Facebook Video
    if (fbRows && fbRows.length > 1) {
      const dataRows = fbRows.slice(1);
      dataRows.forEach((row, idx) => {
        const titleEn = row[0] || `Video ${idx + 1}`;
        const titleBn = titleEn;
        const videoUrl = row[1] || '';
        const imgUrl = convertImageUrl(row[2] || '');
        if (videoUrl || imgUrl) {
          (result['Facebook Video'] as VideoItem[]).push({
            vid: `fb_${idx + 1}`,
            nameEn: titleEn,
            nameBn: titleBn,
            url: videoUrl,
            img: imgUrl
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
    const BATCH_SIZE = 10;
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
    }

    return result;
  } catch (err) {
    console.error('Error in fetchGalleryDataDirectFromSheets:', err);
    return null;
  }
}
