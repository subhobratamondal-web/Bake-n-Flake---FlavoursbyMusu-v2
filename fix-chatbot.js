const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');
code = code.replace(
  'links: faq.link ? [{ label: "More Info", url: faq.link }] : undefined,\n             images: faq.image ? [faq.image] : undefined',
  'links: faq.links || (faq.link ? [{ label: "More Info", url: faq.link }] : undefined),\n             images: (faq.images) || (faq.image ? [faq.image] : undefined),\n             mapIframe: faq.mapIframe'
);
fs.writeFileSync('src/components/ChatBot.tsx', code);
