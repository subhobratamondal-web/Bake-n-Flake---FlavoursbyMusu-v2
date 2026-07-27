import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Sparkles, ShoppingBag, Star, Clock, Heart, ChevronLeft, ChevronRight, Palette } from 'lucide-react';
import { AppContext } from '../App';
import { cn } from '../lib/utils';

import { playSound } from '../lib/sounds';

export default function Hero() {
  const { t, galleryData } = useContext(AppContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featureIndex, setFeatureIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const heroImagesData = (galleryData['Hero Section'] as string[])?.filter(url => url && url.length > 0);
  const heroImages = (heroImagesData && heroImagesData.length > 0) ? heroImagesData : [
    "https://i.ibb.co/QvRWRGy3/POSTER-4.jpg",
    "https://i.ibb.co/DB3XXw4/PIZZA-BUNS-1.png",
    "https://i.ibb.co/ymbNDrks/Brownies-2.jpg",
    "https://i.ibb.co/Dfh5X1tm/TIRE-CAKE.png",
    "https://i.ibb.co/fzVDfmhj/FRESH-FLOWER-CAKE-1.jpg",
    "https://i.ibb.co/9mnwZgX4/TIRE-CAKE1.png"
  ];

  const features = [
    { title: "Made with Love", sub: "Since 2019", icon: Heart, color: "text-pink-500", bg: "bg-white shadow-md" },
    { title: "Custom Designs", sub: "Personalized cakes for your special moments", icon: Palette, color: "text-purple-500", bg: "bg-white shadow-md" },
    { title: "100% Quality", sub: "Premium Ingredients", icon: Star, color: "text-yellow-500", bg: "bg-white shadow-md" },
    { title: "Musu", sub: "Bakery Owner", isAvatar: true, image: "https://i.ibb.co/wrc3VVRg/PROFILE.jpg", link: "https://www.facebook.com/musu.khan99/" }
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatureIndex((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slideFeature = (dir: 'next' | 'prev') => {
    if (dir === 'next') {
      setFeatureIndex((prev) => (prev + 1) % features.length);
    } else {
      setFeatureIndex((prev) => (prev - 1 + features.length) % features.length);
    }
  };

  return (
    <section id="top" className="relative min-h-[110vh] flex flex-col justify-center pt-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-pink-100 dark:bg-pink-900/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100 dark:bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full mb-20 md:mb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-sm">
                <Sparkles className="text-pink-500" size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300">
                  {t.hero.est}
                </span>
              </div>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-white leading-[1.05] mb-8">
              {t.hero.title1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-400 drop-shadow-[0_4px_10px_rgba(236,72,153,0.3)]">
                {t.hero.title2}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-lg lg:ml-0 mx-auto leading-relaxed font-medium">
              {t.hero.desc}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-5">
              <button
                onClick={() => {
                  playSound('ding');
                  const el = document.getElementById('menu');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative px-10 py-5 bg-pink-600 text-white rounded-[2rem] font-bold overflow-hidden shadow-[0_20px_40px_rgba(236,72,153,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 order-btn-neon"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-500 group-hover:opacity-90" />
                <span className="relative flex items-center gap-2 text-lg uppercase tracking-wider">
                  <ShoppingBag size={20} />
                  {t.hero.btn1}
                </span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-[320px] md:max-w-[480px] mx-auto">
              {/* Back Layer 2 - Further offset, NO ROTATION */}
              <div className="absolute inset-x-8 inset-y-8 translate-x-12 translate-y-12 rounded-[3.5rem] md:rounded-[4.5rem] overflow-hidden border border-white/5 shadow-2xl bg-black/10 dark:bg-white/5 backdrop-blur-sm" />

              {/* Back Layer 1 - Shows the next image, NO ROTATION */}
              <div className="absolute inset-0 translate-x-6 translate-y-6 rounded-[3rem] md:rounded-[4rem] overflow-hidden border-2 border-white/10 shadow-2xl bg-black dark:bg-[#080808]">
                 <img 
                   src={heroImages[(currentImageIndex + 1) % heroImages.length]} 
                   className="w-full h-full object-cover opacity-20 blur-[2px]"
                   alt="Next Preview"
                   referrerPolicy="no-referrer"
                   loading="lazy"
                   decoding="async"
                 />
              </div>

              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.92, x: 30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 1.08, x: -30 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 z-10 gpu-accelerated shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-[3rem] md:rounded-[4rem] overflow-hidden border-[6px] border-white/90 dark:border-white/10 shadow-inner"
                >
                  <img
                    src={heroImages[currentImageIndex]}
                    alt="Signature Cake"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </motion.div>
              </AnimatePresence>

              {/* Floating Accents - ADJUSTED POSITIONS WITH ANIMATION */}
              {/* 1. Trending (Pink Pill) - Move Left and Up */}
              <motion.div 
                key={`trend-${currentImageIndex}`}
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-4 -left-6 md:top-10 md:-left-12 z-30 px-6 py-3 rounded-full bg-pink-500/85 backdrop-blur-md text-white text-[10px] md:text-sm font-black uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(236,72,153,0.4)] flex items-center gap-2 border border-white/20"
              >
                <Sparkles size={14} className="fill-white" /> {t.hero.trend}
              </motion.div>

              {/* 2. 100% Fresh - Move further Right */}
              <motion.div 
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-2 -right-6 md:top-4 md:-right-10 z-30 px-5 py-3 rounded-full bg-black/30 backdrop-blur-xl text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border border-white/10 flex items-center gap-3 shadow-2xl"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-pulse" />
                100% Fresh
              </motion.div>

              {/* 3. 100% Rating - Move Down */}
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-4 -left-6 md:bottom-2 md:-left-12 z-30 p-3 md:p-4 rounded-[1.5rem] md:rounded-[2.5rem] bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center gap-3 md:gap-5 min-w-[140px] md:min-w-[200px]"
              >
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-[0.8rem] md:rounded-[1.25rem] bg-yellow-400/20 flex items-center justify-center border border-yellow-400/30 shadow-inner">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                </div>
                <div className="flex flex-col">
                   <span className="text-white font-black text-[10px] md:text-sm uppercase leading-none tracking-tight">100% Rating</span>
                   <span className="text-white/50 text-[8px] md:text-[10px] font-bold mt-1 uppercase tracking-widest leading-none">1K+ Reviews</span>
                </div>
              </motion.div>

              {/* 4. OWNER Accent (FaceBook Link) */}
              <motion.a 
                href="https://www.facebook.com/musu.khan99/"
                target="_blank"
                rel="noreferrer"
                animate={{ y: [7, -7, 7] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                className="absolute bottom-10 -right-4 md:bottom-20 md:-right-12 z-40 p-3 md:p-4 rounded-[1.5rem] md:rounded-[2.5rem] glow-tag-pink flex items-center gap-2 md:gap-4 min-w-[130px] md:min-w-[180px] hover:scale-105 transition-transform"
              >
                <div className="w-8 h-8 md:w-11 md:h-11 rounded-[0.8rem] md:rounded-[1.25rem] overflow-hidden border-2 border-white/40 shadow-lg shrink-0">
                  <img src="https://i.ibb.co/wrc3VVRg/PROFILE.jpg" alt="Musu" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                </div>
                <div className="flex flex-col">
                   <span className="text-white font-black text-[8px] md:text-xs uppercase leading-none tracking-widest">OWNER</span>
                   <span className="text-white/80 text-[8px] md:text-[10px] font-bold mt-1 uppercase tracking-widest leading-none">~ Musu</span>
                </div>
              </motion.a>

              {/* Slider Controls */}
              <div className="absolute -left-8 md:-left-16 top-1/2 -translate-y-1/2 z-20">
                <button 
                  onClick={() => {
                    playSound('pop');
                    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
                  }}
                  className="p-4 md:p-5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all shadow-2xl group active:scale-95"
                >
                  <ChevronLeft size={24} className="text-white/80 group-hover:text-white" />
                </button>
              </div>
              <div className="absolute -right-8 md:-right-16 top-1/2 -translate-y-1/2 z-20">
                <button 
                  onClick={() => {
                    playSound('pop');
                    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
                  }}
                  className="p-4 md:p-5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all shadow-2xl group active:scale-95"
                >
                  <ChevronRight size={24} className="text-white/80 group-hover:text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature Navigation Carousel - Bottom Bar */}
      <div className="w-full border-t border-slate-200 dark:border-white/5 bg-white/20 dark:bg-white/5 backdrop-blur-3xl py-10 md:py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 relative flex items-center">
            {/* Navigation Arrows for Mobile */}
            <button 
              onClick={() => slideFeature('prev')}
              className="absolute left-1 z-10 p-2 md:p-3 rounded-full glass-3d md:hidden hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={20} className="text-pink-600" />
            </button>

            <div className="overflow-hidden w-full px-8 md:px-0">
              <motion.div 
                animate={{ x: isMobile ? `-${featureIndex * 100}%` : '0%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex md:grid md:grid-cols-4 w-full"
              >
                {features.map((feature, i) => (
                  <div 
                    key={i} 
                    className="flex-shrink-0 w-full md:w-auto px-4 border-r last:border-r-0 border-slate-200 dark:border-white/10 flex justify-center items-center"
                  >
                    <a
                      href={(feature as any).link}
                      target={(feature as any).link ? "_blank" : undefined}
                      rel={(feature as any).link ? "noreferrer" : undefined}
                      className={cn(
                        "flex items-center justify-center md:justify-start gap-4 lg:gap-6 group text-left w-full max-w-[280px]",
                        (feature as any).link ? "cursor-pointer" : "cursor-default"
                      )}
                    >
                      <div className={cn(
                        "w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-500",
                        feature.bg || "bg-slate-100"
                      )}>
                        {feature.isAvatar ? (
                          <div className="w-full h-full rounded-full overflow-hidden border-2 border-pink-500/30">
                            <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                        ) : (
                          <feature.icon className={feature.color} size={28} />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h4 className={cn(
                          "text-base md:text-lg font-black uppercase tracking-tight transition-colors",
                          (feature as any).link || feature.isAvatar ? "text-pink-600" : "text-slate-800 dark:text-gray-100 group-hover:text-pink-600"
                        )}>
                          {feature.isAvatar ? `~ ${feature.title}` : feature.title}
                        </h4>
                        <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider line-clamp-1">
                          {feature.sub}
                        </p>
                      </div>
                    </a>
                  </div>
                ))}
              </motion.div>
            </div>

            <button 
              onClick={() => slideFeature('next')}
              className="absolute right-1 z-10 p-2 md:p-3 rounded-full glass-3d md:hidden hover:scale-110 active:scale-95"
            >
              <ChevronRight size={20} className="text-pink-600" />
            </button>
        </div>
      </div>
    </section>
  );
}
