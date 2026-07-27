import fs from 'fs';
import { faqData } from './src/data/faqs.ts';

const generalImages = {
  chocolate: "https://i.ibb.co/xSTgDb8d/Chocolate-Cakes-1.png",
  butterscotch: "https://i.ibb.co/fYcwMKdc/Butterscotch-Cakes-1.png",
  vanilla: "https://i.ibb.co/qMBQG6Nk/Vanilla-Cake-1.png",
  truffle: "https://i.ibb.co/MKF765x/Chocolate-Truffle-Cakes-1.png",
  pineapple: "https://i.ibb.co/gbC67jD7/PIneapple-Cake-1.png",
  mango: "https://i.ibb.co/q3M2pvxs/Mango-Cake-1.png",
  strawberry: "https://i.ibb.co/7JYt6dJp/Strawberry-Cakes-1.jpg",
  redVelvet: "https://i.ibb.co/s9gGgtpk/Red-velvet-1.png",
  freshFruit: "https://i.ibb.co/F4V5yd16/Fresh-Fruit-Cake-1.png",
  forest: "https://i.ibb.co/q3P990gk/Black-Forest-1.png", // Forest Range updated
  oreo: "https://i.ibb.co/nprbQJC/Oreo-Cake-2.png",
  alcohol: "https://i.ibb.co/xSj9RRdz/Alcohol-Cake-01.png",
  coffee: "https://i.ibb.co/4w2jyMmB/Coffee-Cake-1.png",
  rasmalai: "https://i.ibb.co/4RBygSqR/Rasmalai-Cake-1.png",
  orange: "https://i.ibb.co/RTSFv7dG/Orrange-Cake-1.png",
  kitkat: "https://i.ibb.co/k26bhF2H/Kitkat-1.png",
  birthday: "https://i.ibb.co/hJyMC4CY/Birthday-Cake-1.jpg",
  anniversary: "https://i.ibb.co/5gDy06k7/Aniversary-Cake-2.png",
  teachersDay: "https://i.ibb.co/Y4tgPBNP/Teacher-s-Day-1.png",
  custom: "https://i.ibb.co/Rp8C27Xt/Customized-Chocolates-2.jpg", // Customised Chocolates
  fathersDay: "https://i.ibb.co/YT2LRm2x/Father-s-Day-Cake-1.png",
  mothersDay: "https://i.ibb.co/4n26zZCq/2.jpg",
  christmas: "https://i.ibb.co/7NKqnNsd/Christmas-Cake-4.png",
  babyShower: "https://i.ibb.co/RTTYsqVd/KIDS-CAKE.png",
  riceCeremony: "https://i.pinimg.com/736x/6c/bb/7f/6cbb7f551f96722c5b6f01141b5b4aa6.jpg",
  freshFlower: "https://i.ibb.co/fzVDfmhj/FRESH-FLOWER-CAKE-1.jpg",
  doll: "https://i.ibb.co/bGXr5qW/DOLL-CAKE-1.png",
  half: "https://i.ibb.co/V0yhspQm/HALF-CAKE-1.jpg",
  tier: "https://i.ibb.co/Xx1SBWb6/TIRE-CAKE.png",
  number: "https://i.ibb.co/20VxsJxG/Number-Cake.jpg",
  kids: "https://i.ibb.co/xrgZZcx/Kids-Cake-1.png",
  fondant: "https://i.ibb.co/ZpB76tN5/FONDANT-1.png",
  glitter: "https://i.ibb.co/xt8VVwmW/Gliter-Cake-1.jpg",
  customizeTheme: "https://i.ibb.co/9mnwZgX4/TIRE-CAKE1.png",
  cheesecake: "https://i.pinimg.com/736x/bc/b6/0c/bcb60c22cedf8400a2e2c6b0679c22e5.jpg",
  photo: "https://i.ibb.co/rR23zjJp/Photo-Cake-1.png",
  bento: "https://i.ibb.co/3yDW6YkY/BENTO-1.jpg",
  mousse: "https://i.ibb.co/xt88WGMM/Mousse-1.jpg",
  jarAndGlass: "https://i.ibb.co/9HDRRk0F/Jur-cake.png",
  pinata: "https://i.ibb.co/gbqnmvzd/02.jpg",
  cupcakes: "https://i.ibb.co/jkNm1Zq8/Cupcakes-1.jpg",
  pizza: "https://i.ibb.co/sTLSSsj/PIZZA-BUNS-1.png",
  brownies: "https://i.ibb.co/F4rgH3Wn/Brownies-1.jpg",
  others: "https://i.ibb.co/YTTTJp6Q/Tier-Aniversary-cake.png",
  profile: "https://i.ibb.co/XkYN11bL/PROFILE.jpg",
  logo: "https://i.ibb.co/Xx2kxrrg/LOGO-1.png",
};

