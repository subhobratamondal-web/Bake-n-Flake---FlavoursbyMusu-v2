import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lightbulb, Sparkles, RefreshCw, Copy, Check, ChefHat, Heart, Award } from 'lucide-react';
import { playSound } from '../lib/sounds';

interface Tip {
  id: number;
  categoryEn: string;
  categoryBn: string;
  titleEn: string;
  titleBn: string;
  contentEn: string;
  contentBn: string;
  icon: string;
}

const BAKING_TIPS: Tip[] = [
  {
    id: 1,
    categoryEn: 'Sponge & Moisture',
    categoryBn: 'স্পঞ্জ ও ময়শ্চার',
    titleEn: 'How to Keep Cakes Soft & Moist for Days',
    titleBn: 'কেক অনেক দিন তুলতুলে নরম ও ময়স্ট রাখার সিক্রেট',
    contentEn: 'Always use room-temperature eggs and butter! Brush freshly baked warm sponge layers with a light sugar-vanilla syrup before applying cream frosting to lock in moisture. 🧁✨',
    contentBn: 'ডিম ও মাখন সর্বদা ঘরের তাপমাত্রার ব্যবহার করুন! বেকিং এর পর হালকা গরম স্পঞ্জের ওপর চিনি-ভ্যানিলা সিরাপ ব্রাশ করে নিলে কেক দীর্ঘদিন জুসি ও নরম থাকে। 🧁✨',
    icon: '🍰'
  },
  {
    id: 2,
    categoryEn: 'Cream & Frosting',
    categoryBn: 'ক্রিম ও ফ্রস্টিং',
    titleEn: 'Secret to Silky Soft Whipped Cream',
    titleBn: 'সিল্কি ও পারফেক্ট হুইপড ক্রিম তৈরির গোপন ট্রিক',
    contentEn: 'Chill your mixing bowl and whisk attachments in the freezer for 15 minutes before whipping heavy cream. Whip on medium speed to avoid over-beating and grainy texture! 🧈🍦',
    contentBn: 'হুইপড ক্রিম তৈরির আগে বাটি ও বিটার হুক ১৫ মিনিট ফ্রিজে ঠান্ডা করে নিন! সবসময় মাঝারি স্পিডে বিট করুন যাতে ক্রিম কেটে না যায়। 🧈🍦',
    icon: '🍨'
  },
  {
    id: 3,
    categoryEn: 'Eggless Magic',
    categoryBn: 'ডিম ছাড়া বেকিং',
    titleEn: 'Cloud-Soft Eggless Baking Sponge',
    titleBn: '১০০% ভেজ ডিম ছাড়া মেঘের মতো সফট স্পঞ্জ',
    contentEn: 'Combine fresh thick curd with milk and a quarter spoon of baking soda. Let it rest for 5 minutes until frothy, then fold into flour for an ultra-fluffy sponge! 🌿☁️',
    contentBn: 'তাজা মিষ্টি দইয়ের সাথে দুধ ও ১/৪ চামচ বেকিং সোডা মিশিয়ে ৫ মিনিট রাখুন। বুদ্বুদ উঠলে ময়দার সাথে হালকা হাতে ফোল্ড করুন, স্পঞ্জ হবে তুলোর মতো! 🌿☁️',
    icon: '🌿'
  },
  {
    id: 4,
    categoryEn: 'Ganache Perfection',
    categoryBn: 'গ্যানাশ সিক্রেট',
    titleEn: 'Glossy Mirror Chocolate Ganache',
    titleBn: 'গ্লসি ও চকচকে চকোলেট গ্যানাশ তৈরির নিয়ম',
    contentEn: 'Use a 1:1 ratio of 55% dark cocoa chocolate and warm heavy cream. Add a tiny teaspoon of unsalted butter at the end for that signature high-shine bakery gloss! 🍫✨',
    contentBn: 'ডার্ক চকলেট ও গরম ফ্রেশ ক্রিমের ১:১ অনুপাত ব্যবহার করুন। নামানোর আগে এক চামচ বাটার মিশিয়ে দিলে বেকারির মতো দারুণ গ্লসি গাজরা কালার আসবে! 🍫✨',
    icon: '🍫'
  },
  {
    id: 5,
    categoryEn: 'Cutting & Serving',
    categoryBn: 'কেক কাটিং টিপস',
    titleEn: 'How to Slice Fondant & Cream Cakes Cleanly',
    titleBn: 'ফন্ডেন্ট ও ক্রিম কেক নিখুঁতভাবে কাটার উপায়',
    contentEn: 'Dip a long serrated chef knife in a tall cup of hot water, wipe dry with a clean cloth, and slice gently. Repeat for every single clean professional slice! 🔪🍰',
    contentBn: 'ধারালো ছুরি গরম জলে ডুবিয়ে পরিষ্কার কাপড়ে মুছে নিন, তারপর কেক কাটুন। প্রতি কাটিংয়ে একই নিয়ম মানলে কেকের ক্রিম লেয়ার নষ্ট হয় না! 🔪🍰',
    icon: '🔪'
  },
  {
    id: 6,
    categoryEn: 'Fresh Fruit Care',
    categoryBn: 'ফ্রেশ ফ্রুট যত্ন',
    titleEn: 'Preventing Fresh Fruits From Turning Dark',
    titleBn: 'কেকের ওপর তাজা ফল তাজা ও উজ্জ্বল রাখার টিপস',
    contentEn: 'Glaze fresh fruit toppings (kiwi, strawberry, apple) with a light coating of neutral bakery gel or warm apricot jam diluted with water to keep them glossy and fresh for hours! 🍎🍓',
    contentBn: 'পাইনঅ্যাপল, স্ট্রবেরি ও কিউই টুকরোর ওপর নিউট্রাল গ্লেজ জেলি বা হালকা অ্যাপ্রিকট জ্যাম ব্রাশ করে দিলে ফল দীর্ঘক্ষণ উজ্জ্বল ও সতেজ থাকে! 🍎🍓',
    icon: '🍓'
  }
];

