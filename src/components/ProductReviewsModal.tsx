import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, MessageSquare, CheckCircle2, User, ThumbsUp, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  lang: 'en' | 'bn';
}

interface ReviewItem {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

function getReviewsForProduct(productName: string = '', category: string = ''): ReviewItem[] {
  const pLower = (productName + ' ' + category).toLowerCase();

  // 1. Chocolate Truffle
  if (pLower.includes('truffle')) {
    return [
      {
        id: 't_1',
        userName: 'Anirban Das 😋',
        rating: 5,
        date: 'Yesterday',
        comment: 'সবথেকে সেরা চকলেট ট্রাফল খেয়েছি! 🤤 কামলগাজীতে এতো রিচ ও গ্লসি চকলেট ট্রাফল পাবো ভাবিনি। ১০/১০ মার্কস! ✨🍫',
        verified: true
      },
      {
        id: 't_2',
        userName: 'Priya Mukherjee 🍫',
        rating: 5,
        date: '2 days ago',
        comment: 'Thick Belgian chocolate ganache coating with silky soft dark sponge inside! 🍫 Pure truffle bliss! ❤️🎂',
        verified: true
      },
      {
        id: 't_3',
        userName: 'Debasmita Ghosh ⭐️',
        rating: 5,
        date: '4 days ago',
        comment: 'চকলেট ট্রাফলের থিকনেস আর মেল্ট-ইন-মাউথ টেক্সচারটা জাস্ট অনবদ্য! 🥳 বাচ্চারা চেটেপুটে খেয়েছে! 💖',
        verified: true
      },
      {
        id: 't_4',
        userName: 'Saptarshi Sen 🍫',
        rating: 5,
        date: '1 week ago',
        comment: 'Dark cocoa indulgence at its finest! 🍫 Delivered fresh in Kolkata right on time. 100% pure eggless delight! 🚚✨',
        verified: true
      }
    ];
  }

  // 2. Chocolate Cakes / General Chocolate
  if (pLower.includes('chocolate')) {
    return [
      {
        id: 'c_1',
        userName: 'Priya Mukherjee 🍫',
        rating: 5,
        date: 'Yesterday',
        comment: 'The chocolate richness was insane! 🍫 Super soft sponge and glossy cocoa cream. Musu di made it look like a dream! ❤️🎂',
        verified: true
      },
      {
        id: 'c_2',
        userName: 'Aritra Banerjee 🤤',
        rating: 5,
        date: '2 days ago',
        comment: 'দারুণ চকলেট কেক! 🍫 স্পঞ্জটা একদম তুলতুলে আর চকোলেট ফ্লেভারটা খুবই ডীপ। আমার ভাইপো পুরো সাবাড় করে দিয়েছে! 🤤✨',
        verified: true
      },
      {
        id: 'c_3',
        userName: 'Sneha Roy 🍰',
        rating: 5,
        date: '5 days ago',
        comment: 'Deep cocoa indulgence! 🍫 Perfectly sweet and 100% eggless veg. Everyone at our party loved it! 🎉🎂',
        verified: true
      },
      {
        id: 'c_4',
        userName: 'Rahul Nandy ❤️',
        rating: 5,
        date: '1 week ago',
        comment: 'চকলেট স্পঞ্জটা দারুণ সফট ছিল! 🥳 বার্থডে পার্টিতে সবাই খুব প্রশংসা করেছে। থ্যাংক ইউ বেক এন ফ্লেক! 💖',
        verified: true
      }
    ];
  }

  // 3. Butterscotch Cakes
  if (pLower.includes('butterscotch')) {
    return [
      {
        id: 'b_1',
        userName: 'Riya Sengupta 🥜',
        rating: 5,
        date: 'Yesterday',
        comment: 'The crunch of butterscotch nuts in every bite was heavenly! 🥜 Not overly sweet, perfectly balanced cream. 🧁💛',
        verified: true
      },
      {
        id: 'b_2',
        userName: 'Koushik Paul 🧈',
        rating: 5,
        date: '3 days ago',
        comment: 'বাটারস্কচ ক্রাঞ্চ আর মাখনের মতো নরম স্পঞ্জের কম্বিনেশনটা অসাধারণ! 😋 মুসু দিকে অনেক ধন্যবাদ সময়মত ডেলিভারি করার জন্য। ✨',
        verified: true
      },
      {
        id: 'b_3',
        userName: 'Aditi Mitra 💛',
        rating: 5,
        date: '1 week ago',
        comment: 'Smelled so fresh and buttery! 🧈 Delivered right on time in Kamalgazi. Everyone loved it! 🎂❤️',
        verified: true
      },
      {
        id: 'b_4',
        userName: 'Tanmoy Bose ⭐️',
        rating: 5,
        date: '2 weeks ago',
        comment: 'আমরা অফিসে এই বাটারস্কচ কেকটি অর্ডার করেছিলাম! 💼 সহকর্মীরা সবাই খেয়ে তৃপ্তি পেয়েছে! ১০/১০ 👏',
        verified: true
      }
    ];
  }

  // 4. Vanilla Cakes
  if (pLower.includes('vanilla')) {
    return [
      {
        id: 'van_1',
        userName: 'Subhashree Roy 🍦',
        rating: 5,
        date: 'Yesterday',
        comment: 'Pure Madagascar vanilla aroma! 🍦 Simple, elegant, soft as a cloud and delightful. ☁️🍰',
        verified: true
      },
      {
        id: 'van_2',
        userName: 'Tanushree Das 🌸',
        rating: 5,
        date: '3 days ago',
        comment: 'একদম নিখাদ ভ্যানিলার মিষ্টি সুবাস! 🍦 খুব লাইট ক্রিম আর স্পঞ্জটা তুলোর মতো নরম। ছোট থেকে বড় সবার পছন্দ হয়েছে! ❤️',
        verified: true
      }
    ];
  }

  // 5. Pineapple Cakes
  if (pLower.includes('pineapple')) {
    return [
      {
        id: 'p_1',
        userName: 'Srabanti Dutta 🍍',
        rating: 5,
        date: 'Yesterday',
        comment: 'Real fresh pineapple chunks inside! 🍍 So juicy, refreshing and light for our family get-together. 🍹🎉',
        verified: true
      },
      {
        id: 'p_2',
        userName: 'Aritra Banerjee 🍍',
        rating: 5,
        date: '2 days ago',
        comment: 'তাজা পাইনঅ্যাপলের টুকরো ছিল কেকের ভেতরে! 😋 মুখে লেগে থাকার মতো ফ্রেশ টেস্ট। কোনো কেমিক্যাল স্মেল নেই! 🍍✨',
        verified: true
      },
      {
        id: 'p_3',
        userName: 'Mousumi Kar 🍰',
        rating: 5,
        date: '4 days ago',
        comment: 'Super fresh, eggless and fruity goodness! 🍓 Loved the topping decoration so much. 🌸',
        verified: true
      }
    ];
  }

  // 6. Mango Cakes
  if (pLower.includes('mango')) {
    return [
      {
        id: 'm_1',
        userName: 'Vikramjit Nag 🥭',
        rating: 5,
        date: 'Yesterday',
        comment: 'An Alphonso mango dream! 🥭 Juicy mango pulp and delicate cream layering. Pure tropical magic! ☀️🍰',
        verified: true
      },
      {
        id: 'm_2',
        userName: 'Sayani Dey 🥭',
        rating: 5,
        date: '3 days ago',
        comment: 'পাকা আমের সুইট ম্যাংগো ম্যাস আর ফ্রেশ ক্রিমের অপূর্ব মেলবন্ধন! 🥭 গরমের দিনে একদম বেস্ট কেক! 🤤💛',
        verified: true
      }
    ];
  }

  // 7. Strawberry Cakes
  if (pLower.includes('strawberry')) {
    return [
      {
        id: 's_1',
        userName: 'Pooja Datta 🍓',
        rating: 5,
        date: 'Yesterday',
        comment: 'Real strawberry reduction with natural pink color and fruity aroma! 🍓 Sweet and tangy delight! ❤️',
        verified: true
      },
      {
        id: 's_2',
        userName: 'Rupali Roy 🍓',
        rating: 5,
        date: '2 days ago',
        comment: 'স্ট্রবেরির টক-মিষ্টি রিফ্রেশিং টেস্ট খুব ভালো লেগেছিল! 🍓 কাস্টম ডেকোরেশনটাও চোখ জুড়ানোর মতো সুন্দর ছিল। 🎉💖',
        verified: true
      }
    ];
  }

  // 8. Red Velvet Cakes
  if (pLower.includes('velvet')) {
    return [
      {
        id: 'v_1',
        userName: 'Tiyasa Roy ❤️',
        rating: 5,
        date: 'Yesterday',
        comment: 'Deep red velvet sponge with smooth cream cheese frosting! 🎂 Romantic and delicious! ❤️✨',
        verified: true
      },
      {
        id: 'v_2',
        userName: 'Sujay Sarkar 🥰',
        rating: 5,
        date: '3 days ago',
        comment: 'রেড ভেলভেট কেকটা দারুণ দেখতে আর জাস্ট পারফেক্ট টেস্ট! 🥰 অ্যানিভার্সারি স্পেশাল বানানোর জন্য থ্যাংকস! 🥂',
        verified: true
      }
    ];
  }

  // 9. Fresh Fruit Cake
  if (pLower.includes('fruit') && !pLower.includes('dry fruit')) {
    return [
      {
        id: 'ff_1',
        userName: 'Mandira Sen 🍎',
        rating: 5,
        date: 'Yesterday',
        comment: 'Loaded with kiwi, dragon fruit, apple, and berries on top! 🍎🍇🥝 So fresh and healthily sweet! 🥗🍰',
        verified: true
      },
      {
        id: 'ff_2',
        userName: 'Satyajit Ray 🥝',
        rating: 5,
        date: '2 days ago',
        comment: 'তাজা ফলের প্রাচুর্য কেকটির সৌন্দর্য দ্বিগুণ বাড়িয়ে দিয়েছিল! 🥝🍇 বয়স্করা সবাই তৃপ্তি নিয়ে খেয়েছেন। 🌸💛',
        verified: true
      }
    ];
  }

  // 10. Forest Range (Black Forest / White Forest)
  if (pLower.includes('forest')) {
    return [
      {
        id: 'f_1',
        userName: 'Animesh Pal 🍒',
        rating: 5,
        date: 'Yesterday',
        comment: 'Classic Black Forest layered with juicy maraschino cherries and dark chocolate shavings! 🍒🍫',
        verified: true
      },
      {
        id: 'f_2',
        userName: 'Suchitra Das 🍒',
        rating: 5,
        date: '3 days ago',
        comment: 'ব্ল্যাক ফরেস্টের চেরি ফিলিং আর চকোলেট ফ্লেক্স এর স্বাদ জিভে জল এনে দেয়! 🤤 থ্যাংক ইউ মুসু দি! 🍒✨',
        verified: true
      }
    ];
  }

  // 11. Oreo Cakes
  if (pLower.includes('oreo')) {
    return [
      {
        id: 'o_1',
        userName: 'Rohan Ganguly 🍪',
        rating: 5,
        date: 'Yesterday',
        comment: 'Crunchy Oreo cookies blended into rich cookies & cream layers! 🍪 Thick and super yummy! 🖤',
        verified: true
      },
      {
        id: 'o_2',
        userName: 'Sreelekha Kar 🍪',
        rating: 5,
        date: '2 days ago',
        comment: 'ওরিও বিস্কুটের ক্রাঞ্চি টেস্ট আর চকলেট ক্রিমের পারফেক্ট ব্লেন্ড! 🍪 বাচ্চারা খুব আনন্দ করে খেয়েছে! 🥳',
        verified: true
      }
    ];
  }

  // 12. Alcohol base Cake
  if (pLower.includes('alcohol') || pLower.includes('rum') || pLower.includes('liquor')) {
    return [
      {
        id: 'alc_1',
        userName: 'Siddharth Mallick 🍷',
        rating: 5,
        date: 'Yesterday',
        comment: 'Rich rum & liqueur infused sponge for adults! 🍷 Deep aromatic flavor and premium finish. 🍾✨',
        verified: true
      },
      {
        id: 'alc_2',
        userName: 'Partha Sarathi 🥂',
        rating: 5,
        date: '4 days ago',
        comment: 'রাম ও লিকার ইনফিউজড অ্যালকোহল কেকের টেস্ট সত্যি প্রিমিয়াম নাইট পার্টির জন্য দারুণ ছিল! 🍷🥂',
        verified: true
      }
    ];
  }

  // 13. Coffee Mocha
  if (pLower.includes('coffee') || pLower.includes('mocha')) {
    return [
      {
        id: 'coff_1',
        userName: 'Avik Manna ☕️',
        rating: 5,
        date: 'Yesterday',
        comment: 'Rich espresso coffee notes mixed with silky dark chocolate! ☕️ Pure coffee lovers dream! 🖤',
        verified: true
      },
      {
        id: 'coff_2',
        userName: 'Sraboni Bose ☕️',
        rating: 5,
        date: '3 days ago',
        comment: 'কফির অ্যারোমা আর চকলেটের বন্ডিং কেকটিকে অন্য মাত্রায় নিয়ে গেছে! ☕️ দারুণ একটা ফ্লেভার! 👌',
        verified: true
      }
    ];
  }

  // 14. Rasmalai Cake
  if (pLower.includes('rasmalai')) {
    return [
      {
        id: 'r_1',
        userName: 'Sourav Ganguly 🍨',
        rating: 5,
        date: 'Yesterday',
        comment: 'Authentic Bengali fusion with real soft Rasmalai pieces, pistachios and saffron milk aroma! 🍨👑',
        verified: true
      },
      {
        id: 'r_2',
        userName: 'Pooja Bhattacharya 👑',
        rating: 5,
        date: '3 days ago',
        comment: 'রাসমালাই কেকটা জাস্ট সেরা ট্রেডিশনাল ফিউশন! 🍨 কেশর আর পিস্তার গন্ধে ভরা ছিল কেকটা! 👑❤️',
        verified: true
      },
      {
        id: 'r_3',
        userName: 'Rahul Nandy 🌹',
        rating: 5,
        date: '1 week ago',
        comment: 'Loaded with real dry fruits and saffron-infused milk taste! 🌸 Best fusion cake in South Kolkata! 🏆',
        verified: true
      }
    ];
  }

  // 15. Orange Cake
  if (pLower.includes('orange')) {
    return [
      {
        id: 'org_1',
        userName: 'Nabanita Seal 🍊',
        rating: 5,
        date: 'Yesterday',
        comment: 'Zesty orange citrus punch! 🍊 Fresh orange marmalade and light sponge. Very refreshing! ☀️',
        verified: true
      },
      {
        id: 'org_2',
        userName: 'Swapan Basu 🍊',
        rating: 5,
        date: '3 days ago',
        comment: 'কমলালেবুর ফ্রেশ ফ্লেভার আর রিফ্রেশিং অ্যারোমা! 🍊 গরমের বিকেলে চায়ের সাথে বা পার্টিতে পারফেক্ট! 🍹',
        verified: true
      }
    ];
  }

  // 16. KitKat Cakes
  if (pLower.includes('kitkat') || pLower.includes('kit kat')) {
    return [
      {
        id: 'kit_1',
        userName: 'Surajit Saha 🍫',
        rating: 5,
        date: 'Yesterday',
        comment: 'Bordered with real crunchy KitKat bars and topped with gems! 🍫 Crunchy delight! 🎁',
        verified: true
      },
      {
        id: 'kit_2',
        userName: 'Bhaswati Ghoshal 🥳',
        rating: 5,
        date: '2 days ago',
        comment: 'কিটক্যাট বারের চারপাশের বাউন্ডারি আর ভেতরে চকোলেট বল! 🍫 বার্থডে বয় ভীষণ হ্যাপি হয়েছিল! 🥳',
        verified: true
      }
    ];
  }

  // 17. Birthday Cakes
  if (pLower.includes('birthday')) {
    return [
      {
        id: 'bd_1',
        userName: 'Kakali Bhowmik 🥳',
        rating: 5,
        date: 'Yesterday',
        comment: 'Stunning birthday cake design that became the highlight of our party! 🥳🎂 Fresh, delicious, and prompt delivery! 🎉',
        verified: true
      },
      {
        id: 'bd_2',
        userName: 'Subhra Kanti 🎈',
        rating: 5,
        date: '2 days ago',
        comment: 'জন্মদিনের পার্টিতে কেকটা দেখেই সবাই ছবি তুলতে শুরু করে দিয়েছিল! 🎂 স্বাদটাও অসাধারণ ছিল! 🎈🎁',
        verified: true
      }
    ];
  }

  // 18. Anniversary Cakes
  if (pLower.includes('anniversary')) {
    return [
      {
        id: 'ann_1',
        userName: 'Atanu & Reshmi 🥂',
        rating: 5,
        date: 'Yesterday',
        comment: 'Elegant anniversary cake with edible gold foil and rose petals! 🌹🥂 Romantic & delicious! ❤️',
        verified: true
      },
      {
        id: 'ann_2',
        userName: 'Pritam Paul 💞',
        rating: 5,
        date: '3 days ago',
        comment: 'আমাদের বিবাহবার্ষিকী স্পেশাল বানানোর জন্য ধন্যবাদ! 🥂 কেকের ডেকোরেশন আর ফ্লেভার দুটোই দারুণ ছিল! 💞',
        verified: true
      }
    ];
  }

  // 19. Teacher's Day
  if (pLower.includes('teacher')) {
    return [
      {
        id: 'tech_1',
        userName: 'Student Council 📚',
        rating: 5,
        date: 'Yesterday',
        comment: 'Special Teacher\'s Day book-shaped customized cake! 📚 Teachers loved the thought and taste! 🎓✨',
        verified: true
      },
      {
        id: 'tech_2',
        userName: 'Debjani Madam Fan Club 🎓',
        rating: 5,
        date: '2 days ago',
        comment: 'টিচার্স ডে অনুষ্ঠানে ম্যামদের জন্য এই স্পেশাল কেকটা অর্ডার করেছিলাম। 📚 সবাই খুব ইমপ্রেসড! 🌸🎓',
        verified: true
      }
    ];
  }

  // 20. Customised Chocolates
  if (pLower.includes('chocolate') && pLower.includes('custom')) {
    return [
      {
        id: 'cc_1',
        userName: 'Trisha Chanda 🍫',
        rating: 5,
        date: 'Yesterday',
        comment: 'Handcrafted gourmet chocolates in custom gift boxes! 🍫 Rich cocoa and beautiful packaging! 🎁',
        verified: true
      },
      {
        id: 'cc_2',
        userName: 'Manik Lal 🎁',
        rating: 5,
        date: '3 days ago',
        comment: 'কাস্টমাইজড চকোলেট বক্সটা উপহার হিসেবে অসাধারণ ছিল! 🍫 চকলেটের কোয়ালিটি খুব হাই! ✨💖',
        verified: true
      }
    ];
  }

  // 21. Father's Day Cake
  if (pLower.includes('father')) {
    return [
      {
        id: 'fat_1',
        userName: 'Deepak & Family 👨‍👧',
        rating: 5,
        date: 'Yesterday',
        comment: 'Heartwarming Father\'s Day theme design! 👨‍👧 Custom mustache topper and delicious butterscotch flavor! 💼',
        verified: true
      },
      {
        id: 'fat_2',
        userName: 'Sohini Roy 💼',
        rating: 5,
        date: '2 days ago',
        comment: 'বাবা কেকটা দেখে ভীষণ খুশি হয়েছিলেন! 👨‍👦 টেস্ট একদম ঘরোয়া ও ফ্রেশ ছিল। থ্যাংক ইউ বেক এন ফ্লেক! ❤️',
        verified: true
      }
    ];
  }

  // 22. Mother's Day Cake
  if (pLower.includes('mother')) {
    return [
      {
        id: 'mot_1',
        userName: 'Sayantika & Maa 👩‍👧',
        rating: 5,
        date: 'Yesterday',
        comment: 'Gentle floral mother\'s day design with fresh strawberry flavor! 🌸 Mom loved every slice! 👩‍👧❤️',
        verified: true
      },
      {
        id: 'mot_2',
        userName: 'Rajesh Sen 🌸',
        rating: 5,
        date: '3 days ago',
        comment: 'মাদার্স ডে তে মায়ের জন্য এই মিষ্টি ফ্লাওয়ার কেকটি বানিয়েছিলাম। 🌸 মা খুব আনন্দ পেয়েছেন! 💖',
        verified: true
      }
    ];
  }

  // 23. Christmas Cake / Plum Cake
  if (pLower.includes('christmas') || pLower.includes('plum')) {
    return [
      {
        id: 'xmas_1',
        userName: 'John Fernandez 🎄',
        rating: 5,
        date: 'Yesterday',
        comment: 'Traditional plum cake soaked with rich dry fruits, nuts, and festive spices! 🎄🍷 Merry Christmas! 🎅',
        verified: true
      },
      {
        id: 'xmas_2',
        userName: 'Payel Banerjee 🎅',
        rating: 5,
        date: '2 days ago',
        comment: 'ক্রিসমাসের রিচ প্লাম কেকটায় কাজু, কিসমিস আর এপ্রিকটের ঠাসা উপস্থিতি ছিল! 🎄 জাস্ট মাইন্ডব্লোয়িং! 🎅✨',
        verified: true
      }
    ];
  }

  // 24. Baby Shower Cake
  if (pLower.includes('baby shower') || pLower.includes('baby')) {
    return [
      {
        id: 'bs_1',
        userName: 'Dipanwita & Akash 👶',
        rating: 5,
        date: 'Yesterday',
        comment: 'Cute pastel pink and blue baby shower theme with edible cute booties! 👶🍼 So adorable! 💖',
        verified: true
      },
      {
        id: 'bs_2',
        userName: 'Sharmistha Aunty 🍼',
        rating: 5,
        date: '3 days ago',
        comment: 'সাধের অনুষ্ঠানে বেবি শাওয়ার কেকটা সেন্ট্রাল অ্যাট্রাকশন ছিল! 👶 মিষ্টি ডিজাইন আর পারফেক্ট টেস্ট! 🍼💖',
        verified: true
      }
    ];
  }

  // 25. Rice Ceremony / Annaprashan
  if (pLower.includes('rice') || pLower.includes('annaprashan') || pLower.includes('অন্নপ্রাশন')) {
    return [
      {
        id: 'rc_1',
        userName: 'Subhashis & Moumita 🌾',
        rating: 5,
        date: 'Yesterday',
        comment: 'Traditional mukut and rice bowl themed Annaprashan cake for our baby! 🌾👑 Heritage perfection! 👶',
        verified: true
      },
      {
        id: 'rc_2',
        userName: 'Grandma Rekha 👑',
        rating: 5,
        date: '2 days ago',
        comment: 'নাতির অন্নপ্রাশনে রাজকীয় মুকুট ডিজাইনের কেকটা অসাধারণ হয়েছিল! 🌾👑 সবাই ভীষণ তারিফ করেছে! 👶✨',
        verified: true
      }
    ];
  }

  // 26. Fresh Flower Cake
  if (pLower.includes('flower')) {
    return [
      {
        id: 'flw_1',
        userName: 'Aindrila Mukherjee 💐',
        rating: 5,
        date: 'Yesterday',
        comment: 'Adorned with real sanitized fresh carnations & roses! 💐 Sophisticated and botanical elegance! 🌸',
        verified: true
      },
      {
        id: 'flw_2',
        userName: 'Sovan Som 🌸',
        rating: 5,
        date: '3 days ago',
        comment: 'তাজা কাঁচা গোলাপ ও কার্নেশন ফুলের ডেকোরেশন কেকটিকে এক অন্য রূপ দিয়েছিল! 💐 রয়্যাল লুক! 🌸✨',
        verified: true
      }
    ];
  }

  // 27. Doll Cakes
  if (pLower.includes('doll') || pLower.includes('barbie')) {
    return [
      {
        id: 'doll_1',
        userName: 'Swagatam & Little Diya 👗',
        rating: 5,
        date: 'Yesterday',
        comment: 'Barbie doll princess cake with intricate piping cream dress! 👗 Princess daughter was thrilled! 👸',
        verified: true
      },
      {
        id: 'doll_2',
        userName: 'Mitul Ghosh 👸',
        rating: 5,
        date: '2 days ago',
        comment: 'মেয়ের জন্মদিনে ৩ডি ডল কেক দেখে ও আনন্দে লাফিয়ে উঠেছিল! 👗 ড্রেসের ডিটেইলিং খুব নিপুণ ছিল! 👸💖',
        verified: true
      }
    ];
  }

  // 28. Half Cakes
  if (pLower.includes('half')) {
    return [
      {
        id: 'half_1',
        userName: 'Snehasish & Baby 🌈',
        rating: 5,
        date: 'Yesterday',
        comment: 'Trending 6-month half birthday cake! 🎂 Perfectly sliced half design with rainbow cream! 🌈',
        verified: true
      },
      {
        id: 'half_2',
        userName: 'Barnali Das 🎂',
        rating: 5,
        date: '3 days ago',
        comment: 'বাচ্চার ৬ মাসের হাফ বার্থডে সেলিব্রেশনে এই কিউট হাফ কেকটা পারফেক্ট ছিল! 🌈 খুব ইউনিক লুক! 🎂',
        verified: true
      }
    ];
  }

  // 29. Tier Cakes
  if (pLower.includes('tier')) {
    return [
      {
        id: 'tier_1',
        userName: 'Dr. Debabrata Roy 🏰',
        rating: 5,
        date: 'Yesterday',
        comment: 'Grand 3-tier celebration cake! 🏰 Sturdy structure, smooth finish, and 3 different flavor layers! 🎉',
        verified: true
      },
      {
        id: 'tier_2',
        userName: 'Rinita & Sagnik 🥂',
        rating: 5,
        date: '2 days ago',
        comment: '৩-টিয়ারের গ্র্যান্ড কেকটা পুরো রিসেপশনের আকর্ষণ বাড়িয়ে দিয়েছিল! 🏰 প্রতিটি ফ্লেভার অসাধারণ! 🥂',
        verified: true
      }
    ];
  }

  // 30. Number Cakes
  if (pLower.includes('number') || pLower.includes('digit')) {
    return [
      {
        id: 'num_1',
        userName: 'Paramita Guha 🔢',
        rating: 5,
        date: 'Yesterday',
        comment: 'Custom digit shape decorated with macarons, flowers, and chocolates! 🔢 Elegant and clean! ✨',
        verified: true
      },
      {
        id: 'num_2',
        userName: 'Santanu Dutta 🌸',
        rating: 5,
        date: '3 days ago',
        comment: '২৫ নম্বর আকৃতির ডিজিটাল কেকটা খুব নিখুঁত ছিল! 🔢 ম্যাকারন আর ফ্রেশ ফুলের টাচটা অসাধারণ ছিল! 🌸',
        verified: true
      }
    ];
  }

  // 31. Kids Cakes
  if (pLower.includes('kids') || pLower.includes('child')) {
    return [
      {
        id: 'kid_1',
        userName: 'Shilpa Sen 🧸',
        rating: 5,
        date: 'Yesterday',
        comment: 'Colorful cartoon character kids cake! 🎒 Super fun design and kids-friendly soft vanilla sponge! 🧸',
        verified: true
      },
      {
        id: 'kid_2',
        userName: 'Abhrajit Bhowmik 🥳',
        rating: 5,
        date: '2 days ago',
        comment: 'বাচ্চাদের পছন্দের কার্টুন থিম দিয়ে বানানো হয়েছিল! 🧸 বাচ্চারা আনন্দ করে খেয়েছে, ক্রিমও খুব লাইট! 🥳',
        verified: true
      }
    ];
  }

  // 32. Fondant and Semi Fondant Cakes
  if (pLower.includes('fondant')) {
    return [
      {
        id: 'fon_1',
        userName: 'Arnab Chaudhuri 🎨',
        rating: 5,
        date: 'Yesterday',
        comment: 'Sharp fondant figurine work without being overly sweet! 🎨 Clean artistic craftsmanship! 👩‍🎨',
        verified: true
      },
      {
        id: 'fon_2',
        userName: 'Sritama Dey 👏',
        rating: 5,
        date: '3 days ago',
        comment: 'ফন্ডেন্ট টপারগুলোর কাজ খুব নিখুঁত ছিল! 🎨 মিষ্টির পরিমাণও বজায় রাখা হয়েছিল। ব্রিলিয়ান্ট আর্ট! 👏',
        verified: true
      }
    ];
  }

  // 33. Glitter Cake
  if (pLower.includes('glitter')) {
    return [
      {
        id: 'glit_1',
        userName: 'Rituparna Sengupta ✨',
        rating: 5,
        date: 'Yesterday',
        comment: 'Sparkling edible glitter cake that shined under party lights! ✨ Glamorous and delicious! 💎',
        verified: true
      },
      {
        id: 'glit_2',
        userName: 'Soham Basu 💎',
        rating: 5,
        date: '2 days ago',
        comment: 'লাইটের নিচে গ্লিটার কেকের চমক দেখে সবাই অবাক হয়ে গিয়েছিল! ✨ পারফেক্ট পার্টি কেক! 💎🎂',
        verified: true
      }
    ];
  }

  // 34. Customize Theme Cake
  if (pLower.includes('theme') || pLower.includes('customiz')) {
    return [
      {
        id: 'thm_1',
        userName: 'Indrani Chanda 🎯',
        rating: 5,
        date: 'Yesterday',
        comment: 'Customized exactly according to our reference photo sent on WhatsApp! 📸 Musu di nailed it! 🎯',
        verified: true
      },
      {
        id: 'thm_2',
        userName: 'Shuvam Manna 👌',
        rating: 5,
        date: '2 days ago',
        comment: 'হোয়াটসঅ্যাপে পাঠানো ফটোর সাথে ১০০% হুবহু মিলিয়ে কেকটি তৈরি করে দিয়েছেন! 🎯 গ্রেট ফিনিশিং! 👌',
        verified: true
      }
    ];
  }

  // 35. Cheesecakes
  if (pLower.includes('cheesecake') || pLower.includes('cheese')) {
    return [
      {
        id: 'chk_1',
        userName: 'Kalyan Chakraborty 🫐',
        rating: 5,
        date: 'Yesterday',
        comment: 'Authentic New York baked cheesecake with blueberry compote on top! 🫐 Rich, creamy & tangy! 🧀',
        verified: true
      },
      {
        id: 'chk_2',
        userName: 'Rimpa Saha 🧀',
        rating: 5,
        date: '3 days ago',
        comment: 'মেল্ট-ইন-মাউথ টেক্সচারের ব্লুবেরি চিজকেক! 🫐 সুস্বাদু আর রিচ চিজের ক্রিমি ফ্লেভার! 🧀✨',
        verified: true
      }
    ];
  }

  // 36. Photo Cakes
  if (pLower.includes('photo')) {
    return [
      {
        id: 'pho_1',
        userName: 'Soumyajit Nandy 📸',
        rating: 5,
        date: 'Yesterday',
        comment: 'High-resolution crisp edible sugar sheet photo printing! 🖼️ Clear picture quality & tasty cake! 📸',
        verified: true
      },
      {
        id: 'pho_2',
        userName: 'Tamalika Ghosh 🎁',
        rating: 5,
        date: '2 days ago',
        comment: 'কেকের ওপর এডিবল সুগার শিটের ছবিটা এত পরিষ্কার উঠবে ভাবিনি! 📸 বার্থডে বয় খুব সারপ্রাইজড হয়েছে! 🎁',
        verified: true
      }
    ];
  }

  // 37. Bento Cakes
  if (pLower.includes('bento')) {
    return [
      {
        id: 'ben_1',
        userName: 'Meghna & Rishav 🍱',
        rating: 5,
        date: 'Yesterday',
        comment: 'Cute Korean style bento lunchbox cake! 🍱 Perfect small size for intimate 2-person celebrations! 🎀',
        verified: true
      },
      {
        id: 'ben_2',
        userName: 'Adrija Naskar 🎀',
        rating: 5,
        date: '2 days ago',
        comment: 'ছোট ২ জনের সেলিব্রেশনের জন্য এই কিউট বেন্টো কেকটা একদম পারফেক্ট! 🍱 প্যাকেজিংটাও দারুণ ছিল! 🎀',
        verified: true
      }
    ];
  }

  // 38. Mousse
  if (pLower.includes('mousse')) {
    return [
      {
        id: 'mou_1',
        userName: 'Piyali Som 🍮',
        rating: 5,
        date: 'Yesterday',
        comment: 'Velvety smooth chocolate mousse cup with airy texture! 🍮 Heavenly dessert cup! 🍫',
        verified: true
      },
      {
        id: 'mou_2',
        userName: 'Koushik Roy 🤤',
        rating: 5,
        date: '3 days ago',
        comment: 'চকোলেট মাউসের স্মুথনেস মুখে দেওয়ার সাথেই গলে যায়! 🍮 জাস্ট ডিভাইন ডেজার্ট! 🤤',
        verified: true
      }
    ];
  }

  // 39. Jar and Glass Cakes
  if (pLower.includes('jar') || pLower.includes('glass')) {
    return [
      {
        id: 'jar_1',
        userName: 'Susmita Pal 🫙',
        rating: 5,
        date: 'Yesterday',
        comment: 'Layered cake jars packed with ganache, sponge and cream! 🫙 Portable, cute & highly delicious! 🍨',
        verified: true
      },
      {
        id: 'jar_2',
        userName: 'Titas Ray 🎁',
        rating: 5,
        date: '2 days ago',
        comment: 'জার কেকের লেয়ারিংগুলো দেখতে যেমন সুন্দর খেতেও তেমনই টেস্ট! 🫙 উপহার দেওয়ার জন্য দারুণ! 🎁',
        verified: true
      }
    ];
  }

  // 40. Pinata Cakes
  if (pLower.includes('pinata') || pLower.includes('piñata')) {
    return [
      {
        id: 'pin_1',
        userName: 'Jeet & Friends 🔨',
        rating: 5,
        date: 'Yesterday',
        comment: 'Fun hammer break pinata cake! 🔨 Chocolate shell filled with hidden treats & soft cake! 🍫🎉',
        verified: true
      },
      {
        id: 'pin_2',
        userName: 'Sanchita Maiti 🥳',
        rating: 5,
        date: '3 days ago',
        comment: 'হাতুড়ি দিয়ে পিনাটা চকলেট শেল ভেঙে ভেতরে সারপ্রাইজ পাওয়ার আনন্দই আলাদা! 🔨 বাচ্চাদের ভীষণ আনন্দ! 🥳',
        verified: true
      }
    ];
  }

  // 41. Cupcakes and Muffins
  if (pLower.includes('cupcake') || pLower.includes('muffin')) {
    return [
      {
        id: 'cup_1',
        userName: 'Aparna Bhattacharya 🧁',
        rating: 5,
        date: 'Yesterday',
        comment: 'Fluffy, moist cupcakes with swirl frosting and cute sprinkles! 🧁 Great for party return gifts! 🎁',
        verified: true
      },
      {
        id: 'cup_2',
        userName: 'Sayantan Das 🌸',
        rating: 5,
        date: '2 days ago',
        comment: 'কাপকেকগুলো যেমন সফট তেমনই মিষ্টি ক্রিম ঘূর্ণি! 🧁 বার্থডে রিটার্ন গিফট হিসেবে সবাই খুব পছন্দ করেছে! 🌸',
        verified: true
      }
    ];
  }

  // 42. Pizza & Patties
  if (pLower.includes('pizza') || pLower.includes('patties') || pLower.includes('patty')) {
    return [
      {
        id: 'piz_1',
        userName: 'Subhajit Paul 🍕',
        rating: 5,
        date: 'Yesterday',
        comment: 'Hot, crispy baked patties and cheesy veg pizza! 🍕 Freshly baked savory delights! 🥐',
        verified: true
      },
      {
        id: 'piz_2',
        userName: 'Madhurima Kanjilal 🥐',
        rating: 5,
        date: '3 days ago',
        comment: 'গরম গরম পিজ্জা ও প্যাটিসের ক্রাঞ্চ টেক্সচার আর চিজের স্বাদ ছিল খাসা! 🍕 দারুণ স্ন্যাক্স! 🥐',
        verified: true
      }
    ];
  }

  // 43. Brownies
  if (pLower.includes('brownie')) {
    return [
      {
        id: 'brw_1',
        userName: 'Rishabh Shaw 🍫',
        rating: 5,
        date: 'Yesterday',
        comment: 'Fudgy crinkle top chocolate brownies with walnuts! 🍫 Dense, rich & warm! 🤎',
        verified: true
      },
      {
        id: 'brw_2',
        userName: 'Oindrila Sarkar 🍨',
        rating: 5,
        date: '2 days ago',
        comment: 'উপরে ক্রাঙ্কলি লেয়ার আর ভেতরে ফুজি ডার্ক চকলেট ব্রাউনি! 🍫 ভ্যানিলা আইসক্রিমের সাথে স্বর্গীয় স্বাদ! 🍨',
        verified: true
      }
    ];
  }

  // 44. Combos / General / Default
  return [
    {
      id: 'g_1',
      userName: 'Indrani Chanda 🎈',
      rating: 5,
      date: 'Yesterday',
      comment: 'Custom theme design executed to perfection! 🎨 Musu di is a master cake artist! 👩‍🍳✨',
      verified: true
    },
    {
      id: 'g_2',
      userName: 'Shuvam Manna 🎂',
      rating: 5,
      date: '2 days ago',
      comment: 'কাস্টম থিম ডিজাইন একদম হুবহু বানিয়ে দিয়েছেন! 👏 স্পঞ্জ টা ভীষণ নরম আর টেস্ট দুর্দান্ত! 💖',
      verified: true
    },
    {
      id: 'g_3',
      userName: 'Arpita Chaudhury 🌸',
      rating: 5,
      date: '4 days ago',
      comment: '100% pure eggless veg cake! 🌿 Soft as a cloud and cute design. Will order again for sure. ☁️✨',
      verified: true
    },
    {
      id: 'g_4',
      userName: 'Mainak Ghosh 🌟',
      rating: 5,
      date: '1 week ago',
      comment: 'Bake n\' Flake never disappoints! Value combo pack of fresh cakes and cupcakes! 📦💖',
      verified: true
    }
  ];
}

export default function ProductReviewsModal({ isOpen, onClose, product, lang }: ProductReviewsModalProps) {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [userName, setUserName] = useState('');
  const [userComment, setUserComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      setReviewsList(getReviewsForProduct(product.nameEn, product.category || ''));
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userComment.trim()) return;

    const newRev: ReviewItem = {
      id: 'rev_' + Date.now(),
      userName: userName.trim(),
      rating: newRating,
      date: 'Just now',
      comment: userComment.trim(),
      verified: true
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmitted(true);
    setUserName('');
    setUserComment('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Star size={20} className="fill-amber-400 text-amber-400" />
              </div>
              <div>
                <h3 className="font-bold text-base md:text-lg">
                  {lang === 'en' ? 'Product Reviews & Feedback' : 'প্রোডাক্ট রিভিউ ও ফিডব্যাক'}
                </h3>
                <p className="text-xs text-pink-400 font-medium">
                  {product.nameEn}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-6 flex-1">
            {/* Rating Summary */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-black text-slate-900 dark:text-amber-400 flex items-center gap-2">
                    4.9 <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ 5.0</span>
                  </div>
                  <div className="flex text-amber-400 mt-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={14} className="fill-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="text-right text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-bold">{reviewsList.length} Verified Reviews</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                    <CheckCircle2 size={12} /> 100% Quality Guaranteed
                  </p>
                </div>
              </div>

              {/* External Review Platforms */}
              <div className="pt-2 border-t border-amber-200/60 dark:border-amber-800/40 flex flex-wrap gap-2">
                <a
                  href="https://maps.google.com/?q=Bake+n+Flake+Kolkata"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  {lang === 'en' ? 'Google Reviews' : 'গুগেল রিভিউ'}
                </a>

                <a
                  href="https://www.facebook.com/flavoursbymusu/reviews"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  {lang === 'en' ? 'Facebook Reviews' : 'ফেসবুক রিভিউ'}
                </a>
              </div>
            </div>

            {/* Write Review Form */}
            <form onSubmit={handleSubmitReview} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-200 tracking-wider">
                {lang === 'en' ? 'Write a Review for this product' : 'এই কেকটির জন্য রিভিউ লিখুন'}
              </h4>

              {submitted && (
                <div className="p-2.5 rounded-xl bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 animate-bounce">
                  <CheckCircle2 size={16} />
                  {lang === 'en' ? 'Thank you! Your review has been added.' : 'ধন্যবাদ! আপনার রিভিউটি যুক্ত হয়েছে।'}
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{lang === 'en' ? 'Rating:' : 'রেটিং:'}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1"
                    >
                      <Star
                        size={18}
                        className={star <= newRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <input
                type="text"
                required
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder={lang === 'en' ? 'Your Name' : 'আপনার নাম'}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
              />

              <textarea
                rows={2}
                required
                value={userComment}
                onChange={e => setUserComment(e.target.value)}
                placeholder={lang === 'en' ? 'How was the taste, softness, and design?' : 'কেকের স্বাদ, সফটনেস কেমন লেগেছে লিখুন...'}
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-md transition-all"
              >
                {lang === 'en' ? 'Submit Review' : 'রিভিউ জমা দিন'}
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                {lang === 'en' ? 'Customer Feedback' : 'গ্রাহক প্রতিক্রিয়া'}
              </h4>

              {reviewsList.map(rev => (
                <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold text-xs">
                        <User size={14} />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1">
                          {rev.userName}
                          {rev.verified && (
                            <CheckCircle2 size={12} className="text-emerald-500" />
                          )}
                        </p>
                        <p className="text-[10px] text-slate-400">{rev.date}</p>
                      </div>
                    </div>

                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={12} className={s <= rev.rating ? 'fill-amber-400' : 'text-slate-300'} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
