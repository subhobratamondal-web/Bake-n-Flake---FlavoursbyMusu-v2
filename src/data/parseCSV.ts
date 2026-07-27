import fs from 'fs';
import path from 'path';

const csvData = `
"Input","Output"
"hi, hello, hey, ওহে, নমস্কার, হ্যালো","Welcome to Bake n' Flake ~ Flavors by Musu! 🧁 How can I help you today? | বেক এন ফ্লেকে আপনাকে স্বাগতম! আজ কীভাবে সাহায্য করতে পারি? [🔗 WhatsApp: https://wa.me/919875563329]"
"start, begin, শুরু করুন","Hello! I am Musu's digital assistant. What are you craving today? | হ্যালো! আমি মুসুর ডিজিটাল অ্যাসিস্ট্যান্ট। আজ আপনি কী খুঁজছেন? [🔗 WhatsApp: https://wa.me/919875563329]"
"good morning, good evening, শুভ সকাল, শুভ সন্ধ্যা","Good day! Ready to make your celebration sweeter? | শুভ দিন! আপনার উদযাপনকে মিষ্টি করতে আমরা প্রস্তুত! [🔗 WhatsApp: https://wa.me/919875563329]"
"help, assist, সাহায্য, হেল্প","Sure! I can help you with menu, prices, delivery, and custom cakes. | অবশ্যই! আমি আপনাকে মেনু, দাম, ডেলিভারি এবং কাস্টম কেকের ব্যাপারে সাহায্য করতে পারি।"
"robot, chatbot, বট, তুমি কে","I am an AI assistant here to help you order delicious bakes from Bake n' Flake! | আমি একটি এআই অ্যাসিস্ট্যান্ট, বেক এন ফ্লেক থেকে অর্ডার করতে আপনাকে সাহায্য করব!"
"location, map, কোথায়, লোকেশন","We are located at Kamalgazi, Kolkata, 700103. | আমরা কলকাতার কমলগাজীতে (৭০০০১০৩) অবস্থিত। [📍 Map: https://www.google.com/maps/place/Bake+n'+Flake+~+FlavoursbyMusu/@22.4478343,88.3911033,17z/data=!4m6!3m5!1s0x3a027107c2d3f269:0x115c8763018d2718!8m2!3d22.4478343!4d88.3911033!16s%2Fg%2F11jkpnw4kk?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D]"
"address, where, ঠিকানা, অ্যাড্রেস","Our address is Kamalgazi, Kolkata 700103. | আমাদের ঠিকানা কমলগাজী, কলকাতা ৭০০০১০৩। [📍 Map: https://www.google.com/maps/place/Bake+n'+Flake+~+FlavoursbyMusu/@22.4478343,88.3911033,17z/data=!4m6!3m5!1s0x3a027107c2d3f269:0x115c8763018d2718!8m2!3d22.4478343!4d88.3911033!16s%2Fg%2F11jkpnw4kk?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D]"
"shop, bakery location, দোকান, বেকারি","The bakery is in Kamalgazi. We mostly do pre-orders. | বেকারিটি কমলগাজীতে। আমরা মূলত প্রি-অর্ডারে কাজ করি। [📞 Call: tel:+919875563329]"
"directions, how to go, কীভাবে যাব, ডিরেকশন","Click the map link to get exact directions to our bakery! | আমাদের বেকারিতে আসার ডিরেকশন পেতে ম্যাপ লিঙ্কে ক্লিক করুন! [📍 Map: https://www.google.com/maps/place/Bake+n'+Flake+~+FlavoursbyMusu/@22.4478343,88.3911033,17z/data=!4m6!3m5!1s0x3a027107c2d3f269:0x115c8763018d2718!8m2!3d22.4478343!4d88.3911033!16s%2Fg%2F11jkpnw4kk?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D]"
"kamalgazi, sonarpur, কমলগাজী, সোনারপুর","Yes, we are based in Kamalgazi, near Sonarpur. | হ্যাঁ, আমরা সোনারপুরের কাছে কমলগাজীতে অবস্থিত। [📍 Map: https://www.google.com/maps/place/Bake+n'+Flake+~+FlavoursbyMusu/@22.4478343,88.3911033,17z/data=!4m6!3m5!1s0x3a027107c2d3f269:0x115c8763018d2718!8m2!3d22.4478343!4d88.3911033!16s%2Fg%2F11jkpnw4kk?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D]"
"branch, outlets, ব্রাঞ্চ, আউটলেট","We currently operate from our single Kamalgazi kitchen for quality control. | কোয়ালিটি বজায় রাখতে বর্তমানে আমরা শুধুমাত্র কমলগাজী কিচেন থেকেই কাজ করি।"
"pin code, exact address, পিন কোড, পিনকোড","Our pin code is Kolkata 700103. | আমাদের পিন কোড কলকাতা ৭০০০১০৩। [📍 Map: https://www.google.com/maps/place/Bake+n'+Flake+~+FlavoursbyMusu/@22.4478343,88.3911033,17z/data=!4m6!3m5!1s0x3a027107c2d3f269:0x115c8763018d2718!8m2!3d22.4478343!4d88.3911033!16s%2Fg%2F11jkpnw4kk?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D]"
"physical store, visit, স্টোর ভিজিট","You can visit us for pickup, but please call ahead as we work on pre-orders. | আপনি পিক-আপের জন্য আসতে পারেন, তবে প্রি-অর্ডারে কাজ হয় তাই আগে কল করে নেবেন। [📞 Call: tel:+919875563329]"
"dine in, seating, বসে খাওয়া, সিটিং","We don't have a large seating area; we focus on custom orders and delivery. | আমাদের বসে খাওয়ার বড় জায়গা নেই, আমরা কাস্টম অর্ডার ও ডেলিভারিতে ফোকাস করি।"
"open today, timings, আজ খোলা, কখন খোলেন","We operate daily. Please ping us to check slot availability! | আমরা প্রতিদিন কাজ করি। স্লট ফাঁকা আছে কিনা জানতে মেসেজ করুন! [🔗 WhatsApp: https://wa.me/919875563329]"
"call, phone, কল, ফোন নম্বর","You can directly call us here: | আপনি সরাসরি এখানে কল করতে পারেন: [📞 Call: tel:+919875563329]"
"whatsapp, text, হোয়াটসঅ্যাপ, মেসেজ","Let's chat on WhatsApp for easy customization! | কেক কাস্টমাইজ করতে আসুন হোয়াটসঅ্যাপে কথা বলি! [💬 WhatsApp: https://wa.me/919875563329]"
"messenger, fb message, মেসেঞ্জার, ইনবক্স","You can message us directly on our Facebook Messenger. | আমাদের ফেসবুক মেসেঞ্জারে সরাসরি ইনবক্স করতে পারেন। [💬 Messenger: https://m.me/flavoursbymusu]"
"email, gmail, ইমেইল, জিমেইল","For official inquiries, drop a mail at: | অফিশিয়াল যোগাযোগের জন্য মেইল করুন: [✉️ Email: Khanmegha99@gmail.com]"
"owner, musu, ওনার, মুসু কে","Musu (Megha Khan) is the talented owner and head baker behind Bake n' Flake! | মুসু (মেঘা খান) হলেন বেক এন ফ্লেকের প্রতিভাবান মালিক এবং প্রধান বেকার! [👤 Owner FB: https://www.facebook.com/musu.khan99/]"
"facebook, fb page, ফেসবুক পেজ","Follow our official Facebook page for the latest updates! | লেটেস্ট আপডেট পেতে আমাদের ফেসবুক পেজ ফলো করুন! [📘 Facebook: https://www.facebook.com/flavoursbymusu/]"
"instagram, insta, ইনস্টাগ্রাম, ইন্সটা","Check out our aesthetic cake gallery on Instagram! | আমাদের কেকের গ্যালারি দেখতে ইনস্টাগ্রামে আসুন! [📸 Instagram: https://instagram.com/flavoursbymusu]"
"youtube, videos, ইউটিউব, ভিডিও","Watch our cake making videos on YouTube! | আমাদের কেক তৈরির ভিডিওগুলো ইউটিউবে দেখুন! [🎥 YouTube: https://youtube.com/@MuskanKhan-pk3qt]"
"pinterest, pins, পিন্টারেস্ট","Find cake inspirations on our Pinterest boards! | কেকের আইডিয়া পেতে আমাদের পিন্টারেস্ট বোর্ড দেখুন! [📌 Pinterest: https://in.pinterest.com/khanmegha99/]"
"social media, follow, সোশ্যাল মিডিয়া, পেজ","Connect with us across all platforms to stay updated! | আমাদের সাথে সব প্ল্যাটফর্মে যুক্ত থাকুন! [📘 Facebook: https://www.facebook.com/flavoursbymusu/]"
"chocolate cakes, চকোলেট কেক, চকলেট","Rich and classic Chocolate Cakes baked fresh with premium cocoa. | প্রিমিয়াম কোকো দিয়ে তৈরি আমাদের ক্লাসিক চকোলেট কেক। [🖼️ Image: https://i.ibb.co/xSTgDb8d/Chocolate-Cakes-1.png] [🔗 Order: https://wa.me/919875563329]"
"butterscotch cakes, বাটারস্কচ কেক","Delicious Butterscotch cakes packed with crunchy praline. | ক্রাঞ্চি প্রালিন দিয়ে তৈরি দারুণ স্বাদের বাটারস্কচ কেক। [🖼️ Image: https://i.ibb.co/fYcwMKdc/Butterscotch-Cakes-1.png] [🔗 Order: https://wa.me/919875563329]"
"vanilla cakes, ভ্যানিলা কেক","Soft and elegant Vanilla cakes perfect for any theme. | যেকোনো থিমের জন্য মানানসই নরম ও ক্লাসিক ভ্যানিলা কেক। [🖼️ Image: https://i.ibb.co/qMBQG6Nk/Vanilla-Cake-1.png] [🔗 Order: https://wa.me/919875563329]"
"chocolate truffle, চকোলেট ট্রাফল","Our best-seller! Intensely rich and smooth Chocolate Truffle. | আমাদের বেস্ট-সেলার! অত্যন্ত রিচ এবং স্মুথ চকোলেট ট্রাফল। [🖼️ Image: https://i.ibb.co/MKF765x/Chocolate-Truffle-Cakes-1.png] [🔗 Order: https://wa.me/919875563329]"
"pineapple cakes, পাইনঅ্যাপল কেক, আনারস","Freshly baked Pineapple cakes with tangy real fruit chunks. | আসল আনারসের টুকরো দিয়ে তৈরি তাজা পাইনঅ্যাপল কেক। [🖼️ Image: https://i.ibb.co/gbC67jD7/PIneapple-Cake-1.png] [🔗 Order: https://wa.me/919875563329]"
"mango cakes, ম্যাংগো কেক, আম","Seasonal special Mango Cakes made with premium pulp. | প্রিমিয়াম পাল্প দিয়ে তৈরি সিজনাল স্পেশাল ম্যাংগো কেক। [🖼️ Image: https://i.ibb.co/q3M2pvxs/Mango-Cake-1.png] [🔗 Order: https://wa.me/919875563329]"
"strawberry cakes, স্ট্রবেরি কেক","Vibrant Strawberry cakes with sweet and tangy flavor profiles. | টক-মিষ্টি ফ্লেভারের চমৎকার স্ট্রবেরি কেক। [🖼️ Image: https://i.ibb.co/7JYt6dJp/Strawberry-Cakes-1.jpg] [🔗 Order: https://wa.me/919875563329]"
"red velvet cakes, রেড ভেলভেট কেক","Premium Red Velvet cakes layered with real cream cheese frosting. | আসল ক্রিম চিজ ফ্রস্টিং দিয়ে তৈরি প্রিমিয়াম রেড ভেলভেট কেক। [🖼️ Image: https://i.ibb.co/s9gGgtpk/Red-velvet-1.png] [🔗 Order: https://wa.me/919875563329]"
"fresh fruit cake, ফ্রেশ ফ্রুট কেক, ফলের কেক","Healthy and colorful cakes loaded with premium seasonal fruits. | প্রিমিয়াম তাজা ফলে ভরপুর স্বাস্থ্যকর ও রঙিন ফ্রেশ ফ্রুট কেক। [🖼️ Image: https://i.ibb.co/F4V5yd16/Fresh-Fruit-Cake-1.png] [🔗 Order: https://wa.me/919875563329]"
"forest range, black forest, ফরেস্ট রেঞ্জ, ব্ল্যাক ফরেস্ট","Classic Black Forest cakes with chocolate shavings and cherries. | চকোলেট শেভিংস ও চেরি দিয়ে সাজানো ক্লাসিক ব্ল্যাক ফরেস্ট কেক। [🖼️ Image: https://i.ibb.co/q3P990gk/Black-Forest-1.png] [🔗 Order: https://wa.me/919875563329]"
"oreo cakes, ওরিও কেক","Crunchy and creamy Oreo Cakes, a massive hit among kids! | ক্রাঞ্চি ও ক্রিমি ওরিও কেক, যা বাচ্চাদের দারুণ প্রিয়! [🖼️ Image: https://i.ibb.co/nprbQJC/Oreo-Cake-2.png] [🔗 Order: https://wa.me/919875563329]"
"alcohol base cake, অ্যালকোহল বেস কেক, মদ","Premium Alcohol-infused cakes curated specially for adult parties. | প্রাপ্তবয়স্কদের পার্টির জন্য বিশেষভাবে তৈরি অ্যালকোহল-বেসড কেক। [🖼️ Image: https://i.ibb.co/xSj9RRdz/Alcohol-Cake-01.png] [🔗 Order: https://wa.me/919875563329]"
"coffee mocha, coffee cake, কফি মোকা, কফি কেক","Rich Coffee Mocha pairing premium coffee with dark chocolate. | প্রিমিয়াম কফি ও ডার্ক চকোলেটের দারুণ স্বাদের কফি মোকা কেক। [🖼️ Image: https://i.ibb.co/4w2jyMmB/Coffee-Cake-1.png] [🔗 Order: https://wa.me/919875563329]"
"rasmalai cake, রসমলাই কেক","Our royal fusion specialty loaded with real rasmalai chunks! | আসল রসমলাইয়ের টুকরো দিয়ে তৈরি আমাদের রয়্যাল ফিউশন কেক! [🖼️ Image: https://i.ibb.co/4RBygSqR/Rasmalai-Cake-1.png] [🔗 Order: https://wa.me/919875563329]"
"orange cake, অরেঞ্জ কেক, কমলালেবু","Refreshing Orange cakes with real tangy citrus profiles. | আসল সাইট্রাস ফ্লেভারের রিফ্রেশিং অরেঞ্জ কেক। [🖼️ Image: https://i.ibb.co/RTSFv7dG/Orrange-Cake-1.png] [🔗 Order: https://wa.me/919875563329]"
"kitkat cakes, কিটক্যাট কেক","Crunchy KitKat cakes decorated beautifully for chocolate fanatics. | চকোলেট প্রেমীদের জন্য কিটক্যাট দিয়ে সাজানো ক্রাঞ্চি কেক। [🖼️ Image: https://i.ibb.co/k26bhF2H/Kitkat-1.png] [🔗 Order: https://wa.me/919875563329]"
"birthday cakes, জন্মদিনের কেক","Customized Birthday cakes designed uniquely for your celebrations. | আপনার জন্মদিনের থিম অনুযায়ী সুন্দর করে ডিজাইন করা কাস্টম কেক। [🖼️ Image: https://i.ibb.co/hJyMC4CY/Birthday-Cake-1.jpg] [🔗 Order: https://wa.me/919875563329]"
"anniversary cakes, অ্যানিভার্সারি কেক, বিবাহ বার্ষিকী","Celebrate milestones with our beautifully crafted romantic Anniversary cakes. | আমাদের রোমান্টিক অ্যানিভার্সারি কেক দিয়ে বিবাহ বার্ষিকী উদযাপন করুন। [🖼️ Image: https://i.ibb.co/5gDy06k7/Aniversary-Cake-2.png] [🔗 Order: https://wa.me/919875563329]"
"teachers day, teachers day cake, টিচার্স ডে কেক, শিক্ষক দিবস","Special thematic cakes to show gratitude on Teacher's Day. | শিক্ষকদের প্রতি সম্মান জানাতে শিক্ষক দিবসের বিশেষ থিম কেক। [🖼️ Image: https://i.ibb.co/Y4tgPBNP/Teacher-s-Day-1.png] [🔗 Order: https://wa.me/919875563329]"
"customised chocolates, কাস্টমাইজড চকোলেট","Handmade customized chocolates making perfect thoughtful gifts. | উপহার দেওয়ার জন্য দারুণ মানানসই হাতে তৈরি কাস্টমাইজড চকোলেট। [🖼️ Image: https://i.ibb.co/Rp8C27Xt/Customized-Chocolates-2.jpg] [🔗 Order: https://wa.me/919875563329]"
"fathers day cake, ফাদার্স ডে কেক","Surprise your superhero with our customized Father's Day cakes! | বাবা দিবসে আপনার সুপারহিরোকে সারপ্রাইজ দিন আমাদের স্পেশাল কেক দিয়ে! [🖼️ Image: https://i.ibb.co/YT2LRm2x/Father-s-Day-Cake-1.png] [🔗 Order: https://wa.me/919875563329]"
"mothers day cake, মাদার্স ডে কেক","Sweet and elegant Mother's Day cakes designed beautifully. | মা দিবসের জন্য বিশেষভাবে ডিজাইন করা মিষ্টি ও মার্জিত মাদার্স ডে কেক। [🖼️ Image: https://i.ibb.co/4n26zZCq/2.jpg] [🔗 Order: https://wa.me/919875563329]"
"christmas cake, plum cake, ক্রিসমাস কেক, প্লাম কেক","Festive Christmas cakes and rich plum options for the holidays. | বড়দিনের উৎসবকে আরও রঙিন করতে আমাদের স্পেশাল প্লাম কেক। [🖼️ Image: https://i.ibb.co/7NKqnNsd/Christmas-Cake-4.png] [🔗 Order: https://wa.me/919875563329]"
"baby shower cake, বেবি শাওয়ার কেক, সাধ","Adorable Baby Shower cakes curated safely with pastel tones. | প্যাস্টেল টোনে তৈরি বেবি শাওয়ার বা সাধের অনুষ্ঠানের জন্য কিউট কেক। [🖼️ Image: https://i.ibb.co/RTTYsqVd/KIDS-CAKE.png] [🔗 Order: https://wa.me/919875563329]"
"rice ceremony cakes, অন্নপ্রাশনের কেক, মুখে ভাত","Culturally rich Rice Ceremony cakes customized for your little one. | আপনার সোনামণির অন্নপ্রাশনের জন্য ঐতিহ্যবাহী সুন্দর কাস্টমাইজড কেক। [🖼️ Image: https://i.pinimg.com/736x/6c/bb/7f/6cbb7f551f96722c5b6f01141b5b4aa6.jpg] [🔗 Order: https://wa.me/919875563329]"
"fresh flower cake, ফ্রেশ ফ্লাওয়ার কেক, তাজা ফুল","Elegant aesthetic cakes decorated with sanitized real fresh flowers. | সম্পূর্ণ স্যানিটাইজ করা তাজা আসল ফুল দিয়ে সাজানো মার্জিত কেক। [🖼️ Image: https://i.ibb.co/fzVDfmhj/FRESH-FLOWER-CAKE-1.jpg] [🔗 Order: https://wa.me/919875563329]"
"doll cakes, barbie cake, ডল কেক, বার্বি","Gorgeous Barbie and Doll theme cakes for your little princess. | আপনার ছোট্ট রাজকন্যার জন্য চমৎকার ও আকর্ষণীয় বার্বি ডল কেক। [🖼️ Image: https://i.ibb.co/bGXr5qW/DOLL-CAKE-1.png] [🔗 Order: https://wa.me/919875563329]"
"half cakes, 6 month birthday, হাফ কেক, ৬ মাস","Trendy Half Cakes perfect for 6-month half-birthday milestones! | শিশুর প্রথম ৬ মাস বা হাফ-বার্থডে উদযাপনের জন্য আধুনিক হাফ কেক! [🖼️ Image: https://i.ibb.co/V0yhspQm/HALF-CAKE-1.jpg] [🔗 Order: https://wa.me/919875563329]"
"tier cakes, 2 tier, টিয়ার কেক, দোতলা কেক","Magnificent Tier Cakes engineered for grand events and weddings. | বিয়ে বা যেকোনো বড় রাজকীয় অনুষ্ঠানের জন্য বিশেষভাবে তৈরি টিয়ার কেক। [🖼️ Image: https://i.ibb.co/Xx1SBWb6/TIRE-CAKE.png] [🔗 Order: https://wa.me/919875563329]"
"number cakes, letter cake, নম্বর কেক, সংখ্যা","Alphabet and Number cakes custom structured for birthdays. | বয়স বা নামের আদ্যক্ষর অনুযায়ী নিখুঁত আকারে কাটা নম্বর বা লেটার কেক। [🖼️ Image: https://i.ibb.co/20VxsJxG/Number-Cake.jpg] [🔗 Order: https://wa.me/919875563329]"
"kids cakes, cartoon cake, বাচ্চাদের কেক, কার্টুন","Fun and vibrant cartoon or gaming themed cakes for kids. | বাচ্চাদের জন্য তৈরি মজাদার এবং সম্পূর্ণ নিরাপদ কার্টুন থিম কেক। [🖼️ Image: https://i.ibb.co/xrgZZcx/Kids-Cake-1.png] [🔗 Order: https://wa.me/919875563329]"
"fondant and semi fondant cakes, fondant cake, semi fondant, ফন্ডেন্ট কেক","100% edible premium fondant craftsmanship with 3D modeling. | বিস্তারিত থ্রি-ডি (3D) ডিজাইনসহ ১০০% খাওয়ার যোগ্য প্রিমিয়াম ফন্ডেন্ট কেক। [🖼️ Image: https://i.ibb.co/ZpB76tN5/FONDANT-1.png] [🔗 Order: https://wa.me/919875563329]"
"glitter cake, গ্লিটার কেক","Sparkly Glitter cakes finished with safe, 100% edible glitter dust. | ১০০% নিরাপদ ও খাওয়ার যোগ্য গ্লিটার ডাস্ট দিয়ে তৈরি চকচকে গ্লিটার কেক। [🖼️ Image: https://i.ibb.co/xt8VVwmW/Gliter-Cake-1.jpg] [🔗 Order: https://wa.me/919875563329]"
"customize theme cake, কাস্টমাইজড থিম কেক","Share any image, and we will customize it to perfection! | যেকোনো ছবি আমাদের পাঠান, আমরা নিখুঁতভাবে কাস্টমাইজ করে দেব! [🖼️ Image: https://i.ibb.co/9mnwZgX4/TIRE-CAKE1.png] [🔗 Order: https://wa.me/919875563329]"
"cheesecakes, cheesecake, চিজকেকস","Rich, velvety, and creamy Cheesecakes crafted with premium cheese. | প্রিমিয়াম ক্রিম চিজ দিয়ে তৈরি রিচ, ক্রিমি এবং ভেলভেটি চিজকেক। [🖼️ Image: https://i.pinimg.com/736x/bc/b6/0c/bcb60c22cedf8400a2e2c6b0679c22e5.jpg] [🔗 Order: https://wa.me/919875563329]"
"photo cakes, picture cake, ফটো কেক, ছবি দেওয়া","Personalized Photo Cakes with printing on edible sugar sheets. | খাওয়ার যোগ্য সেফ সুগার শিটের ওপর পরিষ্কার প্রিন্টসহ ফটো কেক। [🖼️ Image: https://i.ibb.co/rR23zjJp/Photo-Cake-1.png] [🔗 Order: https://wa.me/919875563329]"
"bento cakes, mini cake, বেন্টো কেক, ছোট কেক","Cute mini Korean bento cakes, perfect for 1-2 people celebrations. | ১-২ জনের ছোট সেলিব্রেশনের জন্য পারফেক্ট ও কিউট কোরিয়ান বেন্টো কেক। [🖼️ Image: https://i.ibb.co/3yDW6YkY/BENTO-1.jpg] [🔗 Order: https://wa.me/919875563329]"
"mousse, chocolate mousse, মাউস","Silky, smooth, and rich Chocolate Mousse cups for dessert lovers. | ডেজার্ট প্রেমীদের জন্য সিল্কি, স্মুথ এবং রিচ স্বাদের চকোলেট মাউস। [🖼️ Image: https://i.ibb.co/xt88WGMM/Mousse-1.jpg] [🔗 Order: https://wa.me/919875563329]"
"jar and glass cakes, jar cake, glass cake, জার এবং গ্লাস কেক","Beautifully layered cakes inside glass jars, perfect for return gifts. | কাঁচের জারে বা গ্লাসে তৈরি সুন্দর লেয়ারড কেক, গিফট দেওয়ার জন্য সেরা। [🖼️ Image: https://i.ibb.co/9HDRRk0F/Jur-cake.png] [🔗 Order: https://wa.me/919875563329]"
"pinata cakes, smash cake, পিনাটা কেক, হাতুড়ি","Fun smash Pinata cakes that come with a complimentary wooden hammer! | মজাদার পিনাটা কেক, শক্ত শেল ভাঙার জন্য সাথে কাঠের হাতুড়ি ফ্রি দেওয়া হয়! [🖼️ Image: https://i.ibb.co/gbqnmvzd/02.jpg] [🔗 Order: https://wa.me/919875563329]"
"cupcakes and muffins, cupcakes, muffins, কাপকেক ও মাফিন","Customized cute cupcakes and muffins perfect for party tables. | কাস্টমাইজড কাপকেক এবং মাফিন, যা পার্টি টেবিলের জন্য দারুণ মানানসই। [🖼️ Image: https://i.ibb.co/jkNm1Zq8/Cupcakes-1.jpg] [🔗 Order: https://wa.me/919875563329]"
"pizza & patties, pizza, patties, snacks, পিজ্জা ও প্যাটিস, নোনতা","We bake delicious homemade pizzas, fresh vegetable/chicken patties, and buns. | মিষ্টি কেক ছাড়াও আমরা সম্পূর্ণ ঘরোয়া উপায়ে তৈরি সুস্বাদু পিজ্জা ও প্যাটিস বেক করি। [🖼️ Image: https://i.ibb.co/sTLSSsj/PIZZA-BUNS-1.png] [🔗 Order: https://wa.me/919875563329]"
"brownies, ব্রাউনিজ","Super fudgy, rich, and intensely chocolatey premium Brownies. | চকোলেটে ঠাসা, অত্যন্ত নরম ও ফাজি প্রিমিয়াম চকোলেট ব্রাউনি। [🖼️ Image: https://i.ibb.co/F4rgH3Wn/Brownies-1.jpg] [🔗 Order: https://wa.me/919875563329]"
"rest of others, other cakes, unique cakes, অন্যান্য, বাকি কেক","Explore our extensive portfolio of custom creations and luxury cakes. | আমাদের তৈরি বিভিন্ন কাস্টমাইজড প্রিমিয়াম ডিজাইনের কেক কালেকশন দেখতে যোগাযোগ করুন। [🖼️ Image: https://i.ibb.co/YTTTJp6Q/Tier-Aniversary-cake.png] [🔗 Order: https://wa.me/919875563329]"
"fusion cake, ফিউশন কেক","We make excellent fusion cakes like Rasmalai and Thandai flavors! | আমরা রসমলাই এবং ঠান্ডাই ফ্লেভারের চমৎকার ফিউশন কেক বানাই! [🔗 WhatsApp: https://wa.me/919875563329]"
"fruit crush, real fruit, তাজা ফল, ক্রাশ","We use premium fruit crushes and real fruit pieces for the best taste. | সেরা স্বাদের জন্য আমরা প্রিমিয়াম ফ্রুট ক্রাশ এবং আসল ফলের টুকরো ব্যবহার করি।"
"best seller, top cake, বেস্ট সেলার, সেরা কেক","Our Chocolate Truffle and Rasmalai cakes are all-time best sellers! | আমাদের চকোলেট ট্রাফল এবং রসমলাই কেক সবসময় সেরা বিক্রি হয়!"
"menu card, list, মেনু কার্ড, লিস্ট","You can check all our signature items right here or ping us on WhatsApp! | আপনি আমাদের সিগনেচার আইটেমগুলো দেখতে পারেন বা হোয়াটসঅ্যাপে মেনু চাইতে পারেন! [🔗 WhatsApp: https://wa.me/919875563329]"
"adult cake, alcohol, বড়দের কেক, অ্যালকোহল","Yes, we make alcohol-infused cakes specially designed for adult parties. | হ্যাঁ, প্রাপ্তবয়স্কদের পার্টির জন্য আমরা অ্যালকোহল-বেসড কেক তৈরি করি।"
"black forest, white forest, ব্ল্যাক ফরেস্ট, হোয়াইট ফরেস্ট","Both classic Black Forest and White Forest are available in our Forest Range. | আমাদের ফরেস্ট রেঞ্জে ব্ল্যাক ফরেস্ট এবং হোয়াইট ফরেস্ট দুটিই পাওয়া যায়।"
"premium cake, প্রিমিয়াম কেক","We have a luxury premium range including cheesecakes and tier fondant cakes. | আমাদের কাছে চিজকেক এবং টিয়ার ফন্ডেন্ট কেকসহ একটি লাক্সারি প্রিমিয়াম রেঞ্জ আছে।"
"seasonal cake, সিজনাল কেক","We bake seasonal specials like Fresh Mango in summer and Plum cake in winter. | গ্রীষ্মে ফ্রেশ ম্যাংগো এবং শীতে প্লাম কেকের মতো সিজনাল স্পেশাল আমরা বেক করি।"
"new flavor, নতুন ফ্লেভার","We frequently update our menu. Drop a message to know the latest addition! | আমরা প্রায়ই মেনু আপডেট করি। নতুন ফ্লেভার জানতে মেসেজ করুন!"
"kids favorite, বাচ্চাদের প্রিয়","Kids absolutely love our Oreo Cakes, KitKat Cakes, and cartoon themes! | বাচ্চারা আমাদের ওরিও কেক, কিটক্যাট কেক এবং কার্টুন থিমগুলো দারুণ পছন্দ করে!"
"chocolate lovers, চকলেট লাভার","For pure chocolate lovers, our Chocolate Truffle and Fudgy Brownies are heaven! | চকোলেট লাভারদের জন্য আমাদের চকোলেট ট্রাফল এবং ফাজি ব্রাউনি একদম সেরা!"
"coffee lover, কফি লাভার","Our Coffee Mocha cake is perfectly crafted for coffee enthusiasts. | আমাদের কফি মোকা কেকটি কফি প্রেমীদের জন্য নিখুঁতভাবে তৈরি করা হয়েছে।"
"tangy cake, টক মিষ্টি কেক","Try our Pineapple, Orange, or Strawberry cakes for a sweet and tangy burst! | টক-মিষ্টি স্বাদের জন্য আমাদের পাইনঅ্যাপল, অরেঞ্জ বা স্ট্রবেরি কেক ট্রাই করতে পারেন!"
"pure chocolate, পিওর চকলেট","We use high-grade pure cocoa to ensure an authentic rich chocolate experience. | খাঁটি চকোলেটের স্বাদ নিশ্চিত করতে আমরা হাই-গ্রেড পিওর কোকো ব্যবহার করি।"
"milk chocolate, মিল্ক চকলেট","Yes, we can customize your cake frosting with smooth milk chocolate. | হ্যাঁ, আমরা স্মুথ মিল্ক চকোলেট দিয়ে আপনার কেকের ফ্রস্টিং কাস্টমাইজ করতে পারি।"
"dark chocolate, ডার্ক চকলেট","We offer premium dark chocolate truffle for an intense cocoa flavor. | ডার্ক চকোলেট ফ্লেভারের জন্য আমরা প্রিমিয়াম ডার্ক চকোলেট ট্রাফল অফার করি।"
"wedding cake, marriage, বিয়ের কেক, ওয়েডিং","We specialize in magnificent multi-tier wedding cakes. Book well in advance! | আমরা আকর্ষণীয় দোতলা/তিনতলা বিয়ের কেক তৈরিতে বিশেষজ্ঞ। আগে থেকে বুক করুন!"
"engagement, এনগেজমেন্ট কেক","Get a beautiful romantic cake customized perfectly for your ring ceremony. | আপনার রিং সেরিমনি বা এনগেজমেন্টের জন্য সুন্দর রোমান্টিক কেক কাস্টমাইজ করে নিন।"
"1st birthday, প্রথম জন্মদিন","Make their 1st birthday memorable with our safe, cute, and edible fondant cakes. | নিরাপদ ও কিউট ফন্ডেন্ট কেক দিয়ে আপনার শিশুর প্রথম জন্মদিন স্মরণীয় করে তুলুন।"
"18th birthday, ১৮ তম জন্মদিন","Celebrate hitting adulthood with our trendy and quirky 18th birthday cakes! | আমাদের ট্রেন্ডি ও মজার কেক দিয়ে ১৮তম জন্মদিনের উদযাপন করুন!"
"50th anniversary, ৫০ তম বিবাহ বার্ষিকী","Golden Jubilee calls for an elegant golden-themed premium anniversary cake. | গোল্ডেন জুবিলির জন্য একটি মার্জিত সোনালী-থিমের প্রিমিয়াম অ্যানিভার্সারি কেক একদম মানানসই।"
"silver jubilee, ২৫ তম বিবাহ বার্ষিকী","We design beautiful silver-themed cakes for the perfect 25th anniversary. | ২৫তম বিবাহ বার্ষিকীর জন্য আমরা সুন্দর সিলভার থিমের কেক ডিজাইন করি।"
"corporate event, কর্পোরেট ইভেন্ট","We take bulk orders and make logo-printed cakes for corporate events. | কর্পোরেট ইভেন্টের জন্য আমরা বাল্ক অর্ডার নিই এবং লোগো-প্রিন্টেড কেক বানাই।"
"office party, অফিস পার্টি","Order bulk cupcakes, patties, or a large cake for your office celebration. | অফিস পার্টির জন্য বেশি পরিমাণে কাপকেক, প্যাটিস বা একটি বড় কেক অর্ডার করতে পারেন।"
"farewell cake, ফেয়ারওয়েল কেক","Give a sweet goodbye with a customized farewell cake. | একটি কাস্টমাইজড ফেয়ারওয়েল কেক দিয়ে মিষ্টি বিদায় জানান।"
"baby welcome, বেবি ওয়েলকাম","Welcome the newborn with pastel shades and cute baby-themed designs. | নবজাতককে স্বাগত জানাতে প্যাস্টেল শেড এবং কিউট বেবি-থিম ডিজাইনের কেক অর্ডার করুন।"
"pet birthday, পোষা প্রাণী, কুকুরের জন্মদিন","While made for humans, we can design fun pet-themed cakes for the party! | কেক মানুষের খাওয়ার জন্য হলেও, আমরা পার্টির জন্য মজাদার পেট-থিম কেক ডিজাইন করতে পারি!"
"diwali hamper, দিওয়ালি হ্যাম্পার","Gift our customized chocolate and brownie hampers this Diwali. | এই দীপাবলিতে আমাদের কাস্টমাইজড চকোলেট এবং ব্রাউনি হ্যাম্পার উপহার দিন।"
"holi special, হোলি স্পেশাল","Try our colorful fusion bakes like Thandai cupcakes during Holi! | হোলির সময় আমাদের রঙিন ফিউশন বেক যেমন ঠান্ডাই কাপকেক ট্রাই করুন!"
"eid cake, ঈদের কেক","We craft beautiful crescent moon and star-themed cakes for Eid. | আমরা ঈদ উদযাপনের জন্য সুন্দর চাঁদ-তারা থিমের কেক ডিজাইন করি।"
"new year cake, নিউ ইয়ার কেক","Countdown to the New Year with our special midnight themed cakes. | আমাদের স্পেশাল মিডনাইট থিম কেক দিয়ে নতুন বছরের কাউন্টডাউন শুরু করুন।"
"valentines day, ভ্যালেন্টাইন্স ডে","Heart-shaped Red Velvet cakes are perfect for Valentine's Day romance. | ভ্যালেন্টাইন্স ডে-র রোমান্সের জন্য হার্ট শেপের রেড ভেলভেট কেক একদম পারফেক্ট।"
"womens day, ওমেন্স ডে","Celebrate the strong women with our elegant floral and theme cakes. | আমাদের সুন্দর ফ্লোরাল ও থিম কেক দিয়ে নারী দিবস উদযাপন করুন।"
"mens day, মেন্স ডে","Get a quirky suit or hobby-themed cake for International Men's Day. | আন্তর্জাতিক পুরুষ দিবসের জন্য স্যুট বা শখের থিমের কেক অর্ডার করুন।"
"friendship day, ফ্রেন্ডশিপ ডে","Share a Bento cake or customized chocolates with your best friend! | আপনার সেরা বন্ধুর সাথে একটি বেন্টো কেক বা কাস্টমাইজড চকোলেট শেয়ার করুন!"
"rakhi, রাখি কেক","Special brother-sister themed cakes and hampers available for Raksha Bandhan. | রাখির জন্য ভাই-বোন থিমের বিশেষ কেক এবং হ্যাম্পার পাওয়া যায়।"
"customize color, কালার চেঞ্জ","Yes, you can choose and customize the cream color to match your theme. | হ্যাঁ, আপনার থিমের সাথে মেলাতে আপনি ক্রিমের কালার কাস্টমাইজ করতে পারবেন।"
"shape change, শেপ চেঞ্জ","We bake round, square, heart, and custom 3D shaped cakes. | আমরা গোল, চারকোনা, হার্ট এবং কাস্টম থ্রিডি (3D) শেপের কেক বেক করি।"
"add photo, ছবি দেওয়া","We can definitely add a custom printed photo on your cake. | আমরা অবশ্যই আপনার কেকের ওপর কাস্টম প্রিন্ট করা ছবি যোগ করতে পারি।"
"edible photo, খাওয়ার যোগ্য ছবি","The photo is printed on an edible sugar sheet with food-safe colors. | ছবিটি সেফ ফুড কালার ব্যবহার করে ভোজ্য সুগার শিটের ওপর প্রিন্ট করা হয়।"
"fondant figures, ফন্ডেন্ট পুতুল","All our fondant decorations and 3D figures are 100% edible. | আমাদের ফন্ডেন্টের সমস্ত ডেকোরেশন এবং থ্রিডি ফিগার ১০০% খাওয়ার যোগ্য।"
"plastic toys, প্লাস্টিকের খেলনা","We can use reusable plastic toy toppers if specifically requested for kid themes. | বাচ্চাদের থিম কেকের ক্ষেত্রে বিশেষভাবে অনুরোধ করা হলে আমরা প্লাস্টিকের খেলনা ব্যবহার করতে পারি।"
"fresh flowers, তাজা ফুল","We use sanitized real flowers for elegant, aesthetic cake designs. | মার্জিত ও নান্দনিক কেক ডিজাইনের জন্য আমরা স্যানিটাইজ করা তাজা আসল ফুল ব্যবহার করি।"
"acrylic topper, অ্যাক্রিলিক টপার","Custom acrylic toppers can be added to your cake for a marginal extra charge. | সামান্য অতিরিক্ত চার্জের বিনিময়ে আপনার কেকে কাস্টম অ্যাক্রিলিক টপার যোগ করা যায়।"
"happy birthday tag, বার্থডে ট্যাগ","We provide basic Happy Birthday tags; custom ones are available on request. | আমরা সাধারণ হ্যাপি বার্থডে ট্যাগ দিই; কাস্টম ট্যাগ অনুরোধে পাওয়া যায়।"
"name on cake, কেকের ওপর নাম","Yes, we will pipe the name beautifully on the cake or board. | হ্যাঁ, আমরা কেকের ওপর বা বোর্ডে সুন্দর করে নাম লিখে দেব।"
"long message on cake, বড় মেসেজ","For very long messages, we can write it neatly on a custom edible sheet. | খুব বড় মেসেজের ক্ষেত্রে আমরা কাস্টম ভোজ্য শিটে পরিষ্কারভাবে লিখে দিতে পারি।"
"heart shape, হার্ট শেপ","Heart-shaped cakes are available for all flavors and celebrations. | সমস্ত ফ্লেভার এবং সেলিব্রেশনের জন্যই হার্ট শেপের কেক পাওয়া যায়।"
"square shape, স্কোয়ার শেপ","Yes, we can bake square-shaped cakes for a modern look. | হ্যাঁ, আধুনিক লুকের জন্য আমরা চারকোনা বা স্কোয়ার শেপের কেক বেক করতে পারি।"
"tall cake, লম্বা কেক","Tall barrel cakes with high layers are very trendy and available to order. | বেশি লেয়ার যুক্ত লম্বা ব্যারেল কেকগুলো খুব ট্রেন্ডি এবং অর্ডার করা যায়।"
"hidden gift, pull me up, সারপ্রাইজ গিফট","We can hide a capsule inside or make a fun pull-me-up money cake! | আমরা ভেতরে ক্যাপসুল লুকাতে পারি বা মজার পুল-মি-আপ মানি কেক বানাতে পারি!"
"money cake, মানি কেক","Surprise them with a cake that dispenses money when pulled! | পুল করলে টাকা বেরোবে এমন কেক দিয়ে তাদের সারপ্রাইজ দিন!"
"glitter dust, গ্লিটার ডাস্ট","We use 100% safe and edible glitter dust to make your cake sparkle. | আপনার কেক চকচকে করতে আমরা ১০০% নিরাপদ ও ভোজ্য গ্লিটার ডাস্ট ব্যবহার করি।"
"gold flakes, গোল্ড ফ্লেক্স","Add a touch of luxury with our edible metallic gold flakes. | আমাদের খাওয়ার যোগ্য মেটালিক গোল্ড ফ্লেক্স দিয়ে কেকের লাক্সারি লুক বাড়িয়ে তুলুন।"
"silver balls, সিলভার বল","The silver balls are sweet, edible sugar dragees, totally safe to eat. | সিলভার বলগুলো হলো মিষ্টি, খাওয়ার যোগ্য সুগার ড্রাজিস, যা সম্পূর্ণ নিরাপদ।"
"mirror glaze, মিরর গ্লেজ","Premium high-gloss mirror glaze cakes can be prepared on special request. | স্পেশাল রিকোয়েস্টে প্রিমিয়াম হাই-গ্লস মিরর গ্লেজ কেক প্রস্তুত করা যেতে পারে।"
"home delivery, হোম ডেলিভারি","Yes, we provide safe home delivery in and around Kamalgazi. | হ্যাঁ, আমরা কমলগাজী এবং আশেপাশের এলাকায় সুরক্ষিত হোম ডেলিভারি প্রদান করি। [🔗 WhatsApp: https://wa.me/919875563329]"
"delivery charge, ডেলিভারি চার্জ","Delivery charges are very nominal and depend on the exact distance. | ডেলিভারি চার্জ অত্যন্ত সামান্য এবং সঠিক দূরত্বের ওপর নির্ভর করে।"
"free delivery, ফ্রি ডেলিভারি","Free delivery may be available for nearby orders exceeding a certain amount. | কাছাকাছি এলাকায় নির্দিষ্ট অ্যামাউন্টের বেশি অর্ডারে ফ্রি ডেলিভারি পাওয়া যেতে পারে।"
"midnight delivery, মাঝরাতে ডেলিভারি","Surprise your loved ones with our midnight delivery (pre-booking required). | আমাদের মিডনাইট ডেলিভারি দিয়ে প্রিয়জনকে সারপ্রাইজ দিন (আগে বুকিং প্রয়োজন)।"
"same day delivery, সেম ডে ডেলিভারি","Same-day delivery is possible for basic flavors if slots are open. Call us! | স্লট ফাঁকা থাকলে বেসিক ফ্লেভারে সেম-ডে ডেলিভারি সম্ভব। আমাদের কল করুন! [📞 Call: tel:+919875563329]"
"pick up, self pickup, স্টোর পিকআপ, নিজে গিয়ে","You are always welcome to pick up your order directly from our location for free. | আপনি যেকোনো সময় বিনামূল্যে আমাদের লোকেশন থেকে নিজে এসে অর্ডার পিক-আপ করতে পারেন।"
"dunzo, porter, swiggy, ডানজো, পোর্টার","You can arrange a Dunzo or Porter, but please ensure they carry it safely. | আপনি ডানজো বা পোর্টার পাঠাতে পারেন, তবে তারা যেন সাবধানে বহন করে তা নিশ্চিত করবেন।"
"outside kamalgazi, কমলগাজীর বাইরে","We cover Sonarpur, Narendrapur, and mostly South Kolkata. Share your pin code! | আমরা সোনারপুর, নরেন্দ্রপুর এবং মূলত দক্ষিণ কলকাতা কভার করি। পিন কোড দিন!"
"rain delivery, বৃষ্টিতে ডেলিভারি","We try our best, but extreme weather might cause slight delivery delays. | আমরা সর্বোচ্চ চেষ্টা করি, তবে চরম আবহাওয়ায় ডেলিভারিতে সামান্য দেরি হতে পারে।"
"safe delivery, damage, সেফ ডেলিভারি, ভেঙে যাবে না তো","Cakes are packed securely in sturdy boxes to ensure 100% safe transit. | কেক ১০০% সুরক্ষিতভাবে পৌঁছানোর জন্য মজবুত বাক্সে প্যাক করা হয়।"
"delivery time, ডেলিভারি টাইম","You can specify your preferred time slot while confirming the order. | অর্ডার কনফার্ম করার সময় আপনি আপনার পছন্দের টাইম স্লটটি নির্দিষ্ট করে দিতে পারেন।"
"banquet delivery, ব্যাঙ্কোয়েট ডেলিভারি","Yes, we can deliver multi-tier cakes directly to your banquet hall venue. | হ্যাঁ, আমরা মাল্টি-টিয়ার কেক সরাসরি আপনার ব্যাঙ্কোয়েট হলে ডেলিভারি করতে পারি।"
"track order, ট্র্যাক অর্ডার","Please call or WhatsApp us to get a live update on your delivery. | ডেলিভারির লাইভ আপডেট পেতে অনুগ্রহ করে আমাদের কল বা হোয়াটসঅ্যাপ করুন।"
"contactless delivery, কন্ট্যাক্টলেস ডেলিভারি","Prepay online, and we will safely drop the cake with your security guard. | অনলাইনে পেমেন্ট করুন, আমরা সিকিউরিটির কাছে কেক নিরাপদে রেখে আসব।"
"carry bag, ক্যারিব্যাগ","A convenient carry bag is provided with the cake box for easy handling. | সহজে নিয়ে যাওয়ার জন্য কেকের বক্সের সাথে একটি সুবিধাজনক ক্যারিব্যাগ দেওয়া হয়।"
"bike carry, বাইক ক্যারি","Small cakes are fine on a bike, but for heavy/tier cakes, a car is recommended. | ছোট কেক বাইকে নেওয়া যায়, তবে ভারী/টিয়ার কেকের জন্য গাড়ি ব্যবহার করা ভালো।"
"car transport, কার ট্রান্সপোর্ট","Place the cake flat on the car floorboard with the AC on for safe transport. | এসি চালিয়ে গাড়ির মেঝেতে কেকটি সমতলভাবে রাখলে তা নিরাপদে পৌঁছাবে।"
"train journey, ট্রেন জার্নি","For long train journeys, we strongly recommend non-cream fondant or dry cakes. | লম্বা ট্রেন জার্নির জন্য আমরা ক্রিম ছাড়া ফন্ডেন্ট বা ড্রাই কেক নেওয়ার পরামর্শ দিই।"
"out of station, আউট অফ স্টেশন","We do not ship fresh cream cakes outside the city via courier to prevent spoiling. | নষ্ট হওয়া এড়াতে আমরা ফ্রেশ ক্রিম কেক শহরের বাইরে কুরিয়ারে পাঠাই না।"
"packaging box, প্যাকেজিং বক্স","Our premium packaging boxes are sturdy, hygienic, and display-friendly. | আমাদের প্রিমিয়াম প্যাকেজিং বক্সগুলো মজবুত, স্বাস্থ্যসম্মত এবং ডিসপ্লে-ফ্রেন্ডলি।"
"how to order, কীভাবে অর্ডার করব","Send us the cake picture, flavor, date, and your details on WhatsApp! | কেকের ছবি, ফ্লেভার, তারিখ এবং আপনার ডিটেইলস আমাদের হোয়াটসঅ্যাপে পাঠিয়ে দিন! [🔗 WhatsApp: https://wa.me/919875563329]"
"order process, অর্ডার প্রসেস","1. Choose design 2. Confirm details 3. Pay advance 4. Order booked! | ১. ডিজাইন বাছুন ২. ডিটেইলস কনফার্ম করুন ৩. অ্যাডভান্স দিন ৪. অর্ডার বুকড!"
"advance payment, অ্যাডভান্স পেমেন্ট","A partial advance payment is mandatory to lock your slot and confirm custom cakes. | স্লট লক করতে এবং কাস্টম কেক কনফার্ম করতে আংশিক অ্যাডভান্স পেমেন্ট বাধ্যতামূলক।"
"cod, cash on delivery, ক্যাশ অন ডেলিভারি","COD is available for delivery, but a booking advance is still required. | ডেলিভারির ক্ষেত্রে COD দেওয়া হয়, তবে বুকিংয়ের জন্য অ্যাডভান্স আবশ্যক।"
"upi, gpay, phonepe, ইউপিআই, গুগল পে","We accept payments via Google Pay, PhonePe, Paytm, and all major UPI apps. | আমরা গুগল পে, ফোনপে, পেটিএম এবং সমস্ত ইউপিআই (UPI) অ্যাপ সাপোর্ট করি।"
"split payment, স্প্লিট পেমেন্ট","You can split the payment between two UPI IDs before delivery is completed. | ডেলিভারির আগে আপনি দুটি ইউপিআই আইডির মধ্যে পেমেন্ট ভাগ করে দিতে পারেন।"
"bank transfer, ব্যাঙ্ক ট্রান্সফার","Yes, NEFT/IMPS bank transfer details can be provided upon request. | হ্যাঁ, অনুরোধ করলে NEFT/IMPS ব্যাঙ্ক ট্রান্সফারের ডিটেইলস দেওয়া যেতে পারে।"
"price list, cost, প্রাইস লিস্ট, দাম কত","Prices vary by design. Share your reference picture for an exact quote! | ডিজাইনের ওপর দাম নির্ভর করে। সঠিক দাম জানতে ছবির রেফারেন্স শেয়ার করুন! [🔗 WhatsApp: https://wa.me/919875563329]"
"discount, offer, ডিসকাউন্ট, অফার","Keep an eye on our Facebook page for festive offers and special discounts! | উৎসবের স্পেশাল ছাড় এবং অফারের জন্য আমাদের ফেসবুক পেজে চোখ রাখুন! [📘 Facebook: https://www.facebook.com/flavoursbymusu/]"
"bulk discount, বাল্ক ডিসকাউন্ট","We offer special customized pricing for large corporate or party bulk orders. | বড় কর্পোরেট বা পার্টি বাল্ক অর্ডারের জন্য আমরা বিশেষ মূল্যের সুবিধা দিই।"
"cancel order, অর্ডার ক্যানসেল","Cancellations are accepted only if the baking or crafting process hasn't started. | বেকিং বা ক্রাফটিং প্রক্রিয়া শুরু না হয়ে থাকলে তবেই ক্যানসেলেশন গ্রহণ করা হয়।"
"refund, রিফান্ড, টাকা ফেরত","If an order is canceled validly, a 100% refund is processed back to source. | যদি বৈধভাবে অর্ডার ক্যানসেল করা হয়, তবে ১০০% রিফান্ড সাথে সাথে প্রসেস করা হয়।"
"change date, তারিখ পরিবর্তন","Need to postpone? Please inform us at least 48 hours before the delivery date. | পেছাতে চান? ডেলিভারির অন্তত ৪৮ ঘণ্টা আগে আমাদের জানিয়ে দিন।"
"change design, ডিজাইন চেঞ্জ","Minor design tweaks are possible if you inform us before we start preparation. | কাজ শুরু করার আগে জানালে ডিজাইনে ছোটখাটো পরিবর্তন করা সম্ভব।"
"order confirmation, অর্ডার কনফার্মেশন","We will send a confirmation receipt on WhatsApp once the advance is received. | অ্যাডভান্স রিসিভ করার পর আমরা হোয়াটসঅ্যাপে একটি কনফার্মেশন রসিদ পাঠিয়ে দেব।"
"digital receipt, রসিদ","Yes, you will get a digital booking receipt containing all order details. | হ্যাঁ, আপনি অর্ডারের সমস্ত ডিটেইলসসহ একটি ডিজিটাল বুকিং রসিদ পাবেন।"
"website form, ওয়েবসাইট ফর্ম","You can drop your details via our website form, and we will call you back! | আপনি আমাদের ওয়েবসাইট ফর্মে ডিটেইলস দিতে পারেন, আমরা কল ব্যাক করব!"
"form not working, ফর্ম কাজ করছে না","If the form acts up, just message us directly on WhatsApp or Facebook! | ফর্মে সমস্যা হলে সরাসরি আমাদের হোয়াটসঅ্যাপ বা ফেসবুকে মেসেজ করুন! [💬 WhatsApp: https://wa.me/919875563329]"
"backend sheet, গুগল শিট","Our smart form syncs all data securely to our private Google Sheets backend. | আমাদের স্মার্ট ফর্মটি সমস্ত ডেটা নিরাপদে আমাদের গুগল শিট ব্যাকএন্ডে সিঙ্ক করে।"
"hidden charges, লুকানো চার্জ","No hidden costs! Box, board, knife, and basic candles are fully included. | কোনো লুকানো চার্জ নেই! বক্স, বোর্ড, ছুরি এবং মোমবাতি সম্পূর্ণভাবে অন্তর্ভুক্ত।"
"eggless, veg, ডিম ছাড়া, পিওর ভেজ","100% pure eggless/vegetarian options are available for almost all our bakes! 🌿 | আমাদের প্রায় সব কেকের ক্ষেত্রেই ১০০% ডিম ছাড়া/নিরামিষ বিকল্প উপলব্ধ রয়েছে! 🌿 [🖼️ Image: https://i.ibb.co/qMBQG6Nk/Vanilla-Cake-1.png] [🔗 Order: https://wa.me/919875563329]"
"less sweet, মিষ্টি কম","We can adjust the sugar levels for a mildly sweet profile upon your request. | আপনার অনুরোধ অনুযায়ী আমরা কেকের মিষ্টির পরিমাণ কমিয়ে (Mild sweet) তৈরি করতে পারি।"
"less cream, ক্রিম কম","Prefer more sponge? We can definitely use a lighter layer of cream. | স্পঞ্জ বেশি পছন্দ? আমরা অবশ্যই ক্রিমের লেয়ার কমিয়ে ব্যবহার করতে পারি।"
"sugar free, সুগার ফ্রি","Sugar-free options are available for select dry cakes on pre-order. | আগে থেকে অর্ডার দিলে নির্দিষ্ট কিছু ড্রাই কেকের ক্ষেত্রে সুগার-ফ্রি বিকল্প দেওয়া হয়।"
"gluten free, গ্লুটেন ফ্রি","As we operate a standard kitchen, we cannot guarantee 100% gluten-free products. | আমাদের সাধারণ কিচেন হওয়ার কারণে আমরা ১০০% গ্লুটেন-ফ্রি খাবারের গ্যারান্টি দিতে পারি না।"
"vegan, ভেগান কেক","Currently, we do not specialize in 100% dairy-free vegan baking. | বর্তমানে আমরা ১০০% ডেইরি-ফ্রি বা ভেগান বেকিংয়ে বিশেষজ্ঞ নই।"
"food color safe, কালার সেফ, ক্ষতিকারক রঙ","We strictly use premium, FSSAI-approved safe edible food colors only. | আমরা কঠোরভাবে শুধুমাত্র FSSAI অনুমোদিত নিরাপদ ভোজ্য রঙ ব্যবহার করি।"
"preservatives, প্রিজারভেটিভ","Zero harmful preservatives are used. Everything is baked fresh against your order. | কোনো ক্ষতিকারক প্রিজারভেটিভ ব্যবহার করা হয় না। সবকিছু ফ্রেশ বেক করা হয়।"
"allergy, nuts, অ্যালার্জি, বাদাম","Please inform us about any nut allergies beforehand so we can ensure safety. | অ্যালার্জির কথা আমাদের আগে থেকে জানিয়ে দেবেন যাতে আমরা সতর্কতা নিতে পারি।"
"shelf life, মেয়াদ, কতদিন ভালো থাকবে","Fresh cream cakes stay fresh for 2-3 days when properly refrigerated. | ফ্রেশ ক্রিমের কেক ঠিকমতো ফ্রিজে রাখলে ২-৩ দিন পর্যন্ত একদম ফ্রেশ থাকে।"
"fridge storage, ফ্রিজে রাখব","Yes, refrigerate fresh cream cakes. Take them out 15 minutes before cutting. | হ্যাঁ, ফ্রেশ ক্রিম কেক ফ্রিজে রাখুন। কাটার ১৫ মিনিট আগে বের করে নেবেন।"
"ac room, এসি রুম","Fondant cakes are best kept in an AC room to prevent them from sweating. | ফন্ডেন্ট কেক ঘামানো রোধ করতে এসি রুমে রাখা সবচেয়ে ভালো।"
"freeze brownie, ব্রাউনি ফ্রিজে রাখব","Brownies can stay at room temp for 3 days or be refrigerated for longer life. | ব্রাউনি সাধারণ তাপমাত্রায় ৩ দিন বা বেশিদিনের জন্য ফ্রিজে রাখা যেতে পারে।"
"heat brownie, ব্রাউনি গরম করে","Microwave your brownie for 10-15 seconds for a warm, gooey chocolate experience! | গরম ও নরম চকোলেটের স্বাদের জন্য ব্রাউনি ১০-১৫ সেকেন্ড মাইক্রোওয়েভ করে নিন!"
"pizza shelf life, পিজ্জার মেয়াদ","Pizzas are best eaten fresh, but can be refrigerated and reheated within 24 hours. | পিজ্জা তাজা খাওয়াই ভালো, তবে ফ্রিজে রেখে ২৪ ঘন্টার মধ্যে গরম করে খাওয়া যায়।"
"gelatin, halal, জিলেটিন, হালাল","We use 100% vegetarian Agar-Agar or veg gel for setting our desserts. | আমরা ডেজার্ট সেট করতে ১০০% নিরামিষ আগার-আগার বা ভেজ জেল ব্যবহার করি।"
"real butter, আসল বাটার","Yes, premium real butter is used in our butterscotch and specific bakes. | হ্যাঁ, আমাদের বাটারস্কচ এবং নির্দিষ্ট বেকিংয়ে প্রিমিয়াম আসল মাখন ব্যবহার করা হয়।"
"msg, tasting salt, টেস্টিং সল্ট","No MSG or artificial taste enhancers are used in our savory snacks. | আমাদের নোনতা স্ন্যাকসে কোনো MSG বা কৃত্রিম স্বাদবর্ধক ব্যবহার করা হয় না।"
"pregnancy safe, প্রেগন্যান্সি","Our bakes are hygienic and safe, but we advise avoiding alcohol-based flavors. | আমাদের খাবার স্বাস্থ্যসম্মত ও নিরাপদ, তবে অ্যালকোহল-বেসড ফ্লেভার এড়িয়ে চলা ভালো।"
"hygiene, clean, হাইজিন, পরিষ্কার","Kitchen hygiene is our top priority; all tools and surfaces are sanitized daily. | কিচেনের পরিচ্ছন্নতা আমাদের প্রধান অগ্রাধিকার; সমস্ত সরঞ্জাম প্রতিদিন স্যানিটাইজ করা হয়।"
"knife, candles, ছুরি, মোমবাতি","A complimentary cake knife and basic candles are included with every whole cake. | প্রতিটি হোল কেকের সাথে একটি ছুরি এবং সাধারণ মোমবাতি বিনামূল্যে দেওয়া হয়।"
"sparkling candle, ম্যাজিক মোমবাতি","Sparkling/magic candles can be added to your package upon request. | অনুরোধ করলে আপনার প্যাকেজে স্পার্কলিং বা ম্যাজিক মোমবাতি যোগ করা যেতে পারে।"
"tissues, plates, টিস্যু, প্লেট","Party cutlery like paper plates and tissues can be arranged if requested beforehand. | আগে থেকে জানালে পেপার প্লেট এবং টিস্যুর মতো কাটলারির ব্যবস্থা করা যেতে পারে।"
"smudge on cake, কেকের ডিজাইন নষ্ট","If transit caused a minor smudge, message us a photo for a quick fix guide! | ট্রানজিটে ছোট দাগ লাগলে, আমাদের গাইডেন্স পেতে একটি ছবি মেসেজ করুন! [💬 Messenger: https://m.me/flavoursbymusu]"
"wrong name, ভুল নাম","We verify details, but if there's an error, let us know instantly for a fix. | আমরা ডিটেইলস চেক করি, তবে কোনো ভুল হলে তা ঠিক করতে দ্রুত আমাদের জানান।"
"not at home, বাড়িতে নেই","The delivery person will wait or can hand it to your neighbor/security guard. | ডেলিভারি পার্সন অপেক্ষা করবেন অথবা আপনার প্রতিবেশী/সিকিউরিটির কাছে দিতে পারেন।"
"review, feedback, রিভিউ, ফিডব্যাক","We'd love your review! Share it on Google Maps or our Facebook page! | আমরা আপনার রিভিউ চাই! এটি গুগল ম্যাপ বা আমাদের ফেসবুক পেজে শেয়ার করুন! [📍 Review: https://www.google.com/maps/place/Bake+n'+Flake...]"
"rating, রেটিং","Your 5-star rating keeps us motivated to bake the best for you! | আপনার ৫-স্টার রেটিং আমাদের আপনার জন্য সেরা বেক করতে অনুপ্রাণিত করে!"
"baking class, বেকিং ক্লাস","Watch our Facebook page for upcoming announcements on baking workshops! | আপকামিং বেকিং ওয়ার্কশপের ঘোষণার জন্য আমাদের ফেসবুক পেজে চোখ রাখুন!"
"why choose musu, মুসুর কেক কেন","Authentic home-baked goodness, fresh premium ingredients, and stunning custom designs! | খাঁটি ঘরোয়া স্বাদ, ফ্রেশ প্রিমিয়াম উপাদান এবং চমৎকার কাস্টম ডিজাইন!"
"thank you, awesome, nice, থ্যাংক ইউ, খুব ভালো, দারুণ","Thank YOU! Your happiness is our success. Looking forward to serving you again! ❤️ | আপনাকে ধন্যবাদ! আপনার আনন্দই আমাদের সাফল্য। আবার দেখা হবে! ❤️"
"cake board, কেক বোর্ড","We use highly sturdy thick drum boards to ensure base safety for tier cakes. | ভারী এবং টিয়ার কেকের সুরক্ষার জন্য আমরা অত্যন্ত মজবুত ড্রাম বোর্ড ব্যবহার করি।"
"transparent box, ট্রান্সপারেন্ট বক্স","Premium transparent display boxes are available for an extra aesthetic touch. | অতিরিক্ত নান্দনিকতার জন্য প্রিমিয়াম স্বচ্ছ ডিসপ্লে বক্স পাওয়া যায়।"
"1 pound size, ১ পাউন্ড সাইজ","A standard 1-pound cake is comfortably enough to serve 4 to 6 people. | একটি সাধারণ ১ পাউন্ডের কেক অনায়াসে ৪ থেকে ৬ জনের জন্য যথেষ্ট।"
"20 people size, ২০ জনের জন্য কেক","For a gathering of 20 people, a 3-pound to 4-pound cake is highly recommended. | ২০ জন অতিথির জন্য ৩ থেকে ৪ পাউন্ডের কেক অর্ডার করার জোরালো পরামর্শ দিই।"
`;

