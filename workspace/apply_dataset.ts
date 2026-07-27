import fs from 'fs';

const imgMap: Record<string, string> = {
      "choc": "https://i.ibb.co/xSTgDb8d/Chocolate-Cakes-1.png",
      "bs": "https://i.ibb.co/fYcwMKdc/Butterscotch-Cakes-1.png",
      "van": "https://i.ibb.co/qMBQG6Nk/Vanilla-Cake-1.png",
      "truf": "https://i.ibb.co/MKF765x/Chocolate-Truffle-Cakes-1.png",
      "pine": "https://i.ibb.co/gbC67jD7/PIneapple-Cake-1.png",
      "man": "https://i.ibb.co/q3M2pvxs/Mango-Cake-1.png",
      "straw": "https://i.ibb.co/7JYt6dJp/Strawberry-Cakes-1.jpg",
      "red": "https://i.ibb.co/s9gGgtpk/Red-velvet-1.png",
      "fruit": "https://i.ibb.co/F4V5yd16/Fresh-Fruit-Cake-1.png",
      "bf": "https://i.ibb.co/q3P990gk/Black-Forest-1.png",
      "oreo": "https://i.ibb.co/nprbQJC/Oreo-Cake-2.png",
      "alc": "https://i.ibb.co/xSj9RRdz/Alcohol-Cake-01.png",
      "mocha": "https://i.ibb.co/4w2jyMmB/Coffee-Cake-1.png",
      "ras": "https://i.ibb.co/4RBygSqR/Rasmalai-Cake-1.png",
      "org": "https://i.ibb.co/RTSFv7dG/Orrange-Cake-1.png",
      "kit": "https://i.ibb.co/k26bhF2H/Kitkat-1.png",
      "bday": "https://i.ibb.co/hJyMC4CY/Birthday-Cake-1.jpg",
      "ann": "https://i.ibb.co/5gDy06k7/Aniversary-Cake-2.png",
      "teach": "https://i.ibb.co/Y4tgPBNP/Teacher-s-Day-1.png",
      "chocs": "https://i.ibb.co/Rp8C27Xt/Customized-Chocolates-2.jpg",
      "father": "https://i.ibb.co/YT2LRm2x/Father-s-Day-Cake-1.png",
      "mother": "https://i.ibb.co/4n26zZCq/2.jpg",
      "xmas": "https://i.ibb.co/7NKqnNsd/Christmas-Cake-4.png",
      "baby": "https://i.ibb.co/RTTYsqVd/KIDS-CAKE.png",
      "rice": "https://i.pinimg.com/736x/6c/bb/7f/6cbb7f551f96722c5b6f01141b5b4aa6.jpg",
      "flower": "https://i.ibb.co/fzVDfmhj/FRESH-FLOWER-CAKE-1.jpg",
      "doll": "https://i.ibb.co/bGXr5qW/DOLL-CAKE-1.png",
      "half": "https://i.ibb.co/V0yhspQm/HALF-CAKE-1.jpg",
      "tier": "https://i.ibb.co/Xx1SBWb6/TIRE-CAKE.png",
      "num": "https://i.ibb.co/20VxsJxG/Number-Cake.jpg",
      "kids": "https://i.ibb.co/xrgZZcx/Kids-Cake-1.png",
      "fon": "https://i.ibb.co/ZpB76tN5/FONDANT-1.png",
      "glit": "https://i.ibb.co/xt8VVwmW/Gliter-Cake-1.jpg",
      "cust": "https://i.ibb.co/9mnwZgX4/TIRE-CAKE1.png",
      "cheese": "https://i.pinimg.com/736x/bc/b6/0c/bcb60c22cedf8400a2e2c6b0679c22e5.jpg",
      "photo": "https://i.ibb.co/rR23zjJp/Photo-Cake-1.png",
      "bento": "https://i.ibb.co/3yDW6YkY/BENTO-1.jpg",
      "mousse": "https://i.ibb.co/xt88WGMM/Mousse-1.jpg",
      "jar": "https://i.ibb.co/9HDRRk0F/Jur-cake.png",
      "pinata": "https://i.ibb.co/gbqnmvzd/02.jpg",
      "cup": "https://i.ibb.co/jkNm1Zq8/Cupcakes-1.jpg",
      "pizza": "https://i.ibb.co/sTLSSsj/PIZZA-BUNS-1.png",
      "brownie": "https://i.ibb.co/F4rgH3Wn/Brownies-1.jpg",
      "others": "https://i.ibb.co/YTTTJp6Q/Tier-Aniversary-cake.png",
      "eggless": "https://i.ibb.co/X3cM89H/Eggless.png"
};

