import React, { useContext, useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useSwipeable } from 'react-swipeable';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { getOptimizedImageUrl } from '../utils/googleSheetsSync';
import { OptimizedImage } from './OptimizedImage';
import { GalleryItemSkeleton } from './common/Skeleton';

const useImagePreloader = (items: any[], currentIndex: number | null, itemsToShow: number = 1) => {
  useEffect(() => {
    if (!items || items.length === 0) return;
    
    let isCancelled = false;

    const preloadImages = () => {
      // 1. Prioritize visible images of the currently active tab
      const startIdx = currentIndex !== null ? currentIndex : 0;
      const immediateCount = Math.min(itemsToShow + 1, items.length);
      
      for (let i = 0; i < immediateCount; i++) {
        const idx = (startIdx + i) % items.length;
        if (items[idx]?.img) {
          const img = new Image();
          img.src = items[idx].img;
        }
      }

      // 2. Defer preloading the rest of the active tab's items so it doesn't block initial render
      const deferPreload = () => {
        if (isCancelled) return;
        items.forEach((item, idx) => {
          const isImmediate = idx >= startIdx && idx < startIdx + immediateCount;
          // Also handle wrap-around if needed, but for simplicity we just skip the simple case
          if (!isImmediate && item.img) {
              const img = new Image();
              img.src = item.img;
          }
        });
      };

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(deferPreload);
      } else {
        setTimeout(deferPreload, 200);
      }
    };

    preloadImages();

    return () => {
      isCancelled = true;
    };
  }, [currentIndex, items, itemsToShow]);
};
import { AppContext } from '../App';
import { flavours, gifts, moreOptionsData } from '../constants/data';
import { ChevronLeft, ChevronRight, Cake, Heart, Sparkles, Gift, MoreHorizontal, Instagram } from 'lucide-react';
import { cn } from '../lib/utils';

// Components and Icons

const categoryDefaults = {
  'Signature Menu': {
    en: 'Indulge in our classic, premium range of artisanal cakes.',
    bn: 'আমাদের ক্লাসিক এবং প্রিমিয়াম আর্টিসানাল কেকের স্বাদ নিন।'
  },
  'Thoughtful Gifting': {
    en: 'Surprise your loved ones with specialized celebration treats.',
    bn: 'বিশেষ উদযাপনের উপহার দিয়ে আপনার প্রিয়জনদের অবাক করে দিন।'
  },
  'Something More': {
    en: 'Explore unique themes, bento cakes, and savory delights.',
    bn: 'অনন্য থিম, বেন্তো কেক এবং নোনতা খাবারের আনন্দ উপভোগ করুন।'
  },
  'Social Feeds': {
    en: 'Real-time updates from our kitchen and customer favorites.',
    bn: 'আমাদের রান্নাঘর থেকে সরাসরি আপডেট এবং গ্রাহকদের পছন্দের মুহূর্ত।'
  }
};

