import React, { createContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import Story from './components/Story';
import FAQ from './components/FAQ';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';
import OrderModal from './components/OrderModal';
import { translations } from './constants/translations';
import GallerySection from './components/GallerySection';
import { Language, Translation, GalleryData, VideoItem } from './types';
import { FULL_GALLERY_BACKUP } from './constants/fullGalleryBackup';
import { fetchGalleryDataDirectFromSheets } from './utils/googleSheetsSync';
import { flavours, gifts, moreOptionsData } from './constants/data';
import { Play, Youtube, Facebook, X, Heart, Star, Snowflake, Gift, Video, Pin, ArrowUp, Sun, Moon } from 'lucide-react';

const getInitialFallbackGalleryData = (): GalleryData => {
  return FULL_GALLERY_BACKUP as unknown as GalleryData;
};
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Toast } from './components/common/Toast';
import ChatBot from './components/ChatBot';

const NeonParticles = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const particlesCount = isMobile ? 15 : 35; 
  const particles = Array.from({ length: particlesCount });
  const Icons = [Heart, Star, Snowflake];
  
  return (
    <div className="absolute inset-0 z-[0] pointer-events-none overflow-hidden opacity-70 md:opacity-100">
      {particles.map((_, i) => {
        const size = Math.random() * (isMobile ? 8 : 16) + 6; // Smaller sizes
        const left = Math.random() * 100;
        const delay = Math.random() * -20; // Negative delay so they are already falling
        const duration = Math.random() * 8 + (isMobile ? 12 : 18); // Smooth and slightly slower falling
        const drift = (Math.random() - 0.5) * 30; // Less horizontal drift for a smoother rain effect
        const Icon = Icons[i % Icons.length];
        const isHeart = Icon === Heart;
        const isStar = Icon === Star;
        const isSnow = Icon === Snowflake;
        const rotateDuration = Math.random() * 5 + 5;
        const blinkDuration = Math.random() * 2 + 1.5; // For blinking effect

        // Dynamic classes combinations - multi-color + natural blur + glow
        const colorClasses = [
          "text-pink-400 dark:text-pink-500 blur-[1px] drop-shadow-[0_0_10px_rgba(244,114,182,0.8)] dark:drop-shadow-[0_0_15px_rgba(236,72,153,1)]",
          "text-blue-300 dark:text-cyan-400 blur-[1.5px] md:blur-[2px] drop-shadow-[0_0_10px_rgba(147,197,253,0.8)] dark:drop-shadow-[0_0_15px_rgba(34,211,238,1)]",
          "text-amber-300 dark:text-yellow-400 blur-[1px] md:blur-[1.5px] drop-shadow-[0_0_10px_rgba(252,211,77,0.8)] dark:drop-shadow-[0_0_15px_rgba(250,204,21,1)]",
          "text-green-300 dark:text-emerald-400 blur-[2px] drop-shadow-[0_0_10px_rgba(134,239,172,0.8)] dark:drop-shadow-[0_0_15px_rgba(52,211,153,1)]",
          "text-purple-300 dark:text-fuchsia-400 blur-[1.5px] drop-shadow-[0_0_10px_rgba(216,180,254,0.8)] dark:drop-shadow-[0_0_15px_rgba(232,121,249,1)]",
          "text-rose-300 dark:text-rose-500 blur-[1px] md:blur-[2px] drop-shadow-[0_0_10px_rgba(253,164,175,0.8)] dark:drop-shadow-[0_0_15px_rgba(244,63,94,1)]",
          "text-white dark:text-gray-100 blur-[1.5px] drop-shadow-[0_0_15px_rgba(255,255,255,1)] dark:drop-shadow-[0_0_20px_rgba(255,255,255,1)]"
        ];
        const colorClass = colorClasses[i % colorClasses.length];

        return (
          <motion.div 
            key={i}
            initial={{ y: '-10vh', x: 0, opacity: 0 }}
            animate={{ 
              y: ['-10vh', '110vh'],
              x: [0, drift],
              opacity: [0, 0.8, 0.8, 0]
            }}
            transition={{
              y: { duration: duration, delay: delay, repeat: Infinity, ease: "linear" },
              x: { duration: duration, delay: delay, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: duration, delay: delay, repeat: Infinity, ease: "easeInOut" }
            }}
            className={cn("absolute", colorClass)}
            style={{ 
              left: left + '%', 
            }}
          >
            {/* Blinking Glow Wrapper */}
            <motion.div
              animate={{ 
                opacity: [0.4, 1, 0.4], 
                scale: [0.9, 1.1, 0.9] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: blinkDuration, 
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            >
              <motion.div
                animate={{ rotate: isSnow ? 360 : [-15, 15, -15] }}
                transition={{ repeat: Infinity, duration: rotateDuration, ease: "linear" }}
              >
                <Icon size={size} fill={(isStar || isHeart) ? "currentColor" : "none"} strokeWidth={isSnow ? 2 : 1.5} />
              </motion.div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  );
};

const CakeParticles = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const particlesCount = isMobile ? 5 : 12; // Reduced count
  const icons = ['🎂', '🍰', '🧁', '🍪', '🍩', '🍬', '🍭', '🍫'];
  
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 md:opacity-50">
      {Array.from({ length: particlesCount }).map((_, i) => {
        const size = Math.random() * (isMobile ? 12 : 24) + 8; // Smaller size
        const left = Math.random() * 100;
        const delay = Math.random() * -15; // Start earlier
        const duration = Math.random() * 8 + 15; // Smooth falling
        const rotate = Math.random() * 360;
        const drift = (Math.random() - 0.5) * 30; // Smoother drift
        const blinkDuration = Math.random() * 3 + 2;
        
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: '-10vh', x: 0 }}
            animate={{
              opacity: [0, 0.8, 0.8, 0],
              y: ['-10vh', '110vh'],
              x: [0, drift],
            }}
            transition={{
               y: { duration, delay, repeat: Infinity, ease: "linear" },
               x: { duration, delay, repeat: Infinity, ease: "easeInOut" },
               opacity: { duration, delay, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute drop-shadow-[0_0_10px_rgba(236,72,153,0.3)] blur-[0.5px]"
            style={{ left: `${left}%`, fontSize: size }}
          >
            <motion.div
              animate={{ 
                scale: [0.9, 1.1, 0.9] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: blinkDuration, 
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            >
              <motion.div
                animate={{ rotate: rotate + 360 }}
                transition={{ repeat: Infinity, duration: duration, ease: "linear" }}
              >
                {icons[i % icons.length]}
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

const Background = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none bg-ash dark:bg-matte transition-colors duration-700 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-200/40 via-white/50 to-slate-200/40 dark:from-matte dark:via-matte dark:to-matte transition-colors duration-700"></div>
      
      {/* Animated Blobs for Glass Effect - Simplified on mobile */}
      <motion.div 
        animate={{
          x: [0, 20, -20, 0],
          y: [0, -30, 30, 0],
          rotate: [0, 90, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] right-[-10%] w-[100vw] h-[100vw] md:w-[70vw] md:h-[70vw] bg-pink-300/10 dark:bg-pink-900/10 rounded-full blur-[80px] md:blur-[120px] mix-blend-multiply transition-all pointer-events-none"
      />
      <motion.div 
        animate={{
          x: [0, -20, 20, 0],
          y: [0, 40, -40, 0],
          rotate: [0, -90, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 45, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] left-[-10%] w-[100vw] h-[100vw] md:w-[70vw] md:h-[70vw] bg-slate-300/10 dark:bg-slate-900/20 rounded-full blur-[80px] md:blur-[120px] mix-blend-screen transition-all pointer-events-none"
      />
      
      {/* Dynamic Grid Overlay (Subtle) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay"></div>
      
      {/* Full Page Particles Layer */}
      <div className="absolute inset-0">
         <NeonParticles />
      </div>
    </div>
  );
}

interface AppContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: any;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  galleryData: GalleryData;
  loading: boolean;
  setOrderModalOpen: (open: boolean) => void;
  serverDate: { date: string, year: number } | null;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

const VideoFrame = ({ type, video, index, t }: { type: 'youtube' | 'facebook', video: VideoItem, index: number, t: any }) => {
  if (!video) return (
    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-800 animate-pulse flex items-center justify-center">
       <span className="text-white/20 font-bold uppercase tracking-widest text-xs">Loading...</span>
    </div>
  );

  const EXTERNAL_URL = type === 'youtube' 
    ? "https://www.youtube.com/@MuskanKhan-pk3qt/playlists" 
    : "https://www.facebook.com/flavoursbymusu/reels/";

  const handleCardClick = () => {
    window.open(EXTERNAL_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 dark:border-white/10 group bg-black">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
            key={`${index}-${type}-${video.nameEn}`}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
            className="absolute inset-0 cursor-pointer overflow-hidden"
            onClick={handleCardClick}
        >
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
            src={video.img} 
            alt={video.nameEn}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            style={{ backgroundColor: 'transparent', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 9\'%3E%3Crect width=\'16\' height=\'9\' fill=\'%23a0aec0\' fill-opacity=\'0.1\'/%3E%3C/svg%3E")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors">
             <motion.div 
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/40 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
             >
                <Play className="text-white fill-current ml-1" size={32} />
             </motion.div>
          </div>

          <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 p-1 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg z-30">
             <div className={cn("p-2 rounded-xl flex items-center gap-2 transition-all", type === 'youtube' ? "bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.4)]" : "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]")}>
                {type === 'youtube' ? <Youtube size={14} className="text-white" /> : <Facebook size={14} className="text-white" />}
                <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">
                   {type === 'youtube' ? 'YouTube' : 'Tutorials'}
                </span>
             </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-8 md:right-8">
             <h4 className="font-serif text-xl md:text-3xl text-white font-bold leading-tight mb-2 drop-shadow-lg line-clamp-2">
                {t.lang === 'en' ? video.nameEn : video.nameBn}
             </h4>
             <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 md:w-8 md:h-0.5 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                <span className="text-[9px] font-black text-pink-400 uppercase tracking-[0.3em]">Watch & Learn</span>
             </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <motion.div 
        key={`bar-${index}-${type}`}
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 5, ease: "linear" }}
        className={cn(
          "absolute bottom-0 left-0 h-1.5 z-20 bg-gradient-to-r", 
          type === 'youtube' ? "from-rose-500 to-rose-700 shadow-[0_0_15px_rgba(225,29,72,0.6)]" : "from-blue-500 to-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.6)]"
        )} 
      />
    </div>
  );
};

// Dedicated Video Section Component
function VideoSection() {
  const { t, galleryData } = React.useContext(AppContext);
  const [ytIndex, setYtIndex] = useState(0);
  const [fbIndex, setFbIndex] = useState(0);

  const ytVidsRaw = (galleryData['YouTube Video'] as VideoItem[])?.filter(v => v.img && v.img.length > 0);
  const ytVids = (ytVidsRaw && ytVidsRaw.length > 0) ? ytVidsRaw : [
    { vid: 'yt1', nameEn: "Cakes 🍰", nameBn: "কেকস 🍰", img: "https://bakings.in/wp-content/uploads/2024/08/Kitkat-Gems-Bomb-Shell-Cake.jpg", url: "https://www.youtube.com/@MuskanKhan-pk3qt" },
    { vid: 'yt2', nameEn: "Pizza 🍕", nameBn: "পিজ্জা 🍕", img: "https://bakings.in/wp-content/uploads/2024/08/Delicious-Butterscotch-Combo.jpg", url: "https://www.youtube.com/@MuskanKhan-pk3qt" }
  ];
  const fbVidsRaw = (galleryData['Facebook Video'] as VideoItem[])?.filter(v => v.img && v.img.length > 0);
  const fbVids = (fbVidsRaw && fbVidsRaw.length > 0) ? fbVidsRaw : [
    { vid: 'fb1', nameEn: "Cake Decoration", nameBn: "কেক ডেকোরেশন", img: "https://bakings.in/wp-content/uploads/2025/04/Rosy-Barbie-Doll-Cake-510x513.jpg", url: "https://www.facebook.com/flavoursbymusu/reels/" },
    { vid: 'fb2', nameEn: "Special Custom Cake", nameBn: "স্পেশাল কাস্টম কেক", img: "https://bakings.in/wp-content/uploads/2025/04/Batman-Theme-Cake-399x400.jpg", url: "https://www.facebook.com/flavoursbymusu/reels/" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setYtIndex(prev => (prev + 1) % ytVids.length);
      setFbIndex(prev => (prev + 1) % fbVids.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [ytVids.length, fbVids.length]);

  return (
    <section id="behind-the-scenes" className="py-24 bg-transparent relative transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-6 p-4 rounded-[2rem] glass-3d neon-border-pink group">
             <Video className="text-pink-500 transform group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" size={32} />
          </div>
          <p className="text-pink-600 dark:text-pink-400 font-black tracking-[0.3em] uppercase text-[10px] md:text-xs">
             {t.lang === 'en' ? 'Behind the Scenes' : 'পর্দার অন্তরালে'}
          </p>
          <h2 className="font-serif text-3xl md:text-7xl font-bold text-slate-900 dark:text-white mt-4 tracking-tighter">
            {t.lang === 'en' ? 'The Joy of Baking' : 'বেকিংয়ের আনন্দ'}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {ytVids.length > 0 ? (
            <VideoFrame type="youtube" video={ytVids[ytIndex]} index={ytIndex} t={t} />
          ) : (
            <div className="aspect-video rounded-[2.5rem] bg-slate-100/5 dark:bg-white/5 animate-pulse flex items-center justify-center text-xs text-slate-400 uppercase tracking-widest font-black">
               Loading YouTube...
            </div>
          )}
          {fbVids.length > 0 ? (
            <VideoFrame type="facebook" video={fbVids[fbIndex]} index={fbIndex} t={t} />
          ) : (
            <div className="aspect-video rounded-[2.5rem] bg-slate-100/5 dark:bg-white/5 animate-pulse flex items-center justify-center text-xs text-slate-400 uppercase tracking-widest font-black">
               Loading Tutorials...
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-16">
          <a href="https://youtube.com/@MuskanKhan-pk3qt/playlists" target="_blank" rel="noreferrer" className="yt-neon-btn group flex items-center justify-center gap-4 px-8 py-4 bg-rose-500 text-white rounded-full shadow-lg shadow-rose-500/30 transition-all hover:scale-105">
             <Youtube size={20} />
             <span className="text-xs font-bold uppercase tracking-widest">Subscribe on YouTube</span>
          </a>
          <a href="https://www.facebook.com/flavoursbymusu/" target="_blank" rel="noreferrer" className="fb-neon-btn group flex items-center justify-center gap-4 px-8 py-4 bg-blue-600 text-white rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-105">
             <Facebook size={20} />
             <span className="text-xs font-bold uppercase tracking-widest">Follow on Facebook</span>
          </a>
          <a href="https://in.pinterest.com/khanmegha99/" target="_blank" rel="noreferrer" className="pinterest-neon-btn group flex items-center justify-center gap-4 px-8 py-4 bg-[#E60023] text-white rounded-full shadow-lg shadow-red-600/30 transition-all hover:scale-105">
             <Pin size={20} />
             <span className="text-xs font-bold uppercase tracking-widest">Visual Inspiration</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  const [galleryData, setGalleryData] = useState<GalleryData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('bake_n_flake_gallery_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object' && Array.isArray(parsed.items) && parsed.items.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Failed to parse local storage cache:', e);
      }
    }
    const initial = getInitialFallbackGalleryData();
    try {
      localStorage.setItem('bake_n_flake_gallery_cache', JSON.stringify(initial));
    } catch (e) {}
    return initial;
  });
  const [loading, setLoading] = useState(false);
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [serverDate, setServerDate] = useState<{ date: string, year: number } | null>(null);
  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/server-date')
      .then(res => res.json())
      .then(data => setServerDate(data))
      .catch(err => console.error('Date fetch error:', err));
  }, []);

  const handleLanguageChange = useCallback((newLang: Language) => {
    setLang(newLang);
    setToast({
      message: newLang === 'en' ? 'Language changed to English' : 'ভাষা বাংলায় পরিবর্তিত হয়েছে',
      visible: true
    });
  }, []);

  useEffect(() => {
    // Minimum ~2 seconds loading time for smooth transition
    const timer = setTimeout(() => setMinLoadingDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchGallery();
    const interval = setInterval(() => {
      fetchGallery(true);
    }, 5000); // Check for updates every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchGallery = async (silent = false) => {
    if (!silent && (!galleryData.items || galleryData.items.length === 0)) setLoading(true);

    let fetchedSuccessfully = false;

    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const text = await response.text();
        const isHtml = text.trim().toLowerCase().startsWith('<!doctype html');
        if (!isHtml) {
          const data = JSON.parse(text);
          if (data && typeof data === 'object' && Array.isArray(data.items) && data.items.length > 0) {
            setGalleryData(data);
            try {
              localStorage.setItem('bake_n_flake_gallery_cache', JSON.stringify(data));
            } catch (e) {
              console.error('LocalStorage save error:', e);
            }
            fetchedSuccessfully = true;
          }
        }
      }
    } catch (e) {
      // /api/gallery failed (e.g., static hosting on Vercel without Node runtime)
    }

    // If server API was unavailable or returned non-JSON/HTML on Vercel, fetch directly from Google Sheets!
    if (!fetchedSuccessfully) {
      try {
        const directData = await fetchGalleryDataDirectFromSheets();
        if (directData && Array.isArray(directData.items) && directData.items.length > 0) {
          setGalleryData(directData);
          try {
            localStorage.setItem('bake_n_flake_gallery_cache', JSON.stringify(directData));
          } catch (e) {
            console.error('LocalStorage save error:', e);
          }
          fetchedSuccessfully = true;
        }
      } catch (e) {
        if (!silent) console.warn('Direct Google Sheets sync attempt failed:', e);
      }
    }

    // Ultimate fallback to existing state or embedded backup if offline / both failed
    if (!fetchedSuccessfully) {
      setGalleryData(prev => {
        if (prev && Array.isArray(prev.items) && prev.items.length > 0) return prev;
        const fallback = getInitialFallbackGalleryData();
        try {
          localStorage.setItem('bake_n_flake_gallery_cache', JSON.stringify(fallback));
        } catch (e) {}
        return fallback;
      });
    }

    if (!silent) {
      setLoading(false);
    }
  };

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const headerLogoItem = galleryData['Header']?.[1];
  const logoUrl = (headerLogoItem 
    ? (typeof headerLogoItem === 'string' ? headerLogoItem : (headerLogoItem as any).img) || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png"
    : "https://i.ibb.co/Xx2kxrrg/LOGO-1.png") || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png";

  const t = { ...translations[lang], lang };

  if (!minLoadingDone) {
    return (
      <div className={cn(
        "min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden transition-colors duration-700",
        theme === 'dark' 
          ? "bg-black bg-gradient-to-br from-black via-slate-900 to-pink-950/20" 
          : "bg-white bg-gradient-to-br from-white via-pink-50 to-slate-100"
      )}>
        <CakeParticles />
        
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className={cn(
             "relative z-10 p-12 md:p-16 rounded-[3rem] backdrop-blur-3xl border border-white/20 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.5)] flex flex-col items-center",
             theme === 'dark' 
               ? "bg-pink-900/20 glass-3d border-pink-500/10" 
               : "bg-white/60 glass-3d border-pink-200"
           )}
        >
          <div className="relative mb-8">
            {/* Animated Logo with Zoom In-Out */}
            <motion.div
               animate={{ 
                 scale: [1, 1.15, 1],
                 rotate: [0, 5, -5, 0],
                 boxShadow: [
                   "0 0 20px rgba(236,72,153,0.3)",
                   "0 0 50px rgba(236,72,153,0.6)",
                   "0 0 20px rgba(236,72,153,0.3)"
                 ]
               }}
               transition={{ 
                 repeat: Infinity, 
                 duration: 3, 
                 ease: "easeInOut" 
               }}
               className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-pink-500 shadow-2xl relative z-10"
            >
               <img src={logoUrl} alt="Bake n Flake" className="w-full h-full object-cover scale-150" referrerPolicy="no-referrer" />
            </motion.div>
            
            {/* Glow Rings */}
            <div className="absolute inset-[-20%] rounded-full bg-pink-500/10 blur-3xl animate-pulse" />
          </div>

          <div className="text-center">
            <motion.h2 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="font-serif text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter"
            >
              Bake n' Flake
            </motion.h2>
            <motion.div
               initial={{ width: 0 }}
               animate={{ width: "100%" }}
               transition={{ duration: 1.5, delay: 0.8 }}
               className="h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent my-4"
            />
            <p className="text-pink-600 dark:text-pink-400 text-xs md:text-sm font-black uppercase tracking-[0.4em] animate-pulse">
               {lang === 'en' ? 'Crafting Sweet Moments...' : 'সুস্বাদু মুহূর্ত তৈরি করছি...'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mt-12 w-48 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
             <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="w-full h-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,1)]"
             />
          </div>
        </motion.div>

        {/* Decorative Particles */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>
    );
  }


  return (
    <AppContext.Provider value={{ 
      lang, setLang: handleLanguageChange, t, theme, toggleTheme, galleryData, loading,
      setOrderModalOpen, serverDate
    }}>
      <Background />
      <div className={cn(
        "min-h-screen selection:bg-pink-100 selection:text-pink-600 relative z-10",
        theme === 'dark' ? "text-white" : "text-slate-900"
      )}>
        <Navbar />
        <Hero />
        <Menu />
        <GallerySection />
        <VideoSection />
        <Story />
        <Reviews />
        <Contact />
        <FAQ />
        <Footer />
        
        <OrderModal 
          isOpen={isOrderModalOpen} 
          onClose={() => setOrderModalOpen(false)} 
          lang={lang} 
        />

        <Toast 
          message={toast.message} 
          isVisible={toast.visible} 
          onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
        />

        <AnimatePresence>
          {showScrollToTop && (
            <div className="fixed bottom-32 md:bottom-10 right-6 md:right-10 z-[500] flex flex-col gap-3">
              <motion.button
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(236, 72, 153, 0.9)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-pink-600/40 text-white shadow-2xl flex items-center justify-center border border-white/20 backdrop-blur-xl transition-colors"
                title="Scroll to Top"
              >
                <ArrowUp size={22} strokeWidth={3} />
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: -20 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(236, 72, 153, 0.9)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const footer = document.getElementById('footer');
                  footer?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-pink-600/40 text-white shadow-2xl flex items-center justify-center border border-white/20 backdrop-blur-xl transition-colors"
                title="Scroll to Bottom"
              >
                <motion.div animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <ArrowUp size={22} strokeWidth={3} className="rotate-180" />
                </motion.div>
              </motion.button>
            </div>
          )}
        </AnimatePresence>

        <ChatBot floating={true} />
      </div>
    </AppContext.Provider>
  );
}
