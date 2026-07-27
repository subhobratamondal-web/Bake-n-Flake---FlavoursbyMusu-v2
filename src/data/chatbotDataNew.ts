import { BotIntent } from "./chatbotData";

export const chatbotDataNew: BotIntent[] = [
  {
    keywords: ["where is bake n' flake located", "আপনাদের বেকারিটি কোথায় অবস্থিত", "বেকারিটি কোথায়", "কোথায় অবস্থিত"],
    en: "We are located in Kamalgazi, Kolkata (700103). You can get directions here: Google Maps Location.",
    bn: "আমরা কলকাতার কমলগাজীতে (৭০০০১০৩) অবস্থিত। ম্যাপ দেখতে এখানে ক্লিক করুন: Google Maps Location।",
    links: [{ label: "📍 Google Maps Location", url: "https://www.google.com/maps/place/Bake+n'+Flake+~+FlavoursbyMusu/@22.4478343,88.3911033,17z" }]
  },
  {
    keywords: ["how can i contact you over the phone", "আমি কীভাবে ফোনে আপনাদের সাথে যোগাযোগ করব", "কীভাবে ফোনে", "contact you over the phone"],
    en: "You can call us directly for inquiries or orders at: 📞 Call Us: +919875563329.",
    bn: "যেকোনো তথ্য জানতে বা অর্ডারের জন্য আমাদের সরাসরি কল করুন: 📞 Call Us: +919875563329।",
    links: [{ label: "📞 Call Us", url: "tel:+919875563329" }]
  },
  {
    keywords: ["do you have a facebook page", "আপনাদের কি ফেসবুক পেজ আছে", "ফেসবুক পেজ আছে", "facebook page"],
    en: "Yes, follow our official page for updates and cake designs: Flavours by Musu on Facebook.",
    bn: "হ্যাঁ, নতুন আপডেট এবং কেকের ডিজাইন দেখতে আমাদের পেজটি ফলো করুন: Flavours by Musu on Facebook।",
    links: [{ label: "📘 Facebook Page", url: "https://www.facebook.com/flavoursbymusu/" }]
  },
  {
    keywords: ["can i message you on whatsapp", "আমি কি হোয়াটসঅ্যাপে মেসেজ করতে পারি", "হোয়াটসঅ্যাপে মেসেজ", "message you on whatsapp"],
    en: "Absolutely! Click here to chat with us directly: 💬 WhatsApp Us.",
    bn: "অবশ্যই! আমাদের সাথে সরাসরি চ্যাট করতে এখানে ক্লিক করুন: 💬 WhatsApp Us।",
    links: [{ label: "💬 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["how do i send reference pictures", "কাস্টম কেকের ছবি কীভাবে পাঠাব", "রেফারেন্স ছবি", "picture send", "send reference pictures"],
    en: "You can send your reference designs to our Messenger or WhatsApp.",
    bn: "আপনি আপনার পছন্দের কেকের ছবি আমাদের Messenger বা WhatsApp-এ পাঠাতে পারেন।",
    links: [{ label: "💬 WhatsApp Us", url: "https://wa.me/919875563329" }]
  },
  {
    keywords: ["do you have a physical seating area", "আপনাদের কি বসে খাওয়ার জায়গা আছে", "seating area", "বসে খাওয়ার", "physical seating area"],
    en: "We operate primarily on a pre-order basis from our Kamalgazi location. Please Call Us before visiting.",
    bn: "আমরা মূলত কমলগাজী লোকেশন থেকে প্রি-অর্ডারের ভিত্তিতে কাজ করি। আসার আগে অনুগ্রহ করে আমাদের কল করুন।"
  },
  {
    keywords: ["what flavors are available in your signature menu", "আপনাদের সিগনেচার মেনুতে কী কী ফ্লেভার আছে", "signature menu", "কী কী ফ্লেভার", "flavors are available"],
    en: "Our Signature Menu includes Chocolate, Butterscotch, Vanilla, Truffle, Pineapple, Mango, Strawberry, and Red Velvet.",
    bn: "আমাদের সিগনেচার মেনুতে চকোলেট, বাটারস্কচ, ভ্যানিলা, ট্রাফল, পাইনঅ্যাপল, ম্যাংগো, স্ট্রবেরি এবং রেড ভেলভেট রয়েছে।"
  },
  {
    keywords: ["do you bake fresh fruit cakes", "আপনারা কি ফ্রেশ ফ্রুট কেক বানান", "fresh fruit cake", "bake fresh fruit cakes"],
    en: "Yes, our Fresh Fruit Cakes are made with premium seasonal fruits. Message us on WhatsApp for seasonal availability.",
    bn: "হ্যাঁ, আমাদের ফ্রেশ ফ্রুট কেকগুলো প্রিমিয়াম তাজা ফল দিয়ে তৈরি হয়। কোন ফল পাওয়া যাচ্ছে তা জানতে WhatsApp-এ মেসেজ করুন।"
  },
  {
    keywords: ["do you have fusion or indian flavor", "আপনাদের কি দেশীয় ফ্লেভারের কেক আছে", "fusion flavor", "indian flavor", "দেশীয় ফ্লেভারের"],
    en: "Yes, our Rasmalai Cake is a highly requested fusion flavor!",
    bn: "হ্যাঁ, আমাদের রসমলাই কেক অত্যন্ত জনপ্রিয় একটি দেশীয় ফ্লেভার!"
  },
  {
    keywords: ["do you make black forest cakes", "আপনারা কি ব্ল্যাক ফরেস্ট কেক তৈরি করেন", "black forest", "make black forest cakes"],
    en: "Yes, we have an entire 'Forest Range' featuring classic Black Forest cakes.",
    bn: "হ্যাঁ, আমাদের 'ফরেস্ট রেঞ্জ'-এ ক্লাসিক ব্ল্যাক ফরেস্ট কেক রয়েছে।"
  },
  {
    keywords: ["do you offer alcohol-based cakes", "আপনাদের কাছে কি অ্যালকোহল-বেসড কেক পাওয়া যায়", "alcohol-based", "অ্যালকোহল-বেসড কেক"],
    en: "Yes, we create special alcohol-based cakes for adult parties.",
    bn: "হ্যাঁ, প্রাপ্তবয়স্কদের পার্টির জন্য আমরা বিশেষ অ্যালকোহল-বেসড কেক তৈরি করি।"
  },
  {
    keywords: ["are oreo or kitkat cakes available", "ওরিও বা কিটক্যাট কেক কি পাওয়া যায়", "oreo or kitkat", "oreo or kitkat cakes"],
    en: "Yes, we bake delicious Oreo and KitKat cakes, perfect for kids and chocolate lovers.",
    bn: "হ্যাঁ, বাচ্চা এবং চকোলেট প্রেমীদের জন্য আমরা সুস্বাদু ওরিও এবং কিটক্যাট কেক তৈরি করি।"
  },
  {
    keywords: ["do you bake coffee-flavored cakes", "আপনারা কি কফি ফ্লেভারের কেক বানান", "coffee-flavored", "কফি ফ্লেভারের"],
    en: "Yes, we have rich Coffee Mocha cakes available.",
    bn: "হ্যাঁ, আমাদের মেনুতে দারুণ স্বাদের কফি মোকা কেক রয়েছে।"
  },
  {
    keywords: ["do you make custom theme cakes", "আপনারা কি কাস্টম থিম কেক তৈরি করেন", "কাস্টম থিম কেক", "custom theme cakes"],
    en: "Yes, we specialize in customized theme cakes. Send your ideas to our Facebook Messenger.",
    bn: "হ্যাঁ, আমরা কাস্টমাইজড থিম কেক তৈরিতে বিশেষজ্ঞ। আপনার আইডিয়া আমাদের Facebook Messenger-এ পাঠান।"
  },
  {
    keywords: ["do you work with fondant", "আপনারা কি ফনডেন্ট নিয়ে কাজ করেন", "ফনডেন্ট নিয়ে কাজ", "work with fondant"],
    en: "Yes, we craft both full fondant and semi-fondant cakes with intricate 3D designs.",
    bn: "হ্যাঁ, আমরা দারুণ সব থ্রি-ডি (3D) ডিজাইনসহ ফুল ফনডেন্ট এবং সেমি-ফনডেন্ট কেক তৈরি করি।"
  },
  {
    keywords: ["can i order a photo cake", "আমি কি ফটো কেক অর্ডার করতে পারি", "ফটো কেক অর্ডার", "order a photo cake"],
    en: "Absolutely! We print 100% edible photos on cakes.",
    bn: "অবশ্যই! আমরা কেকের ওপর ১০০% খাওয়ার যোগ্য ছবি প্রিন্ট করি।"
  },
  {
    keywords: ["do you make multi-tier wedding cakes", "আপনারা কি মাল্টি-টিয়ার বা দোতলা/তিনতলা কেক বানান", "multi-tier wedding", "দোতলা/তিনতলা", "multi-tier wedding cakes"],
    en: "Yes, we design elegant multi-tier cakes for weddings and grand celebrations.",
    bn: "হ্যাঁ, বিয়ে বা বড় অনুষ্ঠানের জন্য আমরা আকর্ষণীয় মাল্টি-টিয়ার কেক ডিজাইন করি।"
  },
  {
    keywords: ["what is a pinata cake", "পিনাটা কেক কী", "pinata cake"],
    en: "A Pinata Cake has a hard chocolate shell that you smash with a wooden hammer to reveal the cake inside. We make them!",
    bn: "পিনাটা কেকের বাইরের আবরণটি শক্ত চকোলেটের হয় যা হাতুড়ি দিয়ে ভেঙে খেতে হয়। আমরা এটি তৈরি করি!"
  },
  {
    keywords: ["do you make bento cakes", "আপনারা কি বেন্টো (মিনি) কেক তৈরি করেন", "bento cakes", "make bento cakes"],
    en: "Yes, we offer trendy Korean-style Bento cakes perfect for 1-2 people.",
    bn: "হ্যাঁ, আমরা ১-২ জনের জন্য মানানসই আধুনিক কোরিয়ান স্টাইলের বেন্টো কেক তৈরি করি।"
  },
  {
    keywords: ["do you make half cakes for 6-month birthdays", "আপনারা কি ৬ মাসের জন্মদিনের জন্য হাফ কেক বানান", "half cakes for 6-month"],
    en: "Yes, our Half Cakes are very popular for half-birthday celebrations.",
    bn: "হ্যাঁ, হাফ-বার্থডে উদযাপনের জন্য আমাদের হাফ কেক অত্যন্ত জনপ্রিয়।"
  },
  {
    keywords: ["can you decorate cakes with fresh flowers", "আপনারা কি তাজা ফুল দিয়ে কেক সাজান", "fresh flowers", "decorate cakes with fresh flowers"],
    en: "Yes, our Fresh Flower Cakes are a beautiful specialty item.",
    bn: "হ্যাঁ, তাজা ফুল দিয়ে সাজানো দারুণ সুন্দর ফ্রেশ ফ্লাওয়ার কেক আমরা তৈরি করি।"
  },
  {
    keywords: ["do you make doll cakes for kids", "বাচ্চাদের জন্য ডল কেক কি বানান", "doll cakes for kids"],
    en: "Yes, we bake stunning Barbie and Doll cakes.",
    bn: "হ্যাঁ, আমরা চমৎকার বার্বি এবং ডল কেক তৈরি করি।"
  },
  {
    keywords: ["can i get a glitter cake", "আমি কি গ্লিটার কেক পেতে পারি", "glitter cake", "get a glitter cake"],
    en: "Yes, we use 100% edible glitter to make sparkling Glitter Cakes.",
    bn: "হ্যাঁ, আমরা ১০০% খাওয়ার যোগ্য গ্লিটার ব্যবহার করে চকচকে গ্লিটার কেক তৈরি করি।"
  },
  {
    keywords: ["do you make number or letter cakes", "আপনারা কি নম্বর বা অক্ষরের কেক তৈরি করেন", "number or letter", "number or letter cakes"],
    en: "Yes, we can shape the cake into any number or initial.",
    bn: "হ্যাঁ, আমরা কেককে যেকোনো সংখ্যা বা নামের আদ্যক্ষরের আকার দিতে পারি।"
  },
  {
    keywords: ["how do i place an order", "আমি কীভাবে অর্ডার করব", "কীভাবে অর্ডার"],
    en: "You can order directly via our WhatsApp, Messenger, or by giving us a call.",
    bn: "আপনি সরাসরি আমাদের WhatsApp, Messenger, অথবা কল করে অর্ডার করতে পারেন।"
  },
  {
    keywords: ["how many days in advance should i order", "কত দিন আগে অর্ডার দিতে হয়", "কত দিন আগে", "days in advance"],
    en: "For standard cakes, 24 hours is required. For customized fondant or tier cakes, please order 2-3 days in advance.",
    bn: "সাধারণ কেকের জন্য ২৪ ঘন্টা আগে জানাতে হয়। কাস্টম বা ফনডেন্ট কেকের জন্য ২-৩ দিন আগে অর্ডার দিন।"
  },
  {
    keywords: ["do you accept same-day orders", "আপনারা কি একই দিনে অর্ডার নেন", "same-day orders", "একই দিনে"],
    en: "Subject to availability, we take same-day orders for basic flavors. Please Call Us urgently.",
    bn: "সময় ও সুযোগ থাকলে আমরা সাধারণ ফ্লেভারের ক্ষেত্রে একই দিনে অর্ডার নিই। জরুরি প্রয়োজনে আমাদের কল করুন।"
  },
  {
    keywords: ["do i need to pay an advance", "আমাকে কি অগ্রিম পেমেন্ট করতে হবে", "pay an advance", "অগ্রিম পেমেন্ট"],
    en: "Yes, a partial advance payment is required to confirm custom orders.",
    bn: "হ্যাঁ, কাস্টম অর্ডারের কনফার্মেশনের জন্য আংশিক অগ্রিম পেমেন্ট করতে হয়।"
  },
  {
    keywords: ["what payment methods do you accept", "আপনারা কোন ধরনের পেমেন্ট গ্রহণ করেন", "payment methods do you accept", "পেমেন্ট গ্রহণ"],
    en: "We accept UPI (GPay, PhonePe, Paytm), Bank Transfers, and Cash.",
    bn: "আমরা ইউপিআই (GPay, PhonePe, Paytm), ব্যাঙ্ক ট্রান্সফার এবং ক্যাশ গ্রহণ করি।"
  },
  {
    keywords: ["can i change my order details after booking", "বুকিংয়ের পর কি অর্ডারে পরিবর্তন আনা যায়", "change my order details"],
    en: "Changes can be made if baking hasn't started. Message us immediately on WhatsApp.",
    bn: "কেক তৈরির কাজ শুরু হওয়ার আগে পরিবর্তন করা সম্ভব। দ্রুত আমাদের WhatsApp-এ মেসেজ করুন।"
  },
  {
    keywords: ["can i cancel my order", "আমি কি আমার অর্ডার বাতিল করতে পারি", "cancel my order"],
    en: "Orders can be canceled before the preparation starts. Custom cakes cannot be canceled once baked.",
    bn: "কেক তৈরির কাজ শুরু হওয়ার আগে ক্যানসেল করা সম্ভব। কাস্টম কেক বানানো শুরু হলে ক্যানসেল করা যায় না।"
  },
  {
    keywords: ["do you take bulk orders for corporate events", "আপনারা কি কর্পোরেট অনুষ্ঠানের জন্য বড় অর্ডার নেন", "bulk orders", "corporate events"],
    en: "Yes, we cater to large parties, weddings, and corporate events.",
    bn: "হ্যাঁ, আমরা বড় পার্টি, বিয়ে এবং কর্পোরেট অনুষ্ঠানের জন্য অর্ডার গ্রহণ করি।"
  },
  {
    keywords: ["do you offer home delivery", "আপনারা কি হোম ডেলিভারি করেন", "home delivery offer", "হোম ডেলিভারি করেন"],
    en: "Yes, we deliver in Kamalgazi, Narendrapur, Sonarpur, and nearby areas.",
    bn: "হ্যাঁ, আমরা কমলগাজী, নরেন্দ্রপুর, সোনারপুর এবং আশেপাশের এলাকায় ডেলিভারি করি।"
  },
  {
    keywords: ["what are the delivery charges", "ডেলিভারি চার্জ কত", "delivery charges"],
    en: "Delivery charges depend on the distance from our Location.",
    bn: "আমাদের লোকেশন থেকে দূরত্বের ওপর ভিত্তি করে ডেলিভারি চার্জ নির্ধারণ করা হয়।"
  },
  {
    keywords: ["can i pick up the cake myself", "আমি কি নিজে গিয়ে কেক নিয়ে আসতে পারি", "pick up the cake myself"],
    en: "Yes, self-pickup is always welcome and free of charge.",
    bn: "হ্যাঁ, আপনি যেকোনো সময় আমাদের স্টোর থেকে বিনামূল্যে কেক পিক-আপ করতে পারেন।"
  },
  {
    keywords: ["do you deliver at midnight", "আপনারা কি মাঝরাতে ডেলিভারি করেন", "deliver at midnight", "মাঝরাতে ডেলিভারি"],
    en: "Yes, midnight surprise deliveries are available with prior booking and an extra charge.",
    bn: "হ্যাঁ, আগে থেকে বুকিং করলে এবং অতিরিক্ত চার্জের বিনিময়ে মাঝরাতে সারপ্রাইজ ডেলিভারির সুবিধা রয়েছে।"
  },
  {
    keywords: ["how is the cake packaged", "কেক কীভাবে প্যাক করা হয়", "cake packaged", "প্যাক করা"],
    en: "Cakes are packed securely in sturdy, hygiene-safe boxes to ensure safe transit.",
    bn: "কেক সুরক্ষিতভাবে পৌঁছানোর জন্য স্বাস্থ্যসম্মত এবং মজবুত বাক্সে প্যাক করা হয়।"
  },
  {
    keywords: ["do you bake eggless cakes", "আপনারা কি এগলেস (ডিম ছাড়া) কেক তৈরি করেন", "eggless cakes"],
    en: "Yes, 100% pure vegetarian/eggless options are available for almost all our cakes.",
    bn: "হ্যাঁ, আমাদের প্রায় সমস্ত কেকের ক্ষেত্রেই ১০০% এগলেস বা ডিম ছাড়া বিকল্প রয়েছে।"
  },
  {
    keywords: ["are your food colors safe", "আপনাদের কেকের রঙ কি নিরাপদ", "food colors safe"],
    en: "Absolutely. We strictly use premium, FSSAI-approved edible food colors.",
    bn: "অবশ্যই। আমরা শুধুমাত্র প্রিমিয়াম এবং FSSAI অনুমোদিত খাওয়ার যোগ্য রঙ ব্যবহার করি।"
  },
  {
    keywords: ["do you use artificial preservatives", "আপনারা কি কৃত্রিম প্রিজারভেটিভ ব্যবহার করেন", "artificial preservatives"],
    en: "No, all our cakes are freshly baked without harmful chemical preservatives.",
    bn: "না, আমাদের সমস্ত কেক ক্ষতিকারক কৃত্রিম প্রিজারভেটিভ ছাড়াই ফ্রেশ বেক করা হয়।"
  },
  {
    keywords: ["can i request less cream on my cake", "আমি কি কেকে ক্রিমের পরিমাণ কম দিতে বলতে পারি", "less cream"],
    en: "Yes, just mention your preference while placing the order on Messenger.",
    bn: "হ্যাঁ, Messenger-এ অর্ডার করার সময় আপনার পছন্দের কথাটি আমাদের জানিয়ে দেবেন।"
  },
  {
    keywords: ["what if i have a nut allergy", "আমার যদি বাদামে অ্যালার্জি থাকে", "nut allergy"],
    en: "Please clearly state any allergies when ordering so we can ensure your safety.",
    bn: "অর্ডার করার সময় অনুগ্রহ করে অ্যালার্জির কথা স্পষ্টভাবে জানিয়ে দেবেন যাতে আমরা সতর্কতা নিতে পারি।"
  },
  {
    keywords: ["do you make anniversary cakes", "আপনারা কি বিবাহ বার্ষিকীর কেক বানান", "for anniversaries"],
    en: "Yes, we have beautiful designs tailored for Anniversaries.",
    bn: "হ্যাঁ, বিবাহ বার্ষিকীর জন্য আমাদের কাছে চমৎকার সব ডিজাইন রয়েছে।"
  },
  {
    keywords: ["do you bake cakes for teacher's day, mother's day, or father's day", "আপনারা কি টিচার্স ডে, মাদার্স ডে বা ফাদার্স ডে-র জন্য কেক বানান", "teacher's day, mother's day, or father's day"],
    en: "Yes, we create thematic cakes for all special occasions.",
    bn: "হ্যাঁ, আমরা সকল বিশেষ দিনের জন্য থিম-ভিত্তিক কেক তৈরি করি।"
  },
  {
    keywords: ["do you offer customised chocolates", "আপনারা কি কাস্টমাইজড চকোলেট তৈরি করেন", "customised chocolates"],
    en: "Yes, our handmade customized chocolates make for perfect thoughtful gifts.",
    bn: "হ্যাঁ, আমাদের হাতে তৈরি কাস্টমাইজড চকোলেটগুলো উপহার হিসেবে দারুণ মানানসই।"
  },
  {
    keywords: ["do you bake savory snacks like pizza and patties", "আপনারা কি পিজ্জা বা প্যাটিসের মতো নোনতা খাবার বানান", "savory snacks"],
    en: "Yes, besides desserts, we bake delicious homemade Pizzas and Patties.",
    bn: "হ্যাঁ, ডেজার্টের পাশাপাশি আমরা দারুণ স্বাদের ঘরোয়া পিজ্জা এবং প্যাটিস তৈরি করি।"
  },
  {
    keywords: ["do you sell cheesecakes", "আপনারা কি চিজকেক বিক্রি করেন", "sell cheesecakes"],
    en: "Yes, rich and creamy Cheesecakes are a part of our specialty menu.",
    bn: "হ্যাঁ, রিচ এবং ক্রিমি চিজকেক আমাদের স্পেশাল মেনুর একটি অংশ।"
  },
  {
    keywords: ["are brownies available", "ব্রাউনি কি পাওয়া যায়", "brownies available"],
    en: "Yes, we bake fudgy and delicious chocolate brownies.",
    bn: "হ্যাঁ, আমরা অত্যন্ত সুস্বাদু এবং চকোলেটি ব্রাউনি তৈরি করি।"
  },
  {
    keywords: ["do you make jar and glass cakes", "আপনারা কি জার বা গ্লাস কেক বানান", "jar and glass cakes"],
    en: "Yes, we make beautifully layered Jar Cakes and Glass Cakes.",
    bn: "হ্যাঁ, আমরা সুন্দর লেয়ার যুক্ত জার কেক এবং গ্লাস কেক তৈরি করি।"
  },
  {
    keywords: ["can i order cupcakes and muffins", "আমি কি কাপকেক এবং মাফিন অর্ডার করতে পারি", "order cupcakes and muffins"],
    en: "Yes, custom cupcakes and muffins are available for any party.",
    bn: "হ্যাঁ, যেকোনো পার্টির জন্য কাস্টম কাপকেক এবং মাফিন পাওয়া যায়।"
  },
  {
    keywords: ["do you make christmas plum cakes", "আপনারা কি ক্রিসমাসের প্লাম কেক তৈরি করেন", "christmas plum cakes"],
    en: "Yes, our rich plum cakes are a festive favorite during Christmas.",
    bn: "হ্যাঁ, ক্রিসমাসের সময় আমাদের তৈরি স্পেশাল প্লাম কেক অত্যন্ত জনপ্রিয়."
  },
  {
    keywords: ["do you provide a knife and candles with the cake", "আপনারা কি কেকের সাথে ছুরি এবং মোমবাতি দেন", "knife and candles"],
    en: "Yes, a complimentary knife and basic candles are provided with every whole cake.",
    bn: "হ্যাঁ, প্রতিটি পুরো কেকের সাথে একটি ছুরি এবং সাধারণ মোমবাতি বিনামূল্যে দেওয়া হয়।"
  }
];
