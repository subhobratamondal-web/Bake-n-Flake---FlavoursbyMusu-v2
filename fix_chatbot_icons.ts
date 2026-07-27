import fs from 'fs';

let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

const targetLinksInner = `{lnk.icon === "MapPin" ? <MapPin size={12} /> : 
                                  lnk.icon === "Phone" ? <Phone size={12} /> :
                                  lnk.icon === "MessageCircle" ? <MessageCircle size={12} /> :
                                  <ExternalLink size={12} />}
                                 {lnk.label}`;

const repLinksInner = `{lnk.icon && lnk.icon.startsWith('http') ? (
                                    <img src={lnk.icon} alt={lnk.label} className="w-4 h-4 object-contain drop-shadow-sm" />
                                 ) : lnk.icon === "MapPin" ? <MapPin size={14} /> : 
                                  lnk.icon === "Phone" ? <Phone size={14} /> :
                                  lnk.icon === "MessageCircle" ? <MessageCircle size={14} /> :
                                  <ExternalLink size={14} />}
                                 {lnk.label}`;

code = code.replace(targetLinksInner, repLinksInner);

fs.writeFileSync('src/components/ChatBot.tsx', code);
console.log('Fixed links icons');
