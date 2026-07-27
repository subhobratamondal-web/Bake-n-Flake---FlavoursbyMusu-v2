import fs from 'fs';
const file = 'src/components/ChatBot.tsx';
let content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
// We need to delete lines 74 to 107 (0-indexed 73 to 106)
lines.splice(73, 34);
fs.writeFileSync(file, lines.join('\n'));
console.log('Fixed syntax error');
