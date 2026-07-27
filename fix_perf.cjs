const fs = require('fs');
const files = [
  'src/components/Hero.tsx',
  'src/components/GallerySection.tsx',
  'src/components/Story.tsx',
  'src/components/OrderModal.tsx',
  'src/components/Menu.tsx',
  'src/App.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/ transform-gpu/g, '');
  content = content.replace(/ will-change-transform/g, '');
  content = content.replace(/transform-gpu/g, '');
  content = content.replace(/will-change-transform/g, '');
  fs.writeFileSync(file, content);
});
console.log('Fixed performance issues');