export default function ProBakingTips({ lang }: { lang: 'en' | 'bn' }) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentTip = BAKING_TIPS[currentTipIndex];

  const handleNextTip = () => {
    playSound('ding');
    setCurrentTipIndex((prev) => (prev + 1) % BAKING_TIPS.length);
    setCopied(false);
  };

  const handleCopy = () => {
    playSound('ding');
    const textToCopy = `${currentTip.icon} ${lang === 'en' ? currentTip.titleEn : currentTip.titleBn}\n\n${lang === 'en' ? currentTip.contentEn : currentTip.contentBn}\n— Musu's Pro Baking Tip (Bake n' Flake)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-12 px-4 max-w-5xl mx-auto my-8">
      <div className="relative bg-gradient-to-br from-amber-50 via-pink-50 to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-850 rounded-3xl p-6 md:p-10 border border-pink-200/80 dark:border-pink-900/40 shadow-xl overflow-hidden">
        {/* Decorative Background Badges */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-300/20 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-300/20 dark:bg-amber-900/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-pink-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-pink-500/30">
              <ChefHat size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                  {lang === 'en' ? "Musu's Bakery Secret" : "মুসু দির বেকারি সিক্রেট"}
                </span>
                <span className="text-xs font-bold text-slate-400">
                  #{currentTipIndex + 1} of {BAKING_TIPS.length}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-extrabold text-slate-900 dark:text-white mt-0.5">
                {lang === 'en' ? 'Pro Baking Advice & Tips' : 'প্রো বেকিং টিপস ও ট্রিকস'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              <span>{copied ? (lang === 'en' ? 'Copied!' : 'কপি হয়েছে!') : (lang === 'en' ? 'Copy Tip' : 'কপি টিপস')}</span>
            </button>

            <button
              onClick={handleNextTip}
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold rounded-2xl shadow-md shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              <span>{lang === 'en' ? 'Next Tip 💡' : 'পরবর্তী টিপস 💡'}</span>
            </button>
          </div>
        </div>

        {/* Tip Content Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-pink-600 dark:text-pink-400">
              <span className="text-base">{currentTip.icon}</span>
              <span>{lang === 'en' ? currentTip.categoryEn : currentTip.categoryBn}</span>
            </div>

            <h4 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {lang === 'en' ? currentTip.titleEn : currentTip.titleBn}
            </h4>

            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-white/60 dark:bg-slate-800/50 p-4 rounded-2xl border border-pink-100/60 dark:border-slate-800">
              {lang === 'en' ? currentTip.contentEn : currentTip.contentBn}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
