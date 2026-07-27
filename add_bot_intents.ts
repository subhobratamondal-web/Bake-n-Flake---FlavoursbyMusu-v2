import fs from 'fs';

const inputData = `
📍 Location & Timing (অবস্থান এবং সময়)
1. Input: location, address, map, দোকান কোথায়, ঠিকানা, কীভাবে যাব
Output: [🖼️ Image Pop-up: Map_Location.jpg] আমরা কলকাতার কমলগাজীতে (৭০০০১০৩) অবস্থিত। ম্যাপ দেখুন: 📍 Google Maps
2. Input: open today, timing, খোলার সময়, কখন খোলেন, দোকান কি খোলা
Output: আমরা প্রতিদিন সকাল থেকে রাত পর্যন্ত কাজ করি। প্রি-অর্ডারের জন্য আসার আগে আমাদের WhatsApp-এ মেসেজ করে নিন।
3. Input: sunday open, holiday, রবিবার খোলা, ছুটির দিনে খোলা থাকে
Output: হ্যাঁ, আমরা রবিবার এবং ছুটির দিনগুলোতেও খোলা থাকি। বিশেষ দিনের অর্ডারের জন্য আগে থেকে বুকিং করা ভালো।
4. Input: near sonarpur, narendrapur, সোনারপুরের কাছে, কমলগাজীর কোথায়
Output: [🖼️ Image Pop-up: Store_Front.jpg] আমাদের লোকেশন কমলগাজী, নরেন্দ্রপুর ও সোনারপুরের খুব কাছেই। লোকেশন লিঙ্ক: 📍 Google Maps
5. Input: seating area, dine in, বসে খাওয়া যাবে, স্টোর ভিজিট
Output: আমরা মূলত প্রি-অর্ডারের ভিত্তিতে কাজ করি। আমাদের লোকেশনে আসার আগে অনুগ্রহ করে কল করে নিন: 📞 +91 00000 00000।

📞 Contact & Social Media (যোগাযোগ)
6. Input: phone, contact number, কল, ফোন নম্বর, কথা বলতে চাই
Output: যেকোনো অর্ডারের জন্য বা কথা বলতে আমাদের কল করুন: 📞 +91 00000 00000।
7. Input: whatsapp number, চ্যাট, হোয়াটসঅ্যাপ নম্বর দিন
Output: [🖼️ Image Pop-up: WhatsApp_Icon.jpg] আমাদের সাথে সরাসরি চ্যাট করতে এখানে ক্লিক করুন: 💬 WhatsApp Us
8. Input: facebook, page link, ফেসবুক পেজ, কাজের ছবি
Output: [🖼️ Image Pop-up: Facebook_Page.jpg] আমাদের দারুণ সব কেকের ডিজাইন দেখতে পেজটি ফলো করুন: 📱 Flavours by Musu
9. Input: youtube, video, ইউটিউব, কেক বানানোর ভিডিও
Output: [🖼️ Image Pop-up: YouTube_Channel.jpg] আমাদের কেক ডেকোরেশনের ভিডিও দেখতে ইউটিউবে আসুন: 🎥 Watch on YouTube
10. Input: owner, musu, বেকারির মালিক, মুসু কে, কে বানায়
Output: [🖼️ Image Pop-up: Baker_Musu.jpg] আমাদের প্রতিটি কেক প্রধান বেকার 'Musu'-এর নিজের হাতে অতি যত্নে তৈরি।
11. Input: instagram, insta, ইনস্টাগ্রাম পেজ
Output: আমাদের লেটেস্ট আপডেট পেতে আমাদের ফেসবুক ও ইনস্টাগ্রামে যুক্ত থাকুন: 📱 Flavours by Musu
12. Input: customer care, support, হেল্পলাইন, কাস্টমার সাপোর্ট
Output: যেকোনো সাপোর্টের জন্য আমাদের মেসেঞ্জারে জানান: 💬 Message Support
13. Input: talk to owner, ওনারের সাথে কথা বলব
Output: সরাসরি কথা বলতে আমাদের অফিশিয়াল নম্বরে কল করুন: 📞 +91 00000 00000।
14. Input: social media links, সোশ্যাল মিডিয়া লিঙ্ক
Output: আমাদের সাথে যুক্ত থাকুন: Facebook | WhatsApp
15. Input: messenger, মেসেঞ্জার লিঙ্ক
Output: আমাদের মেসেঞ্জারে ইনবক্স করুন: 💬 Messenger Link

🎂 Signature Cakes & Flavors (মেনু এবং ফ্লেভার)
16. Input: menu, cake list, কী কী কেক আছে, মেনু দিন
Output: [🖼️ Image Pop-up: Signature_Menu.jpg] আমাদের আছে চকোলেট ট্রাফল, বাটারস্কচ, ভ্যানিলা, পাইনঅ্যাপল, ম্যাংগো, স্ট্রবেরি এবং রেড ভেলভেট কেক।
17. Input: chocolate cake, truffle, চকোলেট কেক, ট্রাফল হবে
Output: [🖼️ Image Pop-up: Chocolate_Truffle.jpg] হ্যাঁ! আমাদের চকোলেট ট্রাফল কেকটি চকোলেট প্রেমীদের জন্য বেস্ট সেলার।
18. Input: fruit cake, fresh fruit, ফলের কেক, ফ্রেশ ফ্রুট কেক
Output: [🖼️ Image Pop-up: Fresh_Fruit_Cake.jpg] হ্যাঁ, আমরা প্রিমিয়াম সিজনাল তাজা ফল দিয়ে দারুণ স্বাদের ফ্রেশ ফ্রুট কেক তৈরি করি।
19. Input: mango cake, pineapple, ম্যাংগো কেক, পাইনঅ্যাপল চাই
Output: হ্যাঁ, আমাদের মেনুতে ম্যাংগো এবং পাইনঅ্যাপল কেক অত্যন্ত জনপ্রিয়।
20. Input: butterscotch, বাটারস্কচ কেক
Output: [🖼️ Image Pop-up: Butterscotch_Cake.jpg] আমাদের বাটারস্কচ কেক আসল মাখন এবং ক্যারামেল ক্রাঞ্চ দিয়ে তৈরি!
21. Input: red velvet, রেড ভেলভেট কেক
Output: হ্যাঁ, আসল ক্রিম চিজ ফ্রস্টিং দিয়ে তৈরি প্রিমিয়াম রেড ভেলভেট কেক আমাদের স্পেশালিটি।
22. Input: coffee cake, mocha, কফি কেক, মোকা হবে
Output: হ্যাঁ, কফি লাভারদের জন্য আমাদের রিচ কফি মোকা (Coffee Mocha) কেক রয়েছে।
23. Input: oreo cake, kitkat, ওরিও কেক, কিটক্যাট বানান
Output: [🖼️ Image Pop-up: Oreo_Kitkat.jpg] হ্যাঁ, বাচ্চাদের প্রিয় ওরিও এবং কিটক্যাট কেক আমাদের মেনুতে আছে।
24. Input: strawberry cake, স্ট্রবেরি কেক
Output: হ্যাঁ, তাজা স্ট্রবেরি ক্রাশ দিয়ে তৈরি আমাদের স্ট্রবেরি কেক পাওয়া যায়।
25. Input: orange cake, অরেঞ্জ কেক
Output: হ্যাঁ, ফ্রেশ অরেঞ্জ ফ্লেভারের কেক আমাদের সিগনেচার আইটেমগুলোর একটি।
26. Input: vanilla cake, ভ্যানিলা কেক
Output: ক্লাসিক ভ্যানিলা স্পঞ্জ কেক যেকোনো ডিজাইনের সাথেই অর্ডার করা যায়।
27. Input: rasmalai cake, fusion, রসমলাই কেক, দেশি ফ্লেভার
Output: [🖼️ Image Pop-up: Rasmalai_Cake.jpg] হ্যাঁ, ফিউশন স্বাদের রসমলাই কেক আমাদের অত্যন্ত ডিমান্ডিং একটি আইটেম!
28. Input: best seller, popular, সবচেয়ে ভালো কেক, বেস্ট সেলার
Output: আমাদের বেস্ট সেলার হলো চকোলেট ট্রাফল, বাটারস্কচ এবং রসমলাই কেক।
29. Input: new flavors, নতুন কী কেক আছে
Output: লেটেস্ট ফ্লেভার জানতে আমাদের WhatsApp-এ মেসেজ করুন।
30. Input: alcohol cake, অ্যালকোহল কেক
Output: হ্যাঁ, প্রাপ্তবয়স্কদের পার্টির জন্য অ্যালকোহল-বেসড স্পেশাল কেক আমরা বানাই।

🌳 Exotic & Forest Range (ফরেস্ট রেঞ্জ)
31. Input: black forest, ব্ল্যাক ফরেস্ট কেক
Output: [🖼️ Image Pop-up: Black_Forest.jpg] হ্যাঁ, আমাদের "ফরেস্ট রেঞ্জ"-এ ক্লাসিক ব্ল্যাক ফরেস্ট কেক রয়েছে।
32. Input: white forest, হোয়াইট ফরেস্ট কেক
Output: হ্যাঁ, হোয়াইট চকোলেট শেভিংস দিয়ে তৈরি হোয়াইট ফরেস্ট কেকও আমাদের কাছে পাবেন।
33. Input: forest range, ফরেস্ট কেক আছে
Output: আমাদের সম্পূর্ণ ফরেস্ট রেঞ্জে ব্ল্যাক ফরেস্ট এবং হোয়াইট ফরেস্ট কেক উপলব্ধ।
34. Input: authentic black forest, আসল ব্ল্যাক ফরেস্ট
Output: আমরা চেরি এবং ডার্ক চকোলেট দিয়ে একদম অথেনটিক ব্ল্যাক ফরেস্ট কেক বানাই।
35. Input: cherry cake, চেরি দেওয়া কেক
Output: আমাদের ফরেস্ট রেঞ্জের কেকগুলোতে প্রিমিয়াম চেরি ব্যবহার করা হয়।

🎨 Customization & Themes (থিম এবং ডিজাইন)
36. Input: custom cake, theme cake, কাস্টম কেক, থিম কেক হবে, পছন্দমতো ডিজাইন
Output: [🖼️ Image Pop-up: Custom_Theme.jpg] হ্যাঁ, আমরা কাস্টম থিম কেক বানাই। আপনার ডিজাইনটি Messenger-এ পাঠান।
37. Input: photo cake, picture on cake, ফটো কেক, ছবি প্রিন্ট করা যাবে
Output: [🖼️ Image Pop-up: Photo_Cake.jpg] একদম! আমরা ১০০% খাওয়ার যোগ্য সুগার পেপার দিয়ে কেকের ওপর ছবি প্রিন্ট করি।
38. Input: fondant cake, 3d cake, ফনডেন্ট কেক, থ্রিডি ডিজাইন
Output: হ্যাঁ, আমরা ফুল ফনডেন্ট এবং সেমি-ফনডেন্ট দুধরনের থ্রিডি ডিজাইনের কেকই তৈরি করি।
39. Input: pinata cake, smash, পিনাটা কেক, হাতুড়ি দিয়ে ভাঙা
Output: [🖼️ Image Pop-up: Pinata_Cake.jpg] হ্যাঁ! আমাদের পিনাটা কেকের সাথে একটি কাঠের কিউট হাতুড়িও দেওয়া হয়।
40. Input: doll cake, barbie, ডল কেক, বার্বি কেক
Output: [🖼️ Image Pop-up: Doll_Cake.jpg] হ্যাঁ, বাচ্চাদের জন্মদিনের জন্য আমরা চমৎকার বার্বি ডল কেক বানাই।
41. Input: bento cake, mini cake, বেন্টো কেক, ছোট কেক
Output: [🖼️ Image Pop-up: Bento_Cake.jpg] ১-২ জনের জন্য উপযুক্ত ট্রেন্ডি কোরিয়ান স্টাইলের বেন্টো কেক আমরা তৈরি করি।
42. Input: half cake, 6 month, হাফ কেক, ৬ মাসের বার্থডে
Output: হ্যাঁ, শিশুদের হাফ ইয়ার (৬ মাস) জন্মদিনের জন্য আমাদের হাফ কেক অত্যন্ত জনপ্রিয়।
43. Input: fresh flower cake, ফুল দিয়ে সাজানো কেক
Output: [🖼️ Image Pop-up: Flower_Cake.jpg] হ্যাঁ, আসল তাজা ফুল দিয়ে সাজানো দারুণ সুন্দর কেক আমরা বানাই।
44. Input: glitter cake, গ্লিটার কেক
Output: হ্যাঁ, আমরা ১০০% খাওয়ার যোগ্য গ্লিটার ব্যবহার করে চকচকে গ্লিটার কেক তৈরি করি।
45. Input: number cake, letter cake, নাম্বার কেক, অ্যালফাবেট কেক
Output: হ্যাঁ, বয়স বা নামের আদ্যক্ষর অনুযায়ী আমরা নম্বর বা লেটার কেক কাটিং করি।
46. Input: pubg cake, free fire, পাবজি কেক, গেমিং থিম
Output: হ্যাঁ, গেমারদের জন্য আমরা পাবজি বা ফ্রি ফায়ার থিমের কাস্টম কেক বানাই।
47. Input: makeup cake, মেকআপ থিম কেক
Output: হ্যাঁ, ভোজ্য ফনডেন্ট দিয়ে আমরা সুন্দর মেকআপ কিট থিম কেক তৈরি করি।
48. Input: cricket cake, football, ক্রিকেট থিম, স্পোর্টস কেক
Output: হ্যাঁ, ক্রীড়াপ্রেমীদের জন্য আমরা ক্রিকেট স্টেডিয়াম বা ফুটবল থিমের কেক ডিজাইন করি।
49. Input: cartoon cake, doraemon, কার্টুন কেক, ডোরেমন
Output: হ্যাঁ, বাচ্চাদের প্রিয় ডোরেমন, শিনচ্যান বা পেপ্পা পিগ থিমের কেক আমরা বানাই।
50. Input: 2 tier cake, wedding cake, দোতলা কেক, বিয়ের কেক
Output: [🖼️ Image Pop-up: Tier_Cake.jpg] হ্যাঁ, বিয়ে বা বড় অনুষ্ঠানের জন্য আমরা আকর্ষণীয় মাল্টি-টিয়ার কেক ডিজাইন করি।
51. Input: marble cake, মার্বেল ডিজাইনের কেক
Output: হ্যাঁ, ফনডেন্ট কালার মিক্স করে আমরা লাক্সারি মার্বেল ফিনিশ কেক তৈরি করি।
52. Input: drip cake, ড্রিপ কেক
Output: হ্যাঁ, চকোলেট গ্যানাশ ড্রিপ দেওয়া দারুণ ডিজাইনের কেক আমরা বানাই।
53. Input: vintage cake, retro, ভিন্টেজ পাইপিং কেক
Output: হ্যাঁ, রেট্রো বা ভিন্টেজ পাইপিং স্টাইলের কেক আমাদের প্রিমিয়াম মেনুতে আছে।
54. Input: same design, হুবহু বানাতে পারবেন
Output: আমরা আপনার দেওয়া ছবির ৯৫-১০০% হুবহু ডিজাইন মেলানোর সর্বোচ্চ চেষ্টা করি!
55. Input: change color, কালার চেঞ্জ করা যাবে
Output: হ্যাঁ, আপনি আপনার পছন্দমতো ক্রিমের কালার কাস্টমাইজ করতে পারবেন।
56. Input: edible lace, লেস ডিজাইন
Output: হ্যাঁ, প্রিমিয়াম কেকের জন্য আমরা ভোজ্য সুগার লেস (Edible Lace) তৈরি করি।
57. Input: mirror glaze, মিরর গ্লেজ কেক
Output: হ্যাঁ, স্পেশাল রিকোয়েস্টে আমরা হাই-গ্লস মিরর গ্লেজ কেক তৈরি করে থাকি।
58. Input: neon text, গ্লোয়িং লেখা
Output: হ্যাঁ, সেফ ফুড জেল ব্যবহার করে আমরা কেকের ওপর নিয়ন ইলিউশন টেক্সট লিখতে পারি।
59. Input: chocolate shards, চকোলেট গার্নিশ
Output: হ্যাঁ, কেক সাজানোর জন্য মুসু নিজের হাতে চকোলেট শার্ডস ও গার্নিশ তৈরি করেন।
60. Input: minimal cake, aesthetic, মিনিমাল কেক, সিম্পল ডিজাইন
Output: হ্যাঁ, ক্লিন এবং মিনিমালিস্ট প্যাস্টেল কেক আমাদের মেনুতে খুব জনপ্রিয়।

🛒 Ordering & Booking (অর্ডার এবং বুকিং)
61. Input: how to order, অর্ডার করব কীভাবে, অর্ডার করার নিয়ম
Output: অর্ডার করতে আপনার নাম, ফোন নম্বর ও কেকের ছবি দিয়ে আমাদের মেসেজ করুন: 💬 Order via WhatsApp
62. Input: advance notice, days before, কত দিন আগে অর্ডার দেব
Output: সাধারণ কেকের জন্য ২৪ ঘণ্টা এবং কাস্টম কেকের জন্য ২-৩ দিন আগে অর্ডার দেওয়া ভালো।
63. Input: same day delivery, today, আজ অর্ডার দিলে আজই পাব
Output: সময় ও স্লট ফাঁকা থাকলে আমরা সাধারণ ফ্লেভারের 'Same Day' অর্ডার নিই। দ্রুত 📞 কল করুন।
64. Input: online order, form, অনলাইনে অর্ডার, ফর্ম
Output: আমাদের অর্ডার ফর্মে ডেটা সাবমিট করতে পারেন, অথবা সরাসরি WhatsApp-এ মেসেজ করতে পারেন।
65. Input: corporate order, bulk order, কর্পোরেট অর্ডার, অনেকগুলো কেক লাগবে
Output: [🖼️ Image Pop-up: Bulk_Orders.jpg] হ্যাঁ, আমরা অফিস পার্টি বা কর্পোরেট ইভেন্টের জন্য বাল্ক অর্ডার গ্রহণ করি।
66. Input: cancel order, অর্ডার ক্যানসেল করা যাবে
Output: কেক তৈরির কাজ শুরু হওয়ার আগে জানালে ক্যানসেল বা পরিবর্তন করা সম্ভব।
67. Input: change design, ডিজাইন চেঞ্জ করা যাবে
Output: ডিজাইন প্রসেস শুরু না হয়ে থাকলে Messenger-এ জানিয়ে পরিবর্তন করতে পারবেন।
68. Input: confirmation, বুকিং কনফার্ম করব কীভাবে
Output: অ্যাডভান্স পেমেন্ট করার পর আমরা হোয়াটসঅ্যাপে বুকিং কনফার্মেশন রসিদ পাঠিয়ে দিই।
69. Input: wrong phone number, ভুল নম্বর দিয়েছি
Output: কোনো ভুল হলে দ্রুত আমাদের Messenger-এ সঠিক তথ্যটি পাঠিয়ে দিন।
70. Input: order delay, রেসপন্স পাচ্ছি না
Output: ফর্ম সাবমিট করার ১-২ ঘণ্টার মধ্যে আমাদের টিম আপনাকে কল করে কনফার্ম করবে।
71. Input: reorder, আবার অর্ডার করব
Output: আগের কেকটি আবার চাইলে সেটির ছবি আমাদের WhatsApp-এ পাঠিয়ে দিন!
72. Input: order for friend, বন্ধুর জন্য অর্ডার
Output: হ্যাঁ, আপনি যেকোনো জায়গা থেকে পেমেন্ট করে বন্ধুর ঠিকানায় সারপ্রাইজ পাঠাতে পারেন।
73. Input: postpone order, তারিখ পেছানো যাবে
Output: ডেলিভারির অন্তত ৪৮ ঘণ্টা আগে জানালে অর্ডারের তারিখ পেছানো সম্ভব।
74. Input: add message, কেকের ওপর লেখা
Output: অবশ্যই! কেকের ওপর আপনার দেওয়া যেকোনো মেসেজ বা নাম আমরা সুন্দর করে লিখে দিই।
75. Input: long message, বড় চিঠি লিখতে চাই
Output: জায়গা সীমিত, তবে আমরা ভোজ্য সুগার শিটে একটি ছোট চিঠি বা প্যারাগ্রাফ লিখে দিতে পারি।

🚚 Delivery & Pickup (ডেলিভারি এবং পিক-আপ)
76. Input: home delivery, হোম ডেলিভারি করেন, ডেলিভারি দেন
Output: [🖼️ Image Pop-up: Delivery.jpg] হ্যাঁ, আমরা কমলগাজী, নরেন্দ্রপুর, সোনারপুর এবং আশেপাশের এলাকায় হোম ডেলিভারি দিই।
77. Input: delivery charge, free delivery, ডেলিভারি চার্জ কত, ফ্রি ডেলিভারি
Output: লোকেশনের দূরত্বের ওপর ভিত্তি করে একটি সামান্য ডেলিভারি চার্জ নির্ধারণ করা হয়।
78. Input: store pickup, self pickup, নিজে গিয়ে আনতে পারব, স্টোর পিক-আপ
Output: হ্যাঁ, আপনি যেকোনো সময় আমাদের স্টোর থেকে সম্পূর্ণ বিনামূল্যে কেক পিক-আপ করতে পারেন।
79. Input: midnight delivery, 12 am, মাঝরাতে ডেলিভারি, রাত ১২ টায় সারপ্রাইজ
Output: [🖼️ Image Pop-up: Midnight_Surprise.jpg] হ্যাঁ! আগে থেকে বুকিং করলে আমরা মাঝরাতে সারপ্রাইজ ডেলিভারি দিয়ে থাকি।
80. Input: cake damage, safely deliver, রাস্তায় কেক ভেঙে যাবে না তো
Output: একদম না! কেকগুলো স্বাস্থ্যসম্মত ও মজবুত বক্সে প্যাক করা হয় যাতে নিখুঁত অবস্থায় পৌঁছায়।
81. Input: sonarpur delivery, narendrapur, সোনারপুরে ডেলিভারি হবে, নরেন্দ্রপুরে
Output: হ্যাঁ, সোনারপুর, নরেন্দ্রপুর এবং আশেপাশের এলাকায় আমরা নিয়মিত ডেলিভারি করি।
82. Input: rain delivery, weather, বৃষ্টি হলে ডেলিভারি দেবেন
Output: চরম আবহাওয়ায় ডেলিভারিতে কিছুটা দেরি হতে পারে, তবে আমরা ফোনে আপনার সাথে যোগাযোগ রাখব।
83. Input: banquet hall, restaurant delivery, ব্যাঙ্কোয়েট হলে ডেলিভারি
Output: হ্যাঁ, আমরা সরাসরি আপনার পার্টির ভেন্যু বা রেস্তোরাঁতেও ডেলিভারি করতে পারি।
84. Input: delivery time, ডেলিভারি কখন পাব
Output: অর্ডারের সময় আপনার পছন্দের টাইম স্লটটি আমাদের জানিয়ে দিন।
85. Input: contactless delivery, কন্ট্যাক্টলেস ডেলিভারি
Output: হ্যাঁ, অনলাইনে পেমেন্ট করলে আমরা কেকটি আপনার সিকিউরিটি গার্ডের কাছে নিরাপদে রেখে আসতে পারি।
86. Input: send own person, dunzo, porter, ডানজো, পোর্টার পাঠাব
Output: হ্যাঁ, আপনি নিজের ডেলিভারি পার্সন পাঠাতে পারেন, তবে তারা যেন সাবধানে কেকটি বহন করে।
87. Input: carry bag, ক্যারিব্যাগ দেবেন
Output: হ্যাঁ, সমস্ত কেক মজবুত বক্সে প্যাক করে সুবিধাজনক ক্যারিব্যাগে দেওয়া হয়।
88. Input: carry on bike, বাইকে করে নিয়ে যেতে পারব
Output: ছোট কেক বাইকে নেওয়া যায়, তবে দোতলা বা ভারী কেক গাড়ি বা অটোতে নেওয়ার পরামর্শ দিই।
89. Input: delivery update, ডেলিভারি কোথায়
Output: আপনার ডেলিভারি স্ট্যাটাস জানতে আমাদের 📞 +91 00000 00000 নম্বরে কল করুন।
90. Input: holiday delivery, durga puja, পূজায় ডেলিভারি হবে
Output: হ্যাঁ, উৎসবের দিনগুলোতেও ডেলিভারি হয়, তবে স্লট দ্রুত পূর্ণ হয়ে যায় বলে আগে বুকিং করা প্রয়োজন।

💳 Pricing & Payments (মূল্য এবং পেমেন্ট)
91. Input: cake price, cost, কেকের দাম কত, দাম কেমন
Output: ফ্লেভার এবং ডিজাইনের ওপর দাম নির্ভর করে। সঠিক দাম জানতে আপনার পছন্দের কেকের ছবিটি আমাদের WhatsApp-এ পাঠান।
92. Input: 1 pound price, ১ পাউন্ড কেকের দাম
Output: আমাদের বেসিক ১ পাউন্ড কেকের দাম অত্যন্ত সাশ্রয়ী। বিস্তারিত প্রাইস লিস্টের জন্য মেসেজ করুন।
93. Input: payment methods, পেমেন্ট কীভাবে করব
Output: আমরা UPI (GPay, PhonePe, Paytm), ব্যাঙ্ক ট্রান্সফার এবং ক্যাশ গ্রহণ করি।
94. Input: cod, cash on delivery, ক্যাশ অন ডেলিভারি হবে
Output: লোকেশনের ওপর ভিত্তি করে COD দেওয়া হয়। তবে কাস্টম কেকের জন্য আংশিক অগ্রিম পেমেন্ট আবশ্যক।
95. Input: upi, google pay, ইউপিআই আছে, গুগল পে করা যাবে
Output: হ্যাঁ, পেমেন্টের জন্য আমরা সমস্ত ইউপিআই (UPI) অ্যাপ সাপোর্ট করি।
96. Input: advance payment, অ্যাডভান্স দিতে হবে
Output: হ্যাঁ, কাস্টম অর্ডারের কনফার্মেশন নিশ্চিত করতে আংশিক অ্যাডভান্স পেমেন্ট করতে হয়।
97. Input: discount, offer, ডিসকাউন্ট আছে, অফার চলছে
Output: নিয়মিত ক্রেতা এবং বাল্ক অর্ডারের জন্য আমরা বিশেষ উৎসবের ছাড় দিয়ে থাকি!
98. Input: photo cake charge, ফটো কেকের এক্সট্রা চার্জ
Output: খাওয়ার যোগ্য ছবি প্রিন্ট করার জন্য কেকের মূল্যের সাথে সামান্য এক্সট্রা চার্জ যুক্ত হয়।
99. Input: split payment, 2 upi, পেমেন্ট ভাগ করে দেব
Output: হ্যাঁ, ডেলিভারির আগে সম্পূর্ণ টাকা পরিশোধ হওয়া পর্যন্ত আপনি পেমেন্ট ভাগ করে দিতে পারেন।
100. Input: refund, money back, টাকা ফেরত, রিফান্ড
Output: আমাদের তরফ থেকে অর্ডার ক্যানসেল হলে বা বৈধ কারণে ১০০% রিফান্ড সাথে সাথে প্রসেস করা হয়।

🌾 Dietary & Hygiene (উপাদান এবং স্বাস্থ্যবিধি)
101. Input: eggless, veg, ডিম ছাড়া কেক, এগলেস কেক, পিওর ভেজ
Output: [🖼️ Image Pop-up: Eggless_Tag.png] হ্যাঁ! আমাদের প্রায় সব কেকই ১০০% এগলেস বা সম্পূর্ণ নিরামিষভাবে তৈরি করে দেওয়া যায়।
102. Input: food colors, safe, কেকের কালার কি সেফ, ক্ষতিকারক রঙ
Output: একদম নিশ্চিন্ত থাকুন। আমরা শুধুমাত্র FSSAI অনুমোদিত প্রিমিয়াম ভোজ্য (Edible) রঙ ব্যবহার করি।
103. Input: preservatives, প্রিজারভেটিভ দেন, কেক ফ্রেশ তো
Output: আমাদের কেকে কোনো ক্ষতিকারক রাসায়নিক বা প্রিজারভেটিভ থাকে না। সব কেক ফ্রেশ বেক করা হয়।
104. Input: less cream, ক্রিম কম দিয়ে বানানো যাবে
Output: হ্যাঁ, আপনার পছন্দ অনুযায়ী আমরা কেকের ক্রিমের পরিমাণ কমিয়ে কাস্টমাইজ করে দিই।
105. Input: less sugar, মিষ্টি কম হবে
Output: হ্যাঁ, অনুরোধ করলে কেকের মিষ্টির পরিমাণ কমিয়ে (Mild sweet) তৈরি করা যায়।
106. Input: sugar free, সুগার ফ্রি কেক হবে
Output: আগে থেকে অর্ডার দিলে নির্দিষ্ট কিছু ফ্লেভারের ক্ষেত্রে আমরা সুগার-ফ্রি বিকল্প তৈরি করি।
107. Input: nut allergy, বাদামে অ্যালার্জি
Output: অর্ডার করার সময় অনুগ্রহ করে অ্যালার্জির কথা জানিয়ে দেবেন যাতে আমরা সতর্কতা নিতে পারি।
108. Input: gluten free, গ্লুটেন ফ্রি কেক
Output: আমাদের সাধারণ কিচেন হওয়ার কারণে আমরা ১০০% গ্লুটেন-ফ্রি খাবারের গ্যারান্টি দিতে পারি না।
109. Input: hygiene, clean, হাইজিন মেনটেইন করেন
Output: পরিচ্ছন্নতা আমাদের প্রথম অগ্রাধিকার! প্রতিদিন কিচেন এবং সরঞ্জাম ডিপ-ক্লিন ও স্যানিটাইজ করা হয়।
110. Input: real fruit, fresh fruit crush, তাজা ফল দেন, আসল ক্রাশ
Output: আমরা কঠোরভাবে উচ্চমানের ফ্রুট ক্রাশ এবং আসল ফলের তাজা টুকরো ব্যবহার করি।
111. Input: real butter, আসল বাটার দেন
Output: হ্যাঁ, সেরা স্বাদ এবং কোয়ালিটির জন্য আমরা প্রিমিয়াম মাখন ব্যবহার করি।
112. Input: gelatin, জিলেটিন ব্যবহার করেন
Output: না, আমরা ডেজার্ট সেট করতে ১০০% নিরামিষ আগার-আগার (Agar-agar) বা ভেজ জেল ব্যবহার করি।
113. Input: animal free, হালাল, এনিমেল ফ্রি
Output: হ্যাঁ, আমাদের কিচেন সম্পূর্ণভাবে প্রাণী-মুক্ত এবং ১০০% নিরামিষ উপাদান ব্যবহারের সুযোগ রয়েছে।
114. Input: msg, tasting salt, টেস্টিং সল্ট দেন
Output: না, আমরা আমাদের পিজ্জা বা স্ন্যাকসে কোনো MSG বা কৃত্রিম স্বাদবর্ধক ব্যবহার করি না।
115. Input: pregnancy safe, প্রেগন্যান্সিতে খাওয়া যাবে
Output: আমাদের বেকড খাবার সম্পূর্ণ নিরাপদ। তবে অ্যালকোহল-বেসড ফ্লেভার এড়িয়ে চলার পরামর্শ দিই।

🧁 Jar Cakes, Cupcakes & Snacks (স্ন্যাকস এবং ডেজার্ট)
116. Input: cupcakes, কাপকেক বানান
Output: [🖼️ Image Pop-up: Cupcakes.jpg] হ্যাঁ, যেকোনো পার্টির জন্য কাস্টম কাপকেক এবং মাফিন পাওয়া যায়।
117. Input: jar cake, glass cake, জার কেক, গ্লাস কেক হবে
Output: [🖼️ Image Pop-up: Jar_Cakes.jpg] হ্যাঁ, আমরা সুন্দর লেয়ার যুক্ত জার কেক এবং গ্লাস কেক তৈরি করি।
118. Input: cheesecake, চিজকেক বিক্রি করেন
Output: হ্যাঁ, রিচ এবং ক্রিমি চিজকেক আমাদের স্পেশাল ডেজার্ট মেনুর একটি অংশ।
119. Input: brownie, ব্রাউনি পাওয়া যায়
Output: [🖼️ Image Pop-up: Brownies.jpg] হ্যাঁ, আমরা অত্যন্ত সুস্বাদু এবং চকোলেটি ব্রাউনি তৈরি করি।
120. Input: pizza, পিজ্জা হবে
Output: [🖼️ Image Pop-up: Pizzas.jpg] হ্যাঁ! ডেজার্টের পাশাপাশি আমরা দারুণ স্বাদের ঘরোয়া পিজ্জা তৈরি করি।
121. Input: patties, প্যাটিস বানান, নোনতা খাবার
Output: হ্যাঁ, আমরা ফ্রেশ ভেজ এবং নন-ভেজ প্যাটিস বানাই। স্ন্যাকস পার্টির জন্য বাল্ক অর্ডারও নিই।
122. Input: lava muffin, চকোলেট লাভা মাফিন
Output: হ্যাঁ, আমাদের ভেতরে চকোলেট ভরা লাভা মাফিনগুলো অত্যন্ত জনপ্রিয়!
123. Input: chocolates, custom chocolate, কাস্টমাইজড চকোলেট, গিফট হট হ্যাম্পার
Output: [🖼️ Image Pop-up: Chocolates.jpg] হ্যাঁ, উপহার দেওয়ার জন্য আমাদের হাতে তৈরি কাস্টমাইজড চকোলেট হ্যাম্পার রয়েছে।
124. Input: single pastry, সিঙ্গেল পেস্ট্রি পাওয়া যায়
Output: প্রতিদিনের স্টকের ওপর ভিত্তি করে সিঙ্গেল স্লাইস পাওয়া যেতে পারে। মেসেজ করে জেনে নিন।
125. Input: bread, পাউরুটি বানান
Output: আমরা মূলত কাস্টম অর্ডারে ফোকাস করি। সকালে ব্রেড অ্যাভেইলেবল আছে কিনা তা হোয়াটসঅ্যাপে জেনে নিন।
126. Input: snack box, স্ন্যাকস বক্স হবে
Output: হ্যাঁ, কাপকেক, মিনি পিজ্জা এবং ব্রাউনি সহ স্কুলের জন্য কাস্টম স্ন্যাকস বক্স তৈরি করে দিই।
127. Input: fresh cheese, পিজ্জায় ফ্রেশ চিজ দেন
Output: হ্যাঁ, আমাদের ঘরোয়া পিজ্জার জন্য আমরা উচ্চমানের মোজারেলা চিজ ব্যবহার করি।
128. Input: return gift jars, রিটার্ন গিফট জার
Output: হ্যাঁ, মিনি ডেজার্ট জারগুলো জন্মদিন এবং বেবি শাওয়ারের চমৎকার রিটার্ন গিফট!
129. Input: sugar free cupcake, সুগার ফ্রি কাপকেক
Output: বাল্ক কাস্টম অর্ডারের জন্য সুগার-ফ্রি কাপকেক প্রস্তুত করা যেতে পারে।
130. Input: printed chocolate, নাম লেখা চকোলেট
Output: হ্যাঁ, চকোলেট র্যাপারের ওপর নাম প্রিন্ট করে রিটার্ন গিফট হিসেবে আমরা তৈরি করে দিই।

📏 Storage & Sizing (সংরক্ষণ এবং পরিমাণ)
131. Input: how long fresh, store cake, কেক কতদিন ভালো থাকবে
Output: ফ্রেশ ক্রিমের কেক ঠিকমতো ফ্রিজে রাখলে ২-৩ দিন পর্যন্ত ভালো থাকে।
132. Input: keep in fridge, ফ্রিজে রাখতে হবে কি
Output: হ্যাঁ, ফ্রেশ ক্রিম কেক ফ্রিজে রাখুন। তবে ফনডেন্ট কেক ঘামতে পারে, তাই এসি রুমে রাখা ভালো।
133. Input: when to take out, ফ্রিজ থেকে কখন বের করব
Output: সেরা স্বাদ এবং টেক্সচার পাওয়ার জন্য কাটার ১৫-২০ মিনিট আগে কেকটি ফ্রিজ থেকে বের করে রাখবেন।
134. Input: store jar cake, জার কেক কতদিন রাখা যায়
Output: জার কেকের মুখ শক্ত করে আটকে ফ্রিজে রাখুন। এগুলো ৪ দিন পর্যন্ত ভালো থাকে।
135. Input: store brownie, ব্রাউনি ফ্রিজে রাখব
Output: ব্রাউনি এয়ারটাইট পাত্রে সাধারণ তাপমাত্রায় ৩ দিন রাখা যায়, অথবা ফ্রিজে বেশিদিন রাখতে পারেন।
136. Input: microwave brownie, ব্রাউনি গরম করে খাওয়া যাবে
Output: হ্যাঁ! খাওয়ার আগে ১০-১৫ সেকেন্ড মাইক্রোওয়েভ করে নিলে ব্রাউনি বেশ নরম এবং চকোলেটি হয়ে যায়।
137. Input: serving size, 1 pound serves, ১ পাউন্ড কেক কতজনের জন্য
Output: একটি সাধারণ ১ পাউন্ডের কেক অনায়াসে ৪ থেকে ৬ জনের জন্য যথেষ্ট!
138. Input: 20 people size, ২০ জনের জন্য কত বড় কেক
Output: ২০ জন অতিথির জন্য আমরা ৩ পাউন্ড থেকে ৪ পাউন্ডের কেক অর্ডার করার পরামর্শ দিই।
139. Input: 2 tier weight, দোতলা কেক কত পাউন্ডের হয়
Output: দোতলা কেকের স্ট্রাকচার ঠিক রাখার জন্য এর ওজন ন্যূনতম ৩ পাউন্ড হতে হবে।
140. Input: half pound cake, হাফ পাউন্ড কেক হবে
Output: অল্প পরিমাণের জন্য হাফ পাউন্ড কেকের পরিবর্তে আমরা ১-২ জনের জন্য 'বেন্টো কেক' নেওয়ার পরামর্শ দিই।
141. Input: weight include decoration, ডেকোরেশনের ওজন কি কেকের সাথে
Output: মূল ওজনটি স্পঞ্জ ও ক্রিমের জন্য। ফনডেন্টের ভারী পুতুলের কারণে ওজন সামান্য বাড়তে পারে।
142. Input: how many cupcakes, বাচ্চাদের পার্টির জন্য কটা কাপকেক
Output: সাধারণত, প্রতিটি বাচ্চার জন্য ১ থেকে ২টি কাপকেক হিসাব করা ভালো।
143. Input: cake box size, কেকের বক্স ফ্রিজে ঢুকবে
Output: সাধারণ ১ বা ২ পাউন্ডের বক্স ফ্রিজে অনায়াসে আঁটবে। লম্বা কেকের জন্য তাক সরাতে হতে পারে।
144. Input: pizza shelf life, পিজ্জার মেয়াদ কতক্ষণ
Output: পিজ্জা তাজা ও গরম খাওয়া ভালো, তবে ফ্রিজে রেখে ২৪ ঘন্টার মধ্যে গরম করে খাওয়া যেতে পারে।
145. Input: custom chocolate life, চকোলেটের মেয়াদ কতদিন
Output: কাস্টম চকোলেট এয়ারটাইট পাত্রে ফ্রিজে রাখলে এক মাস পর্যন্ত ভালো থাকে।

🎉 Occasions & Events (বিশেষ দিন ও ইভেন্ট)
146. Input: anniversary cake, অ্যানিভার্সারি কেক বানান, বিবাহ বার্ষিকী
Output: [🖼️ Image Pop-up: Anniversary_Cake.jpg] হ্যাঁ, বিবাহ বার্ষিকীর জন্য আমাদের কাছে চমৎকার সব রোমান্টিক ডিজাইন রয়েছে।
147. Input: birthday cake, জন্মদিনের কেক হবে
Output: [🖼️ Image Pop-up: Birthday_Cakes.jpg] হ্যাঁ, যেকোনো বয়সের জন্মদিনের জন্য আমরা দারুণ কাস্টম থিম কেক বানাই।
148. Input: teachers day, fathers day, mothers day, টিচার্স ডের কেক, মাদার্স ডে
Output: হ্যাঁ, সকল বিশেষ দিনকে স্মরণীয় করতে আমরা থিম-ভিত্তিক কেক তৈরি করি।
149. Input: valentines day, ভ্যালেন্টাইন্স ডের কেক
Output: হ্যাঁ, ভ্যালেন্টাইন্স ডে-র জন্য আমাদের রেড ভেলভেট এবং হার্ট শেপের কেক রয়েছে।
150. Input: christmas cake, plum cake, ক্রিসমাস প্লাম কেক
Output: হ্যাঁ, ক্রিসমাসের সময় আমাদের তৈরি রিচ স্পেশাল প্লাম কেক অত্যন্ত জনপ্রিয়!
151. Input: new year cake, 31st, নিউ ইয়ারের কেক, থার্টিফার্স্ট
Output: হ্যাঁ, ৩১শে ডিসেম্বরের জন্য মিডনাইট কাউন্টডাউন থিম কেক পাওয়া যায়। আগে থেকে বুকিং করুন।
152. Input: rakhi cake, রাখির জন্য কেক
Output: হ্যাঁ, রাখির জন্য সুন্দর ভাই-বোন থিমের কেক এবং চকোলেট হ্যাম্পার তৈরি করা হয়।
153. Input: holi sweets, হোলির স্পেশাল
Output: হ্যাঁ, আমরা হোলির সময় ঠাণ্ডাই কাপকেকের মতো বিশেষ ফিউশন আইটেম লঞ্চ করি।
154. Input: baby shower, বেবি শাওয়ারের কেক
Output: হ্যাঁ, বেবি শাওয়ার বা জেন্ডার রিভিলের জন্য আমরা চমৎকার কিউট কেক ডিজাইন করি।
155. Input: bachelor party, ব্যাচেলর পার্টির কেক
Output: হ্যাঁ, ব্যাচেলর পার্টির জন্য আমরা মজার এবং আকর্ষণীয় (Quirky) কেক ডিজাইন করি।
156. Input: pet birthday, কুকুরের জন্মদিনের কেক, পোষা প্রাণী
Output: আমাদের কেকগুলো মানুষের জন্য হলেও, আপনার উদযাপনের জন্য আমরা পেট-থিম (Pet-theme) কেক বানাতে পারি!
157. Input: 50th anniversary, golden jubilee, ৫০তম বিবাহ বার্ষিকী
Output: হ্যাঁ, গোল্ডেন জুবিলি বা ৫০তম বিবাহ বার্ষিকীর কেক আমাদের অন্যতম বিশেষত্ব।
158. Input: diwali hampers, দীপাবলির হ্যাম্পার
Output: হ্যাঁ, দীপাবলিতে উপহার দেওয়ার জন্য আমরা কাস্টমাইজড চকোলেট এবং ব্রাউনির হ্যাম্পার তৈরি করি।
159. Input: eid cake, ঈদের কেক
Output: হ্যাঁ, আমরা ঈদ উদযাপনের জন্য দারুণ ডিজাইন করি।
`;