const linkMap: Record<string, any> = {
  map: { url: "https://www.google.com/maps/place/Bake+n'+Flake+~+FlavoursbyMusu/@22.4478343,88.3911033,17z/data=!4m6!3m5!1s0x3a027107c2d3f269:0x115c8763018d2718!8m2!3d22.4478343!4d88.3911033!16s%2Fg%2F11jkpnw4kk?entry=ttu", icon: "https://cdn-icons-png.flaticon.com/512/854/854878.png", text: "View on Google Maps" },
  fb: { url: "https://www.facebook.com/flavoursbymusu/", icon: "https://cdn-icons-png.flaticon.com/512/145/145802.png", text: "Facebook Page" },
  ig: { url: "https://instagram.com/flavoursbymusu", icon: "https://cdn-icons-png.flaticon.com/512/174/174855.png", text: "Instagram" },
  yt: { url: "https://youtube.com/@MuskanKhan-pk3qt", icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png", text: "YouTube Channel" },
  pin: { url: "https://in.pinterest.com/khanmegha99/", icon: "https://cdn-icons-png.flaticon.com/512/145/145808.png", text: "Pinterest" },
  owner: { url: "https://www.facebook.com/musu.khan99/", icon: "https://cdn-icons-png.flaticon.com/512/145/145802.png", text: "Musu's Profile" },
  email: { url: "mailto:Khanmegha99@gmail.com", icon: "https://cdn-icons-png.flaticon.com/512/732/732200.png", text: "Email Us" },
  sheet: { url: "https://docs.google.com/spreadsheets/d/1vZsYmZzxu653U4T6O-_S0i2dazAU_VJKBRYwdgAmXSw/edit?gid=775476424#gid=775476424", icon: "https://cdn-icons-png.flaticon.com/512/281/281760.png", text: "View Database" }
};

const data = [
      ["hi, hello, hey, ওহে, নমস্কার, হ্যালো", "Welcome to Bake n' Flake ~ Flavors by Musu! 🧁 How can I help you today?", "বেক এন ফ্লেকে আপনাকে স্বাগতম! আজ কীভাবে সাহায্য করতে পারি? ✨", "", ""],
      ["start, begin, শুরু করুন", "Hello! I am Musu's digital assistant. What are you craving today? 🍰", "হ্যালো! আমি মুসুর ডিজিটাল অ্যাসিস্ট্যান্ট। আজ আপনি কী খুঁজছেন? 🍰", "", ""],
      ["good morning, good evening, শুভ সকাল, শুভ সন্ধ্যা", "Good day! Ready to make your celebration sweeter? 🎉", "শুভ দিন! আপনার উদযাপনকে মিষ্টি করতে আমরা প্রস্তুত! 🎉", "", ""],
      ["help, assist, সাহায্য, হেল্প", "Sure! I can help you with menu, prices, delivery, and custom cakes. 🎂", "অবশ্যই! আমি আপনাকে মেনু, দাম, ডেলিভারি এবং কাস্টম কেকের ব্যাপারে সাহায্য করতে পারি। 🎂", "", ""],
      ["robot, chatbot, বট, তুমি কে", "I am an AI assistant here to help you order delicious bakes from Bake n' Flake! 🤖", "আমি একটি এআই অ্যাসিস্ট্যান্ট, বেক এন ফ্লেক থেকে সুস্বাদু খাবার অর্ডার করতে আপনাকে সাহায্য করব! 🤖", "", ""],
      ["location, map, কোথায়, লোকেশন", "We are located at Kamalgazi, Kolkata, 700103. 🏢", "আমরা কলকাতার কমলগাজীতে (৭০০০১০৩) অবস্থিত। 🏢", "", "map"],
      ["address, where, ঠিকানা, অ্যাড্রেস", "Our address is Kamalgazi, Kolkata 700103. 🏠", "আমাদের ঠিকানা কমলগাজী, কলকাতা ৭০০০১০৩। 🏠", "", "map"],
      ["shop, bakery location, দোকান, বেকারি", "The bakery is in Kamalgazi. We mostly do pre-orders. 🏬", "বেকারিটি কমলগাজীতে। আমরা মূলত প্রি-অর্ডারে কাজ করি। 🏬", "", "map"],
      ["directions, how to go, কীভাবে যাব, ডিরেকশন", "Click the map link to get exact directions to our bakery! 🗺️", "আমাদের বেকারিতে আসার ডিরেকশন পেতে ম্যাপ লিঙ্কে ক্লিক করুন! 🗺️", "", "map"],
      ["kamalgazi, sonarpur, কমলগাজী, সোনারপুর", "Yes, we are based in Kamalgazi, near Sonarpur. 📍", "হ্যাঁ, আমরা সোনারপুরের কাছে কমলগাজীতে অবস্থিত। 📍", "", "map"],
      ["branch, outlets, ব্রাঞ্চ, আউটলেট", "We currently operate from our single Kamalgazi kitchen for quality control. 👩‍🍳", "কোয়ালিটি বজায় রাখতে বর্তমানে আমরা শুধুমাত্র কমলগাজী কিচেন থেকেই কাজ করি। 👩‍🍳", "", ""],
      ["pin code, exact address, পিন কোড, পিনকোড", "Our pin code is Kolkata 700103. 📮", "আমাদের পিন কোড কলকাতা ৭০০০১০৩। 📮", "", "map"],
      ["physical store, visit, স্টোর ভিজিট", "You can visit us for pickup, but please inform us ahead as we work on pre-orders. 🛍️", "আপনি পিক-আপের জন্য আসতে পারেন, তবে প্রি-অর্ডারে কাজ হয় তাই আগে কল করে নেবেন। 🛍️", "", ""],
      ["dine in, seating, বসে খাওয়া, সিটিং", "We don't have a large seating area; we focus on custom orders and delivery. 🛵", "আমাদের বসে খাওয়ার বড় জায়গা নেই, আমরা কাস্টম অর্ডার ও ডেলিভারিতে ফোকাস করি। 🛵", "", ""],
      ["open today, timings, আজ খোলা, কখন খোলেন", "We operate daily. Please ping us to check slot availability! 🕒", "আমরা প্রতিদিন কাজ করি। স্লট ফাঁকা আছে কিনা জানতে মেসেজ করুন! 🕒", "", ""],
      
      ["call, phone, কল, ফোন নম্বর", "You can directly call us using our official contact number below. 📞", "যেকোনো তথ্যের জন্য নিচের কল বাটনে ক্লিক করে সরাসরি কথা বলুন। 📞", "", "whatsapp"],
      ["email, gmail, ইমেইল, জিমেইল", "For official business inquiries, please drop us an email! 📧", "অফিশিয়াল যোগাযোগের জন্য আমাদের ইমেইল করতে পারেন! 📧", "", "email"],
      ["owner, musu, ওনার, মুসু কে", "Musu (Megha Khan) is the talented owner and head baker behind Bake n' Flake! 👩‍🍳", "মুসু (মেঘা খান) হলেন বেক এন ফ্লেকের প্রতিভাবান মালিক এবং প্রধান বেকার! 👩‍🍳", "", "owner"],
      ["facebook, fb page, ফেসবুক পেজ", "Follow our official Facebook page for the latest updates and designs! 🌟", "লেটেস্ট আপডেট পেতে আমাদের ফেসবুক পেজ ফলো করুন! 🌟", "", "fb"],
      ["instagram, insta, ইনস্টাগ্রাম, ইন্সটা", "Check out our aesthetic cake gallery on Instagram! 📸", "আমাদের কেকের গ্যালারি দেখতে ইনস্টাগ্রামে আসুন! 📸", "", "ig"],
      ["youtube, videos, ইউটিউব, ভিডিও", "Watch our exciting cake making videos on YouTube! 🎥", "আমাদের কেক তৈরির ভিডিওগুলো ইউটিউবে দেখুন! 🎥", "", "yt"],
      ["pinterest, pins, পিন্টারেস্ট", "Find lovely cake inspirations on our Pinterest boards! 📌", "কেকের আইডিয়া পেতে আমাদের পিন্টারেস্ট বোর্ড দেখুন! 📌", "", "pin"],
      ["social media, follow, সোশ্যাল মিডিয়া, পেজ", "Connect with us across all platforms to stay updated! 📱", "আমাদের সাথে সব সোশ্যাল প্ল্যাটফর্মে যুক্ত থাকুন! 📱", "", "fb"],

      ["chocolate cakes, চকোলেট কেক, চকলেট", "Rich and classic Chocolate Cakes baked fresh with premium cocoa. 🍫", "প্রিমিয়াম কোকো দিয়ে তৈরি আমাদের ক্লাসিক চকোলেট কেক। 🍫", "choc", ""],
      ["butterscotch cakes, বাটারস্কচ কেক", "Delicious Butterscotch cakes packed with crunchy praline. 🍮", "ক্রাঞ্চি প্রালিন দিয়ে তৈরি দারুণ স্বাদের বাটারস্কচ কেক। 🍮", "bs", ""],
      ["vanilla cakes, ভ্যানিলা কেক", "Soft and elegant Vanilla cakes perfect for any theme. 🎂", "যেকোনো থিমের জন্য মানানসই নরম ও ক্লাসিক ভ্যানিলা কেক। 🎂", "van", ""],
      ["chocolate truffle, চকোলেট ট্রাফল", "Our best-seller! Intensely rich and smooth Chocolate Truffle. 🍫", "আমাদের বেস্ট-সেলার! অত্যন্ত রিচ এবং স্মুথ চকোলেট ট্রাফল। 🍫", "truf", ""],
      ["pineapple cakes, পাইনঅ্যাপল কেক, আনারস", "Freshly baked Pineapple cakes with tangy real fruit chunks. 🍍", "আসল আনারসের টুকরো দিয়ে তৈরি তাজা পাইনঅ্যাপল কেক। 🍍", "pine", ""],
      ["mango cakes, ম্যাংগো কেক, আম", "Seasonal special Mango Cakes made with premium pulp. 🥭", "প্রিমিয়াম পাল্প দিয়ে তৈরি সিজনাল স্পেশাল ম্যাংগো কেক। 🥭", "man", ""],
      ["strawberry cakes, স্ট্রবেরি কেক", "Vibrant Strawberry cakes with sweet and tangy flavor profiles. 🍓", "টক-মিষ্টি ফ্লেভারের চমৎকার স্ট্রবেরি কেক। 🍓", "straw", ""],
      ["red velvet cakes, রেড ভেলভেট কেক", "Premium Red Velvet cakes layered with real cream cheese frosting. ❤️", "আসল ক্রিম চিজ ফ্রস্টিং দিয়ে তৈরি প্রিমিয়াম রেড ভেলভেট কেক। ❤️", "red", ""],
      ["fresh fruit cake, ফ্রেশ ফ্রুট কেক, ফলের কেক", "Healthy and colorful cakes loaded with premium seasonal fruits. 🍇", "প্রিমিয়াম তাজা ফলে ভরপুর স্বাস্থ্যকর ও রঙিন ফ্রেশ ফ্রুট কেক। 🍇", "fruit", ""],
      ["forest range, black forest, ফরেস্ট রেঞ্জ, ব্ল্যাক ফরেস্ট", "Classic Black Forest cakes with chocolate shavings and cherries. 🍒", "চকোলেট শেভিংস ও চেরি দিয়ে সাজানো ক্লাসিক ব্ল্যাক ফরেস্ট কেক। 🍒", "bf", ""],
      ["oreo cakes, ওরিও কেক", "Crunchy and creamy Oreo Cakes, a massive hit among kids! 🍪", "ক্রাঞ্চি ও ক্রিমি ওরিও কেক, যা বাচ্চাদের দারুণ প্রিয়! 🍪", "oreo", ""],
      ["alcohol base cake, অ্যালকোহল বেস কেক, মদ", "Premium Alcohol-infused cakes curated specially for adult parties. 🍾", "প্রাপ্তবয়স্কদের পার্টির জন্য বিশেষভাবে তৈরি অ্যালকোহল-বেসড কেক। 🍾", "alc", ""],
      ["coffee mocha, coffee cake, কফি মোকা, কফি কেক", "Rich Coffee Mocha pairing premium coffee with dark chocolate. ☕", "প্রিমিয়াম কফি ও ডার্ক চকোলেটের দারুণ স্বাদের কফি মোকা কেক। ☕", "mocha", ""],
      ["rasmalai cake, রসমলাই কেক", "Our royal fusion specialty loaded with real rasmalai chunks! 🍮", "আসল রসমলাইয়ের টুকরো দিয়ে তৈরি আমাদের রয়্যাল ফিউশন কেক! 🍮", "ras", ""],
      ["orange cake, অরেঞ্জ কেক, কমলালেবু", "Refreshing Orange cakes with real tangy citrus profiles. 🍊", "আসল সাইট্রাস ফ্লেভারের রিফ্রেশিং অরেঞ্জ কেক। 🍊", "org", ""],
      ["kitkat cakes, কিটক্যাট কেক", "Crunchy KitKat cakes decorated beautifully for chocolate fanatics. 🍫", "চকোলেট প্রেমীদের জন্য কিটক্যাট দিয়ে সাজানো ক্রাঞ্চি কেক। 🍫", "kit", ""],
      ["birthday cakes, জন্মদিনের কেক", "Customized Birthday cakes designed uniquely for your celebrations. 🎂", "আপনার জন্মদিনের থিম অনুযায়ী সুন্দর করে ডিজাইন করা কাস্টম কেক। 🎂", "bday", ""],
      ["anniversary cakes, অ্যানিভার্সারি কেক, বিবাহ বার্ষিকী", "Celebrate milestones with our beautifully crafted romantic Anniversary cakes. 💍", "আমাদের রোমান্টিক অ্যানিভার্সারি কেক দিয়ে বিবাহ বার্ষিকী উদযাপন করুন। 💍", "ann", ""],
      ["teachers day, teachers day cake, টিচার্স ডে কেক, শিক্ষক দিবস", "Special thematic cakes to show gratitude on Teacher's Day. 📚", "শিক্ষকদের প্রতি সম্মান জানাতে শিক্ষক দিবসের বিশেষ থিম কেক। 📚", "teach", ""],
      ["customised chocolates, কাস্টমাইজড চকোলেট", "Handmade customized chocolates making perfect thoughtful gifts. 🎁", "উপহার দেওয়ার জন্য দারুণ মানানসই হাতে তৈরি কাস্টমাইজড চকোলেট। 🎁", "chocs", ""],
      ["fathers day cake, ফাদার্স ডে কেক", "Surprise your superhero with our customized Father's Day cakes! 🦸‍♂️", "বাবা দিবসে আপনার সুপারহিরোকে সারপ্রাইজ দিন আমাদের স্পেশাল কেক দিয়ে! 🦸‍♂️", "father", ""],
      ["mothers day cake, মাদার্স ডে কেক", "Sweet and elegant Mother's Day cakes designed beautifully. 🌸", "মা দিবসের জন্য বিশেষভাবে ডিজাইন করা মিষ্টি ও মার্জিত মাদার্স ডে কেক। 🌸", "mother", ""],
      ["christmas cake, plum cake, ক্রিসমাস কেক, প্লাম কেক", "Festive Christmas cakes and rich plum options for the holidays. 🎄", "বড়দিনের উৎসবকে আরও রঙিন করতে আমাদের স্পেশাল প্লাম কেক। 🎄", "xmas", ""],
      ["baby shower cake, বেবি শাওয়ার কেক, সাধ", "Adorable Baby Shower cakes curated safely with pastel tones. 🍼", "প্যাস্টেল টোনে তৈরি বেবি শাওয়ার বা সাধের অনুষ্ঠানের জন্য কিউট কেক। 🍼", "baby", ""],
      ["rice ceremony cakes, অন্নপ্রাশনের কেক, মুখে ভাত", "Culturally rich Rice Ceremony cakes customized for your little one. 🍚", "আপনার সোনামণির অন্নপ্রাশনের জন্য ঐতিহ্যবাহী সুন্দর কাস্টমাইজড কেক। 🍚", "rice", ""],
      ["fresh flower cake, ফ্রেশ ফ্লাওয়ার কেক, তাজা ফুল", "Elegant aesthetic cakes decorated with sanitized real fresh flowers. 🌺", "সম্পূর্ণ স্যানিটাইজ করা তাজা আসল ফুল দিয়ে সাজানো মার্জিত কেক। 🌺", "flower", ""],
      ["doll cakes, barbie cake, ডল কেক, বার্বি", "Gorgeous Barbie and Doll theme cakes for your little princess. 👸", "আপনার ছোট্ট রাজকন্যার জন্য চমৎকার ও আকর্ষণীয় বার্বি ডল কেক। 👸", "doll", ""],
      ["half cakes, 6 month birthday, হাফ কেক, ৬ মাস", "Trendy Half Cakes perfect for 6-month half-birthday milestones! 🎂", "শিশুর প্রথম ৬ মাস বা হাফ-বার্থডে উদযাপনের জন্য আধুনিক হাফ কেক! 🎂", "half", ""],
      ["tier cakes, 2 tier, টিয়ার কেক, দোতলা কেক", "Magnificent Tier Cakes engineered for grand events and weddings. 🏰", "বিয়ে বা যেকোনো বড় রাজকীয় অনুষ্ঠানের জন্য বিশেষভাবে তৈরি টিয়ার কেক। 🏰", "tier", ""],
      ["number cakes, letter cake, নম্বর কেক, সংখ্যা", "Alphabet and Number cakes custom structured for birthdays. 🔢", "বয়স বা নামের আদ্যক্ষর অনুযায়ী নিখুঁত আকারে কাটা নম্বর বা লেটার কেক। 🔢", "num", ""],
      ["kids cakes, cartoon cake, বাচ্চাদের কেক, কার্টুন", "Fun and vibrant cartoon or gaming themed cakes for kids. 🎈", "বাচ্চাদের জন্য তৈরি মজাদার এবং সম্পূর্ণ নিরাপদ কার্টুন থিম কেক। 🎈", "kids", ""],
      ["fondant and semi fondant cakes, fondant cake, semi fondant, ফন্ডেন্ট কেক", "100% edible premium fondant craftsmanship with 3D modeling. 🎨", "বিস্তারিত থ্রি-ডি (3D) ডিজাইনসহ ১০০% খাওয়ার যোগ্য প্রিমিয়াম ফন্ডেন্ট কেক। 🎨", "fon", ""],
      ["glitter cake, গ্লিটার কেক", "Sparkly Glitter cakes finished with safe, 100% edible glitter dust. ✨", "১০০% নিরাপদ ও খাওয়ার যোগ্য গ্লিটার ডাস্ট দিয়ে তৈরি চকচকে গ্লিটার কেক। ✨", "glit", ""],
      ["customize theme cake, কাস্টমাইজড থিম কেক", "Share any image, and we will customize it to perfection! 🖌️", "যেকোনো ছবি আমাদের পাঠান, আমরা নিখুঁতভাবে কাস্টমাইজ করে দেব! 🖌️", "cust", ""],
      ["cheesecakes, cheesecake, চিজকেকস", "Rich, velvety, and creamy Cheesecakes crafted with premium cheese. 🧀", "প্রিমিয়াম ক্রিম চিজ দিয়ে তৈরি রিচ, ক্রিমি এবং ভেলভেটি চিজকেক। 🧀", "cheese", ""],
      ["photo cakes, picture cake, ফটো কেক, ছবি দেওয়া", "Personalized Photo Cakes with printing on edible sugar sheets. 🖼️", "খাওয়ার যোগ্য সেফ সুগার শিটের ওপর পরিষ্কার প্রিন্টসহ ফটো কেক। 🖼️", "photo", ""],
      ["bento cakes, mini cake, বেন্টো কেক, ছোট কেক", "Cute mini Korean bento cakes, perfect for 1-2 people celebrations. 🍱", "১-২ জনের ছোট সেলিব্রেশনের জন্য পারফেক্ট ও কিউট কোরিয়ান বেন্টো কেক। 🍱", "bento", ""],
      ["mousse, chocolate mousse, মাউস", "Silky, smooth, and rich Chocolate Mousse cups for dessert lovers. 🍨", "ডেজার্ট প্রেমীদের জন্য সিল্কি, স্মুথ এবং রিচ স্বাদের চকোলেট মাউস। 🍨", "mousse", ""],
      ["jar and glass cakes, jar cake, glass cake, জার এবং গ্লাস কেক", "Beautifully layered cakes inside glass jars, perfect for return gifts. 🍯", "কাঁচের জারে বা গ্লাসে তৈরি সুন্দর লেয়ারড কেক, গিফট দেওয়ার জন্য সেরা। 🍯", "jar", ""],
      ["pinata cakes, smash cake, পিনাটা কেক, হাতুড়ি", "Fun smash Pinata cakes that come with a complimentary wooden hammer! 🔨", "মজাদার পিনাটা কেক, শক্ত শেল ভাঙার জন্য সাথে কাঠের হাতুড়ি ফ্রি দেওয়া হয়! 🔨", "pinata", ""],
      ["cupcakes and muffins, cupcakes, muffins, কাপকেক ও মাফিন", "Customized cute cupcakes and muffins perfect for party tables. 🧁", "কাস্টমাইজড কাপকেক এবং মাফিন, যা পার্টি টেবিলের জন্য দারুণ মানানসই। 🧁", "cup", ""],
      ["pizza & patties, pizza, patties, snacks, পিজ্জা ও প্যাটিস, নোনতা", "We bake delicious homemade pizzas, fresh vegetable/chicken patties, and buns. 🍕", "মিষ্টি কেক ছাড়াও আমরা সম্পূর্ণ ঘরোয়া উপায়ে তৈরি সুস্বাদু পিজ্জা ও প্যাটিস বেক করি। 🍕", "pizza", ""],
      ["brownies, ব্রাউনিজ", "Super fudgy, rich, and intensely chocolatey premium Brownies. 🍫", "চকোলেটে ঠাসা, অত্যন্ত নরম ও ফাজি প্রিমিয়াম চকোলেট ব্রাউনি। 🍫", "brownie", ""],
      ["rest of others, other cakes, unique cakes, অন্যান্য, বাকি কেক", "Explore our extensive portfolio of custom creations and luxury cakes. ✨", "আমাদের তৈরি বিভিন্ন কাস্টমাইজড প্রিমিয়াম ডিজাইনের কেক কালেকশন দেখতে যোগাযোগ করুন। ✨", "others", ""],
      
      ["fusion cake, ফিউশন কেক", "We make excellent fusion cakes like Rasmalai and Thandai flavors! 🍮", "আমরা রসমলাই এবং ঠান্ডাই ফ্লেভারের চমৎকার ফিউশন কেক বানাই! 🍮", "ras", ""],
      ["fruit crush, real fruit, তাজা ফল, ক্রাশ", "We use premium fruit crushes and real fruit pieces for the best taste. 🍓", "সেরা স্বাদের জন্য আমরা প্রিমিয়াম ফ্রুট ক্রাশ এবং আসল ফলের টুকরো ব্যবহার করি। 🍓", "", ""],
      ["best seller, top cake, বেস্ট সেলার, সেরা কেক", "Our Chocolate Truffle and Rasmalai cakes are all-time best sellers! 🏆", "আমাদের চকোলেট ট্রাফল এবং রসমলাই কেক সবসময় সেরা বিক্রি হয়! 🏆", "truf", ""],
      ["menu card, list, মেনু কার্ড, লিস্ট", "You can check all our signature items right here and pick your favorite! 📋", "আপনি আমাদের সিগনেচার আইটেমগুলোর প্রিভিউ দেখতে পারেন এবং পছন্দ করতে পারেন! 📋", "", ""],
      ["adult cake, alcohol, বড়দের কেক, অ্যালকোহল", "Yes, we make alcohol-infused cakes specially designed for adult parties. 🍾", "হ্যাঁ, প্রাপ্তবয়স্কদের পার্টির জন্য আমরা অ্যালকোহল-বেসড কেক তৈরি করি। 🍾", "alc", ""],
      ["black forest, white forest, ব্ল্যাক ফরেস্ট, হোয়াইট ফরেস্ট", "Both classic Black Forest and White Forest are available in our Forest Range. 🍒", "আমাদের ফরেস্ট রেঞ্জে ব্ল্যাক ফরেস্ট এবং হোয়াইট ফরেস্ট দুটিই পাওয়া যায়। 🍒", "bf", ""],
      ["premium cake, প্রিমিয়াম কেক", "We have a luxury premium range including cheesecakes and tier fondant cakes. 👑", "আমাদের কাছে চিজকেক এবং টিয়ার ফন্ডেন্ট কেকসহ একটি লাক্সারি প্রিমিয়াম রেঞ্জ আছে। 👑", "cheese", ""],
      ["seasonal cake, সিজনাল কেক", "We bake seasonal specials like Fresh Mango in summer and Plum cake in winter. ☀️", "গ্রীষ্মে ফ্রেশ ম্যাংগো এবং শীতে প্লাম কেকের মতো সিজনাল স্পেশাল আমরা বেক করি। ☀️", "man", ""],
      ["new flavor, নতুন ফ্লেভার", "We frequently update our menu with new flavors! Feel free to ask us! 🆕", "আমরা প্রায়ই মেনু আপডেট করি। নতুন ফ্লেভার জানতে নির্দ্বিধায় আমাদের জিজ্ঞেস করুন! 🆕", "", ""],
      ["kids favorite, বাচ্চাদের প্রিয়", "Kids absolutely love our Oreo Cakes, KitKat Cakes, and cartoon themes! 🎈", "বাচ্চারা আমাদের ওরিও কেক, কিটক্যাট কেক এবং কার্টুন থিমগুলো দারুণ পছন্দ করে! 🎈", "oreo", ""],
      ["chocolate lovers, চকলেট লাভার", "For pure chocolate lovers, our Chocolate Truffle and Fudgy Brownies are heaven! 🍫", "চকোলেট লাভারদের জন্য আমাদের চকোলেট ট্রাফল এবং ফাজি ব্রাউনি একদম সেরা! 🍫", "brownie", ""],
      ["coffee lover, কফি লাভার", "Our Coffee Mocha cake is perfectly crafted for coffee enthusiasts. ☕", "আমাদের কফি মোকা কেকটি কফি প্রেমীদের জন্য নিখুঁতভাবে তৈরি করা হয়েছে। ☕", "mocha", ""],
      ["tangy cake, টক মিষ্টি কেক", "Try our Pineapple, Orange, or Strawberry cakes for a sweet and tangy burst! 🍊", "টক-মিষ্টি স্বাদের জন্য আমাদের পাইনঅ্যাপল, অরেঞ্জ বা স্ট্রবেরি কেক ট্রাই করতে পারেন! 🍊", "pine", ""],
      ["pure chocolate, পিওর চকলেট", "We use high-grade pure cocoa to ensure an authentic rich chocolate experience. 🍫", "খাঁটি চকোলেটের স্বাদ নিশ্চিত করতে আমরা হাই-গ্রেড পিওর কোকো ব্যবহার করি। 🍫", "choc", ""],
      ["milk chocolate, মিল্ক চকলেট", "Yes, we can customize your cake frosting with smooth milk chocolate. 🥛", "হ্যাঁ, আমরা স্মুথ মিল্ক চকোলেট দিয়ে আপনার কেকের ফ্রস্টিং কাস্টমাইজ করতে পারি। 🥛", "", ""],
      ["dark chocolate, ডার্ক চকলেট", "We offer premium dark chocolate truffle for an intense cocoa flavor. 🤎", "ডার্ক চকোলেট ফ্লেভারের জন্য আমরা প্রিমিয়াম ডার্ক চকোলেট ট্রাফল অফার করি। 🤎", "truf", ""],
      ["wedding cake, marriage, বিয়ের কেক, ওয়েডিং", "We specialize in magnificent multi-tier wedding cakes. Book well in advance! 💍", "আমরা আকর্ষণীয় দোতলা/তিনতলা বিয়ের কেক তৈরিতে বিশেষজ্ঞ। আগে থেকে বুক করুন! 💍", "tier", ""],
      ["engagement, এনগেজমেন্ট কেক", "Get a beautiful romantic cake customized perfectly for your ring ceremony. 💍", "আপনার রিং সেরিমনি বা এনগেজমেন্টের জন্য সুন্দর রোমান্টিক কেক কাস্টমাইজ করে নিন। 💍", "ann", ""],
      ["1st birthday, প্রথম জন্মদিন", "Make their 1st birthday memorable with our safe, cute, and edible fondant cakes. 🍼", "নিরাপদ ও কিউট ফন্ডেন্ট কেক দিয়ে আপনার শিশুর প্রথম জন্মদিন স্মরণীয় করে তুলুন। 🍼", "fon", ""],
      ["18th birthday, ১৮ তম জন্মদিন", "Celebrate hitting adulthood with our trendy and quirky 18th birthday cakes! 🥳", "আমাদের ট্রেন্ডি ও मजेदार কেক দিয়ে ১৮তম জন্মদিনের উদযাপন করুন! 🥳", "bday", ""],
      ["50th anniversary, ৫০ তম বিবাহ বার্ষিকী", "Golden Jubilee calls for an elegant golden-themed premium anniversary cake. ✨", "গোল্ডেন জুবিলির জন্য একটি মার্জিত সোনালী-থিমের প্রিমিয়াম অ্যানিভার্সারি কেক একদম মানানসই। ✨", "tier", ""],
      ["silver jubilee, ২৫ তম বিবাহ বার্ষিকী", "We design beautiful silver-themed cakes for the perfect 25th anniversary. 🥈", "২৫তম বিবাহ বার্ষিকীর জন্য আমরা সুন্দর সিলভার থিমের কেক ডিজাইন করি। 🥈", "ann", ""],
      ["corporate event, কর্পোরেট ইভেন্ট", "We take bulk orders and make logo-printed cakes for corporate events. 🏢", "কর্পোরেট ইভেন্টের জন্য আমরা বাল্ক অর্ডার নিই এবং লোগো-প্রিন্টেড কেক বানাই। 🏢", "", ""],
      ["office party, অফিস পার্টি", "Order bulk cupcakes, patties, or a large cake for your office celebration. 💼", "অফিস পার্টির জন্য বেশি পরিমাণে কাপকেক, প্যাটিস বা একটি বড় কেক অর্ডার করতে পারেন। 💼", "cup", ""],
      ["farewell cake, ফেয়ারওয়েল কেক", "Give a sweet goodbye with a customized farewell cake. 👋", "একটি কাস্টমাইজড ফেয়ারওয়েল কেক দিয়ে মিষ্টি বিদায় জানান। 👋", "", ""],
      ["baby welcome, বেবি ওয়েলকাম", "Welcome the newborn with pastel shades and cute baby-themed designs. 👶", "নবজাতককে স্বাগত জানাতে প্যাস্টেল শেড এবং কিউট বেবি-থিম ডিজাইনের কেক অর্ডার করুন। 👶", "baby", ""],
      ["pet birthday, পোষা প্রাণী, কুকুরের জন্মদিন", "While made for humans, we can design fun pet-themed cakes for the party! 🐾", "কেক মানুষের খাওয়ার জন্য হলেও, আমরা পার্টির জন্য মজাদার পেট-থিম কেক ডিজাইন করতে পারি! 🐾", "", ""],
      ["diwali hamper, দিওয়ালি হ্যাম্পার", "Gift our customized chocolate and brownie hampers this Diwali. 🪔", "এই দীপাবলিতে আমাদের কাস্টমাইজড চকোলেট এবং ব্রাউনি হ্যাম্পার উপহার দিন। 🪔", "chocs", ""],
      ["holi special, হোলি স্পেশাল", "Try our colorful fusion bakes like Thandai cupcakes during Holi! 🎨", "হোলির সময় আমাদের রঙিন ফিউশন বেক যেমন ঠান্ডাই কাপকেক ট্রাই করুন! 🎨", "", ""],
      ["eid cake, ঈদের কেক", "We craft beautiful crescent moon and star-themed cakes for Eid. 🌙", "আমরা ঈদ উদযাপনের জন্য সুন্দর চাঁদ-তারা থিমের কেক ডিজাইন করি। 🌙", "", ""],
      ["new year cake, নিউ ইয়ার কেক", "Countdown to the New Year with our special midnight themed cakes. 🎆", "আমাদের স্পেশাল মিডনাইট থিম কেক দিয়ে নতুন বছরের কাউন্টডাউন শুরু করুন। 🎆", "", ""],
      ["valentines day, ভ্যালেন্টাইন্স ডে", "Heart-shaped Red Velvet cakes are perfect for Valentine's Day romance. ❤️", "ভ্যালেন্টাইন্স ডে-র রোমান্সের জন্য হার্ট শেপের রেড ভেলভেট কেক একদম পারফেক্ট। ❤️", "red", ""],
      ["womens day, ওমেন্স ডে", "Celebrate the strong women with our elegant floral and theme cakes. 👩", "আমাদের সুন্দর ফ্লোরাল ও থিম কেক দিয়ে নারী দিবস উদযাপন করুন। 👩", "flower", ""],
      ["mens day, মেন্স ডে", "Get a quirky suit or hobby-themed cake for International Men's Day. 👨", "আন্তর্জাতিক পুরুষ দিবসের জন্য স্যুট বা শখের থিমের কেক অর্ডার করুন। 👨", "", ""],
      ["friendship day, ফ্রেন্ডশিপ ডে", "Share a Bento cake or customized chocolates with your best friend! 🤝", "আপনার সেরা বন্ধুর সাথে একটি বেন্টো কেক বা কাস্টমাইজড চকোলেট শেয়ার করুন! 🤝", "bento", ""],
      ["rakhi, রাখি কেক", "Special brother-sister themed cakes and hampers available for Raksha Bandhan. 🎀", "রাখির জন্য ভাই-বোন থিমের বিশেষ কেক এবং হ্যাম্পার পাওয়া যায়। 🎀", "chocs", ""],
      
      ["customize color, কালার চেঞ্জ", "Yes, you can choose and customize the cream color to match your theme. 🎨", "হ্যাঁ, আপনার থিমের সাথে মেলাতে আপনি ক্রিমের কালার কাস্টমাইজ করতে পারবেন। 🎨", "", ""],
      ["shape change, শেপ চেঞ্জ", "We bake round, square, heart, and custom 3D shaped cakes. 🟢", "আমরা গোল, চারকোনা, হার্ট এবং কাস্টম থ্রিডি (3D) শেপের কেক বেক করি। 🟢", "", ""],
      ["add photo, ছবি দেওয়া", "We can definitely add a custom printed photo on your cake. 🖼️", "আমরা অবশ্যই আপনার কেকের ওপর কাস্টম প্রিন্ট করা ছবি যোগ করতে পারি। 🖼️", "photo", ""],
      ["edible photo, খাওয়ার যোগ্য ছবি", "The photo is printed on an edible sugar sheet with food-safe colors. 🖨️", "ছবিটি সেফ ফুড কালার ব্যবহার করে ভোজ্য সুগার শিটের ওপর প্রিন্ট করা হয়। 🖨️", "photo", ""],
      ["fondant figures, ফন্ডেন্ট পুতুল", "All our fondant decorations and 3D figures are 100% edible. 🧸", "আমাদের ফন্ডেন্টের সমস্ত ডেকোরেশন এবং থ্রিডি ফিগার ১০০% খাওয়ার যোগ্য। 🧸", "fon", ""],
      ["plastic toys, প্লাস্টিকের খেলনা", "We can use reusable plastic toy toppers if specifically requested for kid themes. 🏎️", "বাচ্চাদের থিম কেকের ক্ষেত্রে বিশেষভাবে অনুরোধ করা হলে আমরা প্লাস্টিকের খেলনা ব্যবহার করতে পারি। 🏎️", "kids", ""],
      ["fresh flowers, তাজা ফুল", "We use sanitized real flowers for elegant, aesthetic cake designs. 🌺", "মার্জিত ও নান্দনিক কেক ডিজাইনের জন্য আমরা স্যানিটাইজ করা তাজা আসল ফুল ব্যবহার করি। 🌺", "flower", ""],
      ["acrylic topper, অ্যাক্রিলিক টপার", "Custom acrylic toppers can be added to your cake for a marginal extra charge. ✨", "সামান্য অতিরিক্ত চার্জের বিনিময়ে আপনার কেকে কাস্টম অ্যাক্রিলিক টপার যোগ করা যায়। ✨", "", ""],
      ["happy birthday tag, বার্থডে ট্যাগ", "We provide basic Happy Birthday tags; custom ones are available on request. 🏷️", "আমরা সাধারণ হ্যাপি বার্থডে ট্যাগ দিই; কাস্টম ট্যাগ অনুরোধে পাওয়া যায়। 🏷️", "", ""],
      ["name on cake, কেকের ওপর নাম", "Yes, we will pipe the name beautifully on the cake or board. ✍️", "হ্যাঁ, আমরা কেকের ওপর বা বোর্ডে সুন্দর করে নাম লিখে দেব। ✍️", "", ""],
      ["long message on cake, বড় মেসেজ", "For very long messages, we can write it neatly on a custom edible sheet. 📜", "খুব বড় মেসেজের ক্ষেত্রে আমরা কাস্টম ভোজ্য শিটে পরিষ্কারভাবে লিখে দিতে পারি। 📜", "", ""]
];


let intentsStr = "import { BotIntent } from '../types';\n\nexport const botIntents: BotIntent[] = [\n";

data.forEach((item, index) => {
    let keywords = item[0].split(',').map(x => x.trim().toLowerCase()).filter(x => x);
    let enA = item[1];
    let bnA = item[2];
    let imgKey = item[3];
    let linkKey = item[4];

    let images = [];
    if (imgKey && imgMap[imgKey]) {
        images.push(imgMap[imgKey]);
    }

    let links = [];
    let mapIframe = null;
    
    // Default actions
    const defaultActions = [
      { label: 'WhatsApp', url: 'https://wa.me/918918883329', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png' },
      { label: 'Call', url: 'tel:+918918883329', icon: 'https://cdn-icons-png.flaticon.com/512/483/483947.png' }
    ];

    if (linkKey && linkMap[linkKey]) {
        links.push({
            label: linkMap[linkKey].text,
            url: linkMap[linkKey].url,
            icon: linkMap[linkKey].icon
        });
        if (linkKey === 'map') {
            mapIframe = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14872.2858172!2d88.3846665!3d22.4478343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027107c2d3f269%3A0x115c8763018d2718!2sBake%20n&#39;%20Flake%20~%20FlavoursbyMusu!5e0!3m2!1sen!2sin!4v1716301772186!5m2!1sen!2sin";
        }
    } else {
        // default links on some generic things like 'call' or if NO link explicitly is given, maybe just contact?
        // Wait, not every message needs a link. Only those specifically requested.
        if (keywords.includes('call') || keywords.includes('ফোন নম্বর')) {
            links = defaultActions;
        }
    }

    intentsStr += `  {\n`;
    intentsStr += `    id: "gen_${index}",\n`;
    intentsStr += `    keywords: ${JSON.stringify(keywords)},\n`;
    intentsStr += `    responseEn: ${JSON.stringify(enA)},\n`;
    intentsStr += `    responseBn: ${JSON.stringify(bnA)},\n`;
    if (images.length > 0) {
        intentsStr += `    images: ${JSON.stringify(images)},\n`;
    }
    if (links.length > 0) {
        intentsStr += `    links: ${JSON.stringify(links)},\n`;
    }
    if (mapIframe) {
        intentsStr += `    mapIframe: ${JSON.stringify(mapIframe)},\n`;
    }
    intentsStr += `  }${index < data.length - 1 ? ',' : ''}\n`;
});

intentsStr += "];\n";

fs.writeFileSync('src/data/botIntents.ts', intentsStr);
console.log('Updated botIntents from user payload');
