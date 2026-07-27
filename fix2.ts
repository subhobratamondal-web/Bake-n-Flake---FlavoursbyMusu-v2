import fs from 'fs';
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

if(!code.includes('MapPin')) {
  code = code.replace(
    /Globe, HeartHandshake, Phone, Paperclip,/g,
    'Globe, HeartHandshake, Phone, Paperclip, MapPin, ExternalLink,'
  );
}

const target = `{msg.images && msg.images.length > 0 && (
                          <div className="mt-3">
                            {msg.images.map((imgUrl, i) => (
                              <img key={i} src={imgUrl} alt="Preview" className="max-w-[200px] w-full max-h-[200px] object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform" />
                            ))}
                          </div>
                        )}`;

const replacement = `{msg.images && msg.images.length > 0 && (
                          <div className="mt-3">
                            {msg.images.map((imgUrl, i) => (
                              <img key={i} src={imgUrl} alt="Preview" className="max-w-[200px] w-full max-h-[200px] object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform" />
                            ))}
                          </div>
                        )}

                        {msg.mapIframe && (
                          <div className="mt-3 w-full max-w-[250px] aspect-video rounded-xl overflow-hidden shadow-md border border-slate-100 dark:border-white/10 relative z-10 isolate" style={{ pointerEvents: 'auto' }}>
                             <iframe src={msg.mapIframe} width="100%" height="100%" style={{border:0}} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                          </div>
                        )}

                        {msg.links && msg.links.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                             {msg.links.map((lnk, i) => (
                               <a key={i} href={lnk.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 hover:bg-pink-500 hover:text-white dark:hover:bg-pink-500 dark:hover:text-white rounded-lg text-xs font-bold transition-colors">
                                 {lnk.icon === "MapPin" ? <MapPin size={12} /> : 
                                  lnk.icon === "Phone" ? <Phone size={12} /> :
                                  lnk.icon === "MessageCircle" ? <MessageCircle size={12} /> :
                                  <ExternalLink size={12} />}
                                 {lnk.label}
                               </a>
                             ))}
                          </div>
                        )}`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/ChatBot.tsx', code);
