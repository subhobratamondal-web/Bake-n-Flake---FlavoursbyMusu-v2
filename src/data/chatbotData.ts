export interface BotIntent {
  keywords: string[];
  en: string;
  bn: string;
  image?: string;
  links?: { label: string; url: string }[];
}

export const chatbotData: BotIntent[] = [
  // 1. Location & Contact
  {
    keywords: ["location", "address", "direction", "ঠিকানা", "কোথায়", "কোথায়", "কীভাবে যাব", "map", "ম্যাপ", "shop location", "যেতে চাই"],
    en: "We are located at Kamalgazi, Kolkata, 700103. Get directions here:",
    bn: "আমরা কলকাতার কমলগাজীতে (৭০০০১০৩) অবস্থিত। ম্যাপে আমাদের অবস্থান দেখতে এখানে ক্লিক করুন:",
    links: [{ label: "📍 Google Maps Location", url: "https://www.google.com/maps/place/Bake+n'+Flake+~+FlavoursbyMusu/@22.4478343,88.3911033,17z" }]
  },
  {
    keywords: ["call", "phone number", "mobile", "কন্টাক্ট নম্বর", "ফোন নম্বর", "নাম্বার", "কথা বলতে চাই", "যোগাযোগ", "contact"],
    en: "You can call us directly for orders or inquiries at: +919875563329.",
    bn: "যেকোনো তথ্য জানতে বা সরাসরি অর্ডারের জন্য আমাদের কল করুন: +919875563329।",
    links: [{ label: "📞 Call +919875563329", url: "tel:+919875563329" }]
  },
  {
    keywords: ["whatsapp", "text", "live chat", "হোয়াটসঅ্যাপ", "হোয়াটসঅ্যাপ", "message via whatsapp"],
    en: "Let's chat instantly on WhatsApp to customize your cake:",
    bn: "আমাদের সাথে সরাসরি হোয়াটসঅ্যাপে কথা বলে কেক কাস্টমাইজ করতে এখানে ক্লিক করুন:",
    links: [{ label: "💬 WhatsApp Chat", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["messenger", "fb chat", "ইনবক্স", "মেসেঞ্জার", "facebook message", "inbox"],
    en: "Send us a direct message on Messenger:",
    bn: "আমাদের সাথে ফেসবুক মেসেঞ্জারে সরাসরি চ্যাট করতে এখানে ক্লিক করুন:",
    links: [{ label: "💬 Chat on Messenger", url: "https://m.me/flavoursbymusu" }]
  },
  {
    keywords: ["email", "mail address", "জিমেইল", "ইমেইল", "gmail"],
    en: "You can drop an email at: Khanmegha99@gmail.com.",
    bn: "আমাদের অফিসিয়াল ইমেইলে যোগাযোগ করতে পারেন: Khanmegha99@gmail.com।",
    links: [{ label: "✉️ Email Us", url: "mailto:Khanmegha99@gmail.com" }]
  },
  {
    keywords: ["seating", "shop timing", "দোকান কখন খোলা", "কখন খোলা", "open time", "visit shop", "বসে খাওয়া"],
    en: "We majorly operate on a pre-order basis. Please drop a message on WhatsApp before visiting.",
    bn: "আমরা মূলত প্রি-অর্ডারের ভিত্তিতে কাজ করি। আসার আগে দয়া করে আমাদের WhatsApp-এ একটি মেসেজ দিয়ে কনফর্ম করে নেবেন।"
  },

  // 2. Signature Cakes & Flavors
  {
    keywords: ["chocolate cake", "চকোলেট কেক", "চকলেট কেক", "ছবি দেখান", "picture", "choclate"],
    en: "Classic chocolate cakes baked fresh with rich premium cocoa.",
    bn: "প্রিমিয়াম কোকো পাউডার দিয়ে তৈরি আমাদের ক্লাসিক চকোলেট কেক।",
    image: "https://i.ibb.co/xSTgDb8d/Chocolate-Cakes-1.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["butterscotch cake", "বাটারস্কচ", "বাটারস্কচ কেক", "butterscotch"],
    en: "Rich Butterscotch cakes with real butter and crunchy caramel praline.",
    bn: "আসল মাখন এবং ক্রাঞ্চি ক্যারামেল প্রালিন দিয়ে তৈরি বাটারস্কচ কেক।",
    image: "https://i.ibb.co/fYcwMKdc/Butterscotch-Cakes-1.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["vanilla cake", "ভ্যানিলা কেক", "vanilla"],
    en: "Soft, elegant, and classic Vanilla cakes perfect for any celebration.",
    bn: "নরম এবং ক্লাসিক ভ্যানিলা কেক, যা যেকোনো উৎসবের জন্য পারফেক্ট।",
    image: "https://i.ibb.co/qMBQG6Nk/Vanilla-Cake-1.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["chocolate truffle", "চকোলেট ট্রাফল", "truffle cake", "ট্রাফল কেক"],
    en: "Our ultimate best-seller! Rich, dark, and smooth chocolate truffle layers.",
    bn: "আমাদের সবচেয়ে বেশি বিক্রি হওয়া রিচ এবং স্মুথ চকোলেট ট্রাফল কেক।",
    image: "https://i.ibb.co/MKF765x/Chocolate-Truffle-Cakes-1.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["pineapple cake", "পাইনঅ্যাপল কেক", "আনারস কেক", "pineapple"],
    en: "Freshly baked Pineapple cakes with tangy pineapple chunks inside.",
    bn: "কেকের ভেতরে আনারসের তাজা টুকরোসহ ফ্রেশ পাইনঅ্যাপল কেক।",
    image: "https://i.ibb.co/gbC67jD7/PIneapple-Cake-1.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["mango cake", "ম্যাংগো কেক", "আমের কেক", "mango"],
    en: "Delicious Mango Cakes layered with high-grade natural mango pulp.",
    bn: "উচ্চমানের প্রাকৃতিক আমের পাল্প দিয়ে তৈরি সুস্বাদু ম্যাংগো কেক।",
    image: "https://i.ibb.co/q3M2pvxs/Mango-Cake-1.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["strawberry cake", "স্ট্রবেরি কেক", "strawberry"],
    en: "Vibrant Strawberry cakes made with delicious natural fruit elements.",
    bn: "প্রাকৃতিক ফলের উপাদান দিয়ে তৈরি চমৎকার স্ট্রবেরি কেক।",
    image: "https://i.ibb.co/7JYt6dJp/Strawberry-Cakes-1.jpg",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["red velvet", "red velvet cake", "রেড ভেলভেট", "রেড ভেলভেট কেক"],
    en: "Premium Red Velvet cakes crafted with authentic, rich cream cheese frosting.",
    bn: "আসল রিচ ক্রিম চিজ ফ্রস্টিং দিয়ে তৈরি আমাদের প্রিমিয়াম রেড ভেলভেট কেক।",
    image: "https://i.ibb.co/s9gGgtpk/Red-velvet-1.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["fresh fruit cake", "ফ্রেশ ফ্রুট কেক", "ফলের কেক", "fruit cake"],
    en: "Healthy and colorful Fresh Fruit cakes loaded with premium seasonal fruits.",
    bn: "প্রিমিয়াম মরসুমি তাজা ফলে ভরপুর স্বাস্থ্যকর ও রঙিন ফ্রেশ ফ্রুট কেক।",
    image: "https://i.ibb.co/F4V5yd16/Fresh-Fruit-Cake-1.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["oreo cake", "ওরিও কেক", "oreo"],
    en: "Crunchy and creamy Oreo Cakes, a massive hit among kids and chocolate lovers!",
    bn: "ক্রাঞ্চি ও ক্রিমি ওরিও কেক, যা বাচ্চা এবং চকোলেট প্রেমীদের অত্যন্ত প্রিয়!",
    image: "https://i.ibb.co/nprbQJC/Oreo-Cake-2.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["alcohol base cake", "অ্যালকোহল কেক", "অ্যালকোহল", "alcohol cake", "liquor cake", "মদ"],
    en: "Premium Alcohol-infused cakes curated specially for adult parties and events.",
    bn: "প্রাপ্তবয়স্কদের পার্টি এবং অনুষ্ঠানের জন্য বিশেষভাবে তৈরি অ্যালকোহল-বেসড কেক।",
    image: "https://i.ibb.co/xSj9RRdz/Alcohol-Cake-01.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["coffee mocha", "কফি মোকা", "কফি কেক", "coffee cake"],
    en: "Rich Coffee Mocha cakes pairing premium coffee beans with dark chocolate profiles.",
    bn: "ডার্ক চকোলেট ও প্রিমিয়াম কফির চমৎকার কম্বিনেশনে তৈরি কফি মোকা কেক।",
    image: "https://i.ibb.co/4w2jyMmB/Coffee-Cake-1.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["rasmalai cake", "রসমলাই কেক", "rasmalai"],
    en: "Our royal fusion specialty! Loaded with real rasmalai chunks, saffron, and pistachios.",
    bn: "আমাদের রয়্যাল ফিউশন আইটেম! আসল রসমলাইয়ের টুকরো, জাফরান এবং পেস্তা সমৃদ্ধ কেক।",
    image: "https://i.ibb.co/4RBygSqR/Rasmalai-Cake-1.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["orange cake", "অরেঞ্জ কেক", "কমলালেবুর কেক", "orange", "কমলালেবু"],
    en: "Refreshing Orange cakes with real tangy citrus profiles.",
    bn: "চমৎকার টক-মিষ্টি স্বাদের আসল সাইট্রাস ফ্লেভারের রিফ্রেশিং অরেঞ্জ কেক।",
    image: "https://i.ibb.co/RTSFv7dG/Orrange-Cake-1.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["kitkat cake", "কিটক্যাট কেক", "kitkat", "কিটক্যাট"],
    en: "Crunchy, chocolatey KitKat cakes decorated beautifully for chocolate fanatics.",
    bn: "চকোলেট প্রেমীদের জন্য কিটক্যাট বার দিয়ে সুন্দর করে সাজানো ক্রাঞ্চি কেক।",
    image: "https://i.ibb.co/k26bhF2H/Kitkat-1.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },

  // 3. Exotic & Forest Range
  {
    keywords: ["forest range", "black forest", "হোয়াইট ফরেস্ট", "চেরি কেক", "ব্ল্যাক ফরেস্ট", "white forest", "cherry cake", "ফরেস্ট రేঞ্জ"],
    en: "Our Forest Range features classic Black Forest cakes covered with rich chocolate shavings and cherries.",
    bn: "আমাদের ফরেস্ট রেঞ্জে রয়েছে ক্লাসিক ব্ল্যাক ফরেস্ট কেক, যা রিচ চকোলেট শেভিংস এবং চেরি দিয়ে সাজানো।",
    image: "https://i.ibb.co/q3P990gk/Black-Forest-1.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },

  // 4. Customization & Themes
  {
    keywords: ["birthday cake", "জন্মদিনের কেক", "birthday", "জন্মদিন"],
    en: "Customized Birthday cakes designed uniquely based on your preferred birthday themes.",
    bn: "আপনার পছন্দের বার্থডে থিমের ওপর ভিত্তি করে বিশেষভাবে তৈরি জন্মদিনের কেক।",
    image: "https://i.ibb.co/hJyMC4CY/Birthday-Cake-1.jpg",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["anniversary cake", "অ্যানিভার্সারি কেক", "বিবাহ বার্ষিকী", "anniversary", "wedding anniversary"],
    en: "Celebrate your milestones with our beautifully crafted romantic Anniversary cakes.",
    bn: "আমাদের সুন্দর ও রোমান্টিক অ্যানিভার্সারি কেক দিয়ে আপনার বিবাহ বার্ষিকী উদযাপন করুন।",
    image: "https://i.ibb.co/5gDy06k7/Aniversary-Cake-2.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["teachers day", "teachers day cake", "টিচার্স ডে", "শিক্ষক দিবস"],
    en: "Special thematic cakes to show gratitude to your teachers on Teacher's Day.",
    bn: "শিক্ষকদের প্রতি সম্মান ও কৃতজ্ঞতা জানাতে শিক্ষক দিবসের বিশেষ থিম কেক।",
    image: "https://i.ibb.co/Y4tgPBNP/Teacher-s-Day-1.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["fathers day cake", "ফাদার্স ডে কেক", "father's day", "বাবা দিবস"],
    en: "Surprise your superhero with our customized Father's Day cakes!",
    bn: "বাবা দিবসে আপনার সুপারহিরোকে সারপ্রাইজ দিন আমাদের কাস্টমাইজড ফাদার্স ডে কেক দিয়ে!",
    image: "https://i.ibb.co/YT2LRm2x/Father-s-Day-Cake-1.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["mothers day cake", "মাদার্স ডে কেক", "mother's day", "মা দিবস"],
    en: "Sweet, elegant, and heartfelt Mother's Day cakes designed beautifully.",
    bn: "মা দিবসের জন্য বিশেষভাবে ডিজাইন করা মিষ্টি ও মার্জিত মাদার্স ডে কেক।",
    image: "https://i.ibb.co/4n26zZCq/2.jpg",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["christmas cake", "ক্রিসমাস কেক", "বড়দিন", "plum cake", "প্লাম কেক"],
    en: "Festive Christmas cakes and rich plum options to sparkle up your winter holidays.",
    bn: "বড়দিনের উৎসবকে আরও রঙিন করতে আমাদের স্পেশাল ক্রিসমাস থিম এবং রিচ প্লাম কেক।",
    image: "https://i.ibb.co/7NKqnNsd/Christmas-Cake-4.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["baby shower cake", "gender reveal", "বেবি শাওয়ার কেক", "সাধের কেক"],
    en: "Adorable and premium Baby Shower cakes curated safely with pastel tones.",
    bn: "প্যাস্টেল টোনে তৈরি বেবি শাওয়ার বা সাধের অনুষ্ঠানের জন্য অত্যন্ত কিউট প্রিমিয়াম কেক।",
    image: "https://i.ibb.co/RTTYsqVd/KIDS-CAKE.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["rice ceremony cake", "অন্নপ্রাশনের কেক", "মুখে ভাত", "annaprashan", "rice ceremony"],
    en: "Culturally rich Rice Ceremony cakes beautifully customized for your little one's milestone.",
    bn: "আপনার সোনামণির অন্নপ্রাশন বা মুখে ভাত উৎসবের জন্য ঐতিহ্যবাহী সুন্দর কাস্টমাইজড কেক।",
    image: "https://i.pinimg.com/736x/6c/bb/7f/6cbb7f551f96722c5b6f01141b5b4aa6.jpg",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["fresh flower cake", "ফুল দিয়ে সাজানো কেক", "floral cake", "ফুলের কেক"],
    en: "Elegant aesthetic cakes decorated with fully sanitized, real fresh flowers.",
    bn: "সম্পূর্ণ স্যানিটাইজ করা তাজা আসল ফুল দিয়ে সাজানো মার্জিত ও নান্দনিক কেক।",
    image: "https://i.ibb.co/fzVDfmhj/FRESH-FLOWER-CAKE-1.jpg",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["doll cake", "barbie cake", "ডল কেক", "বার্বি কেক", "princess cake"],
    en: "Gorgeous Barbie and Doll theme cakes, perfect for your little princess.",
    bn: "আপনার ছোট্ট রাজকন্যার জন্মদিনের জন্য চমৎকার ও আকর্ষণীয় বার্বি ডল কেক।",
    image: "https://i.ibb.co/bGXr5qW/DOLL-CAKE-1.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["half cake", "6 months birthday", "হাফ কেক", "৬ মাসের কেক", "six month"],
    en: "Trendy Half Cakes perfect for celebrating 6-month half-birthday milestones!",
    bn: "শিশুর প্রথম ৬ মাস বা হাফ-বার্থডে উদযাপনের জন্য আধুনিক ট্রেন্ডি হাফ কেক!",
    image: "https://i.ibb.co/V0yhspQm/HALF-CAKE-1.jpg",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["tier cake", "মাল্টি টিয়ার", "দোতলা কেক", "মাল্টি টিয়ার", "two tier cake", "multi tier"],
    en: "Magnificent Tier Cakes carefully engineered for grand events and weddings.",
    bn: "বিয়ে বা যেকোনো বড় রাজকীয় অনুষ্ঠানের জন্য বিশেষভাবে তৈরি চমৎকার টিয়ার কেক।",
    image: "https://i.ibb.co/Xx1SBWb6/TIRE-CAKE.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["number cake", "letter cake", "নম্বর কেক", "alphabet cake", "অ্যালফাবেট কেক", "লেটার কেক"],
    en: "Alphabet and Number cakes structured custom for precise birthday milestones.",
    bn: "বয়স বা নামের আদ্যক্ষর অনুযায়ী নিখুঁত আকারে কাটা নম্বর বা লেটার কেক।",
    image: "https://i.ibb.co/20VxsJxG/Number-Cake.jpg",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["kids cake", "বাচ্চাদের কেক", "কার্টুন কেক", "cartoon cake", "superhero cake"],
    en: "Fun, vibrant, and completely safe cartoon and gaming themed cakes for kids.",
    bn: "বাচ্চাদের জন্য তৈরি মজাদার, প্রাণবন্ত এবং সম্পূর্ণ নিরাপদ কার্টুন বা গেমিং থিম কেক।",
    image: "https://i.ibb.co/xrgZZcx/Kids-Cake-1.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["fondant cake", "semi fondant", "ফন্ডেন্ট কেক", "সেমি ফন্ডেন্ট", "ফন্ডেন্ট"],
    en: "100% edible premium fondant craftsmanship with highly detailed 3D modeling.",
    bn: "বিস্তারিত থ্রি-ডি (3D) ডিজাইনসহ ১০০% খাওয়ার যোগ্য প্রিমিয়াম ফন্ডেন্ট ও সেমি-ফন্ডেন্ট কেক।",
    image: "https://i.ibb.co/ZpB76tN5/FONDANT-1.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["glitter cake", "গ্লিটার কেক", "চকচকে কেক", "sparkle cake"],
    en: "Sparkly and glamorous Glitter cakes finished with safe, 100% edible glitter dust.",
    bn: "১০০% নিরাপদ ও খাওয়ার যোগ্য গ্লিটার ডাস্ট দিয়ে তৈরি চমৎকার ও চকচকে গ্লিটার কেক।",
    image: "https://i.ibb.co/xt8VVwmW/Gliter-Cake-1.jpg",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["customize theme cake", "কাস্টমাইজড থিম কেক", "custom cake", "ইন্টারনেট থেকে ডিজাইন", "picture design", "make like this"],
    en: "Share any image from Pinterest or internet, and we will customize it to perfection!",
    bn: "পিন্টারেস্ট বা ইন্টারনেটের যেকোনো ছবি আমাদের পাঠান, আমরা সেম টু সেম নিখুঁতভাবে কাস্টমাইজ করে দেব!",
    image: "https://i.ibb.co/9mnwZgX4/TIRE-CAKE1.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["photo cake", "ছবি দেওয়া কেক", "ছবি দেওয়া কেক", "picture cake"],
    en: "Personalized Photo Cakes with crisp, clean printing using safe edible sugar sheets.",
    bn: "খাওয়ার যোগ্য সেফ সুগার শিটের ওপর পরিষ্কার প্রিন্টসহ আপনার পছন্দের ছবি দেওয়া ফটো কেক।",
    image: "https://i.ibb.co/rR23zjJp/Photo-Cake-1.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["pinata cake", "হাতুড়ি দিয়ে ভাঙা কেক", "হাতুড়ি কেক", "পিনাটা কেক", "smash cake"],
    en: "Fun smash Pinata cakes that come along with a complimentary, cute wooden hammer!",
    bn: "মজাদার পিনাটা কেক, যার শক্ত চকোলেট শেল ভাঙার জন্য সাথে একটি সুন্দর কাঠের হাতুড়ি ফ্রি দেওয়া হয়!",
    image: "https://i.ibb.co/gbqnmvzd/02.jpg",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },

  // 5. Ordering & Delivery
  {
    keywords: ["how to order", "কীভাবে অর্ডার করব", "অর্ডার করার নিয়ম", "অর্ডার করতে চাই", "place order", "book cake", "অর্ডার দেব"],
    en: "Simply send your name, contact number, preferred flavor, and design details to our WhatsApp Chat.",
    bn: "আপনার নাম, ফোন নম্বর, কেকের ফ্লেভার এবং ডিজাইনের ছবি সরাসরি আমাদের WhatsApp Chat-এ পাঠিয়ে অর্ডার কনফর্ম করুন।"
  },
  {
    keywords: ["delivery availability", "ডেলিভারি এরিয়া", "হোম ডেলিভারি", "ডেলিভারি হবে", "home delivery", "deliver", "ডেলিভারি"],
    en: "We offer home delivery across Kamalgazi, Narendrapur, Sonarpur, and nearby Kolkata circles. Share your address on WhatsApp to confirm.",
    bn: "আমরা কমলগাজী, নরেন্দ্রপুর, সোনারপুর এবং কলকাতার আশেপাশের এলাকায় হোম ডেলিভারি দিই। আপনার ঠিকানাটি WhatsApp-এ পাঠান।"
  },
  {
    keywords: ["advance notice", "কত দিন আগে অর্ডার দেব", "কবে অর্ডার", "pre order time", "days before"],
    en: "Standard cakes require 24 hours. Custom theme, tier, or fondant cakes require at least 2-3 days advance booking.",
    bn: "সাধারণ কেকের জন্য ২৪ ঘণ্টা এবং কাস্টম থিম, ফন্ডেন্ট বা টিয়ার কেকের জন্য অন্তত ২-৩ দিন আগে বুকিং করা প্রয়োজন।"
  },
  {
    keywords: ["midnight delivery", "রাত ১২টায় ডেলিভারি", "রাত ১২টায়", "মাঝরাতে", "midnight"],
    en: "Yes! Midnight surprise delivery is available with prior booking and extra marginal charges.",
    bn: "হ্যাঁ! আগে থেকে বুকিং করলে সামান্য অতিরিক্ত চার্জের বিনিময়ে আমরা মাঝরাতে সারপ্রাইজ ডেলিভারি দিয়ে থাকি।",
    links: [{ label: "🔗 Book Now", url: "https://wa.me/919875563329" }]
  },

  // 6. Our Story & Musu
  {
    keywords: ["who is musu", "owner profile", "মুসু কে", "মালিক কে", "who bakes", "baker name", "owner"],
    en: "Every single bake is handcrafted with utmost care by our owner and head baker, Musu. Connect with her here:",
    bn: "আমাদের প্রতিটি কেক ও ডেজার্ট আমাদের ওনার এবং প্রধান বেকার (Baker) মুসুর নিজের হাতে অতি যত্নে তৈরি। ওনার প্রোফাইল দেখুন:",
    links: [{ label: "📱 Musu Khan on Facebook", url: "https://www.facebook.com/musu.khan99/" }]
  },

  // 7. Pricing & Payments
  {
    keywords: ["price list", "কেকের দাম কত", "দাম কত", "price", "cost", "কত টাকা", "কত দাম"],
    en: "Prices vary according to flavor and design complexity. Please share your shortlisted design via WhatsApp for an instant quote.",
    bn: "কেকের দাম ফ্লেভার এবং ডিজাইনের জটিলতার ওপর নির্ভর করে। সঠিক দাম জানতে আপনার পছন্দের ছবিটি আমাদের WhatsApp-এ পাঠান।"
  },
  {
    keywords: ["payment methods", "upi", "পেমেন্ট অপশন", "ক্যাশ", "কিভাবে পেমেন্ট", "payment", "gpay", "phonepe", "bank transfer"],
    en: "We accept all digital UPI modes (GPay, PhonePe, Paytm), Bank Transfers, and Cash. Partial advance is required to lock slots.",
    bn: "আমরা সমস্ত ইউপিআই (GPay, PhonePe, Paytm), ব্যাঙ্ক ট্রান্সফার এবং ক্যাশ পেমেন্ট গ্রহণ করি। স্লট বুক করতে আংশিক অগ্রিম আবশ্যিক।"
  },

  // 8. Dietary & Hygiene
  {
    keywords: ["eggless cake", "নিরামিষ কেক", "ডিম ছাড়া", "eggless", "veg cake", "ডিম ছাড়া"],
    en: "Yes! 100% pure vegetarian/eggless variants are securely crafted upon request. Please specify during checkout on WhatsApp.",
    bn: "হ্যাঁ! অনুরোধ করলে আমরা সম্পূর্ণ আলাদাভাবে ১০০% ডিম ছাড়া নিরামিষ কেক তৈরি করে দিই। WhatsApp-এ অর্ডার করার সময় উল্লেখ করে দেবেন।"
  },
  {
    keywords: ["hygiene", "chemical free", "ক্ষতিকারক রঙ", "safe color", "food safety", "healthy", "প্রিজারভেটিভ"],
    en: "We enforce strict home-hygiene standards, using only FSSAI-approved premium edible colors without artificial harmful preservatives.",
    bn: "আমরা ঘরোয়া কিচেনের সর্বোচ্চ পরিচ্ছন্নতা বজায় রাখি এবং শুধুমাত্র FSSAI অনুমোদিত প্রিমিয়াম খাওয়ার যোগ্য রঙ ব্যবহার করি (কোনো প্রিজারভেটিভ থাকে না)।"
  },

  // 9. Jar Cakes & Cupcakes
  {
    keywords: ["bento cakes", "bento cake", "বেন্টো কেক", "mini cake", "ছোট কেক"],
    en: "Cute mini Korean bento cakes, perfect for intimate 1-2 people celebrations.",
    bn: "১-২ জনের ছোট সেলিব্রেশনের জন্য পারফেক্ট ও কিউট কোরিয়ান স্টাইলের বেন্টো কেক।",
    image: "https://i.ibb.co/3yDW6YkY/BENTO-1.jpg",
    links: [{ label: "🔗 Order Bento", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["mousse", "মাউস", "chocolate mousse", "ডেজার্ট কাপ", "মউস"],
    en: "Silky, smooth, and rich Chocolate Mousse cups for dessert lovers.",
    bn: "ডেজার্ট প্রেমীদের জন্য সিল্কি, স্মুথ এবং অত্যন্ত রিচ স্বাদের চকোলেট মাউস কাপ।",
    image: "https://i.ibb.co/xt88WGMM/Mousse-1.jpg",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["jar and glass cakes", "jar cake", "জার কেক", "glass cake", "গ্লাস কেক"],
    en: "Beautifully layered cakes inside glass or jars, perfect for return gifting.",
    bn: "কাঁচের জারে বা গ্লাসে তৈরি সুন্দর লেয়ারড কেক, যা গিফট দেওয়ার জন্য দারুণ ট্রেন্ডি।",
    image: "https://i.ibb.co/9HDRRk0F/Jur-cake.png",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["cupcakes and muffins", "cupcake", "কাপকেক ও মাফিন", "কাপকেক", "muffin", "মাফিন"],
    en: "Customized cute cupcakes and muffins perfect for party tables or sets of 6.",
    bn: "কাস্টমাইজড কাপকেক এবং মাফিন, যা ৬টি সেট আকারে বা পার্টি টেবিলের জন্য অর্ডার করতে পারেন।",
    image: "https://i.ibb.co/jkNm1Zq8/Cupcakes-1.jpg",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },

  // 10. Snacks & Savories
  {
    keywords: ["pizza & patties", "পিজ্জা ও প্যাটিস", "নোনতা খাবার", "pizza", "patties", "snack", "পিজ্জা", "প্যাটিস"],
    en: "Besides cakes, we bake delicious homemade pizzas, fresh vegetable/chicken patties, and buns.",
    bn: "মিষ্টি কেক ছাড়াও আমরা সম্পূর্ণ ঘরোয়া উপায়ে তৈরি সুস্বাদু পিজ্জা, ফ্রেশ প্যাটিস এবং বান (Buns) বেক করি।",
    image: "https://i.ibb.co/sTLSSsj/PIZZA-BUNS-1.png",
    links: [{ label: "🔗 Order Snacks", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["brownies", "brownie", "ব্রাউনিজ", "ব্রাউনি"],
    en: "Super fudgy, rich, and intensely chocolatey premium Brownies.",
    bn: "চকোলেটে ঠাসা, অত্যন্ত নরম ও ফাজি প্রিমিয়াম চকোলেট ব্রাউনি।",
    image: "https://i.ibb.co/F4rgH3Wn/Brownies-1.jpg",
    links: [{ label: "🔗 Order Brownies", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["cheesecakes", "cheesecake", "চিজকেকস", "চিজকেক"],
    en: "Rich, velvety, and creamy Cheesecakes crafted with premium cream cheese settings.",
    bn: "প্রিমিয়াম ক্রিম চিজ দিয়ে তৈরি রিচ, ক্রিমি এবং ভেলভেটি টেক্সচারের চিজকেক।",
    image: "https://i.pinimg.com/736x/bc/b6/0c/bcb60c22cedf8400a2e2c6b0679c22e5.jpg",
    links: [{ label: "🔗 Order Now", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["rest of others", "অন্যান্য কেক", "what else", "আর কী আছে", "other cakes"],
    en: "Explore our extensive portfolio of custom creations and premium tiered anniversary layouts.",
    bn: "আমাদের তৈরি বিভিন্ন কাস্টমাইজড প্রিমিয়াম ডিজাইনের কেক কালেকশন দেখতে এবং বিস্তারিত জানতে যোগাযোগ করুন।",
    image: "https://i.ibb.co/YTTTJp6Q/Tier-Aniversary-cake.png",
    links: [{ label: "🔗 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },

  // 11. Social & Community
  {
    keywords: ["instagram profile", "insta link", "ইনস্টাগ্রাম", "instagram", "insta"],
    en: "Follow our vibrant Instagram grid for daily cake aesthetics:",
    bn: "আমাদের কেকের এক্সক্লুসিভ ছবি এবং রিলস দেখতে ইনস্টাগ্রামে ফলো করুন:",
    links: [{ label: "📸 Flavours by Musu on Instagram", url: "https://instagram.com/flavoursbymusu" }]
  },
  {
    keywords: ["pinterest link", "pins", "পিন্টারেস্ট", "pinterest"],
    en: "Check out our inspiration boards and catalog designs on Pinterest:",
    bn: "আমাদের বিভিন্ন থিম এবং কেকের ক্যাটালগ বোর্ড দেখতে পিন্টারেস্টে ফলো করতে পারেন:",
    links: [{ label: "📌 Musu on Pinterest", url: "https://in.pinterest.com/" }]
  },
  {
    keywords: ["youtube channel", "videos", "ইউটিউব ভিডিও", "youtube", "ভিডিও", "tutorial"],
    en: "Watch behind-the-scenes baking videos and cake decoration tours:",
    bn: "কেক বেকিং এবং সুন্দর করে সাজানোর ফুল মেকিং ভিডিও দেখতে আমাদের ইউটিউব চ্যানেলটি সাবস্ক্রাইব করুন:",
    links: [{ label: "🎥 Muskan Khan on YouTube", url: "https://youtube.com/@MuskanKhan-pk3qt" }]
  },
  {
    keywords: ["facebook", "fb page", "ফেসবুক", "ফেসবুক পেজ", "facebook page"],
    en: "Follow our official Facebook page for the latest updates and customer reviews:",
    bn: "সর্বশেষ আপডেট এবং কাস্টমার রিভিউ দেখতে আমাদের অফিসিয়াল ফেসবুক পেজ ফলো করুন:",
    links: [{ label: "📘 Facebook Page", url: "https://www.facebook.com/flavoursbymusu/" }]
  },

  // 12. Troubleshooting & Fixes
  {
    keywords: ["wrong data form", "পরিবর্তন", "ভুল তথ্য দিয়েছি", "ভুল তথ্য দিয়েছি", "edit order", "change detail"],
    en: "If you entered any wrong data or forgot to add details in our order sheet dashboard, please ping us directly on WhatsApp to fix the sheet row instantly.",
    bn: "যদি ভুলবশত অর্ডার ফর্মে কোনো তথ্য ভুল দিয়ে থাকেন, তবে ডেটাবেস রো-টি সংশোধন করতে দ্রুত আমাদের WhatsApp-এ টেক্সট করুন।"
  },
  {
    keywords: ["backend sheet", "sheet access", "গুগল শিট ব্যাকএন্ড", "google sheet"],
    en: "All incoming automated web data forms sync safely straight to our backend system:",
    bn: "আমাদের ওয়েবসাইট ফর্মের সমস্ত ডেটা সরাসরি সুরক্ষিত অফিশিয়াল ব্যাকএন্ড শিটে সিঙ্ক হয়ে যায়:",
    links: [{ label: "📊 Google Sheets Backend Portal", url: "https://docs.google.com/spreadsheets/d/1Zt-WJ-2B03kQx-xV12W4XWwH0Bw" }]
  },

  // 13. Reviews & Feedback
  {
    keywords: ["leave feedback", "write review", "কেক খুব ভালো হয়েছে", "কেক খুব ভালো হয়েছে", "রিভিউ দেব", "review", "feedback", "রিভিউ", "খুব ভালো", "awesome", "tasty"],
    en: "We value your feedback deeply! Please drop your rating or happy text directly inside our Facebook Inbox or trace our map profile.",
    bn: "আপনার মূল্যবান মতামত আমাদের অনুপ্রেরণা! দয়া করে আপনার মিষ্টি রিভিউটি সরাসরি আমাদের Facebook Inbox-এ শেয়ার করুন।",
    links: [{ label: "⭐ Leave a Review", url: "https://www.facebook.com/flavoursbymusu/reviews" }]
  },

  // 14. General
  {
    keywords: ["shelf life", "storage instructions", "কেক কতদিন ফ্রিজে রাখব", "ফ্রিজে রাখতে", "ফ্রিজ", "ফ্রিজে", "fridge", "store cake", "কতদিন ভালো থাকবে", "কীভাবে রাখবো"],
    en: "Fresh cream cakes stay rich for up to 2-3 days under normal refrigeration. For optimal texture, rest it outside for 15 minutes before slicing.",
    bn: "ফ্রিজের নরমাল চেম্বারে আমাদের ফ্রেশ ক্রিম কেক ২-৩ দিন চমৎকার ভালো থাকে। কাটার ১৫ মিনিট আগে ফ্রিজ থেকে বের করে রাখবেন।"
  },
  {
    keywords: ["complimentary items", "ছুরি মোমবাতি", "knife", "candle", "ছুরি", "মোমবাতি"],
    en: "Yes, a safe cake knife and matching birthday candles are fully included free of charge with all our whole-cake packaging boxes!",
    bn: "হ্যাঁ, আমাদের প্রতিটি হোল-কেক বক্স প্যাকেজিংয়ের সাথে একটি চমৎকার কেক কাটার ছুরি এবং মোমবাতি সম্পূর্ণ বিনামূল্যে দেওয়া হয়!"
  },
  
  // Extra Greetings & Conversational
  {
    keywords: ["hi", "hello", "hey", "ওহে", "নমস্কার", "হ্যালো", "start", "begin", "শুরু করুন", "good morning", "good evening", "শুভ সকাল", "শুভ সন্ধ্যা"],
    en: "Welcome to Bake n' Flake ~ Flavors by Musu! 🧁 How can I make your day sweeter?",
    bn: "বেক এন ফ্লেকে আপনাকে স্বাগতম! 🧁 আজ কীভাবে আপনার দিনটি মিষ্টি করতে পারি?",
  },
  {
    keywords: ["help", "assist", "সাহায্য", "হেল্প", "robot", "chatbot", "বট", "তুমি কে", "automation", "ai", "customer support", "support", "help desk"],
    en: "I am Musu's AI digital assistant! 🤖 I can help you with menu, prices, delivery, and custom orders.",
    bn: "আমি মুসুর এআই ডিজিটাল অ্যাসিস্ট্যান্ট! 🤖 আমি আপনাকে মেনু, দাম, ডেলিভারি এবং কাস্টম অর্ডারের ব্যাপারে সাহায্য করতে পারি।"
  }
];
