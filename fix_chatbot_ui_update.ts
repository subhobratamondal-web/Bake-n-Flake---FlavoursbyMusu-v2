import fs from 'fs';

let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

// Fix language detection
const findMatchStr = `      const { bestMatch, maxScore } = findBestMatch(userInput);

      if (bestMatch && maxScore > 0) {
        botText = lang === 'en' 
          ? (bestMatch.responseEn || bestMatch.answerEn || botText)
          : (bestMatch.responseBn || bestMatch.answerBn || botText);`;

const findMatchStrRep = `      const { bestMatch, maxScore } = findBestMatch(userInput);

      if (bestMatch && maxScore > 0) {
        const isBengali = /[\\u0980-\\u09FF]/.test(userInput);
        const respondInBn = isBengali || lang === 'bn';
        
        botText = !respondInBn 
          ? (bestMatch.responseEn || bestMatch.answerEn || botText)
          : (bestMatch.responseBn || bestMatch.answerBn || bestMatch.responseEn || botText);`;

code = code.replace(findMatchStr, findMatchStrRep);

// Fix mapIframe style
const mapIframeStr = `{msg.mapIframe && (
                          <div className="mt-3 w-full max-w-[250px] aspect-video rounded-xl overflow-hidden shadow-md border border-slate-100 dark:border-white/10 relative z-10 isolate" style={{ pointerEvents: 'auto' }}>
                             <iframe src={msg.mapIframe} width="100%" height="100%" style={{border:0}} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                          </div>
                        )}`;

const mapIframeRep = `{msg.mapIframe && (
                          <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg aspect-video h-40 md:h-48 w-full max-w-[280px] sm:max-w-xs relative z-10 isolate" style={{ pointerEvents: 'auto' }}>
                             <iframe src={msg.mapIframe} className="w-full h-full border-0 bg-slate-50 dark:bg-slate-800" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                          </div>
                        )}`;

code = code.replace(mapIframeStr, mapIframeRep);

// Fix links style
const linkStyleStr = `className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/10 text-pink-700 dark:bg-pink-500/20 dark:text-pink-300 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-500 dark:hover:text-white rounded-2xl text-[13px] font-bold transition-all shadow-sm"`;

const linkStyleRep = `className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs font-bold text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-500/10 transition-colors shadow-sm"`;

code = code.replace(linkStyleStr, linkStyleRep);

fs.writeFileSync('src/components/ChatBot.tsx', code);
console.log('Fixed ChatBot lang and UI');