const lines = csvData.trim().split('\n').slice(1);
const intents = [];

for (const line of lines) {
  if (!line.trim()) continue;
  let parts = [];
  let currentPart = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes;
    } else if (line[i] === ',' && !inQuotes) {
      parts.push(currentPart);
      currentPart = '';
    } else {
      currentPart += line[i];
    }
  }
  parts.push(currentPart);

  if (parts.length >= 2) {
    let keywordsPart = parts[0].replace(/^"|"$/g, '').trim();
    let textPart = parts[1].replace(/^"|"$/g, '').trim();

    const keywords = keywordsPart.split(',').map(k => k.trim());
    
    let textSplit = textPart.split('|');
    let enText = textSplit[0]?.trim() || '';
    let restText = textSplit[1] || '';
    
    let bnText = restText;
    
    let links = [];
    let images = [];
    
    const linkRegex = /\[(.*?)\s*:\s*(.*?)\]/g;
    let match;
    while ((match = linkRegex.exec(restText)) !== null) {
        if (match[1].includes('Image') || match[1].includes('🖼️')) {
            images.push(match[2].trim());
        } else {
            links.push({ label: match[1].trim(), url: match[2].trim() });
        }
        bnText = bnText.replace(match[0], '');
    }
    bnText = bnText.trim();
    
    while ((match = linkRegex.exec(enText)) !== null) {
        if (match[1].includes('Image') || match[1].includes('🖼️')) {
            images.push(match[2].trim());
        } else {
            links.push({ label: match[1].trim(), url: match[2].trim() });
        }
        enText = enText.replace(match[0], '');
    }
    enText = enText.trim();

    intents.push({
      keywords,
      responseEn: enText,
      responseBn: bnText,
      images: images.length ? images : undefined,
      links: links.length ? links : undefined
    });
  }
}

const fileContent = `import { BotIntent } from '../types';

export const botIntents: BotIntent[] = ${JSON.stringify(intents, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/botIntents.ts'), fileContent);
console.log("Written file botIntents.ts!");
