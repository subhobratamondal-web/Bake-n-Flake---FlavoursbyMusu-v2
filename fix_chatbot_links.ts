import fs from 'fs';

let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

const targetLinks = `className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-500 dark:hover:text-white rounded-lg text-xs font-bold transition-colors"`;

const replacementLinks = `className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors shadow-sm"`;

code = code.replace(targetLinks, replacementLinks);

fs.writeFileSync('src/components/ChatBot.tsx', code);
console.log('Fixed links style');
