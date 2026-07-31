import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cake, Sparkles, Check, ChevronRight, ShoppingBag, Send, Heart, Layers, MessageSquare, Info, Plus } from 'lucide-react';
import { playSound } from '../lib/sounds';

interface CakeBuilderProps {
  lang: 'en' | 'bn';
  onOrderCustomCake: (customOrderSummary: string, estimatedPrice: number) => void;
  onAddToCartCustom?: (item: any) => void;
}

const CAKE_TYPES = [
  { id: 'round', labelEn: 'Round Classic 🎂', labelBn: 'রাউন্ড ক্লাসিক 🎂', basePrice: 550, img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80' },
  { id: 'heart', labelEn: 'Heart Special ❤️', labelBn: 'হার্ট স্পেশাল ❤️', basePrice: 600, img: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=300&q=80' },
  { id: 'bento', labelEn: 'Bento Lunchbox 🍱', labelBn: 'বেন্টো কেক 🍱', basePrice: 350, img: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=300&q=80' },
  { id: 'tiered', labelEn: '2-Tier Royal 🏰', labelBn: '২-টিয়ার রয়্যাল 🏰', basePrice: 1400, img: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=300&q=80' },
  { id: 'pinata', labelEn: 'Pinata Hammer 🔨', labelBn: 'পিনাটা কেক 🔨', basePrice: 850, img: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=300&q=80' },
  { id: 'photo', labelEn: 'Photo Print 📸', labelBn: 'ফটো প্রিন্ট 📸', basePrice: 700, img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&q=80' },
  { id: 'doll', labelEn: 'Doll Princess 👗', labelBn: 'ডল প্রিন্সেস 👗', basePrice: 900, img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300&q=80' }
];

const FLAVORS = [
  { id: 'truffle', nameEn: 'Chocolate Truffle 🍫', nameBn: 'চকোলেট ট্রাফল 🍫' },
  { id: 'butterscotch', nameEn: 'Butterscotch Crunch 🧈', nameBn: 'বাটারস্কচ ক্রাঞ্চ 🧈' },
  { id: 'vanilla', nameEn: 'Vanilla Dream 🍦', nameBn: 'ভ্যানিলা ড্রীম 🍦' },
  { id: 'pineapple', nameEn: 'Fresh Pineapple 🍍', nameBn: 'ফ্রেশ পাইনঅ্যাপল 🍍' },
  { id: 'mango', nameEn: 'Alphonso Mango 🥭', nameBn: 'আলফ্রেডো ম্যাংগো 🥭' },
  { id: 'strawberry', nameEn: 'Strawberry Bliss 🍓', nameBn: 'স্ট্রবেরি ব্লিস 🍓' },
  { id: 'redvelvet', nameEn: 'Red Velvet Cheese ❤️', nameBn: 'রেড ভেলভেট চিজ ❤️' },
  { id: 'rasmalai', nameEn: 'Royal Rasmalai 🍨', nameBn: 'রয়্যাল রসমলাই 🍨' },
  { id: 'coffee', nameEn: 'Coffee Mocha ☕️', nameBn: 'কফি মোকা ☕️' }
];

const WEIGHTS = [
  { id: '0.5', labelEn: '0.5 Kg (1 Lb)', labelBn: '০.৫ কেজি (১ পাউন্ড)', multiplier: 1 },
  { id: '1.0', labelEn: '1.0 Kg (2 Lb)', labelBn: '১.০ কেজি (২ পাউন্ড)', multiplier: 1.8 },
  { id: '1.5', labelEn: '1.5 Kg (3 Lb)', labelBn: '১.৫ কেজি (৩ পাউন্ড)', multiplier: 2.6 },
  { id: '2.0', labelEn: '2.0 Kg (4 Lb)', labelBn: '২.০ কেজি (৪ পাউন্ড)', multiplier: 3.4 },
  { id: '3.0', labelEn: '3.0 Kg + Tiered', labelBn: '৩.০ কেজি টিয়ার্ড', multiplier: 4.8 }
];

const ADDONS = [
  { id: 'macarons', labelEn: 'Macarons Topping 🧁', labelBn: 'ম্যাকারন টপিং 🧁', price: 120 },
  { id: 'gold', labelEn: 'Edible Gold Foil ✨', labelBn: 'এডিবল গোল্ড ফয়েল ✨', price: 80 },
  { id: 'flowers', labelEn: 'Fresh Roses 🌸', labelBn: 'ফ্রেশ গোলাপ ফ্লাওয়ার 🌸', price: 150 },
  { id: 'ferrero', labelEn: 'Ferrero Rocher 🍫', labelBn: 'ফেরেও রোশার 🍫', price: 180 },
  { id: 'candles', labelEn: 'Sparkler Candle Set 🕯️', labelBn: 'স্পার্কলার ক্যান্ডেল 🕯️', price: 50 }
];

export default function CakeBuilder({ lang, onOrderCustomCake, onAddToCartCustom }: CakeBuilderProps) {
  const [selectedType, setSelectedType] = useState(CAKE_TYPES[0]);
  const [selectedFlavor, setSelectedFlavor] = useState(FLAVORS[0]);
  const [selectedWeight, setSelectedWeight] = useState(WEIGHTS[1]); // Default 1.0 kg
  const [isEggless, setIsEggless] = useState(true);
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['gold']);
  const [message, setMessage] = useState('');

  const toggleAddon = (id: string) => {
    playSound('ding');
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  // Calculate estimated price
  const addonsTotal = selectedAddons.reduce((sum, id) => {
    const item = ADDONS.find(a => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  const estimatedPrice = Math.round(selectedType.basePrice * selectedWeight.multiplier) + addonsTotal;

  // Formatted Order String
  const addonNames = selectedAddons.map(id => {
    const item = ADDONS.find(a => a.id === id);
    return item ? (lang === 'en' ? item.labelEn : item.labelBn) : '';
  }).filter(Boolean).join(', ');

  const customOrderSummary = `[Custom Cake Builder] ${selectedWeight.labelEn} ${selectedType.labelEn} - Flavor: ${selectedFlavor.nameEn} (${isEggless ? '100% Eggless Veg 🌿' : 'With Egg 🥚'})${addonNames ? ` | Add-ons: ${addonNames}` : ''}${message ? ` | Message: "${message}"` : ''} (Est. ₹${estimatedPrice})`;

  const handleOrderClick = () => {
    playSound('ding');
    onOrderCustomCake(customOrderSummary, estimatedPrice);
  };

  const handleAddToCartClick = () => {
    if (onAddToCartCustom) {
      playSound('ding');
      onAddToCartCustom({
        id: 'custom_' + Date.now(),
        productNameEn: `Custom ${selectedFlavor.nameEn.split(' ')[0]} ${selectedType.labelEn.split(' ')[0]} Cake`,
        productNameBn: `কাস্টম ${selectedFlavor.nameBn.split(' ')[0]} কেক`,
        img: selectedType.img,
        weight: selectedWeight.labelEn,
        price: estimatedPrice,
        quantity: 1,
        customNote: customOrderSummary,
        category: 'Customised'
      });
    }
  };

  return (
    <section id="cake-builder" className="py-12 px-4 max-w-6xl mx-auto my-10">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden relative">
        {/* Background Accent glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={14} className="animate-spin" />
            {lang === 'en' ? 'Interactive Cake Studio' : 'কাস্টম কেক প্রস্তুত করুন'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 dark:text-white leading-tight">
            {lang === 'en' ? 'Build Your Dream Cake' : 'আপনার পছন্দের কাস্টম কেক বানান'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            {lang === 'en' 
              ? 'Select design, flavor, size & toppings to customize your perfect celebration cake' 
              : 'ডিজাইন, ফ্লেভার, ওজন ও টপিং বেছে নিয়ে আপনার মনের মতো কেক তৈরি করুন'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Builder Controls Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Cake Type */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                <Cake size={16} className="text-pink-500" />
                {lang === 'en' ? '1. Select Cake Design / Type' : '১. কেকের ডিজাইন বা টাইপ বেছে নিন'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CAKE_TYPES.map((type) => {
                  const isSelected = selectedType.id === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        playSound('ding');
                        setSelectedType(type);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                        isSelected
                          ? 'border-pink-500 bg-pink-50/80 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 ring-2 ring-pink-500/30 font-bold shadow-md'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-pink-300'
                      }`}
                    >
                      <p className="text-xs font-extrabold leading-tight">
                        {lang === 'en' ? type.labelEn : type.labelBn}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                        Base: ₹{type.basePrice}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Flavor */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                <Heart size={16} className="text-rose-500" />
                {lang === 'en' ? '2. Choose Cake Flavor' : '২. কেকের ফ্লেভার পছন্দ করুন'}
              </label>
              <div className="flex flex-wrap gap-2">
                {FLAVORS.map((flavor) => {
                  const isSelected = selectedFlavor.id === flavor.id;
                  return (
                    <button
                      key={flavor.id}
                      onClick={() => {
                        playSound('ding');
                        setSelectedFlavor(flavor);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md scale-105'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {lang === 'en' ? flavor.nameEn : flavor.nameBn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Weight & Preference */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {lang === 'en' ? '3. Weight / Size' : '৩. ওজন বা সাইজ'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {WEIGHTS.map((w) => {
                    const isSelected = selectedWeight.id === w.id;
                    return (
                      <button
                        key={w.id}
                        onClick={() => {
                          playSound('ding');
                          setSelectedWeight(w);
                        }}
                        className={`py-2 px-2.5 rounded-xl text-xs font-bold text-center border transition-all ${
                          isSelected
                            ? 'border-pink-500 bg-pink-500 text-white shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-pink-300'
                        }`}
                      >
                        {lang === 'en' ? w.labelEn : w.labelBn}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  {lang === 'en' ? '4. Egg Preference' : '৪. এগ/এগলেস পছন্দ'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsEggless(true)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 ${
                      isEggless
                        ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>🌿 100% Eggless</span>
                  </button>
                  <button
                    onClick={() => setIsEggless(false)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 ${
                      !isEggless
                        ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>🥚 With Egg</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Add-ons & Toppings */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1">
                <Sparkles size={15} className="text-amber-500" />
                {lang === 'en' ? '5. Luxury Toppings & Add-ons' : '৫. কাস্টম টপিং ও ডেকোরেশন'}
              </label>
              <div className="flex flex-wrap gap-2">
                {ADDONS.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 ring-2 ring-amber-500/30'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-amber-300'
                      }`}
                    >
                      {isSelected ? <Check size={13} className="text-amber-600" /> : <Plus size={13} />}
                      <span>{lang === 'en' ? addon.labelEn : addon.labelBn}</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-black">+₹{addon.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Custom Message */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === 'en' ? '6. Custom Message on Cake' : '৬. কেকের ওপর মেসেজ (লেখা)'}
              </label>
              <input
                type="text"
                placeholder={lang === 'en' ? 'e.g. Happy Birthday Priya! ❤️' : 'যেমন: হ্যাপি বার্থডে প্রিয়া! ❤️'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Builder Summary Box Right Column */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-slate-800 dark:to-slate-850 p-6 rounded-3xl border border-pink-200/80 dark:border-slate-700 space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-pink-200/60 dark:border-slate-700">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Cake className="text-pink-600" size={18} />
                {lang === 'en' ? 'Custom Summary' : 'কাস্টম কেক সামারি'}
              </h3>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-pink-500 text-white shadow-sm">
                Est. ₹{estimatedPrice}
              </span>
            </div>

            {/* Preview Spec Cards */}
            <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'en' ? 'Design:' : 'ডিজাইন:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {lang === 'en' ? selectedType.labelEn : selectedType.labelBn}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'en' ? 'Flavor:' : 'ফ্লেভার:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {lang === 'en' ? selectedFlavor.nameEn : selectedFlavor.nameBn}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'en' ? 'Weight:' : 'ওজন:'}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {lang === 'en' ? selectedWeight.labelEn : selectedWeight.labelBn}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'en' ? 'Type:' : 'টাইপ:'}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {isEggless ? '100% Eggless Veg 🌿' : 'With Egg 🥚'}
                </span>
              </div>
              {selectedAddons.length > 0 && (
                <div className="pt-1 border-t border-pink-200/40 dark:border-slate-700">
                  <span className="text-slate-500 block mb-1">{lang === 'en' ? 'Add-ons:' : 'টপিং:'}</span>
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300 leading-tight">
                    {addonNames}
                  </p>
                </div>
              )}
              {message && (
                <div className="pt-1 border-t border-pink-200/40 dark:border-slate-700">
                  <span className="text-slate-500 block">{lang === 'en' ? 'Message on cake:' : 'লেখা:'}</span>
                  <p className="text-xs italic font-bold text-pink-600 dark:text-pink-400">
                    "{message}"
                  </p>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleOrderClick}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-pink-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                <span>{lang === 'en' ? 'Order Custom Cake Now 🚀' : 'এখনই কাস্টম কেক অর্ডার করুন 🚀'}</span>
              </button>

              {onAddToCartCustom && (
                <button
                  onClick={handleAddToCartClick}
                  className="w-full py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={15} />
                  <span>{lang === 'en' ? 'Add to Cart 🛒' : 'কার্টে যোগ করুন 🛒'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
