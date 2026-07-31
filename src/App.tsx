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
import { Language, Translation, GalleryData, VideoItem, WeatherCondition, WeatherData, CartItem, UserProfile, Order, OrderStatus, Product } from './types';
import { FULL_GALLERY_BACKUP } from './constants/fullGalleryBackup';
import { fetchGalleryDataDirectFromSheets, getOptimizedImageUrl, sendOrderToGoogleSheet } from './utils/googleSheetsSync';
import { OptimizedImage } from './components/OptimizedImage';
import { VideoSkeleton } from './components/common/Skeleton';
import { WEATHER_THEMES, fetchCurrentWeather } from './utils/weatherTheme';
import { flavours, gifts, moreOptionsData } from './constants/data';
import { Play, Youtube, Facebook, X, Heart, Star, Snowflake, Gift, Video, Pin, ArrowUp, Sun, Moon, Keyboard, RefreshCw, CheckCircle2, ShoppingCart, User as UserIcon, Clock, Shield, MessageCircle } from 'lucide-react';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import OrderHistoryModal from './components/OrderHistoryModal';
import OwnerPortalModal from './components/OwnerPortalModal';
import QuickAddToCartModal from './components/QuickAddToCartModal';
import WishlistModal from './components/WishlistModal';
import PromoBanner from './components/PromoBanner';
import CelebrationsModal, { CelebrationEvent } from './components/CelebrationsModal';
import GoogleWorkspaceModal from './components/GoogleWorkspaceModal';
import CelebrationsBanner from './components/CelebrationsBanner';
import ProBakingTips from './components/ProBakingTips';
import CakeBuilder from './components/CakeBuilder';