const lines = inputData.split('\n');

const imgMap: Record<string, string> = {
    'Map_Location.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Store_Front.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'WhatsApp_Icon.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Facebook_Page.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'YouTube_Channel.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Baker_Musu.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Signature_Menu.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Chocolate_Truffle.jpg': 'https://i.ibb.co/MKF765x/Chocolate-Truffle-Cakes-1.png',
    'Fresh_Fruit_Cake.jpg': 'https://i.ibb.co/q3M2pvxs/Mango-Cake-1.png',
    'Butterscotch_Cake.jpg': 'https://i.ibb.co/fYcwMKdc/Butterscotch-Cakes-1.png',
    'Oreo_Kitkat.jpg': 'https://i.ibb.co/k26bhF2H/Kitkat-1.png',
    'Rasmalai_Cake.jpg': 'https://i.ibb.co/4RBygSqR/Rasmalai-Cake-1.png',
    'Black_Forest.jpg': 'https://i.ibb.co/q3P990gk/Black-Forest-1.png',
    'Custom_Theme.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Photo_Cake.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Pinata_Cake.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Doll_Cake.jpg': 'https://i.ibb.co/xrgZZcx/Kids-Cake-1.png',
    'Bento_Cake.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Flower_Cake.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Tier_Cake.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Bulk_Orders.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Delivery.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Midnight_Surprise.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Eggless_Tag.png': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Cupcakes.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Jar_Cakes.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Brownies.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Pizzas.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Chocolates.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Anniversary_Cake.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
    'Birthday_Cakes.jpg': 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png',
};

