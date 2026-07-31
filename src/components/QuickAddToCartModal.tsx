import React, { useState, useEffect, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Plus, Minus, MessageSquare, Scale, Check, ShieldCheck, Info, Sparkles, MapPin, Navigation, MessageCircle, Search, ZoomIn } from 'lucide-react';
import { Product, CartItem } from '../types';
import OptimizedImage from './OptimizedImage';
import { getOptimizedImageUrl } from '../utils/googleSheetsSync';
import { AppContext } from '../App';

interface QuickAddToCartModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  lang: 'en' | 'bn';
}

const WEIGHT_OPTIONS = [
  { label: '0.5 Kg (1 pound)', value: '0.5 Kg (1 pound)', estPrice: 600, priceText: '₹600 approx.' },
  { label: '1 Kg (2 Pound)', value: '1 Kg (2 Pound)', estPrice: 1100, priceText: '₹1100 approx.' },
  { label: '1.5 Kg (3 Pound)', value: '1.5 Kg (3 Pound)', estPrice: 1700, priceText: '₹1700 approx.' },
  { label: '2 Kg (Custom)', value: '2 Kg (Custom)', estPrice: 0, priceText: '₹ ******' }
];

const FLAVOUR_OPTIONS = [
  'Chocolate',
  'Butterscotch',
  'Vanilla',
  'Red Velvet',
  'Rasmalai',
  'Pineapple',
  'Mango',
  'Strawberry',
  'Fresh Fruit',
  'Forest Range',
  'Oreo',
  'Alcohol base',
  'Coffee Mocha',
  'Orange',
  'KitKat'
];
const SHAPE_OPTIONS = ['Round', 'Heart', 'Square'];
const PRESET_MESSAGES = ['Happy Birthday', 'Happy Anniversary', 'Congratulations', 'Best Wishes'];