const getInitialFallbackGalleryData = (): GalleryData => {
  return FULL_GALLERY_BACKUP as unknown as GalleryData;
};
import { motion, AnimatePresence } from 'motion/react';
import { cn, isAllowedAdminUser } from './lib/utils';
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
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  user: UserProfile | null;
  loginUser: (profile: Omit<UserProfile, 'id' | 'isLoggedIn'>) => void;
  logoutUser: () => void;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'timestamp' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  addOrderReview: (orderId: string, rating: number, comment: string) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (loggedIn: boolean) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsOrderHistoryOpen: (open: boolean) => void;
  setIsOwnerPortalOpen: (open: boolean) => void;
  openQuickAddToCart: (product: Product) => void;
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productNameEn: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isGoogleWorkspaceModalOpen: boolean;
  setIsGoogleWorkspaceModalOpen: (open: boolean) => void;
  googleWorkspaceTab: 'calendar' | 'tasks';
  openGoogleWorkspace: (tab?: 'calendar' | 'tasks') => void;
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

  // E-commerce state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bnf_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('bnf_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bnf_orders');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCelebrationsModalOpen, setIsCelebrationsModalOpen] = useState(false);
  const [isGoogleWorkspaceModalOpen, setIsGoogleWorkspaceModalOpen] = useState(false);
  const [googleWorkspaceTab, setGoogleWorkspaceTab] = useState<'calendar' | 'tasks'>('calendar');

  const openGoogleWorkspace = useCallback((tab: 'calendar' | 'tasks' = 'calendar') => {
    setGoogleWorkspaceTab(tab);
    setIsGoogleWorkspaceModalOpen(true);
  }, []);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isStoryInView, setIsStoryInView] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [quickProductToAdd, setQuickProductToAdd] = useState<Product | null>(null);

  useEffect(() => {
    const checkStoryVisibility = () => {
      const storyElem = document.getElementById('story') || document.getElementById('about');
      if (storyElem) {
        const rect = storyElem.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;
        setIsStoryInView(inView);
      }
    };

    window.addEventListener('scroll', checkStoryVisibility, { passive: true });
    // Check initially and also after a short delay for dynamic rendering
    checkStoryVisibility();
    const timer1 = setTimeout(checkStoryVisibility, 300);
    const timer2 = setTimeout(checkStoryVisibility, 1000);

    return () => {
      window.removeEventListener('scroll', checkStoryVisibility);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bnf_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bnf_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('bnf_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem('bnf_user', JSON.stringify(user));
      else localStorage.removeItem('bnf_user');
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('bnf_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    if (!user || !user.isLoggedIn) {
      setIsAuthModalOpen(true);
      setToast({
        message: lang === 'en' 
          ? 'Please login first to add items to your cart!' 
          : 'কার্টে প্রোডাক্ট যোগ করতে আগে লগইন করুন!',
        visible: true
      });
      return;
    }
    const newItem: CartItem = {
      ...item,
      id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)
    };
    setCart(prev => [...prev, newItem]);
    setToast({
      message: lang === 'en' ? `${item.productNameEn} added to Cart!` : `${item.productNameBn} কার্টে যোগ করা হয়েছে!`,
      visible: true
    });
  }, [user, lang]);

  const handleOrderCustomCake = useCallback((customNote: string, estimatedPrice: number) => {
    addToCart({
      productNameEn: 'Custom Bakery Cake 🎂',
      productNameBn: 'কাস্টম বেকারি কেক 🎂',
      img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80',
      weight: 'Custom Size',
      price: estimatedPrice,
      quantity: 1,
      customNote: customNote,
      category: 'Customised'
    });
    setIsCartOpen(true);
  }, [addToCart]);

  const handleOrderForCelebration = useCallback((item: CelebrationEvent) => {
    const note = `[Celebration Order] For ${item.personName} (${item.relationship}) - ${item.type.toUpperCase()} on ${item.date}${item.notes ? ` | Pref: ${item.notes}` : ''}`;
    addToCart({
      productNameEn: `${item.personName}'s Special ${item.type === 'birthday' ? 'Birthday' : 'Anniversary'} Cake 🎂`,
      productNameBn: `${item.personName}-এর বিশেষ কেক 🎂`,
      img: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=300&q=80',
      weight: '1.0 Kg',
      price: 650,
      quantity: 1,
      customNote: note,
      category: 'Customised'
    });
    setIsCartOpen(true);
  }, [addToCart]);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateCartQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const loginUser = useCallback((profile: Omit<UserProfile, 'id' | 'isLoggedIn'>) => {
    const newUserProfile: UserProfile = {
      ...profile,
      id: 'usr_' + Date.now(),
      isLoggedIn: true
    };
    setUser(newUserProfile);
    setToast({
      message: lang === 'en' ? `Welcome back, ${profile.name}!` : `স্বাগতম, ${profile.name}!`,
      visible: true
    });
  }, [lang]);

  const logoutUser = useCallback(() => {
    setUser(null);
    setToast({
      message: lang === 'en' ? 'Logged out successfully' : 'লগ আউট সফল হয়েছে',
      visible: true
    });
  }, [lang]);

  const addOrder = useCallback((orderData: Omit<Order, 'id' | 'timestamp' | 'status'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: '#BNF-' + Math.floor(1000 + Math.random() * 9000),
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    sendOrderToGoogleSheet(newOrder, false);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => {
      const existing = prev.find(o => o.id === orderId);
      if (existing) {
        if (existing.status === 'Delivered') return prev; // Locked!
        const updated = { ...existing, status };
        sendOrderToGoogleSheet(updated, true);
        return prev.map(o => o.id === orderId ? updated : o);
      }
      return prev;
    });
    setToast({
      message: `Order ${orderId} status updated to ${status}`,
      visible: true
    });
  }, []);

  const updateOrder = useCallback((updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    sendOrderToGoogleSheet(updatedOrder, true);
    setToast({
      message: lang === 'en' ? `Order ${updatedOrder.id} updated successfully!` : `অর্ডার ${updatedOrder.id} সেভ করা হয়েছে!`,
      visible: true
    });
  }, [lang]);

  const addOrderReview = useCallback((orderId: string, rating: number, comment: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          userReview: {
            rating,
            comment,
            timestamp: new Date().toISOString()
          }
        };
      }
      return o;
    }));
    setToast({
      message: lang === 'en' ? 'Thank you for your feedback!' : 'ধন্যবাদ আপনার ফিডব্যাকের জন্য!',
      visible: true
    });
  }, [lang]);

  const clearOldOrders = useCallback(() => {
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    setOrders(prev => prev.filter(o => {
      const orderTime = new Date(o.timestamp).getTime();
      return orderTime >= oneMonthAgo;
    }));
    setToast({
      message: lang === 'en' ? 'Orders older than 1 month removed from history' : '১ মাসের পুরনো অর্ডার মুছে ফেলা হয়েছে',
      visible: true
    });
  }, [lang]);

  const removeOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    setToast({
      message: lang === 'en' ? `Order ${orderId} removed` : `অর্ডার ${orderId} হিস্ট্রি থেকে রিমুভ করা হয়েছে`,
      visible: true
    });
  }, [lang]);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.nameEn.toLowerCase() === product.nameEn.toLowerCase());
      if (exists) {
        setToast({
          message: lang === 'en' ? `Removed ${product.nameEn} from Wishlist` : `উইশলিস্ট থেকে ${product.nameBn || product.nameEn} সেশন বাদ দেওয়া হয়েছে`,
          visible: true
        });
        return prev.filter(item => item.nameEn.toLowerCase() !== product.nameEn.toLowerCase());
      } else {
        setToast({
          message: lang === 'en' ? `Saved ${product.nameEn} to Wishlist! ❤️` : `উইশলিস্টে ${product.nameBn || product.nameEn} সেভ করা হয়েছে! ❤️`,
          visible: true
        });
        return [...prev, product];
      }
    });
  }, [lang]);

  const isWishlisted = useCallback((productNameEn: string) => {
    return wishlist.some(item => item.nameEn.toLowerCase() === productNameEn.toLowerCase());
  }, [wishlist]);

  const openQuickAddToCart = useCallback((product: Product) => {
    if (!user || !user.isLoggedIn) {
      setIsAuthModalOpen(true);
      setToast({
        message: lang === 'en' 
          ? 'Please login first to order or add items to cart!' 
          : 'কার্টে প্রোডাক্ট যোগ করতে আগে লগইন করুন!',
        visible: true
      });
      return;
    }
    setQuickProductToAdd(product);
  }, [user, lang]);

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
      .then(async res => {
        if (!res.ok) return null;
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          return null;
        }
      })
      .then(data => {
        if (data && data.date) {
          setServerDate(data);
        } else {
          setServerDate({
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
            year: new Date().getFullYear()
          });
        }
      })
      .catch(() => {
        setServerDate({
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          year: new Date().getFullYear()
        });
      });
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
        try {
          const exists = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="prefetch"]')).some(link => link.href === url);
          if (!exists) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.as = 'image';
            link.href = url;
            document.head.appendChild(link);
          }
        } catch (e) {}
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
      lastSyncedTime, syncStatus, handleForceRefresh,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      user, loginUser, logoutUser,
      orders, addOrder, updateOrderStatus, addOrderReview,
      isAdminLoggedIn, setIsAdminLoggedIn,
      setIsCartOpen, setIsAuthModalOpen, setIsOrderHistoryOpen, setIsOwnerPortalOpen,
      openQuickAddToCart,
      wishlist, toggleWishlist, isWishlisted, isWishlistOpen, setIsWishlistOpen,
      isGoogleWorkspaceModalOpen, setIsGoogleWorkspaceModalOpen, googleWorkspaceTab, openGoogleWorkspace
    }}>
      <Background />
      <div className={cn(
        "min-h-screen selection:bg-pink-100 selection:text-pink-600 relative z-10",
        theme === 'dark' ? "text-white" : "text-slate-900"
      )}>
        <PromoBanner lang={lang} />
        <Navbar />
        <Hero
          onOpenCelebrationsModal={() => setIsCelebrationsModalOpen(true)}
          onOrderForCelebration={handleOrderForCelebration}
        />
        <Menu />
        <GallerySection />
        <VideoSection />
        <ProBakingTips lang={lang} />
        <Story />
        <Reviews />
        <Contact />
        <FAQ />
        <Footer />
        
        <CelebrationsModal
          isOpen={isCelebrationsModalOpen}
          onClose={() => setIsCelebrationsModalOpen(false)}
          lang={lang}
          onOrderForCelebration={handleOrderForCelebration}
        />

        <GoogleWorkspaceModal
          isOpen={isGoogleWorkspaceModalOpen}
          onClose={() => setIsGoogleWorkspaceModalOpen(false)}
          lang={lang}
          initialTab={googleWorkspaceTab}
        />
        
        <WishlistModal
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
        />
        
        <OrderModal 
          isOpen={isOrderModalOpen} 
          onClose={() => setOrderModalOpen(false)} 
          lang={lang} 
        />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateCartQuantity}
          onClearCart={clearCart}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onPlaceOrder={addOrder}
          lang={lang}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          user={user}
          onLogin={loginUser}
          onLogout={logoutUser}
          lang={lang}
        />

        <OrderHistoryModal
          isOpen={isOrderHistoryOpen}
          onClose={() => setIsOrderHistoryOpen(false)}
          orders={orders}
          onAddReview={addOrderReview}
          onRemoveOldOrders={clearOldOrders}
          onRemoveOrder={removeOrder}
          lang={lang}
        />

        <OwnerPortalModal
          isOpen={isOwnerPortalOpen}
          onClose={() => setIsOwnerPortalOpen(false)}
          orders={orders}
          onUpdateStatus={updateOrderStatus}
          onUpdateOrder={updateOrder}
          lang={lang}
        />

        <QuickAddToCartModal
          product={quickProductToAdd}
          isOpen={!!quickProductToAdd}
          onClose={() => setQuickProductToAdd(null)}
          onAddToCart={addToCart}
          lang={lang}
        />

        <ChatBot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          hideFloatingButton={true}
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

        {/* Persistent Floating Bottom Action Bar (Chat, Cart, User, Orders, Owner) */}
        <div className="fixed bottom-6 left-4 sm:left-6 md:left-8 z-[120] flex items-center gap-2 bg-white/80 dark:bg-slate-900/95 p-2 rounded-full backdrop-blur-xl border border-white/60 dark:border-white/20 shadow-2xl text-slate-800 dark:text-white">
          {/* Chat Assistant Trigger (Visible when Story section is in view or chat is open) */}
          <AnimatePresence>
            {(isStoryInView || isChatOpen) && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onClick={() => setIsChatOpen(prev => !prev)}
                className="p-3 sm:p-3.5 rounded-full bg-pink-600 hover:bg-pink-700 text-white shadow-lg transition-colors relative group shrink-0"
                title="Chat Assistant"
              >
                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-3 sm:p-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white shadow-md transition-all relative border border-slate-200/80 dark:border-slate-700/60"
            title="Cart"
          >
            <ShoppingCart size={20} className="text-pink-500 dark:text-pink-400" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-900 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                {cart.length}
              </span>
            )}
          </button>

          {/* User Account / Login Trigger */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="p-3 sm:p-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white shadow-md transition-all border border-slate-200/80 dark:border-slate-700/60"
            title={user?.isLoggedIn ? user.name : (lang === 'en' ? 'Login' : 'লগইন')}
          >
            <UserIcon size={20} className="text-pink-500 dark:text-pink-400" />
          </button>

          {/* My Orders Button */}
          {(() => {
            const activeCount = (user && user.isLoggedIn) ? orders.length : 0;
            return (
              <button
                onClick={() => {
                  if (!user || !user.isLoggedIn) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsOrderHistoryOpen(true);
                  }
                }}
                className="p-3 sm:p-3.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white shadow-md transition-all relative border border-slate-200/80 dark:border-slate-700/60"
                title={`My Orders (${activeCount})`}
              >
                <Clock size={20} className="text-amber-500 dark:text-amber-400" />
                {activeCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {activeCount}
                  </span>
                )}
              </button>
            );
          })()}

          {/* Owner Admin Portal Shortcut - Shows Musu Bakery Owner Profile Photo */}
          <button
            onClick={() => {
              if (user?.isLoggedIn && isAllowedAdminUser(user.phone)) {
                setIsOwnerPortalOpen(true);
              }
            }}
            className={cn(
              "p-1 rounded-full transition-all border flex items-center justify-center relative group shrink-0",
              (user?.isLoggedIn && isAllowedAdminUser(user.phone))
                ? "bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/30 animate-pulse cursor-pointer"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-pink-500/50 cursor-default"
            )}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-amber-300/80 shadow-md">
              <img src="https://i.ibb.co/wrc3VVRg/PROFILE.jpg" alt="Musu Owner" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            {(user?.isLoggedIn && isAllowedAdminUser(user.phone)) && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white dark:border-slate-900 shadow">
                ADMIN
              </span>
            )}
          </button>
        </div>



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

        <ChatBot floating={true} isOpen={isChatOpen} onToggle={setIsChatOpen} hideFloatingButton={true} />
      </div>
    </AppContext.Provider>
  );
}