const processed = [];
let currentId = 1000;

for(let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if(line.match(/^\d+\.\s+Input:/)) {
       const keywords = line.replace(/^\d+\.\s+Input:\s*/, '').trim();
       let nextLine = lines[i+1]?.trim() || '';
       let answer = nextLine.replace(/^Output:\s*/, '').trim();
       
       let images = [];
       // Extract [🖼️ Image Pop-up: Map_Location.jpg]
       const imgMatch = answer.match(/\[🖼️ Image Pop-up: ([^\]]+)\]/);
       if(imgMatch) {
            images.push(imgMap[imgMatch[1]] || 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png');
            answer = answer.replace(/\[🖼️ Image Pop-up: [^\]]+\]\s*/, '');
       }

       let mapIframe = undefined;
       if(keywords.includes('location') || keywords.includes('map')) {
           mapIframe = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3687.5000858931385!2d88.3911033!3d22.4478343!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027107c2d3f269%3A0x115c8763018d2718!2sBake%20n'%20Flake%20~%20FlavoursbyMusu!5e0!3m2!1sen!2sin!4v1779862971344!5m2!1sen!2sin";
       }

       let links = [];
       // Process inline links from answer text if necessary, such as 📍 Google Maps -> link
       if(answer.includes('📍 Google Maps')) {
          links.push({ label: 'View on Maps', url: 'https://g.page/r/CRgnjQFjh1wREBM', icon: 'MapPin' });
          answer = answer.replace('📍 Google Maps', '');
       }
       if(answer.includes('📞 +91 00000 00000')) {
          links.push({ label: 'Call Us Now', url: 'tel:+919875563329', icon: 'Phone' });
          answer = answer.replace('📞 +91 00000 00000', '+91 98755 63329');
       }
       if(answer.includes('💬 WhatsApp Us') || answer.includes('Order via WhatsApp')) {
          links.push({ label: 'WhatsApp', url: 'https://wa.me/919875563329', icon: 'MessageCircle' });
          answer = answer.replace('💬 WhatsApp Us', '').replace('💬 Order via WhatsApp', '');
       }
       if(answer.includes('📱 Flavours by Musu')) {
          links.push({ label: 'Facebook', url: 'https://www.facebook.com/flavoursbymusu/', icon: 'Facebook' });
          answer = answer.replace('📱 Flavours by Musu', '');
       }
       if(answer.includes('🎥 Watch on YouTube')) {
          links.push({ label: 'YouTube', url: 'https://youtube.com', icon: 'Youtube' });
          answer = answer.replace('🎥 Watch on YouTube', '');
       }
       if(answer.includes('💬 Message Support') || answer.includes('💬 Messenger Link')) {
           links.push({ label: 'Messenger', url: 'https://m.me/flavoursbymusu', icon: 'MessageSquare' });
           answer = answer.replace('💬 Message Support', '').replace('💬 Messenger Link', '');
       }

       processed.push({
           id: currentId++,
           questionEn: keywords,
           questionBn: keywords,
           answerEn: answer,
           answerBn: answer,
           keywords: keywords,
           images: images.length > 0 ? images : undefined,
           links: links.length > 0 ? links : undefined,
           mapIframe: mapIframe
       });
    }
}

let existingCode = fs.readFileSync('src/data/faqs.ts', 'utf8');

// Insert the new category containing all these into faqData
const newCategory = {
    titleEn: "Bot Knowledge Base",
    titleBn: "অ্যাসিস্ট্যান্ট ডাটাবেস",
    icon: "Bot",
    categoryImages: [],
    faqs: processed
};

// Locate the end of faqData array
const lastBraceIndex = existingCode.lastIndexOf(']');
if(lastBraceIndex !== -1) {
    const injected = existingCode.slice(0, lastBraceIndex) + ', ' + JSON.stringify(newCategory, null, 2) + '\n]';
    fs.writeFileSync('src/data/faqs.ts', injected);
    console.log("Injected knowledge base");
} else {
    console.error("Could not inject");
}
