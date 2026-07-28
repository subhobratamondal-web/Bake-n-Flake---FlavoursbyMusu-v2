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
import Preloader3D from './components/Preloader3D';
import ShortcutsModal from './components/ShortcutsModal';
import { translations } from './constants/translations';
import GallerySection from './components/GallerySection';
import { Language, Translation, GalleryData, VideoItem, WeatherCondition, WeatherData } from './types';
import { FULL_GALLERY_BACKUP } from './constants/fullGalleryBackup';
import { fetchGalleryDataDirectFromSheets, getOptimizedImageUrl } from './utils/googleSheetsSync';
import { OptimizedImage } from './components/OptimizedImage';
import { VideoSkeleton } from './components/common/Skeleton';
import { WEATHER_THEMES, fetchCurrentWeather } from './utils/weatherTheme';
import { flavours, gifts, moreOptionsData } from './constants/data';
import { Play, Youtube, Facebook, X, Heart, Star, Snowflake, Gift, Video, Pin, ArrowUp, Sun, Moon, Keyboard, RefreshCw, CheckCircle2 } from 'lucide-react';

const getInitialFallbackGalleryData = (): GalleryData => {
  return FULL_GALLERY_BACKUP as unknown as GalleryData;
};
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { Toast } from './components/common/Toast';
import ChatBot from './components/ChatBot';

const NeonParticles = React.memo(() => {
  const { weatherData } = React.useContext(AppContext);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const condition = weatherData?.condition || 'sunny';
  const theme = WEATHER_THEMES[condition];

  const particleData = React.useMemo(() => {
    const count = isMobile ? 8 : 16;
    const Icons = [Heart, Star, Snowflake];
    const colorClasses = theme.particleColors;

    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: (i % 3 === 0 ? 12 : i % 2 === 0 ? 10 : 8) + (isMobile ? 0 : 4),
      left: ((i * 17 + 5) % 92) + 4,
      delay: -(i * 1.5),
      duration: 14 + (i % 5) * 2,
      drift: (i % 2 === 0 ? 15 : -15),
      Icon: Icons[i % Icons.length],
      colorClass: colorClasses[i % colorClasses.length],
    }));
  }, [isMobile, theme]);

  return (
    <div className="absolute inset-0 z-[0] pointer-events-none overflow-hidden opacity-60 md:opacity-80">
      {particleData.map((p) => {
        const Icon = p.Icon;
        return (
          <motion.div 
            key={p.id}
            initial={{ y: '-10vh', x: 0, opacity: 0 }}
            animate={{ 
              y: ['-10vh', '110vh'],
              x: [0, p.drift],
              opacity: [0, 0.7, 0.7, 0]
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear"
            }}
            className={cn("absolute gpu-accelerated", p.colorClass)}
            style={{ left: `${p.left}%` }}
          >
            <Icon size={p.size} fill="currentColor" />
          </motion.div>
        );
      })}
    </div>
  );
});

const CakeParticles = React.memo(() => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const icons = ['🎂', '🍰', '🧁', '🍪', '🍩', '🍫'];
  const particleData = React.useMemo(() => {
    const count = isMobile ? 4 : 8;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      size: (i % 2 === 0 ? 14 : 18) + (isMobile ? 0 : 4),
      left: ((i * 23 + 11) % 90) + 5,
      delay: -(i * 2),
      duration: 16 + (i % 4) * 3,
      drift: (i % 2 === 0 ? 20 : -20),
      icon: icons[i % icons.length]
    }));
  }, [isMobile]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 md:opacity-40">
      {particleData.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: '-10vh', x: 0 }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            y: ['-10vh', '110vh'],
            x: [0, p.drift],
          }}
          transition={{
             duration: p.duration,
             delay: p.delay,
             repeat: Infinity,
             ease: "linear"
          }}
          className="absolute gpu-accelerated"
          style={{ left: `${p.left}%`, fontSize: p.size }}
        >
          {p.icon}
        </motion.div>
      ))}
    </div>
  );
});