const contactInfo = [
  { icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670051.png', label: 'WhatsApp', link: 'https://wa.me/918918883329', color: 'bg-[#25D366]' },
  { icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968771.png', label: 'Messenger', link: 'https://m.me/bakenflake.musu', color: 'bg-[#0084FF]' },
  { icon: 'https://cdn-icons-png.flaticon.com/512/483/483947.png', label: 'Call', link: 'tel:+918918883329', color: 'bg-[#FF4B2B]' }
];

export default function GallerySection() {
  const { galleryData, lang, theme } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'Signature Menu' | 'Thoughtful Gifting' | 'Something More' | 'Social Feeds'>('Signature Menu');
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [feedsLoading, setFeedsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isSectionInView = useInView(sectionRef, { amount: 0.1 });
  const elfsightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle Feeds Loading State and Branding Removal
  useEffect(() => {
    if (activeTab === 'Social Feeds') {
      setFeedsLoading(true);
      const timer = setTimeout(() => setFeedsLoading(false), 2500);

      // Dynamic branding removal attempt
      const cleanupInterval = setInterval(() => {
        const brandingElements = document.querySelectorAll(`
          div[class*="Badge__Container"], 
          div[class*="Badge__Component"], 
          [class*="WidgetToolbar"], 
          [class*="Badge__Wrapper"], 
          a[href*="elfsight.com"]
        `);
        brandingElements.forEach(el => {
          (el as HTMLElement).style.display = 'none';
          (el as HTMLElement).style.opacity = '0';
          (el as HTMLElement).style.pointerEvents = 'none';
        });
      }, 500);

      return () => {
        clearTimeout(timer);
        clearInterval(cleanupInterval);
      };
    }
  }, [activeTab]);

  // Helper to map sheet section strings to known IDs
  const mapSection = (s: string) => {
    if (!s) return 'Signature';
    const normalized = s.toLowerCase().trim();
    if (normalized === 'true' || normalized === 'false') return 'Signature';
    if (normalized === 'signature' || normalized === 'কেকস' || normalized === 'cakes') return 'Signature';
    if (normalized === 'gifting' || normalized === 'gifts' || normalized === 'উপহার') return 'Gifting';
    if (normalized === 'more' || normalized === 'more items' || normalized === 'অন্যান্য') return 'More';
    if (normalized.includes('signature')) return 'Signature';
    if (normalized.includes('gifting')) return 'Gifting';
    if (normalized.includes('something more') || normalized.includes('explore the rest')) return 'More';
    if (normalized.includes('কেকস') || normalized.includes('cake')) return 'Signature';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  // Filter items based on active tab
  const items = useMemo(() => {
    if (activeTab === 'Social Feeds') return [];
    
    let dynamicItems = [...(galleryData.items || [])];
    
    const appendMissing = (arr: any[], sectionName: string) => {
        arr.forEach(a => {
           if (!dynamicItems.some(di => 
               String(di.nameEn || di.name || di.title || '').trim().toLowerCase() === String(a.nameEn).trim().toLowerCase()
           )) {
               let finalImg = a.img;
               const normalizeKey = (str: string) => (str || '').trim().toLowerCase().replace(/s$/, '');
               const nameKey = Object.keys(galleryData).find(k => normalizeKey(k) === normalizeKey(a.nameEn) || normalizeKey(k) === normalizeKey(a.nameBn)) || a.nameEn;
               
               if (galleryData[nameKey] && Array.isArray(galleryData[nameKey]) && galleryData[nameKey].length > 0) {
                   const validImgs = galleryData[nameKey].filter((url: any) => typeof url === 'string' && url.trim() !== '');
                   if (validImgs.length > 0) finalImg = validImgs[0];
               }
               dynamicItems.push({ ...a, section: sectionName, img: finalImg });
           }
        });
    };
    
    appendMissing(flavours, 'Signature');
    appendMissing(gifts, 'Gifting');
    appendMissing(moreOptionsData, 'More');

    // Group all items dynamically based on their section (map it correctly)
    const baseItems = dynamicItems.map((it: any) => ({
        nameEn: String(it.nameEn || it.name || it.title || ''),
        nameBn: String(it.nameBn || it.title || it.name || ''),
        img: it.img || it.url || it.image || it.Image || it.Img || it.URL || '',
        category: mapSection(String(it.category || it.section || '')),
        descEn: it.descEn || '',
        descBn: it.descBn || ''
    }));

    // For Gallery tabs, we map 'Signature Menu' to 'Signature', 'Thoughtful Gifting' to 'Gifting', 'Something More' to 'More', 
    // but also allow catching anything else under 'Something More'.
    const targetCategory = 
      activeTab === 'Signature Menu' ? 'Signature' :
      activeTab === 'Thoughtful Gifting' ? 'Gifting' :
      activeTab === 'Something More' ? 'More' : activeTab;

    let filteredBase = baseItems.filter(it => {
      // If "Something More" tab is selected, grab 'More' AND any unmapped custom categories
      if (targetCategory === 'More') {
        return it.category === 'More' || (it.category !== 'Signature' && it.category !== 'Gifting');
      }
      return it.category === targetCategory || it.category.includes(targetCategory);
    });

    const finalItems: any[] = [];
    const seenImages = new Set();
    
    // Expand to include all subsheet images just like the Menu does
    filteredBase.forEach(item => {
        let imgs: string[] = [];
        
        // Find matching key even if there are trailing spaces or plural differences
        const normalizeKey = (str: string) => (str || '').trim().toLowerCase().replace(/s$/, '');
        const nameKey = Object.keys(galleryData).find(k => normalizeKey(k) === normalizeKey(item.nameEn) || normalizeKey(k) === normalizeKey(item.nameBn)) || item.nameEn;
        const sheetImages = galleryData[nameKey];
        
        if (Array.isArray(sheetImages)) {
            imgs = sheetImages.filter(url => typeof url === 'string' && url.trim() !== '');
        }
        
        // Use thumbnail if no subsheet images
        if (imgs.length === 0 && item.img) {
            imgs = [item.img];
        }

        imgs.forEach(url => {
            if (!seenImages.has(url)) {
                seenImages.add(url);
                finalItems.push({
                   ...item,
                   img: url
                });
            }
        });
    });

    return finalItems;
  }, [activeTab, galleryData]);

  // Auto Tab Switcher (Every 3 minutes)
  useEffect(() => {
    const tabOrder: Array<'Signature Menu' | 'Thoughtful Gifting' | 'Something More' | 'Social Feeds'> = [
      'Social Feeds', 'Signature Menu', 'Thoughtful Gifting', 'Something More'
    ];
    
    const interval = setInterval(() => {
      setActiveTab(prev => {
        const currentIndex = tabOrder.indexOf(prev);
        const nextIndex = (currentIndex + 1) % tabOrder.length;
        return tabOrder[nextIndex];
      });
    }, 180000); // 3 minutes

    return () => clearInterval(interval);
  }, []);

  const itemsToShow = isMobile ? 1 : 3;
  const maxIndex = Math.max(0, items.length - itemsToShow);

  const next = () => setIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  const prev = () => setIndex(prev => (prev <= 0 ? maxIndex : prev - 1));

  const nextLightbox = () => lightboxIndex !== null && setLightboxIndex((lightboxIndex + 1) % items.length);
  const prevLightbox = () => lightboxIndex !== null && setLightboxIndex((lightboxIndex - 1 + items.length) % items.length);

  useImagePreloader(items, lightboxIndex, 1);
  useImagePreloader(items, index, itemsToShow);

  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    trackMouse: true
  });

  const lightboxHandlers = useSwipeable({
    onSwipedLeft: () => nextLightbox(),
    onSwipedRight: () => prevLightbox(),
    trackMouse: true
  });

  // Clamp index if items are removed during sync
  useEffect(() => {
    if (index > maxIndex) {
      setIndex(maxIndex);
    }
  }, [maxIndex, index]);

  // Reset index when tab changes
  useEffect(() => {
    setIndex(0);
  }, [activeTab]);

  // Autoplay
  useEffect(() => {
    if (items.length <= itemsToShow || activeTab === 'Social Feeds') return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [items.length, itemsToShow, activeTab]);

  // Handle Elfsight Script Loading
  useEffect(() => {
    if (activeTab === 'Social Feeds') {
      const script = document.createElement('script');
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
         // Optionally remove script but Elfsight usually handles it
      };
    }
  }, [activeTab]);

  const getCount = (tabName: string) => {
    const targetCategory = 
      tabName === 'Signature Menu' ? 'Signature' :
      tabName === 'Thoughtful Gifting' ? 'Gifting' :
      tabName === 'Something More' ? 'More' : tabName;

    let dynamicItems = [...(galleryData.items || [])];
    
    const appendMissing2 = (arr: any[], sectionName: string) => {
        arr.forEach(a => {
           if (!dynamicItems.some(di => 
               String(di.nameEn || di.name || di.title || '').trim().toLowerCase() === String(a.nameEn).trim().toLowerCase()
           )) {
               let finalImg = a.img;
               const normalizeKey = (str: string) => (str || '').trim().toLowerCase().replace(/s$/, '');
               const nameKey = Object.keys(galleryData).find(k => normalizeKey(k) === normalizeKey(a.nameEn) || normalizeKey(k) === normalizeKey(a.nameBn)) || a.nameEn;
               
               if (galleryData[nameKey] && Array.isArray(galleryData[nameKey]) && galleryData[nameKey].length > 0) {
                   const validImgs = galleryData[nameKey].filter((url: any) => typeof url === 'string' && url.trim() !== '');
                   if (validImgs.length > 0) finalImg = validImgs[0];
               }
               dynamicItems.push({ ...a, section: sectionName, img: finalImg });
           }
        });
    };

    appendMissing2(flavours, 'Signature');
    appendMissing2(gifts, 'Gifting');
    appendMissing2(moreOptionsData, 'More');

    const baseItems = dynamicItems.map((it: any) => ({
      nameEn: String(it.nameEn || it.name || it.title || ''),
      img: it.img || it.url || it.image || it.Image || it.Img || it.URL || '',
      category: mapSection(String(it.category || it.section || ''))
    }));
    
    let filteredBase = baseItems.filter(it => {
      if (targetCategory === 'More') {
        return it.category === 'More' || (it.category !== 'Signature' && it.category !== 'Gifting');
      }
      return it.category === targetCategory || it.category.includes(targetCategory);
    });

    const seenImages = new Set();
    filteredBase.forEach((item: any) => {
        let imgs: string[] = [];
        // Find matching key even if there are trailing spaces or plural differences
        const normalizeKey = (str: string) => (str || '').trim().toLowerCase().replace(/s$/, '');
        const nameKey = Object.keys(galleryData).find(k => normalizeKey(k) === normalizeKey(item.nameEn) || normalizeKey(k) === normalizeKey(item.nameBn)) || item.nameEn;
        const sheetImages = galleryData[nameKey];
        
        if (Array.isArray(sheetImages)) {
            imgs = sheetImages.filter(url => typeof url === 'string' && url.trim() !== '');
        }
        if (imgs.length === 0 && item.img) {
            imgs = [item.img];
        }
        imgs.forEach(url => seenImages.add(url));
    });

    return seenImages.size;
  };

  const tabs = [
    { id: 'Social Feeds', en: 'Feeds', bn: 'সোশ্যাল ফিড', icon: Instagram, count: 'Live' },
    { id: 'Signature Menu', en: 'Cakes', bn: 'সিগনেচার মেনু', icon: Cake, count: getCount('Signature Menu') },
    { id: 'Thoughtful Gifting', en: 'Gifts', bn: 'গিফটিং', icon: Gift, count: getCount('Thoughtful Gifting') },
    { id: 'Something More', en: 'More', bn: 'আরো অনেক', icon: MoreHorizontal, count: getCount('Something More') }
  ];

  return (
    <section ref={sectionRef} id="gallery" className="py-24 bg-transparent relative overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-6 p-4 rounded-[2rem] glass-3d neon-border-pink group">
             <Heart className="text-pink-500 transform group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" size={32} />
          </div>
          <p className="text-pink-600 dark:text-pink-400 font-black tracking-[0.3em] uppercase text-[10px] md:text-xs">
             {lang === 'en' ? 'Visual Delight' : 'ভিজ্যুয়াল ডিলাইট'}
          </p>
          <h2 className="font-serif text-3xl md:text-7xl font-bold text-slate-900 dark:text-white mt-4 tracking-tighter">
            {lang === 'en' ? 'Our Gallery' : 'আমাদের গ্যালারি'}
          </h2>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap overflow-x-auto hide-scrollbar snap-x snap-mandatory items-center justify-center gap-3 md:gap-4 mb-16 px-4 md:px-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "relative flex-shrink-0 snap-center flex items-center gap-2 md:gap-3 px-5 md:px-6 py-2.5 md:py-3 rounded-2xl transition-all duration-300 font-bold text-[10px] md:text-sm tracking-widest uppercase mb-2",
                  isActive 
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-500/30 scale-105" 
                    : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
                )}
              >
                <Icon size={18} className={cn(isActive ? "animate-pulse" : "")} />
                <span>{lang === 'en' ? tab.en : tab.bn}</span>
                <span className={cn(
                  "ml-1 text-[10px] px-2 py-0.5 rounded-full",
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-pink-400"
                )}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab !== 'Social Feeds' ? (
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative group px-0 md:px-12"
            >
              <div className="overflow-hidden w-full" {...handlers}>
                {items.length > 0 ? (
                  <motion.div 
                     animate={{ x: `-${(index * 100) / items.length}%` }}
                     transition={{ type: "spring", stiffness: 100, damping: 20 }}
                     className="flex relative"
                     style={{ width: `${(items.length * 100) / itemsToShow}%` }}
                  >
                     {items.map((item, i) => (
                       <motion.div 
                         key={`${activeTab}-${i}`}
                         className={cn(
                           "flex-shrink-0 px-2 sm:px-4",
                         )}
                         style={{ width: `${100 / items.length}%` }}
                         onClick={() => setLightboxIndex(i)}
                       >
                       <div className="bg-white dark:bg-white/5 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white dark:border-white/10 group/card transition-all duration-500 relative aspect-[4/5] cursor-pointer bg-slate-100 dark:bg-black/30">
                          <OptimizedImage 
                            src={item.img} 
                            alt={item.nameEn}
                            width={500}
                            quality={75}
                            fallbackSrc="https://i.ibb.co/XkYN11bL/PROFILE.jpg"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 z-10 pointer-events-none">
                             <div className="translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
                                <h3 className="font-serif text-lg md:text-xl font-black text-white mb-2 drop-shadow-md">
                                   {lang === 'en' ? item.nameEn : item.nameBn}
                                </h3>
                                <div className="w-10 h-1 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,1)]" />
                             </div>
                          </div>
                       </div>
                     </motion.div>
                   ))}
                </motion.div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <GalleryItemSkeleton key={`gallery-skel-${idx}`} />
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              {items.length > itemsToShow && (
                <>
                  <button 
                    onClick={prev}
                    className="absolute -left-2 md:left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-2xl flex items-center justify-center text-pink-600 border border-slate-100 dark:border-white/10 hover:scale-110 active:scale-95 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} className="md:w-6 md:h-6" />
                  </button>
                  <button 
                    onClick={next}
                    className="absolute -right-2 md:right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-2xl flex items-center justify-center text-pink-600 border border-slate-100 dark:border-white/10 hover:scale-110 active:scale-95 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  >
                    <ChevronRight size={20} className="md:w-6 md:h-6" />
                  </button>
                </>
              )}
            </motion.div>
          ) : (
             <motion.div 
               key="social"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="min-h-[400px] md:min-h-[700px] w-full rounded-[2rem] overflow-hidden bg-transparent mb-16 relative group"
            >
               {/* Styling to hide Elfsight labels and branding */}
               <style dangerouslySetInnerHTML={{ __html: `
                 .eapps-widget-toolbar, 
                 [class*="WidgetToolbar"],
                 [class*="BadgeContainer"],
                 [class*="EditButton"],
                 [class*="WidgetToolbar__Container"],
                 [class*="Badge__Container"],
                 [class*="Badge__Inner"],
                 [class*="Badge__Component"],
                 [class*="Badge__Wrapper"],
                 [class*="FloatingButton"],
                 a[href*="elfsight.com"],
                 .elfsight-app-b5cb708d-abcf-475e-90c9-23841a07cd28 a[href*="elfsight.com"],
                 #elfsight-app-b5cb708d-abcf-475e-90c9-23841a07cd28 a[href*="elfsight.com"] {
                    display: none !important;
                    opacity: 0 !important;
                    height: 0 !important;
                    width: 0 !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                 }
                 /* Match text color to background as fallback */
                 [class*="Badge__Text"] {
                    color: ${theme === 'dark' ? '#020617' : '#ffffff'} !important;
                 }
                 /* Fix container height and width for social widget on mobile */
                 .elfsight-app-b5cb708d-abcf-475e-90c9-23841a07cd28 {
                    margin-top: -30px !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    overflow-x: hidden !important;
                    box-sizing: border-box !important;
                 }
                 .elfsight-app-b5cb708d-abcf-475e-90c9-23841a07cd28 > div,
                 .elfsight-app-b5cb708d-abcf-475e-90c9-23841a07cd28 iframe,
                 .elfsight-app-b5cb708d-abcf-475e-90c9-23841a07cd28 .eapps-instagram-feed {
                    width: 100% !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                 }
                 /* Force dark theme adjustments if possible */
                 ${theme === 'dark' ? `
                    .elfsight-app-b5cb708d-abcf-475e-90c9-23841a07cd28 .eapps-instagram-feed-posts-item-container {
                       background-color: rgba(255,255,255,0.05) !important;
                       border-color: rgba(255,255,255,0.1) !important;
                    }
                    .elfsight-app-b5cb708d-abcf-475e-90c9-23841a07cd28 * {
                       color: white !important;
                    }
                 ` : ''}
               `}} />

               {feedsLoading && (
                 <div className="absolute inset-0 z-10 flex items-center justify-center bg-white dark:bg-black/20 backdrop-blur-sm">
                   <div className="flex flex-col items-center gap-4">
                     <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full"
                     />
                     <span className="text-pink-500 font-bold uppercase tracking-widest text-xs animate-pulse">
                        {lang === 'en' ? 'Syncing Feeds...' : 'ফিড সিঙ্ক হচ্ছে...'}
                     </span>
                   </div>
                 </div>
               )}

               <div className="elfsight-app-b5cb708d-abcf-475e-90c9-23841a07cd28" data-elfsight-app-lazy></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lightbox Implementation */}
        <AnimatePresence>
          {lightboxIndex !== null && items[lightboxIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-[600] flex items-center justify-center p-4 backdrop-blur-3xl overflow-hidden"
              onClick={() => setLightboxIndex(null)}
            >
              {/* Dynamic Animated Background */}
              <div className="absolute inset-0 z-[-1] opacity-40">
                <motion.div 
                  animate={{ 
                    background: [
                      "radial-gradient(circle at 20% 20%, #ec4899 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 80%, #be185d 0%, transparent 50%)",
                      "radial-gradient(circle at 20% 80%, #9d174d 0%, transparent 50%)",
                      "radial-gradient(circle at 80% 20%, #ec4899 0%, transparent 50%)",
                    ]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full"
                />
              </div>
              <div className="absolute inset-0 bg-white/90 dark:bg-black/90 z-[-2] backdrop-blur-3xl" />

              <motion.div 
                className="relative max-w-6xl w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12" 
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                {...lightboxHandlers}
              >

                {/* Main Content Area */}
                <div className="relative flex flex-col md:flex-row bg-white/90 dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-slate-900/10 dark:border-white/20 shadow-[0_0_100px_rgba(236,72,153,0.1)] dark:shadow-[0_0_100px_rgba(236,72,153,0.2)] w-full max-w-5xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto hide-scrollbar">
                  
                  <button 
                    className="absolute top-3 right-3 md:top-6 md:right-6 z-[650] w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200/50 dark:bg-slate-800/40 md:bg-black/5 dark:md:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center hover:bg-pink-500 hover:text-white hover:scale-110 active:scale-95 transition-all border border-slate-900/10 dark:border-white/20 shadow-lg backdrop-blur-md"
                    onClick={() => setLightboxIndex(null)}
                  >
                    <ChevronLeft size={20} className="rotate-45" />
                  </button>

                  {/* Image Section */}
                  <div className="w-full md:w-3/5 aspect-[4/5] relative overflow-hidden group/img bg-slate-100 dark:bg-black/30 flex items-center justify-center shrink-0">
                    <TransformWrapper
                      initialScale={1}
                      minScale={1}
                      maxScale={4}
                      centerOnInit={true}
                      wheel={{ step: 0.1 }}
                      pinch={{ step: 5 }}
                    >
                      <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full flex items-center justify-center">
                        <motion.img
                          key={lightboxIndex}
                          initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 260, 
                            damping: 20 
                          }}
                          src={getOptimizedImageUrl(items[lightboxIndex].img, 1000, 85) || items[lightboxIndex]?.img || "https://i.ibb.co/XkYN11bL/PROFILE.jpg"}
                          alt={items[lightboxIndex].nameEn}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.triedOriginal) {
                              target.dataset.triedOriginal = 'true';
                              target.src = items[lightboxIndex]?.img || "https://i.ibb.co/XkYN11bL/PROFILE.jpg";
                            }
                          }}
                        />
                      </TransformComponent>
                    </TransformWrapper>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    
                    {/* Previous Button inside Image */}
                    <button 
                      onClick={prevLightbox}
                      className="flex absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-[610] w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-black/40 md:bg-white/5 text-white items-center justify-center hover:bg-pink-500/20 hover:scale-110 active:scale-95 transition-all border border-white/10 group/btn shadow-2xl backdrop-blur-md"
                    >
                      <ChevronLeft size={24} className="group-hover/btn:-translate-x-1 transition-transform" />
                    </button>
                    {/* Next Button inside Image */}
                    <button 
                      onClick={nextLightbox}
                      className="flex absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-[610] w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-black/40 md:bg-white/5 text-white items-center justify-center hover:bg-pink-500/20 hover:scale-110 active:scale-95 transition-all border border-white/10 group/btn shadow-2xl backdrop-blur-md"
                    >
                      <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Details Section */}
                  <div className="w-full md:w-2/5 p-6 md:p-12 flex flex-col justify-between bg-white/70 dark:bg-slate-900/60 md:bg-transparent dark:md:bg-transparent overflow-y-auto max-h-[50vh] md:max-h-none hide-scrollbar">
                    <div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-pink-500 font-bold tracking-[0.3em] uppercase text-[9px] md:text-[10px] mb-2 md:mb-3">
                           {items[lightboxIndex].category}
                        </p>
                        <h2 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4 md:mb-6 tracking-tighter uppercase italic">
                           {lang === 'en' ? items[lightboxIndex].nameEn : items[lightboxIndex].nameBn}
                        </h2>
                        
                        <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                           <div className="text-slate-600 dark:text-slate-300 text-[10px] md:text-sm leading-relaxed font-medium whitespace-pre-wrap max-h-[20vh] md:max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                              {lang === 'en' 
                                ? (items[lightboxIndex] as any).descEn || `✨ The Magic of Classic ${items[lightboxIndex].nameEn}! 🎂\nMake your special days even sweeter with Bake n' Flake's super soft, fluffy, and premium ${items[lightboxIndex].nameEn}! 🤍`
                                : (items[lightboxIndex] as any).descBn || `✨ ক্লাসিক ${items[lightboxIndex].nameBn || items[lightboxIndex].nameEn} এর স্নিগ্ধ জাদুকরী স্বাদ! 🎂\nআপনার স্পেশাল দিনগুলোকে আরও মিষ্টি করে তুলতে Bake n' Flake নিয়ে এসেছে একদম নরম, তুলতুলে এবং প্রিমিয়াম ${items[lightboxIndex].nameBn || items[lightboxIndex].nameEn}! 🤍`}
                           </div>
                           
                           <div className="w-10 md:w-12 h-1 md:h-1.5 bg-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.6)] mt-4" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Order & Assist Buttons */}
                    <div className="space-y-4 md:space-y-6">
                      <div className="text-left">
                        <p className="text-slate-500 dark:text-white/60 text-[9px] md:text-[10px] uppercase font-black tracking-widest mb-3 md:mb-4">
                          {lang === 'en' ? 'For Order & Further Assist' : 'অর্ডার এবং সহায়তার জন্য'}
                        </p>
                        <div className="flex flex-wrap gap-2 md:gap-3">
                          {contactInfo.map((contact, idx) => (
                            <motion.a 
                              key={contact.label}
                              href={contact.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + (idx * 0.1) }}
                              className={cn(
                                "flex items-center gap-2 px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl text-white font-bold text-[9px] md:text-[11px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg border border-white/10 backdrop-blur-sm",
                                contact.color
                              )}
                            >
                              {contact.icon && <img src={contact.icon} alt={contact.label} className="w-3 h-3 md:w-4 md:h-4" />}
                              <span>{contact.label}</span>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
