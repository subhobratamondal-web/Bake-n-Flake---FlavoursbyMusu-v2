import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import { AppContext } from '../App';
import { cn } from '../lib/utils';
import { getOptimizedImageUrl } from '../utils/googleSheetsSync';

export default function Story() {
  const { t, galleryData } = useContext(AppContext);
  const [currentSlide, setCurrentSlide] = useState(0);

  const storyImagesData = (galleryData['Story Section'] as string[])?.filter(url => url && url.length > 0);
  const storyImages = (storyImagesData && storyImagesData.length > 0) ? storyImagesData : [
    "https://i.ibb.co/XkYN11bL/PROFILE.jpg",
    "https://bakings.in/wp-content/uploads/2024/04/Rose-Symphony-Cake.jpg",
    "https://bakings.in/wp-content/uploads/2024/04/Chocolate-Overload-Photo-Cake.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % storyImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [storyImages.length]);

  return (
    <section id="story" className="py-24 bg-transparent relative transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
             {/* Slider Container */}
             <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.3)] relative z-10 border-8 border-white dark:border-white/5 bg-white/5 neon-border-pink">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img 
                    key={currentSlide}
                    initial={{ x: currentSlide % 2 === 0 ? "100%" : "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: currentSlide % 2 === 0 ? "-100%" : "100%" }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    src={getOptimizedImageUrl(storyImages[currentSlide], 800, 80)}
                    alt="Our Story" 
                    className="absolute inset-0 w-full h-full object-cover"
                    decoding="async"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedOriginal) {
                        target.dataset.triedOriginal = 'true';
                        target.src = storyImages[currentSlide] || "https://i.ibb.co/XkYN11bL/PROFILE.jpg";
                      }
                    }}
                  />
                </AnimatePresence>
             </div>

             {/* OWNER Floating Accent for Story Slider */}
             <motion.a 
               href="https://www.facebook.com/musu.khan99/"
               target="_blank"
               rel="noreferrer"
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="absolute bottom-4 -right-4 md:bottom-12 md:-right-16 z-30 p-3 md:p-5 rounded-[1.5rem] md:rounded-[2.5rem] glow-tag-pink flex items-center gap-3 md:gap-4 min-w-[120px] md:min-w-[180px] hover:scale-105 transition-transform"
             >
               <div className="w-8 h-8 md:w-12 md:h-12 rounded-[0.8rem] md:rounded-[1.25rem] overflow-hidden border-2 border-white/40 shadow-lg shrink-0">
                 <img src="https://i.ibb.co/wrc3VVRg/PROFILE.jpg" alt="Musu" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               </div>
               <div className="flex flex-col">
                  <span className="text-white font-black text-[8px] md:text-sm uppercase leading-none tracking-widest">OWNER</span>
                  <span className="text-white/80 text-[8px] md:text-xs font-bold mt-0.5 md:mt-1 uppercase tracking-widest leading-none">~ Musu</span>
               </div>
             </motion.a>
             
             {/* Decorative Background Blob */}
             <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-400/20 dark:bg-pink-900/10 rounded-full blur-[100px] -z-0 animate-blob" />
             <div className="absolute top-0 -right-10 w-40 h-40 bg-rose-400/20 dark:bg-rose-900/10 rounded-full blur-[60px] -z-0 animate-blob" style={{ animationDelay: '2s' }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="inline-flex items-center justify-center gap-3 p-4 rounded-2xl bg-white dark:bg-white/5 shadow-2xl shadow-pink-500/10 border border-pink-100 dark:border-white/10 group">
                 <Sparkles className="text-pink-500 transform group-hover:scale-110 transition-transform drop-shadow-[0_4px_4px_rgba(236,72,153,0.3)]" size={32} />
              </div>
            </div>
            <p className="text-pink-600 dark:text-pink-400 font-black tracking-[0.3em] uppercase text-[10px] md:text-xs">
              {t.lang === 'en' ? 'Our Journey' : 'আমাদের যাত্রা'}
            </p>
            
            <h2 className="font-serif text-3xl md:text-6xl font-bold text-slate-900 dark:text-white mt-4 mb-8 tracking-tighter">
              {t.lang === 'en' ? 'Crafting Happiness Since 2019' : '২০১৯ থেকে সুখ তৈরি করছি'}
            </h2>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium">
              {t.story.desc}
            </p>

            <div className="grid grid-cols-2 gap-8">
              {[
                { val: t.story.stat1Val, label: t.story.stat1, icon: Heart },
                { val: t.story.stat2Val, label: t.story.stat2, icon: Sparkles }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-pink-100/50 dark:border-white/10"
                >
                  <div className="w-12 h-12 bg-pink-50 dark:bg-pink-900/30 rounded-2xl flex items-center justify-center mb-4">
                     <stat.icon className="text-pink-500" size={24} />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.val}</div>
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