const Background = React.memo(() => {
  const { weatherData } = React.useContext(AppContext);
  const condition = weatherData?.condition || 'sunny';
  const theme = WEATHER_THEMES[condition];

  return (
    <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none bg-slate-50 dark:bg-[#050505] transition-colors duration-700 overflow-hidden">
      {/* Weather Adaptive Ambient Soft Gradient Tint */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-tr transition-all duration-1000",
        theme.bgGradient
      )}></div>
      
      {/* Light Ambient Glow Orbs - Weather Adaptive & GPU optimized */}
      <div className={cn(
        "absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] pointer-events-none opacity-60 transition-all duration-1000",
        theme.orb1
      )} />
      <div className={cn(
        "absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] pointer-events-none opacity-60 transition-all duration-1000",
        theme.orb2
      )} />
      
      {/* Dynamic Grid Overlay (Subtle) */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] dark:opacity-[0.03] mix-blend-overlay"></div>
      
      {/* Full Page Particles Layer */}
      <div className="absolute inset-0">
         <NeonParticles />
      </div>
    </div>
  );
});

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
  weatherData: WeatherData | null;
  setWeatherCondition: (condition: WeatherCondition) => void;
  setWeatherAuto: (isAuto: boolean) => void;
  refreshWeather: () => Promise<void>;
  lastSyncedTime: string | null;
  syncStatus: 'synced' | 'syncing' | 'offline';
  handleForceRefresh: () => Promise<void>;
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
          <OptimizedImage 
            src={video.img} 
            alt={video.nameEn}
            width={800}
            quality={80}
            fallbackSrc="https://i.ibb.co/XkYN11bL/PROFILE.jpg"
            className="w-full h-full object-cover"
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
  const ytVids = (ytVidsRaw && ytVidsRaw.length > 0) ? ytVidsRaw : (FULL_GALLERY_BACKUP['YouTube Video'] as VideoItem[]) || [];
  const fbVidsRaw = (galleryData['Facebook Video'] as VideoItem[])?.filter(v => v.img && v.img.length > 0);
  const fbVids = (fbVidsRaw && fbVidsRaw.length > 0) ? fbVidsRaw : (FULL_GALLERY_BACKUP['Facebook Video'] as VideoItem[]) || [];

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
            <VideoSkeleton />
          )}
          {fbVids.length > 0 ? (
            <VideoFrame type="facebook" video={fbVids[fbIndex]} index={fbIndex} t={t} />
          ) : (
            <VideoSkeleton />
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
    let cachedParsed: Partial<GalleryData> = {};
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('bake_n_flake_gallery_cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            cachedParsed = parsed;
          }
        }
      } catch (e) {
        console.error('Failed to parse local storage cache:', e);
      }
    }
    const combined = {
      ...(FULL_GALLERY_BACKUP as unknown as GalleryData),
      ...cachedParsed
    };
    try {
      localStorage.setItem('bake_n_flake_gallery_cache', JSON.stringify(combined));
    } catch (e) {}
    return combined;
  });
  const [loading, setLoading] = useState(false);
  const [minLoadingDone, setMinLoadingDone] = useState(false);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [serverDate, setServerDate] = useState<{ date: string, year: number } | null>(null);
  const [toast, setToast] = useState<{ message: string, visible: boolean }>({ message: '', visible: false });
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('bake_n_flake_last_sync_time') || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    return null;
  });

  const handleForceRefresh = useCallback(async () => {
    try {
      localStorage.removeItem('bake_n_flake_gallery_cache');
      localStorage.removeItem('bake_n_flake_last_sync_time');
    } catch (e) {}
    setToast({
      message: lang === 'en' ? 'Cache cleared. Refetching latest gallery...' : 'ক্যাশে ক্লিয়ার করা হয়েছে। নতুন তথ্য লোড হচ্ছে...',
      visible: true
    });
    await fetchGallery(false);
  }, [lang]);

  const refreshWeather = useCallback(async (isAuto = true, cond?: WeatherCondition) => {
    const data = await fetchCurrentWeather(isAuto, cond);
    setWeatherData(data);
  }, []);

  useEffect(() => {
    refreshWeather(true);
  }, [refreshWeather]);

  const setWeatherCondition = useCallback((cond: WeatherCondition) => {
    setWeatherData(prev => prev ? {
      ...prev,
      condition: cond,
      isAuto: false,
      labelEn: WEATHER_THEMES[cond].themeNameEn,
      labelBn: WEATHER_THEMES[cond].themeNameBn,
      icon: WEATHER_THEMES[cond].icon,
    } : {
      condition: cond,
      temp: 28,
      locationName: 'Custom Weather',
      isAuto: false,
      labelEn: WEATHER_THEMES[cond].themeNameEn,
      labelBn: WEATHER_THEMES[cond].themeNameBn,
      icon: WEATHER_THEMES[cond].icon,
    });
  }, []);

  const setWeatherAuto = useCallback((isAuto: boolean) => {
    refreshWeather(isAuto);
  }, [refreshWeather]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLanguageChange = useCallback((newLang: Language) => {
    setLang(newLang);
    setToast({
      message: newLang === 'en' ? 'Language changed to English' : 'ভাষা বাংলায় পরিবর্তিত হয়েছে',
      visible: true
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          searchInput.focus();
        } else {
          document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setOrderModalOpen(true);
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleLanguageChange(lang === 'en' ? 'bn' : 'en');
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setOrderModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lang, handleLanguageChange, toggleTheme]);

  const galleryDataRef = useRef(galleryData);
  galleryDataRef.current = galleryData;

  useEffect(() => {
    fetch('/api/server-date')
      .then(res => res.json())
      .then(data => setServerDate(data))
      .catch(err => console.error('Date fetch error:', err));
  }, []);

  useEffect(() => {
    // Minimum ~2.2 seconds 3D loading time for smooth transition
    const timer = setTimeout(() => setMinLoadingDone(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchGallery();
    const interval = setInterval(() => {
      fetchGallery(true);
    }, 30000); // Check for updates every 30s
    return () => clearInterval(interval);
  }, []);

  const applyGranularGalleryUpdate = useCallback((newData: GalleryData) => {
    setGalleryData(prev => {
      if (!prev) return newData;
      let hasChanges = false;
      const nextState = { ...prev };

      for (const key of Object.keys(newData) as Array<keyof GalleryData>) {
        const prevStr = JSON.stringify(prev[key]);
        const newStr = JSON.stringify(newData[key]);
        if (prevStr !== newStr) {
          nextState[key] = newData[key] as any;
          hasChanges = true;
        }
      }

      if (!hasChanges) {
        return prev;
      }

      try {
        localStorage.setItem('bake_n_flake_gallery_cache', JSON.stringify(nextState));
      } catch (e) {
        console.error('LocalStorage save error:', e);
      }

      return nextState;
    });
  }, []);

  const fetchGallery = async (silent = false) => {
    if (!silent && (!galleryDataRef.current?.items || galleryDataRef.current.items.length === 0)) setLoading(true);
    setSyncStatus('syncing');

    let fetchedSuccessfully = false;

    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const text = await response.text();
        const isHtml = text.trim().toLowerCase().startsWith('<!doctype html');
        if (!isHtml) {
          const data = JSON.parse(text);
          if (data && typeof data === 'object' && Array.isArray(data.items) && data.items.length > 0) {
            applyGranularGalleryUpdate(data);
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
          applyGranularGalleryUpdate(directData);
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

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (fetchedSuccessfully) {
      setSyncStatus('synced');
      setLastSyncedTime(timeStr);
      try {
        localStorage.setItem('bake_n_flake_last_sync_time', timeStr);
      } catch (e) {}
    } else {
      setSyncStatus(navigator.onLine ? 'synced' : 'offline');
      if (!lastSyncedTime) setLastSyncedTime(timeStr);
    }

    if (!silent) {
      setLoading(false);
    }
  };

  // Background pre-fetching utility using link rel="prefetch"
  useEffect(() => {
    if (!galleryData || !galleryData.items || galleryData.items.length === 0) return;

    const prefetchNextGalleryImages = () => {
      const urls: string[] = [];

      // Prioritize upcoming gallery images
      galleryData.items.slice(0, 24).forEach(item => {
        if (item.img) {
          const opt = getOptimizedImageUrl(item.img, 700, 80) || item.img;
          if (opt) urls.push(opt);
        }
      });

      // Also prefetch menu category images
      Object.values(galleryData).forEach(val => {
        if (Array.isArray(val)) {
          val.slice(0, 6).forEach((item: any) => {
            const imgUrl = typeof item === 'string' ? item : item?.img;
            if (imgUrl) {
              const opt = getOptimizedImageUrl(imgUrl, 600, 75) || imgUrl;
              if (opt) urls.push(opt);
            }
          });
        }
      });

      const uniqueUrls = Array.from(new Set(urls)).slice(0, 30);

      uniqueUrls.forEach(url => {
        if (!document.querySelector(`link[rel="prefetch"][href="${CSS.escape(url)}"]`)) {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.as = 'image';
          link.href = url;
          document.head.appendChild(link);
        }
      });
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        const handle = (window as any).requestIdleCallback(prefetchNextGalleryImages, { timeout: 2500 });
        return () => (window as any).cancelIdleCallback(handle);
      } else {
        const timer = setTimeout(prefetchNextGalleryImages, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [galleryData]);

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
    return <Preloader3D logoUrl={logoUrl} lang={lang} theme={theme} />;
  }

  return (
    <AppContext.Provider value={{ 
      lang, setLang: handleLanguageChange, t, theme, toggleTheme, galleryData, loading,
      setOrderModalOpen, serverDate,
      weatherData, setWeatherCondition, setWeatherAuto, refreshWeather,
      lastSyncedTime, syncStatus, handleForceRefresh
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

        <ShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
          lang={lang}
          onTriggerSearch={() => {
            const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (searchInput) {
              searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              searchInput.focus();
            } else {
              document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          onTriggerOrder={() => setOrderModalOpen(true)}
          onTriggerMenu={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          onTriggerLang={() => handleLanguageChange(lang === 'en' ? 'bn' : 'en')}
          onTriggerTheme={() => toggleTheme()}
          onTriggerForceRefresh={handleForceRefresh}
          lastSyncedTime={lastSyncedTime}
          syncStatus={syncStatus}
        />

        <Toast 
          message={toast.message} 
          isVisible={toast.visible} 
          onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
        />



        <AnimatePresence>
          {showScrollToTop && (
            <div className="fixed bottom-24 sm:bottom-28 md:bottom-10 right-4 sm:right-6 md:right-10 z-[500] flex flex-col gap-2 sm:gap-3">
              <motion.button
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(236, 72, 153, 0.9)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-pink-600/60 text-white shadow-2xl flex items-center justify-center border border-white/20 backdrop-blur-xl transition-colors"
                title="Scroll to Top"
              >
                <ArrowUp size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" strokeWidth={3} />
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
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-pink-600/60 text-white shadow-2xl flex items-center justify-center border border-white/20 backdrop-blur-xl transition-colors"
                title="Scroll to Bottom"
              >
                <motion.div animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <ArrowUp size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6 rotate-180" strokeWidth={3} />
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
