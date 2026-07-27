import React, { useContext, useState } from 'react';
import { Star, Filter, Quote, Globe, Facebook, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppContext } from '../App';
import { googleReviewsData, facebookReviewsData } from '../constants/data';
import { cn } from '../lib/utils';

export default function Reviews() {
  const { t } = useContext(AppContext);
  const [source, setSource] = useState<'google' | 'facebook'>('google');
  const [filter, setFilter] = useState('relevant');
  
  const rawReviews = source === 'google' ? googleReviewsData : facebookReviewsData;
  
  const reviews = React.useMemo(() => {
    return [...rawReviews].sort((a, b) => {
      if (filter === 'highest') return b.rating - a.rating;
      if (filter === 'lowest') return a.rating - b.rating;
      if (filter === 'newest') return b.date.getTime() - a.date.getTime();
      if (filter === 'relevant') {
        const lenA = (t.lang === 'en' ? (a.textEn || '') : (a.textBn || '')).length;
        const lenB = (t.lang === 'en' ? (b.textEn || '') : (b.textBn || '')).length;
        if (lenA !== lenB) return lenB - lenA;
        return b.rating - a.rating;
      }
      return 0;
    });
  }, [rawReviews, filter, t.lang]);

  const getReviewUrl = () => {
    if (source === 'google') return "https://www.google.com/search?q=Bake+n%27+Flake+~+FlavoursbyMusu+reviews";
    return "https://www.facebook.com/flavoursbymusu/reviews";
  };

  const filters = [
    { id: 'relevant', label: t.reviews.filter1 },
    { id: 'newest', label: t.reviews.filter2 },
    { id: 'highest', label: t.reviews.filter3 },
    { id: 'lowest', label: t.reviews.filter4 }
  ];

  return (
    <section id="reviews" className="py-24 bg-transparent relative transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-6 p-4 rounded-2xl bg-white dark:bg-white/5 shadow-2xl shadow-pink-500/10 border border-pink-100 dark:border-white/10 group">
             <MessageSquare className="text-pink-500 transform group-hover:scale-110 transition-transform drop-shadow-[0_4px_4px_rgba(236,72,153,0.3)]" size={32} />
          </div>
          <p className="text-pink-600 dark:text-pink-400 font-black tracking-[0.3em] uppercase text-[10px] md:text-xs">
             {t.lang === 'en' ? 'Testimonials' : 'প্রশংসাপত্র'}
          </p>
          <h2 className="font-serif text-3xl md:text-7xl font-bold text-slate-900 dark:text-white mt-4 tracking-tighter">
            {t.lang === 'en' ? 'Our Beloved Community' : 'আমাদের প্রিয় সম্প্রদায়'}
          </h2>
        </div>

        {/* Top Floating Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-4xl mx-auto px-4">
           {/* Google Stat */}
                <motion.div 
                 whileHover={{ y: -10, scale: 1.02 }}
                 className="relative p-8 md:p-10 bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-pink-100/50 dark:border-white/10 shadow-2xl flex flex-col items-center overflow-hidden group transition-all duration-500 gpu-accelerated"
               >
                  <a 
                    href="https://maps.app.goo.gl/xdx3E56QMbxhrSNK9"
                    target="_blank"
                    rel="noreferrer"
                    className="relative z-10 px-6 md:px-8 py-3.5 bg-[#EA4335] rounded-[1.5rem] flex items-center gap-4 text-white font-black uppercase text-[10px] tracking-[0.2em] mb-8 shadow-[0_10px_30px_rgba(234,67,53,0.4)] transition-all hover:scale-105 active:scale-95 group/btn overflow-hidden border border-white/20"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm shrink-0">
                       <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="relative z-10">Review us on Google</span>
                    {/* Rainbow Glow Hover Effect */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
                  </a>
              <div className="text-center">
                 <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">4.9 on Google</div>
                 <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-loose opacity-60">(200+ REVIEWS)</div>
                 <div className="flex justify-center gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={22} fill="currentColor" className="text-yellow-400" />) }
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
           </motion.div>

           {/* Facebook Stat */}
           <motion.div 
             whileHover={{ y: -10, scale: 1.02 }}
             className="relative p-8 md:p-10 bg-white/40 dark:bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-pink-100/50 dark:border-white/10 shadow-2xl flex flex-col items-center overflow-hidden group transition-all duration-500"
           >
              <a 
                href="https://www.facebook.com/flavoursbymusu/reviews"
                target="_blank"
                rel="noreferrer"
                className="relative z-10 px-8 py-3.5 bg-[#1877F2] rounded-[1.5rem] flex items-center gap-3 text-white font-black uppercase text-[10px] tracking-[0.2em] mb-8 shadow-[0_10px_30px_rgba(24,119,242,0.4)] border border-white/20 transition-all hover:scale-105 active:scale-95 group/btn"
              >
                <Facebook size={18} fill="currentColor" />
                Review us on Facebook
                <motion.div 
                  className="absolute inset-0 rounded-[1.5rem] bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity" 
                />
              </a>
              <div className="text-center">
                 <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">100% on Facebook</div>
                 <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-loose opacity-60">(1K+ REVIEWS)</div>
                 <div className="flex justify-center gap-1 mt-4">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={22} fill="currentColor" className="text-yellow-400" />) }
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1877F2]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
           </motion.div>
        </div>

        {/* Reviews Main Container */}
        <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-pink-100/50 dark:border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* Main Tabs */}
          <div className="flex p-2 gap-2 bg-slate-100 dark:bg-white/5 mx-8 mt-8 rounded-[2rem]">
            <button
              onClick={() => setSource('google')}
              className={cn(
                "flex-1 py-4 flex items-center justify-center gap-3 text-xs md:text-sm font-black uppercase tracking-widest transition-all relative rounded-full",
                source === 'google' 
                  ? "text-white bg-[#EA4335] shadow-[0_8px_20px_rgba(234,67,53,0.4)]" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/10"
              )}
            >
              <div className="flex items-center justify-center w-7 h-7 bg-white rounded-lg shadow-sm shrink-0">
                 <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="w-4 h-4 object-contain" />
              </div>
              Reviews
              {source === 'google' && <motion.div layoutId="tab-underline" className="absolute inset-0 rounded-full border-2 border-white/30" />}
            </button>
            <button
              onClick={() => setSource('facebook')}
              className={cn(
                "flex-1 py-4 flex items-center justify-center gap-3 text-xs md:text-sm font-black uppercase tracking-widest transition-all relative rounded-full",
                source === 'facebook' 
                  ? "text-white bg-[#1877F2] shadow-[0_8px_20px_rgba(24,119,242,0.4)]" 
                  : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/10"
              )}
            >
              <div className="flex items-center justify-center w-7 h-7 bg-white rounded-lg shadow-sm shrink-0">
                 <Facebook size={16} className="text-[#1877F2]" fill="currentColor" />
              </div>
              Reviews
              {source === 'facebook' && <motion.div layoutId="tab-underline" className="absolute inset-0 rounded-full border-2 border-white/30" />}
            </button>
          </div>

          <div className="p-8 md:p-12">
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {filters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border",
                    filter === f.id 
                      ? "bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-500/30" 
                      : "bg-white/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-pink-100 dark:border-white/10 hover:border-pink-300"
                  )}
                >
                  {filter === f.id && <Filter size={14} />}
                  {f.label}
                </button>
              ))}
            </div>

            {/* Review Cards */}
            <div className="grid md:grid-cols-2 gap-8">
              <AnimatePresence>
                {reviews.map((review, i) => (
                  <motion.div 
                    key={review.nameEn + i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-pink-50 dark:border-white/5 hover:border-pink-200 transition-all flex flex-col group h-full shadow-lg"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="relative">
                        <img src={review.avatar} alt={review.nameEn} className="w-14 h-14 rounded-full border-2 border-white dark:border-matte" />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-matte">
                          {source === 'google' ? <Globe className="text-white" size={10} /> : <Facebook className="text-white" size={10} />}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">
                          {t.lang === 'en' ? review.nameEn : review.nameBn}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} size={12} fill={j < review.rating ? "currentColor" : "none"} className={j < review.rating ? "text-yellow-400" : "text-slate-300"} />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                            {t.lang === 'en' ? "1 month ago" : "১ মাস আগে"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-grow font-medium">
                      "{t.lang === 'en' ? review.textEn : review.textBn}"
                    </p>
                    
                    <div className="pt-6 border-t border-pink-50 dark:border-white/5 flex items-center justify-between">
                       <Quote className="text-pink-100 dark:text-pink-900/30" size={24} />
                       <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full">VERIFIED</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="mt-16 text-center">
               <a 
                 href="https://maps.app.goo.gl/xdx3E56QMbxhrSNK9"
                 target="_blank"
                 rel="noreferrer"
                 className="inline-block px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 group"
               >
                  See More Authentic Reviews <motion.div className="inline-block" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>⫸</motion.div>
               </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
