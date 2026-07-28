import React, { useContext, useState, useMemo } from 'react';
import { Star, Filter, Quote, Globe, Facebook, MessageSquare, ThumbsUp, CornerDownRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppContext } from '../App';
import { googleReviewsData, facebookReviewsData } from '../constants/data';
import { cn } from '../lib/utils';

const GOOGLE_REVIEW_LINK = "https://g.page/r/CRgnjQFjh1wREBM/review";
const FACEBOOK_REVIEW_LINK = "https://www.facebook.com/flavoursbymusu/reviews";

export default function Reviews() {
  const { t } = useContext(AppContext);
  const [source, setSource] = useState<'google' | 'facebook'>('google');
  const [filter, setFilter] = useState('relevant');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  
  const rawReviews = source === 'google' ? googleReviewsData : facebookReviewsData;

  const topicList = useMemo(() => {
    if (source === 'google') {
      return [
        { id: 'all', labelEn: 'All', labelBn: 'সব' },
        { id: 'price', labelEn: 'Price', labelBn: 'দাম' },
        { id: 'service', labelEn: 'Service', labelBn: 'সার্ভিস' },
        { id: 'birthday cake', labelEn: 'birthday cake (3)', labelBn: 'বার্থডে কেক (৩)' },
        { id: 'custom cakes', labelEn: 'custom cakes (4)', labelBn: 'কাস্টম কেক (৪)' },
        { id: 'dream cake', labelEn: 'dream cake (3)', labelBn: 'ড্রিম কেক (৩)' },
        { id: 'soft cake', labelEn: 'soft cake (2)', labelBn: 'সফট কেক (২)' }
      ];
    } else {
      return [
        { id: 'all', labelEn: 'All', labelBn: 'সব' },
        { id: 'custom cakes', labelEn: 'custom cakes', labelBn: 'কাস্টম কেক' },
        { id: 'birthday cake', labelEn: 'birthday cake', labelBn: 'বার্থডে কেক' },
        { id: 'service', labelEn: 'service', labelBn: 'সার্ভিস' }
      ];
    }
  }, [source]);

  // Filter & Sort reviews
  const reviews = useMemo(() => {
    let result = [...rawReviews];

    // Filter by topic if selected
    if (selectedTopic !== 'all') {
      result = result.filter(r => 
        r.topics?.includes(selectedTopic) || 
        r.textEn.toLowerCase().includes(selectedTopic.toLowerCase()) ||
        r.textBn.toLowerCase().includes(selectedTopic.toLowerCase())
      );
    }

    // Sort by filter
    return result.sort((a, b) => {
      if (filter === 'highest') {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.date.getTime() - a.date.getTime();
      }
      if (filter === 'lowest') {
        if (a.rating !== b.rating) return a.rating - b.rating;
        return b.date.getTime() - a.date.getTime();
      }
      if (filter === 'newest') {
        return b.date.getTime() - a.date.getTime();
      }
      if (filter === 'relevant') {
        const likesA = a.likes || 0;
        const likesB = b.likes || 0;
        if (likesB !== likesA) return likesB - likesA;
        const hasOwnerReplyA = a.ownerReplyEn ? 1 : 0;
        const hasOwnerReplyB = b.ownerReplyEn ? 1 : 0;
        if (hasOwnerReplyB !== hasOwnerReplyA) return hasOwnerReplyB - hasOwnerReplyA;
        return b.date.getTime() - a.date.getTime();
      }
      return 0;
    });
  }, [rawReviews, selectedTopic, filter]);

  const sortFilters = [
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto px-4">
           {/* Google Stat */}
           <motion.div 
             whileHover={{ y: -8, scale: 1.01 }}
             className="relative p-8 md:p-10 bg-white/50 dark:bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-pink-100/50 dark:border-white/10 shadow-2xl flex flex-col items-center overflow-hidden group transition-all duration-500"
           >
              <a 
                href={GOOGLE_REVIEW_LINK}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 px-6 md:px-8 py-3.5 bg-[#EA4335] rounded-[1.5rem] flex items-center gap-3 text-white font-black uppercase text-[10px] sm:text-xs tracking-[0.2em] mb-6 shadow-[0_10px_30px_rgba(234,67,53,0.4)] transition-all hover:scale-105 active:scale-95 group/btn border border-white/20"
              >
                <div className="flex items-center justify-center w-7 h-7 bg-white rounded-lg shadow-sm shrink-0">
                   <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="w-4 h-4 object-contain" />
                </div>
                <span className="relative z-10">REVIEW US ON GOOGLE</span>
              </a>
              <div className="text-center">
                 <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">4.9 on Google</div>
                 <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-loose opacity-70">(200+ REVIEWS)</div>
                 <div className="flex justify-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" className="text-yellow-400" />) }
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
           </motion.div>

           {/* Facebook Stat */}
           <motion.div 
             whileHover={{ y: -8, scale: 1.01 }}
             className="relative p-8 md:p-10 bg-white/50 dark:bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-pink-100/50 dark:border-white/10 shadow-2xl flex flex-col items-center overflow-hidden group transition-all duration-500"
           >
              <a 
                href={FACEBOOK_REVIEW_LINK}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 px-6 md:px-8 py-3.5 bg-[#1877F2] rounded-[1.5rem] flex items-center gap-3 text-white font-black uppercase text-[10px] sm:text-xs tracking-[0.2em] mb-6 shadow-[0_10px_30px_rgba(24,119,242,0.4)] border border-white/20 transition-all hover:scale-105 active:scale-95 group/btn"
              >
                <Facebook size={18} fill="currentColor" />
                REVIEW US ON FACEBOOK
              </a>
              <div className="text-center">
                 <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">100% on Facebook</div>
                 <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-loose opacity-70">(1K+ REVIEWS)</div>
                 <div className="flex justify-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" className="text-yellow-400" />) }
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1877F2]/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
           </motion.div>
        </div>

        {/* Reviews Main Container */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[3rem] border border-pink-100/50 dark:border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* Platform Toggle Tabs */}
          <div className="flex p-2 gap-2 bg-slate-100/80 dark:bg-white/5 mx-4 sm:mx-8 mt-6 sm:mt-8 rounded-[2rem]">
            <button
              onClick={() => { setSource('google'); setSelectedTopic('all'); }}
              className={cn(
                "flex-1 py-3.5 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-black uppercase tracking-widest transition-all relative rounded-full",
                source === 'google' 
                  ? "text-white bg-[#EA4335] shadow-[0_8px_20px_rgba(234,67,53,0.4)]" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/10"
              )}
            >
              <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-lg shadow-sm shrink-0">
                 <img src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png" alt="Google" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain" />
              </div>
              <span>REVIEWS</span>
              {source === 'google' && <motion.div layoutId="tab-underline" className="absolute inset-0 rounded-full border-2 border-white/30" />}
            </button>
            <button
              onClick={() => { setSource('facebook'); setSelectedTopic('all'); }}
              className={cn(
                "flex-1 py-3.5 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-black uppercase tracking-widest transition-all relative rounded-full",
                source === 'facebook' 
                  ? "text-white bg-[#1877F2] shadow-[0_8px_20px_rgba(24,119,242,0.4)]" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/10"
              )}
            >
              <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-lg shadow-sm shrink-0">
                 <Facebook size={16} className="text-[#1877F2]" fill="currentColor" />
              </div>
              <span>REVIEWS</span>
              {source === 'facebook' && <motion.div layoutId="tab-underline" className="absolute inset-0 rounded-full border-2 border-white/30" />}
            </button>
          </div>

          <div className="p-4 sm:p-8 md:p-12">
            {/* Google Review Summary Bar (Matching Image 3) */}
            {source === 'google' && (
              <div className="mb-10 p-5 sm:p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                        {t.lang === 'en' ? 'Google review summary' : 'গুগল রিভিউ সারসংক্ষেপ'}
                      </h3>
                      <a href={GOOGLE_REVIEW_LINK} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors" title="View on Google">
                        <Globe size={16} />
                      </a>
                    </div>
                    
                    {/* Star Distribution Progress Bars */}
                    <div className="space-y-1.5 max-w-md mt-4">
                      {[
                        { star: 5, pct: '92%' },
                        { star: 4, pct: '5%' },
                        { star: 3, pct: '2%' },
                        { star: 2, pct: '1%' },
                        { star: 1, pct: '0%' },
                      ].map(row => (
                        <div key={row.star} className="flex items-center gap-3 text-xs">
                          <span className="w-3 font-bold text-slate-600 dark:text-slate-400">{row.star}</span>
                          <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: row.pct }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end justify-center shrink-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 pt-4 md:pt-0 md:pl-8">
                    <div className="text-5xl font-black text-slate-900 dark:text-white">4.9</div>
                    <div className="flex gap-1 my-2">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" className="text-amber-400" />)}
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {t.lang === 'en' ? '200+ Google Reviews' : '২০০+ গুগল রিভিউ'}
                    </span>
                  </div>
                </div>

                {/* Topic Tags / Chips Filter (Matching Image 3) */}
                <div className="mt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
                    {t.lang === 'en' ? 'Reviews Keyword Filter' : 'কীওয়ার্ড অনুযায়ী রিভিউ'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {topicList.map(topic => (
                      <button
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic.id)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                          selectedTopic === topic.id
                            ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md scale-105"
                            : "bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-pink-400"
                        )}
                      >
                        {t.lang === 'en' ? topic.labelEn : topic.labelBn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sort Controls (Matching Image 3) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200/60 dark:border-white/10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                <Filter size={14} className="text-pink-500" />
                <span>{t.lang === 'en' ? 'Sort by' : 'বাছাই করুন'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sortFilters.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5",
                      filter === f.id 
                        ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/20" 
                        : "bg-white/80 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-pink-300"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <AnimatePresence mode="popLayout">
                {reviews.map((review, i) => (
                  <motion.div 
                    key={review.nameEn + review.timeEn + i}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 hover:border-pink-300/60 transition-all flex flex-col group h-full shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative shrink-0">
                          <img 
                            src={review.avatar || "https://i.ibb.co/XkYN11bL/PROFILE.jpg"} 
                            alt={review.nameEn} 
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover" 
                            onError={(e) => {
                              e.currentTarget.src = "https://i.ibb.co/XkYN11bL/PROFILE.jpg";
                            }}
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800">
                            {source === 'google' ? <Globe className="text-white" size={10} /> : <Facebook className="text-white" size={10} />}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight">
                            {t.lang === 'en' ? review.nameEn : review.nameBn}
                          </h4>
                          {(review.badgeEn || review.badgeBn) && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                              {t.lang === 'en' ? review.badgeEn : review.badgeBn}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} size={13} fill={j < review.rating ? "currentColor" : "none"} className={j < review.rating ? "text-amber-400" : "text-slate-300 dark:text-slate-600"} />
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-tight">
                              {t.lang === 'en' ? review.timeEn : review.timeBn}
                            </span>
                          </div>
                        </div>
                      </div>

                      {review.likes && review.likes > 0 ? (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          <span>🙏</span>
                          <span>{review.likes}</span>
                        </div>
                      ) : null}
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 flex-grow font-normal">
                      "{t.lang === 'en' ? review.textEn : review.textBn}"
                    </p>

                    {/* Owner Response Box */}
                    {(review.ownerReplyEn || review.ownerReplyBn) && (
                      <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-pink-50/70 dark:bg-pink-950/20 border border-pink-200/50 dark:border-pink-500/20 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-pink-600 dark:text-pink-400 mb-1 text-[11px]">
                          <CornerDownRight size={13} />
                          <span>Bake n' Flake ~ FlavoursbyMusu (owner)</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] sm:text-xs pl-4 font-medium">
                          {t.lang === 'en' ? review.ownerReplyEn : review.ownerReplyBn}
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-auto">
                       <Quote className="text-pink-200 dark:text-pink-900/40" size={20} />
                       <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200/40 dark:border-emerald-500/20">
                          <CheckCircle2 size={10} />
                          <span>VERIFIED</span>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {reviews.length === 0 && (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
                {t.lang === 'en' ? 'No reviews found for this topic.' : 'এই কীওয়ার্ডের জন্য কোনো রিভিউ পাওয়া যায়নি।'}
              </div>
            )}
            
            {/* CTA Button */}
            <div className="mt-12 text-center">
               <a 
                 href={source === 'google' ? GOOGLE_REVIEW_LINK : FACEBOOK_REVIEW_LINK}
                 target="_blank"
                 rel="noreferrer"
                 className="inline-flex items-center gap-2 px-8 sm:px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95 group"
               >
                  <span>{t.lang === 'en' ? 'See More Authentic Reviews' : 'আরও রিভিউ দেখুন'}</span>
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>⫸</motion.span>
               </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