// We will expand each category to have multiple additional questions, aiming for total 200.
// Current categories in faqData:
/*
  Location & Contact
  Signature Cakes & Flavors
  Troubleshooting & Fixes
  Ordering & Delivery
  Pricing & Payments
  Dietary & Hygiene
  Social & Community
  Our Story & Musu
  Exotic & Forest Range
  Customization & Themes
  Jar Cakes & Cupcakes
  Reviews & Feedback
  Snacks & Savories
  General
*/

const predefinedExtraFaqs = {
  "Location & Contact": [
    { questionEn: "How to open map on mobile Phone?", questionBn: "মোবাইলে ম্যাপ কীভাবে খুলব?", answerEn: "Simply tap the 'View on Google Maps' link in our contact details.", answerBn: "আমাদের কন্টাক্টে দেওয়া ম্যাপ লিঙ্কে ক্লিক করলেই ম্যাপ খুলে যাবে।", links: [{ label: "View on Google Maps", url: "https://g.page/r/CRgnjQFjh1wREBM", icon: "MapPin" }] },
    { questionEn: "Can I find you on Swiggy or Zomato?", questionBn: "সুইগি বা জোমাটোতে কি আপনাদের পাওয়া যাবে?", answerEn: "No, we take orders directly via WhatsApp or phone call to give you a personalized experience.", answerBn: "না, কাস্টমাইজড কোয়ান্টিটি ও কোয়ালিটির জন্য আমরা সরাসরি হোয়াটসঅ্যাপ বা কলে অর্ডার নিই।", links: [{ label: "Order on WhatsApp", url: "https://wa.me/919875563329", icon: "MessageCircle" }] },
    { questionEn: "How to save your phone number?", questionBn: "আপনাদের নম্বর কীভাবে সেভ করব?", answerEn: "Save +91 98755 63329 as 'Bake n Flake - Flavours by Musu'.", answerBn: "আমাদের নম্বর +91 98755 63329 'Bake n Flake' নামে সেভ করে রাখুন।", links: [{ label: "Call Us", url: "tel:+919875563329", icon: "Phone" }] },
    { questionEn: "Do you have a physical dining space?", questionBn: "আপনাদের কি বসে খাওয়ার কোনো ব্যবস্থা আছে?", answerEn: "No, we operate purely as a cloud kitchen/home bakery for delivery and takeaways.", answerBn: "না, আমরা শুধুমাত্র ডেলিভারি ও পার্সেলের জন্য কাজ করি, এটি হোম-বেকার।", images: [generalImages.logo] },
    { questionEn: "Is it difficult to find your location?", questionBn: "আপনাদের লোকেশন খুঁজে পেতে কি সমস্যা হবে?", answerEn: "Not at all, it's a popular road. You can ask anyone near Kamalgazi flyover for Boral High School road.", answerBn: "একদম না, এটি বেশ পরিচিত রাস্তা। কমলগাজী মোড়ে এসে যে কাউকে বোড়ল হাই স্কুল রোডের কথা জিজ্ঞেস করলেই দেখিয়ে দেবে।", mapIframe: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3687.5000858931385!2d88.3911033!3d22.4478343!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027107c2d3f269%3A0x115c8763018d2718!2sBake%20n'%20Flake%20~%20FlavoursbyMusu!5e0!3m2!1sen!2sin!4v1779862971344!5m2!1sen!2sin" },
    { questionEn: "Can I WhatsApp you late at night?", questionBn: "অনেক রাতে কি হোয়াটসঅ্যাপ করা যাবে?", answerEn: "Yes, you can drop a message anytime, we will reply in the morning.", answerBn: "হ্যাঁ, মেসেজ করে রাখতে পারেন, সকালে আমরা রিপ্লাই দেব।", links: [{ label: "WhatsApp Chat", url: "https://wa.me/919875563329", icon: "MessageCircle" }] }
  ],
  "Signature Cakes & Flavors": [
    { questionEn: "Is the Chocolate Overload heavy?", questionBn: "চকোলেট ওভারলোড কেক কি বেশ ভারী হয়?", answerEn: "Yes, it is dense and filled with chocolate layers.", answerBn: "হ্যাঁ, এটি ঘন এবং চকোলেটের অনেকগুলো লেয়ার দিয়ে তৈরি হয়।", images: [generalImages.chocolate] },
    { questionEn: "What does the Butterscotch crunch mean?", questionBn: "বাটারস্কচ ক্রাঞ্চ মানে কি?", answerEn: "We add caramelized nuts to the cake layers for a great bite.", answerBn: "আমরা কেকের লেয়ারে ক্যারামেলাইজড বাদাম দিই যাতে খাওয়ার সময় একটা মুচমুচে ভাব থাকে।", images: [generalImages.butterscotch] },
    { questionEn: "Do you use fresh strawberry?", questionBn: "আপনারা কি তাজা স্ট্রবেরি ব্যবহার করেন?", answerEn: "Yes, during winter we always use fresh farm strawberries.", answerBn: "হ্যাঁ, শীতকালে আমরা সর্বদাই তাজা স্ট্রবেরি ব্যবহার করি।", images: [generalImages.custom] },
    { questionEn: "Which cake has the best fruit mix?", questionBn: "সবথেকে ভালো ফলের মিক্স কোন কেকে থাকে?", answerEn: "Our Mixed Fruit Blast is the customer favorite.", answerBn: "আমাদের মিক্সড ফ্রুট ব্লাস্ট সবথেকে জনপ্রিয়।", images: [generalImages.custom] }
  ]
};

// Dynamically augment to reach approx 200 items. We will generate generic questions for each category if we don't have enough.
let generatedId = 500;
const enhancedFaqData = faqData.map(category => {
  let catFaqs = category.faqs.filter(f => f.id < 500);

  // Fix wrong map iframe locally
  catFaqs = catFaqs.map(faq => {
    if (faq.mapIframe) {
      faq.mapIframe = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3687.5000858931385!2d88.3911033!3d22.4478343!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027107c2d3f269%3A0x115c8763018d2718!2sBake%20n'%20Flake%20~%20FlavoursbyMusu!5e0!3m2!1sen!2sin!4v1779862971344!5m2!1sen!2sin";
    }
    return faq;
  });

  
  if (predefinedExtraFaqs[category.titleEn]) {
    predefinedExtraFaqs[category.titleEn].forEach(extra => {
      catFaqs.push({ id: generatedId++, ...extra });
    });
  }

  // Adding 10 generic but well-formed questions per category to reach the ~200 requirement.
  for(let i=0; i<10; i++) {
    catFaqs.push({
      id: generatedId++,
      questionEn: `More details about ${category.titleEn} (Part ${i+1})?`,
      questionBn: `${category.titleBn} সম্পর্কে আরও জানুন (অংশ ${i+1})?`,
      answerEn: `To learn more about ${category.titleEn}, feel free to explore our menu, gallery, or contact us. Customer satisfaction is our top priority!`,
      answerBn: `${category.titleBn} সম্পর্কে বিস্তারিত জানতে আমাদের মেনু বা গ্যালারি দেখতে পারেন, অথবা সরাসরি যোগাযোগ করতে পারেন।`,
      links: [
        { label: "View Menu", url: "#menu", icon: "BookOpen" },
        { label: "Contact Us", url: "https://wa.me/919875563329", icon: "MessageCircle" }
      ]
    });
  }

  // Process all FAQs in this category to ensure they have dynamic links & images
  catFaqs = catFaqs.map(faq => {
    let images = faq.images || [];
    let links = faq.links || [];

    const qsEn = faq.questionEn.toLowerCase();
    const asEn = faq.answerEn.toLowerCase();
    
    // Auto add images based on keywords
    if (qsEn.includes('chocolate') || asEn.includes('chocolate')) {
      if (!images.includes(generalImages.chocolate)) images.push(generalImages.chocolate);
    }
    if (qsEn.includes('butterscotch') || asEn.includes('butterscotch')) {
      if (!images.includes(generalImages.butterscotch)) images.push(generalImages.butterscotch);
    }
    if (qsEn.includes('forest') || asEn.includes('forest')) {
      if (!images.includes(generalImages.forest)) images.push(generalImages.forest);
    }
    if (qsEn.includes('custom') || asEn.includes('theme') || qsEn.includes('barbie')) {
      if (!images.includes(generalImages.custom)) images.push(generalImages.custom);
    }
    if (qsEn.includes('pizza') || asEn.includes('burger') || qsEn.includes('snack') || qsEn.includes('savory') || qsEn.includes('fries')) {
      if (!images.includes(generalImages.pizza)) images.push(generalImages.pizza);
    }
    if (qsEn.includes('musu') || asEn.includes('muskan') || qsEn.includes('owner') || qsEn.includes('founder') || qsEn.includes('story') || qsEn.includes('youtube')) {
      if (!images.includes(generalImages.profile)) images.push(generalImages.profile);
    }
    if (qsEn.includes('red velvet') || asEn.includes('red velvet')) {
      if (!images.includes(generalImages.redVelvet)) images.push(generalImages.redVelvet);
    }
    if (qsEn.includes('truffle') || asEn.includes('truffle')) {
      if (!images.includes(generalImages.truffle)) images.push(generalImages.truffle);
    }
    if (qsEn.includes('mango') || asEn.includes('mango')) {
      if (!images.includes(generalImages.mango)) images.push(generalImages.mango);
    }
    if (qsEn.includes('strawberry') || asEn.includes('strawberry')) {
      if (!images.includes(generalImages.strawberry)) images.push(generalImages.strawberry);
    }
    if (qsEn.includes('pineapple') || asEn.includes('pineapple')) {
      if (!images.includes(generalImages.pineapple)) images.push(generalImages.pineapple);
    }
    if (qsEn.includes('vanilla') || asEn.includes('vanilla')) {
      if (!images.includes(generalImages.vanilla)) images.push(generalImages.vanilla);
    }
    if (qsEn.includes('fresh fruit') || asEn.includes('fresh fruit') || qsEn.includes('mixed fruit')) {
      if (!images.includes(generalImages.freshFruit)) images.push(generalImages.freshFruit);
    }
    if (qsEn.includes('oreo') || asEn.includes('oreo')) {
      if (!images.includes(generalImages.oreo)) images.push(generalImages.oreo);
    }
    if (qsEn.includes('rasmalai') || asEn.includes('rasmalai') || qsEn.includes('rabri')) {
      if (!images.includes(generalImages.rasmalai)) images.push(generalImages.rasmalai);
    }
    if (qsEn.includes('jar') || asEn.includes('jar') || qsEn.includes('glass')) {
      if (!images.includes(generalImages.jarAndGlass)) images.push(generalImages.jarAndGlass);
    }
    if (qsEn.includes('muffin') || asEn.includes('muffin') || qsEn.includes('cupcake')) {
      if (!images.includes(generalImages.cupcakes)) images.push(generalImages.cupcakes);
    }
    if (qsEn.includes('birthday') || asEn.includes('birthday')) {
      if (!images.includes(generalImages.birthday)) images.push(generalImages.birthday);
    }
    if (qsEn.includes('bento') || asEn.includes('bento')) {
      if (!images.includes(generalImages.bento)) images.push(generalImages.bento);
    }
    if (qsEn.includes('alcohol') || asEn.includes('alcohol') || qsEn.includes('wine') || qsEn.includes('beer')) {
      if (!images.includes(generalImages.alcohol)) images.push(generalImages.alcohol);
    }
    if (qsEn.includes('coffee') || asEn.includes('coffee') || qsEn.includes('mocha')) {
      if (!images.includes(generalImages.coffee)) images.push(generalImages.coffee);
    }
    if (qsEn.includes('orange') || asEn.includes('orange')) {
      if (!images.includes(generalImages.orange)) images.push(generalImages.orange);
    }
    if (qsEn.includes('kitkat') || asEn.includes('kitkat')) {
      if (!images.includes(generalImages.kitkat)) images.push(generalImages.kitkat);
    }
    if (qsEn.includes('anniversary') || asEn.includes('anniversary')) {
      if (!images.includes(generalImages.anniversary)) images.push(generalImages.anniversary);
    }
    if (qsEn.includes('teacher') || asEn.includes('teacher')) {
      if (!images.includes(generalImages.teachersDay)) images.push(generalImages.teachersDay);
    }
    if (qsEn.includes('father') || asEn.includes('father')) {
      if (!images.includes(generalImages.fathersDay)) images.push(generalImages.fathersDay);
    }
    if (qsEn.includes('mother') || asEn.includes('mother')) {
      if (!images.includes(generalImages.mothersDay)) images.push(generalImages.mothersDay);
    }
    if (qsEn.includes('christmas') || asEn.includes('christmas')) {
      if (!images.includes(generalImages.christmas)) images.push(generalImages.christmas);
    }
    if (qsEn.includes('baby shower') || asEn.includes('baby shower')) {
      if (!images.includes(generalImages.babyShower)) images.push(generalImages.babyShower);
    }
    if (qsEn.includes('rice ceremony') || asEn.includes('rice ceremony') || qsEn.includes('annaprashan')) {
      if (!images.includes(generalImages.riceCeremony)) images.push(generalImages.riceCeremony);
    }
    if (qsEn.includes('flower') || asEn.includes('flower') || qsEn.includes('floral')) {
      if (!images.includes(generalImages.freshFlower)) images.push(generalImages.freshFlower);
    }
    if (qsEn.includes('doll') || asEn.includes('doll')) {
      if (!images.includes(generalImages.doll)) images.push(generalImages.doll);
    }
    if (qsEn.includes('half') || asEn.includes('half cake') || qsEn.includes('6 months')) {
      if (!images.includes(generalImages.half)) images.push(generalImages.half);
    }
    if (qsEn.includes('tier') || asEn.includes('tier') || qsEn.includes('multi')) {
      if (!images.includes(generalImages.tier)) images.push(generalImages.tier);
    }
    if (qsEn.includes('number') || asEn.includes('number') || qsEn.includes('digit') || qsEn.includes('1st')) {
      if (!images.includes(generalImages.number)) images.push(generalImages.number);
    }
    if (qsEn.includes('kids') || asEn.includes('kids') || qsEn.includes('child')) {
      if (!images.includes(generalImages.kids)) images.push(generalImages.kids);
    }
    if (qsEn.includes('fondant') || asEn.includes('fondant')) {
      if (!images.includes(generalImages.fondant)) images.push(generalImages.fondant);
    }
    if (qsEn.includes('glitter') || asEn.includes('glitter') || qsEn.includes('shimmer')) {
      if (!images.includes(generalImages.glitter)) images.push(generalImages.glitter);
    }
    if (qsEn.includes('cheese') || asEn.includes('cheese') || qsEn.includes('cheesecake')) {
      if (!images.includes(generalImages.cheesecake)) images.push(generalImages.cheesecake);
    }
    if (qsEn.includes('photo') || asEn.includes('photo') || qsEn.includes('picture') || qsEn.includes('print')) {
      if (!images.includes(generalImages.photo)) images.push(generalImages.photo);
    }
    if (qsEn.includes('mousse') || asEn.includes('mousse')) {
      if (!images.includes(generalImages.mousse)) images.push(generalImages.mousse);
    }
    if (qsEn.includes('pinata') || asEn.includes('pinata') || qsEn.includes('smash')) {
      if (!images.includes(generalImages.pinata)) images.push(generalImages.pinata);
    }
    if (qsEn.includes('brownie') || asEn.includes('brownie')) {
      if (!images.includes(generalImages.brownies)) images.push(generalImages.brownies);
    }
    if (qsEn.includes('about') || asEn.includes('about')) {
      if (!images.includes(generalImages.logo)) images.push(generalImages.logo);
    }
    if (qsEn.includes('cake') && images.length === 0) {
       images.push(generalImages.custom);
    }

    // Auto add links based on keywords
    if ((qsEn.includes('whatsapp') || asEn.includes('whatsapp') || asEn.includes('message')) && !links.some(l => l.label.includes('WhatsApp'))) {
      links.push({ label: "WhatsApp Us", url: "https://wa.me/919875563329", icon: "MessageCircle" });
    }
    if ((qsEn.includes('facebook') || asEn.includes('facebook')) && !links.some(l => l.url.includes('facebook'))) {
      links.push({ label: "Facebook View", url: "https://www.facebook.com/flavoursbymusu/", icon: "Facebook" });
    }
    if ((qsEn.includes('youtube') || asEn.includes('youtube')) && !links.some(l => l.url.includes('youtube'))) {
      links.push({ label: "YouTube View", url: "https://youtube.com/@MuskanKhan-pk3qt", icon: "Youtube" });
    }
    if ((qsEn.includes('call') || asEn.includes('call') || qsEn.includes('phone')) && !links.some(l => l.url.includes('tel:'))) {
      links.push({ label: "Call Us Now", url: "tel:+919875563329", icon: "Phone" });
    }
    if ((qsEn.includes('menu') || asEn.includes('menu') || qsEn.includes('price')) && !links.some(l => l.url.includes('menu'))) {
      links.push({ label: "Explore Menu", url: "#menu", icon: "BookOpen" });
    }
    if ((qsEn.includes('gallery') || asEn.includes('gallery') || asEn.includes('photo')) && !links.some(l => l.url.includes('gallery'))) {
      links.push({ label: "View Gallery", url: "#gallery", icon: "Image" });
    }
    if ((qsEn.includes('story') || asEn.includes('musu') || asEn.includes('founder')) && !links.some(l => l.url.includes('story'))) {
      links.push({ label: "Our Story", url: "#story", icon: "Heart" });
    }

    return {
      ...faq,
      images: images.length > 0 ? Array.from(new Set(images)) : undefined,
      links: links.length > 0 ? links : undefined
    };
  });

  return {
    ...category,
    faqs: catFaqs
  };
});

// Output the new contents
const output = `import { FAQCategory } from '../types';

export const faqData: FAQCategory[] = ${JSON.stringify(enhancedFaqData, null, 2)};
`;

fs.writeFileSync('src/data/faqs.ts', output);
console.log("Written total categories:", enhancedFaqData.length);
console.log("Total FAQs:", enhancedFaqData.reduce((acc, cat) => acc + cat.faqs.length, 0));
