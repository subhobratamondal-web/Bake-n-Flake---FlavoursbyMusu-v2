const text = "শুভ দিন! আপনার উদযাপনকে মিষ্টি করতে আমরা প্রস্তুত! [🔗 WhatsApp: https://wa.me/919875563329]";
const linkRegex = /\[(.*?)\s*:\s*(.*?)\]/g;
let match;
while ((match = linkRegex.exec(text)) !== null) {
  console.log(match);
}