export default function QuickAddToCartModal({ product, isOpen, onClose, onAddToCart, lang }: QuickAddToCartModalProps) {
  const { galleryData } = useContext(AppContext);
  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[0].value);
  const [estPrice, setEstPrice] = useState(WEIGHT_OPTIONS[0].estPrice);
  const [eggType, setEggType] = useState<'Eggless (100% Veg)' | 'With Egg'>('Eggless (100% Veg)');
  const [selectedFlavour, setSelectedFlavour] = useState('Chocolate');
  const [selectedShape, setSelectedShape] = useState('Round');
  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [userLocation, setUserLocation] = useState('Kamalgazi, Kolkata');
  const [isLocating, setIsLocating] = useState(false);
  const [activeTab, setActiveTab] = useState<'options' | 'care'>('options');
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // Magnifier Lens Zoom state
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number; posX: number; posY: number } | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.img || '');
    }
  }, [product]);

  const availableImages = useMemo(() => {
    if (!product) return [];
    const imgs: string[] = [];
    if (product.img) imgs.push(product.img);

    const pName = (product.nameEn || '').trim().toLowerCase();
    const pCat = (product.category || '').trim().toLowerCase();

    if (galleryData) {
      const keys = Object.keys(galleryData);
      keys.forEach(k => {
        const kLower = k.toLowerCase();
        if ((pName && kLower.includes(pName)) || (pCat && kLower.includes(pCat))) {
          const val = galleryData[k];
          if (Array.isArray(val)) {
            val.forEach((item: any) => {
              if (typeof item === 'string' && item.startsWith('http') && !imgs.includes(item)) {
                imgs.push(item);
              } else if (item && typeof item === 'object' && item.img && !imgs.includes(item.img)) {
                imgs.push(item.img);
              }
            });
          }
        }
      });
    }

    return imgs.slice(0, 8);
  }, [product, galleryData]);

  // Auto-select flavor based on product name if matched
  useEffect(() => {
    if (product) {
      const name = (product.nameEn + ' ' + (product.category || '')).toLowerCase();
      const matchedFlavour = FLAVOUR_OPTIONS.find(flv => name.includes(flv.toLowerCase()));
      if (matchedFlavour) {
        setSelectedFlavour(matchedFlavour);
      } else {
        setSelectedFlavour('Chocolate');
      }
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          setUserLocation(`GPS: ${lat}, ${lng} (Auto Detected)`);
          setIsLocating(false);
        },
        () => {
          setUserLocation('Kamalgazi, Kolkata (Default)');
          setIsLocating(false);
        },
        { timeout: 8000 }
      );
    }
  };

  const handleWeightSelect = (opt: typeof WEIGHT_OPTIONS[0]) => {
    setSelectedWeight(opt.value);
    setEstPrice(opt.estPrice);
  };

  const handleAdd = () => {
    onAddToCart({
      productNameEn: product.nameEn,
      productNameBn: product.nameBn,
      img: selectedImage || product.img,
      weight: `${selectedWeight} | ${eggType} (${selectedFlavour}, ${selectedShape})`,
      price: estPrice > 0 ? estPrice : 0,
      quantity: quantity,
      customNote: `${customNote.trim() ? customNote.trim() + ' | ' : ''}Location: ${userLocation}`,
      category: product.category
    });

    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 800);
  };

  const currentImgSrc = selectedImage || product.img;
  const imageUrl = getOptimizedImageUrl(currentImgSrc, 800, 90) || currentImgSrc;

  // Magnifying loupe move handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const posX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const posY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setZoomPos({ x, y, posX, posY });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const posX = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const posY = Math.max(0, Math.min(100, (y / rect.height) * 100));
      setZoomPos({ x, y, posX, posY });
    }
  };

  const handleMouseLeave = () => setZoomPos(null);
  const handleTouchEnd = () => setZoomPos(null);

  const selectedOpt = WEIGHT_OPTIONS.find(o => o.value === selectedWeight) || WEIGHT_OPTIONS[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                100% Pure Eggless Veg Available
              </span>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
            {/* Top Interactive Image Preview Card with Magnifying Glass Loupe */}
            <div className="space-y-2">
              <div 
                className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 group select-none cursor-crosshair shadow-md"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchMove}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onClick={() => setIsLightboxOpen(true)}
              >
                <OptimizedImage 
                  src={imageUrl} 
                  alt={product.nameEn}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width={800}
                />

                {/* Instruction overlay badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20 pointer-events-none z-10">
                  <Search size={13} className="text-pink-400 animate-pulse" />
                  <span>{lang === 'en' ? 'Touch / Drag to Magnify' : 'ছবিতে আঙুল ছুঁইয়ে বা ড্র্যাগ করে জুম করুন'}</span>
                </div>

                <div className="absolute top-3 right-3 bg-pink-600/90 hover:bg-pink-600 text-white p-2 rounded-full shadow-lg backdrop-blur-md transition-all cursor-pointer z-10" title="Full Screen View">
                  <ZoomIn size={16} />
                </div>

                {/* Magnifying Loupe Circle */}
                {zoomPos && (
                  <div 
                    className="absolute pointer-events-none w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-white shadow-[0_0_35px_rgba(0,0,0,0.6)] overflow-hidden z-30 ring-2 ring-pink-500 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
                    style={{
                      left: `${zoomPos.x}px`,
                      top: `${zoomPos.y}px`,
                    }}
                  >
                    <div 
                      className="w-full h-full bg-no-repeat"
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundPosition: `${zoomPos.posX}% ${zoomPos.posY}%`,
                        backgroundSize: '350%',
                      }}
                    />
                    <div className="absolute inset-0 rounded-full border border-black/20 shadow-inner" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300">
                  {product.category || 'Bake n\' Flake Fresh Cake'}
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  {lang === 'en' ? product.nameEn : product.nameBn}
                </span>
              </div>
            </div>

            {/* Select Design / Image Variant Selector */}
            {availableImages.length > 1 && (
              <div className="bg-pink-50/60 dark:bg-pink-950/20 p-3 rounded-2xl border border-pink-200/60 dark:border-pink-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={14} className="text-pink-500" />
                    {lang === 'en' ? 'Select Preferred Cake Design / Photo:' : 'ছবি বা ডিজাইন নির্বাচন করুন (কার্টে দেখাবে):'}
                  </span>
                  <span className="text-[11px] text-pink-600 dark:text-pink-400 font-bold">
                    {availableImages.length} {lang === 'en' ? 'designs' : 'টি ডিজাইন'}
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 custom-scrollbar">
                  {availableImages.map((imgSrc, idx) => {
                    const isSelected = (selectedImage || product.img) === imgSrc;
                    const thumbUrl = getOptimizedImageUrl(imgSrc, 150, 75);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(imgSrc)}
                        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-pink-500 ring-2 ring-pink-400 scale-105 shadow-md shadow-pink-500/30' 
                            : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <OptimizedImage
                          src={thumbUrl}
                          alt={`Variant ${idx + 1}`}
                          className="w-full h-full object-cover"
                          width={100}
                        />
                        {isSelected && (
                          <div className="absolute top-0.5 right-0.5 bg-pink-500 text-white p-0.5 rounded-full shadow">
                            <Check size={10} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('options')}
                className={`py-2 px-4 border-b-2 transition-all ${
                  activeTab === 'options'
                    ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {lang === 'en' ? 'Select Options' : 'অপশনসমূহ নির্বাচন করুন'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('care')}
                className={`py-2 px-4 border-b-2 transition-all ${
                  activeTab === 'care'
                    ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {lang === 'en' ? 'Delivery & Care Info' : 'ডেলিভারি ও টেক কেয়ার ইনফো'}
              </button>
            </div>

            {activeTab === 'options' ? (
              <div className="space-y-4">
                {/* EGG OR EGGLESS Option */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-pink-500" />
                    {lang === 'en' ? 'Cake Type (Egg / Eggless):' : 'কেকের ধরন (ডিম / ডিম ছাড়া):'}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setEggType('Eggless (100% Veg)')}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold border transition-all flex items-center justify-center gap-2 ${
                        eggType === 'Eggless (100% Veg)'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/30'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
                      <span>Eggless (100% Veg)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEggType('With Egg')}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold border transition-all flex items-center justify-center gap-2 ${
                        eggType === 'With Egg'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/20 ring-2 ring-amber-500/30'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                      <span>With Egg</span>
                    </button>
                  </div>
                </div>

                {/* Weight Options */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Scale size={14} className="text-pink-500" />
                    {lang === 'en' ? 'Select Weight:' : 'ওজন নির্বাচন করুন:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {WEIGHT_OPTIONS.map((opt) => {
                      const isSelected = selectedWeight === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleWeightSelect(opt)}
                          className={`p-3 rounded-2xl border text-left transition-all relative ${
                            isSelected 
                              ? 'border-pink-500 bg-pink-500/10 text-pink-600 dark:text-pink-400 ring-2 ring-pink-500/30 font-bold' 
                              : 'border-slate-200 dark:border-slate-800 hover:border-pink-300 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                          }`}
                        >
                          <div className="text-xs font-bold">{opt.label}</div>
                          <div className="text-xs font-black text-pink-600 dark:text-pink-400 mt-1">{opt.priceText}</div>
                          {isSelected && (
                            <Check size={16} className="absolute top-2.5 right-2.5 text-pink-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Price dependent notice with WhatsApp button */}
                  <div className="mt-3.5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 space-y-2.5">
                    <div className="flex items-start gap-2.5">
                      <MessageCircle size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                        {lang === 'en' 
                          ? "The price depends on the cake flavor and design complexity. To know the exact price, send your preferred picture to our WhatsApp."
                          : "প্রাইজ টি হল কেকের দাম ফ্লেভার এবং ডিজাইনের জটিলতার ওপর নির্ভর করে। সঠিক দাম জানতে আপনার পছন্দের ছবিটি আমাদের WhatsApp-এ পাঠান।"}
                      </p>
                    </div>
                    <a
                      href={`https://wa.me/917439366657?text=${encodeURIComponent(`Hi Bake n' Flake, I would like to check the exact price and design customization for ${product.nameEn}. Weight: ${selectedWeight}, Flavor: ${selectedFlavour}, Type: ${eggType}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <MessageCircle size={16} className="fill-white text-white" />
                      <span>{lang === 'en' ? 'Send Picture on WhatsApp' : 'WhatsApp-এ ছবি পাঠান ও দাম জানুন'}</span>
                    </a>
                  </div>
                </div>

                {/* Flavour Options */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {lang === 'en' ? 'Flavour:' : 'ফ্লেভার:'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {FLAVOUR_OPTIONS.map(flv => (
                      <button
                        key={flv}
                        type="button"
                        onClick={() => setSelectedFlavour(flv)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                          selectedFlavour === flv
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {flv}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Shape Options */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    {lang === 'en' ? 'Cake Shape:' : 'কেকের শেপ:'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SHAPE_OPTIONS.map(shp => (
                      <button
                        key={shp}
                        type="button"
                        onClick={() => setSelectedShape(shp)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                          selectedShape === shp
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {shp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Location Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin size={14} className="text-pink-500" />
                    {lang === 'en' ? 'Delivery Location:' : 'ডেলিভারি লোকেশন:'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userLocation}
                      onChange={(e) => setUserLocation(e.target.value)}
                      placeholder="Kamalgazi, Garia, Kolkata"
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                      className="px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                    >
                      <Navigation size={12} className={isLocating ? 'animate-spin' : ''} />
                      {isLocating ? 'Detecting...' : 'Auto Detect GPS'}
                    </button>
                  </div>
                </div>

                {/* Preset Messages & Custom Note */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MessageSquare size={14} className="text-pink-500" />
                    {lang === 'en' ? 'Message on Cake (Max 30 Chars):' : 'কেকের উপর বার্তা (সর্বোচ্চ ৩০ অক্ষর):'}
                  </label>
                  
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {PRESET_MESSAGES.map(msg => (
                      <button
                        key={msg}
                        type="button"
                        onClick={() => setCustomNote(msg)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-semibold"
                      >
                        + {msg}
                      </button>
                    ))}
                  </div>

                  <input 
                    type="text"
                    maxLength={30}
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder={lang === 'en' ? 'e.g. "Happy Birthday Rahul!"' : 'যেমন: "হ্যাপি বার্থডে রাহুল!"'}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
                  />
                  <div className="text-[10px] text-slate-400 text-right mt-1">
                    {customNote.length}/30 characters
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {lang === 'en' ? 'Quantity:' : 'পরিমাণ:'}
                  </span>
                  <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-200 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold w-6 text-center text-sm dark:text-white">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-200 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Care Info Tab */
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-1.5">
                  <p className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <Info size={14} /> Care Instructions:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li>Upon receiving, store cream cakes in the refrigerator immediately.</li>
                    <li>Avoid squeezing or tilting the box sides during transport.</li>
                    <li>Serve within 24 hours for optimal fluffy softness.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                  <p className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-500" /> Delivery Guarantee:
                  </p>
                  <p className="text-[11px]">
                    Hand-delivered safely by Bake n' Flake delivery team across Kamalgazi, Garia, and Kolkata.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">{lang === 'en' ? 'Estimated Price' : 'আনুমানিক দাম'}</div>
              <div className="text-lg sm:text-xl font-black text-pink-600 dark:text-pink-400">
                {estPrice > 0 ? `₹${estPrice * quantity}` : selectedOpt.priceText}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={addedSuccess}
              className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                addedSuccess 
                  ? 'bg-emerald-500 shadow-emerald-500/30' 
                  : 'bg-slate-900 hover:bg-slate-800 dark:bg-pink-500 dark:hover:bg-pink-600 shadow-pink-500/20'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check size={18} />
                  {lang === 'en' ? 'Added to Cart!' : 'কার্টে যোগ করা হয়েছে!'}
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  {lang === 'en' ? 'Add to Cart' : 'কার্টে যোগ করুন'}
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Fullscreen Lightbox Pop-up Modal */}
        {isLightboxOpen && (
          <div 
            className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button 
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/40 text-white rounded-full z-10 transition-colors"
              >
                <X size={24} />
              </button>
              <OptimizedImage 
                src={imageUrl} 
                alt={product.nameEn}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                width={1200}
              />
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
