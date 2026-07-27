const fs = require('fs');

let content = fs.readFileSync('src/data/faqs.ts', 'utf-8');

// Replace questionEn: "English / Bengali" with questionEn: "English"
content = content.replace(/questionEn:\s*"(.*?)\s*\/\s*(.*?)"/g, 'questionEn: "$1"');

// Fix map iframe to the one provided by the user
const newMapIframe = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3687.5000858931385!2d88.3911033!3d22.4478343!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027107c2d3f269%3A0x115c8763018d2718!2sBake%20n&#39;%20Flake%20~%20FlavoursbyMusu!5e0!3m2!1sen!2sin!4v1779862971344!5m2!1sen!2sin`;
content = content.replace(/mapIframe:\s*".*?"/, `mapIframe: "${newMapIframe}"`);

fs.writeFileSync('src/data/faqs.ts', content);
console.log("Fixed faqs.ts");
