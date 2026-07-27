import fs from 'fs';

const data = JSON.parse(fs.readFileSync('src/data/botIntents.ts', 'utf8').replace("import { BotIntent } from '../types';\n\nexport const botIntents: BotIntent[] = ", "").replace(/;\\s*$/, ''));

let count = 0;
data.forEach(x => count += x.images ? 1 : 0);
console.log('Total intents with images:', count);
console.log('Sample image:', data.find(x => x.images)?.images);
