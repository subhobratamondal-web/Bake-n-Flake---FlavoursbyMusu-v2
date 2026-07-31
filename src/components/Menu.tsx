import React, { useState, useContext, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronRight, X, ExternalLink, Star, Facebook, ChevronLeft, Globe, Search, Cake, Gift, LayoutGrid, ShoppingCart, Heart, MessageSquare, Sparkles } from 'lucide-react';

import { AppContext } from '../App';
import { flavours, gifts, moreOptionsData } from '../constants/data';
import { cn } from '../lib/utils';
import { Product } from '../types';
import { playSound } from '../lib/sounds';
import { ProductSkeleton } from './common/Skeleton';
import { getOptimizedImageUrl } from '../utils/googleSheetsSync';
import { OptimizedImage } from './OptimizedImage';
import ProductReviewsModal from './ProductReviewsModal';

const linkMap: Record<string, string> = {
  'Chocolate Cakes': 'https://i.ibb.co/xSTgDb8d/Chocolate-Cakes-1.png',
  'Butterscotch Cakes': 'https://i.ibb.co/fYcwMKdc/Butterscotch-Cakes-1.png',
  'Vanilla Cakes': 'https://i.ibb.co/qMBQG6Nk/Vanilla-Cake-1.png',
  'Chocolate Truffle': 'https://i.ibb.co/MKF765x/Chocolate-Truffle-Cakes-1.png',
  'Pineapple Cakes': 'https://i.ibb.co/gbC67jD7/PIneapple-Cake-1.png',
  'Mango Cakes': 'https://i.ibb.co/q3M2pvxs/Mango-Cake-1.png',
  'Strawberry Cakes': 'https://i.ibb.co/7JYt6dJp/Strawberry-Cakes-1.jpg',
  'Red Velvet Cakes': 'https://i.ibb.co/s9gGgtpk/Red-velvet-1.png',
  'Fresh Fruit Cake': 'https://i.ibb.co/F4V5yd16/Fresh-Fruit-Cake-1.png',
  'Forest Range': 'https://i.ibb.co/q3P990gk/Black-Forest-1.png',
  'Oreo Cakes': 'https://i.ibb.co/nprbQJC/Oreo-Cake-2.png',
  'Alcohol base Cake': 'https://i.ibb.co/xSj9RRdz/Alcohol-Cake-01.png',
  'Coffee Mocha': 'https://i.ibb.co/4w2jyMmB/Coffee-Cake-1.png',
  'Rasmalai Cake': 'https://i.ibb.co/4RBygSqR/Rasmalai-Cake-1.png',
  'Orange Cake': 'https://i.ibb.co/RTSFv7dG/Orrange-Cake-1.png',
  'KitKat Cakes': 'https://i.ibb.co/k26bhF2H/Kitkat-1.png',
  'Birthday Cakes': 'https://i.ibb.co/hJyMC4CY/Birthday-Cake-1.jpg',
  'Anniversary Cakes': 'https://i.ibb.co/5gDy06k7/Aniversary-Cake-2.png',
  'Teacher\'s Day': 'https://i.ibb.co/fzVDfmhj/FRESH-FLOWER-CAKE-1.jpg',
  'Customised Chocolates': 'https://i.ibb.co/Rp8C27Xt/Customized-Chocolates-2.jpg',
  'Father\'s Day Cake': 'https://i.ibb.co/YT2LRm2x/Father-s-Day-Cake-1.png',
  'Mother\'s Day Cake': 'https://i.ibb.co/4n26zZCq/2.jpg',
  'Christmas Cake': 'https://i.ibb.co/7NKqnNsd/Christmas-Cake-4.png',
  'Baby Shower Cake': 'https://i.ibb.co/RTTYsqVd/KIDS-CAKE.png',
  'Rice Ceremony cakes': 'https://i.pinimg.com/736x/6c/bb/7f/6cbb7f551f96722c5b6f01141b5b4aa6.jpg',
  'Fresh Flower Cake': 'https://i.ibb.co/fzVDfmhj/FRESH-FLOWER-CAKE-1.jpg',
  'Doll Cakes': 'https://i.ibb.co/bGXr5qW/DOLL-CAKE-1.png',
  'Half Cakes': 'https://i.ibb.co/V0yhspQm/HALF-CAKE-1.jpg',
  'Tier Cakes': 'https://i.ibb.co/Xx1SBWb6/TIRE-CAKE.png',
  'Number Cakes': 'https://i.ibb.co/20VxsJxG/Number-Cake.jpg',
  'Kids Cakes': 'https://i.ibb.co/xrgZZcx/Kids-Cake-1.png',
  'Fondant and Semi Fondant Cakes': 'https://i.ibb.co/ZpB76tN5/FONDANT-1.png',
  'Glitter Cake': 'https://i.ibb.co/xt8VVwmW/Gliter-Cake-1.jpg',
  'Customize Theme Cake': 'https://i.ibb.co/9mnwZgX4/TIRE-CAKE1.png',
  'Cheesecakes': 'https://i.pinimg.com/736x/bc/b6/0c/bcb60c22cedf8400a2e2c6b0679c22e5.jpg',
  'Photo Cakes': 'https://i.ibb.co/rR23zjJp/Photo-Cake-1.png',
  'Bento Cakes': 'https://i.ibb.co/3yDW6YkY/BENTO-1.jpg',
  'Mousse': 'https://i.ibb.co/xt88WGMM/Mousse-1.jpg',
  'Jar and Glass Cakes': 'https://i.ibb.co/9HDRRk0F/Jur-cake.png',
  'Pinata Cakes': 'https://i.ibb.co/gbqnmvzd/02.jpg',
  'Cupcakes and Muffins': 'https://i.ibb.co/jkNm1Zq8/Cupcakes-1.jpg',
  'Pizza & Patties': 'https://i.ibb.co/sTLSSsj/PIZZA-BUNS-1.png',
  'Brownies': 'https://i.ibb.co/F4rgH3Wn/Brownies-1.jpg',
};

interface MenuItemCardProps {
  item: Product;
  index: number;
  activeTab: string;
  t: any;
  toggleWishlist: (item: Product) => void;
  isWishlisted: (nameEn: string) => boolean;
  openQuickAddToCart: (item: Product) => void;
  setSelectedProduct: (item: Product) => void;
  getProductImages: (productName: string) => string[];
}

function MenuItemCard({
  item,
  index,
  activeTab,
  t,
  toggleWishlist,
  isWishlisted,
  openQuickAddToCart,
  setSelectedProduct,
  getProductImages
}: MenuItemCardProps) {
  const allImages = React.useMemo(() => {
    const sheetImgs = getProductImages(item.nameEn);
    const isValidImage = (url: any) => typeof url === 'string' && url.trim().length > 0 && url !== 'undefined' && url !== 'null';
    
    const list: string[] = [];
    if (Array.isArray(sheetImgs)) {
      sheetImgs.forEach(u => {
        if (isValidImage(u) && !list.includes(u)) list.push(u);
      });
    }
    if (isValidImage(item.img) && !list.includes(item.img)) {
      list.push(item.img);
    }
    if (linkMap[item.nameEn] && isValidImage(linkMap[item.nameEn]) && !list.includes(linkMap[item.nameEn])) {
      list.push(linkMap[item.nameEn]);
    }
    return list.length > 0 ? list : ["https://i.ibb.co/Xx2kxrrg/LOGO-1.png"];
  }, [item, getProductImages]);

  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    if (allImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % allImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [allImages]);

  const primaryImage = allImages[currentImgIndex % allImages.length] || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png";

  return (
    <div
      className="group cursor-pointer w-full flex flex-col transition-transform duration-300 hover:scale-[1.02]"
      onClick={() => {
        playSound('ding');
        setSelectedProduct(item);
      }}
    >
      <div className={cn(
        "relative aspect-square w-full overflow-hidden mb-4 bg-pink-100/50 dark:bg-pink-900/20",
        item.rounded 
          ? "rounded-full p-2 border-2 border-dashed border-pink-200 dark:border-pink-900/30 shadow-inner" 
          : "rounded-[2.5rem] glass-3d neon-border-pink"
      )}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(item);
          }}
          className="absolute top-4 left-4 z-30 p-2 rounded-full glass-3d bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md border border-white/40 dark:border-white/10 text-rose-500 hover:scale-110 active:scale-95 transition-all"
          title={isWishlisted(item.nameEn) ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart 
            size={16} 
            className={cn(
              "transition-all",
              isWishlisted(item.nameEn) ? "fill-rose-500 text-rose-500 scale-110" : "text-slate-400 hover:text-rose-500"
            )} 
          />
        </button>

        {allImages.length > 1 && (
          <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-xl glass-3d text-[10px] font-black text-pink-600 dark:text-pink-400 border border-pink-500/30 shadow-[0_4px_12px_rgba(236,72,153,0.2)] flex items-center gap-1.5 backdrop-blur-md">
            <div className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
            {currentImgIndex + 1}/{allImages.length} {t.lang === 'en' ? 'Photos' : 'ছবি'}
          </div>
        )}

        <div className="w-full h-full absolute inset-0 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={primaryImage}
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-full h-full absolute inset-0"
            >
              <OptimizedImage
                src={primaryImage}
                alt={item.nameEn}
                width={400}
                quality={75}
                fallbackSrc="https://i.ibb.co/Xx2kxrrg/LOGO-1.png"
                className={cn(
                  "w-full h-full object-cover transition-transform duration-500 lg:group-hover:scale-110 relative z-10",
                  item.rounded ? "rounded-full shadow-lg" : "rounded-[2.2rem]"
                )}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 lg:group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 z-20">
          <div className="px-6 py-2 rounded-full glass-3d text-[10px] font-black text-white uppercase tracking-[0.2em] translate-y-4 group-hover:translate-y-0 transition-transform">
            {t.lang === 'en' ? 'Quick View' : 'বিস্তারিত দেখুন'}
          </div>
        </div>
      </div>

      <div className="text-center px-2">
        <h3 className="font-serif font-bold text-slate-800 dark:text-gray-100 text-sm md:text-xl group-hover:text-pink-600 transition-colors line-clamp-1 mb-1">
          {t.lang === 'en' ? item.nameEn : item.nameBn}
        </h3>
        <div className="flex items-center justify-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity mb-2">
          <div className="h-0.5 w-4 bg-pink-500 rounded-full" />
          <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest leading-none mt-0.5">Premium</span>
          <div className="h-0.5 w-4 bg-pink-500 rounded-full" />
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            playSound('ding');
            if (openQuickAddToCart) openQuickAddToCart(item);
          }}
          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/20 active:scale-95 transition-all mt-1"
        >
          <ShoppingCart size={13} />
          {t.lang === 'en' ? 'Order Now' : 'অর্ডার করুন'}
        </button>
      </div>
    </div>
  );
}

export default function Menu() {
  const { t, galleryData, setOrderModalOpen, loading, openQuickAddToCart, toggleWishlist, isWishlisted } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<string>('Signature');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  
  // Lazy Loading / Infinite Scroll state
  const [displayLimit, setDisplayLimit] = useState(24);
  const observerRef = React.useRef<IntersectionObserver | null>(null);

  // Callback Ref for IntersectionObserver to prevent missing observer binding
  const loadMoreCallbackRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!node) return;
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setDisplayLimit(prev => prev + 24);
      }
    }, { rootMargin: '250px', threshold: 0.1 });
    observerRef.current.observe(node);
  }, []);

  // Rating state
  const [ratings, setRatings] = useState<Record<string, number>>({});

  // Reset limit when tab or search changes
  useEffect(() => {
    setDisplayLimit(24);
  }, [activeTab, searchQuery]);

  // Group Dynamic items from galleryData
  const dynamicItems = (galleryData.items || []) as any[];
  
  // Define base categories and labels
  const baseSections = [
    { id: 'Signature', label: t.categories.navSignature, tag: t.categories.catTag, title: "Our Signature Cakes", icon: Cake },
    { id: 'Gifting', label: t.categories.navGifting, tag: t.categories.giftTag, title: t.categories.giftTitle, icon: Gift },
    { id: 'More', label: t.categories.navMore, tag: t.categories.moreTag, title: t.categories.moreTitle, icon: LayoutGrid }
  ];

  // Helper to map sheet section strings to known IDs
  const mapSection = (s: string) => {
    if (!s) return 'Signature';
    const normalized = s.toLowerCase().trim();
    
    // Explicitly ignore boolean strings that might come from misaligned columns
    if (normalized === 'true' || normalized === 'false') return 'Signature';

    // Direct matches for base categories
    if (normalized === 'signature' || normalized === 'কেকস' || normalized === 'cakes') return 'Signature';
    if (normalized === 'gifting' || normalized === 'gifts' || normalized === 'উপহার') return 'Gifting';
    if (normalized === 'more' || normalized === 'more items' || normalized === 'অন্যান্য' || normalized === 'more items') return 'More';

    // User requested "Explore the Rest (Something More)" to be captured in "More"
    if (normalized.includes('signature')) return 'Signature';
    if (normalized.includes('gifting')) return 'Gifting';
    if (normalized.includes('something more') || normalized.includes('explore the rest')) return 'More';
    
    // If it's a specific product category that used to be a tab, don't swallow it into Signature if it doesn't match perfectly
    // or if it's "Chocolate Cakes" and they want it as a tab
    if (normalized === 'chocolate cakes' || normalized === 'chocolate cake') return s.charAt(0).toUpperCase() + s.slice(1);

    // Fallback grouping for general cake keywords to ensure they land somewhere safe if not specified
    if (normalized.includes('কেকস')) return 'Signature';

    return s.charAt(0).toUpperCase() + s.slice(1); // Custom section name
  };

  // Get all unique sections from data, but prioritize standard ones first
  const sheetSections = Array.from(new Set(dynamicItems.map(it => {
    const s = String(it.section || '').trim();
    if (s.toLowerCase() === 'true' || s.toLowerCase() === 'false') return null;
    return s;
  }).filter(Boolean))) as string[];
  
  // We want to ensure Signature, Gifting, More are always present if they have content, 
  // and in that specific order.
  const dynamicSectionIds = [
    'Signature', 'Gifting', 'More',
    ...sheetSections.map(mapSection).filter(s => !['Signature', 'Gifting', 'More'].includes(s))
  ];

  // Unique list of sections that actually have items and are not just garbage/booleans
  const activeSectionIds = Array.from(new Set(dynamicSectionIds)).filter(id => {
    const lower = id.toLowerCase();
    return lower !== 'true' && lower !== 'false' && lower !== '';
  });

  const getSectionData = (sectionId: string) => {
    // Collect all items that map to this sectionId
    const items = dynamicItems.filter(it => mapSection(it.section) === sectionId);
    
    // Merge logic for base sections to ensure essential items like "Chocolate Cakes" aren't lost
    // when the sheet only has a partial selection.
    if (sectionId === 'Signature') {
      const merged = [...items];
      // Ensure essential items from flavours are present
      flavours.forEach(f => {
        const alreadyExists = merged.some(m => 
          m.nameEn.toLowerCase().trim() === f.nameEn.toLowerCase().trim() ||
          m.nameBn.toLowerCase().trim() === f.nameBn.toLowerCase().trim()
        );
        if (!alreadyExists) {
          merged.unshift(f); // Prepend missing essentials
        }
      });
      return merged;
    }

    if (sectionId === 'Gifting') {
      const merged = [...items];
      gifts.forEach(g => {
        const alreadyExists = merged.some(m => 
          m.nameEn.toLowerCase().trim() === g.nameEn.toLowerCase().trim() ||
          m.nameBn.toLowerCase().trim() === g.nameBn.toLowerCase().trim()
        );
        if (!alreadyExists) merged.push(g);
      });
      return merged;
    }

    if (sectionId === 'More') {
      const merged = [...items];
      moreOptionsData.forEach(m => {
        const alreadyExists = merged.some(item => 
          item.nameEn.toLowerCase().trim() === m.nameEn.toLowerCase().trim() ||
          item.nameBn.toLowerCase().trim() === m.nameBn.toLowerCase().trim()
        );
        if (!alreadyExists) merged.push(m);
      });
      return merged;
    }
    
    return items;
  };

  const visibleTabs = activeSectionIds.map(id => {
    const base = baseSections.find(s => s.id === id);
    const data = getSectionData(id);
    
    if (base) return { ...base, data };
    
    // For custom sections
    return {
      id,
      label: id,
      tag: 'Special Collection',
      title: id,
      data
    };
  }).filter(tab => tab.data.length > 0);

  useEffect(() => {
    if (selectedProduct) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [selectedProduct]);

  const getProductImages = useCallback((productName: string) => {
    if (!productName) return [];
    
    const lowerName = productName.toLowerCase().trim();
    const keys = Object.keys(galleryData);

    const filterImages = (arr: any) => {
        if (!Array.isArray(arr)) return [];
        return arr.filter(url => typeof url === 'string' && url.trim().length > 0 && url !== 'undefined' && url !== 'null');
    };

    // 1. Direct match
    if (galleryData[productName]) {
        const imgs = filterImages(galleryData[productName]);
        if (imgs.length > 0) return imgs;
    }

    // 2. Normalized match
    const normalizedKey = keys.find(k => k.toLowerCase().trim() === lowerName);
    if (normalizedKey) {
        const imgs = filterImages(galleryData[normalizedKey]);
        if (imgs.length > 0) return imgs;
    }

    // 3. Singular/Plural variations
    const singular = lowerName.endsWith('s') ? lowerName.slice(0, -1) : lowerName;
    const plural = lowerName.endsWith('s') ? lowerName : lowerName + 's';
    
    const variationKey = keys.find(k => {
      const vk = k.toLowerCase().trim();
      return vk === singular || vk === plural;
    });
    if (variationKey) {
        const imgs = filterImages(galleryData[variationKey]);
        if (imgs.length > 0) return imgs;
    }

    // 4. Underscore variation
    const underscored = lowerName.replace(/\s+/g, '_');
    const uKey = keys.find(k => k.toLowerCase().trim() === underscored);
    if (uKey) {
        const imgs = filterImages(galleryData[uKey]);
        if (imgs.length > 0) return imgs;
    }

    const fallbackImg = linkMap[productName];
    return fallbackImg && typeof fallbackImg === 'string' && fallbackImg.trim().length > 0 ? [fallbackImg.trim()] : [];
  }, [galleryData, linkMap]);

  const getProductImagesRef = React.useRef(getProductImages);
  useEffect(() => {
    getProductImagesRef.current = getProductImages;
  }, [getProductImages]);

  useEffect(() => {
    if (!selectedProduct) {
      setCurrentImageIndex(0);
      return;
    }

    const images = getProductImagesRef.current(selectedProduct.nameEn);
    if (!images || images.length <= 1) {
      setCurrentImageIndex(0);
      return;
    }

    const timer = setInterval(() => {
      // Use the ref to get the latest available images each tick without triggering resets
      const currentImages = getProductImagesRef.current(selectedProduct.nameEn);
      if (currentImages.length > 1) {
        setCurrentImageIndex(prev => (prev + 1) % currentImages.length);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [selectedProduct?.nameEn]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedProduct) return;
    const images = getProductImages(selectedProduct.nameEn);
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedProduct) return;
    const images = getProductImages(selectedProduct.nameEn);
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const getProductImage = (item: Product) => {
    const sheetImages = getProductImages(item.nameEn);
    const isValidImage = (url: any) => typeof url === 'string' && url.trim().length > 0 && url !== 'undefined' && url !== 'null';
    
    if (isValidImage(sheetImages[0])) return sheetImages[0];
    if (isValidImage(item.img)) return item.img;
    
    return "https://i.ibb.co/Xx2kxrrg/LOGO-1.png";
  };

  const currentTab = visibleTabs.find(tab => tab.id === activeTab) || visibleTabs[0];

  // Combine ALL items from ALL visible tabs for global search
  const allProducts = visibleTabs.reduce((acc, tab) => {
    return [...acc, ...(tab.data as Product[])];
  }, [] as Product[]);

  // Filter logic: If search exists, search ALL products; otherwise use current tab
  const isSearching = searchQuery.trim().length > 0;
  const sourceData = isSearching ? allProducts : (currentTab.data as Product[]);

  // Deduplicate products based on name when searching globally
  const uniqueSourceData = isSearching 
    ? Array.from(new Map(sourceData.map(item => [item.nameEn.toLowerCase(), item])).values())
    : sourceData;

  const filteredData = uniqueSourceData.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      (item.nameEn || '').toLowerCase().includes(query) || 
      (item.nameBn || '').toLowerCase().includes(query)
    );
  });

  return (
    <section id="menu" className="py-12 md:py-16 bg-transparent transition-colors duration-500 min-h-screen relative">


      <div className="w-full px-4 sm:px-6 lg:px-8 mt-12 md:mt-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-3 mb-6 relative group">
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
               className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center overflow-hidden border-4 border-pink-500 shadow-2xl relative z-10"
            >
               <img 
                 src={galleryData['Header']?.[1] || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png"} 
                 alt="Logo" 
                 className="w-full h-full object-cover scale-150" 
                 referrerPolicy="no-referrer"
               />
            </motion.div>
            {/* Glow Rings */}
            <div className="absolute inset-[-20%] rounded-full bg-pink-500/10 blur-3xl animate-pulse" />
          </div>
          <p className="text-pink-600 dark:text-pink-400 font-black tracking-[0.3em] uppercase text-[10px] md:text-xs">
             {t.lang === 'en' ? 'OUR DELICIOUS' : 'আমাদের সুস্বাদু'}
          </p>
          <h2 className="font-serif text-3xl md:text-7xl font-bold text-slate-900 dark:text-white mt-4 tracking-tighter flex items-center justify-center gap-4">
            {t.lang === 'en' ? 'Bake n Flake Menu' : 'বেক এন ফ্লেক মেনু'}
            {galleryData.totalImageCount ? (
              <span className="text-xl md:text-3xl font-black text-pink-500 bg-pink-500/10 px-4 py-2 rounded-2xl border border-pink-500/20">
                {galleryData.totalImageCount}
              </span>
            ) : null}
          </h2>
        </div>

        {/* Sticky Search & Tabs Bar - Always visible now - FULL WIDTH WITH GAP */}
        <div className="sticky top-[86px] z-[90] left-0 right-0 w-full py-2 bg-slate-50/90 dark:bg-[#080808]/90 backdrop-blur-xl border-y border-slate-200 dark:border-white/10 mb-8 shadow-xl transition-all duration-300">
          <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
            {/* Search Bar */}
            <div className="relative group mb-4 md:mb-8 max-w-4xl mx-auto">
              <input
                type="text"
                placeholder={t.lang === 'en' ? "Search for any cake, gift or item..." : "যেকোনো কেক, উপহার বা আইটেম খুঁজুন..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 md:pl-14 pr-4 py-3 md:py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:border-pink-500 dark:focus:border-pink-500 outline-none transition-all shadow-inner text-slate-800 dark:text-gray-100 text-sm md:text-base"
              />
              <Search className="absolute left-3.5 md:left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-500 transition-colors" size={20} />
            </div>

            {/* Category Tabs - Restored and Always On - Now taking full width flow */}
            <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-3 md:gap-4 mb-16 overflow-x-auto scrollbar-hide snap-x px-2 pb-4" style={{ WebkitTapHighlightColor: 'transparent' }}>
              {visibleTabs.map((tab, idx) => {
                const isActive = !isSearching && activeTab === tab.id;

                return (
                  <motion.button
                    whileTap={{ scale: 0.94 }}
                    key={tab.id}
                    onClick={() => {
                      playSound('pop');
                      setActiveTab(tab.id as any);
                      setSearchQuery('');
                    }}
                    className={cn(
                      "relative flex-shrink-0 snap-center flex items-center gap-2 md:gap-3 px-5 md:px-6 py-2.5 md:py-3 rounded-2xl transition-all duration-300 font-bold text-[10px] md:text-sm tracking-widest uppercase mb-2",
                      isActive 
                        ? "bg-pink-600 text-white shadow-lg shadow-pink-500/30 scale-105" 
                        : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
                    )}
                  >
                    {(tab as any).icon ? (
                      React.createElement((tab as any).icon, { 
                        size: 18, 
                        className: cn(isActive ? "animate-pulse" : "") 
                      })
                    ) : (
                      <ShoppingBag size={18} className={cn(isActive ? "animate-pulse" : "")} />
                    )}
                    <span>{tab.label}</span>
                    <span className={cn(
                      "ml-1 text-[10px] px-2 py-0.5 rounded-full",
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-pink-400"
                    )}>
                      {tab.data.length}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Tab Heading */}
        <div className="mb-8 md:mb-12 text-center px-4">
            <h3 className="font-serif text-2xl md:text-4xl font-bold text-slate-800 dark:text-white">
                {isSearching ? (t.lang === 'en' ? 'Search Results' : 'অনুসন্ধানের ফলাফল') : currentTab.title}
            </h3>
            <p className="text-pink-500 font-bold text-[9px] md:text-[10px] uppercase tracking-widest mt-2">
              {isSearching ? (t.lang === 'en' ? `Found ${filteredData.length} items across all categories` : `সব বিভাগ মিলিয়ে ${filteredData.length}টি আইটেম পাওয়া গেছে`) : currentTab.tag}
            </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-16 px-1 md:px-0">
          <AnimatePresence mode="popLayout" initial={false}>
            {loading ? (
              // Skeleton Grid
              Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <ProductSkeleton />
                </motion.div>
              ))
            ) : filteredData.length > 0 ? (
              filteredData.slice(0, displayLimit).map((item: Product, index) => (
                <MenuItemCard
                  key={`${activeTab}-${item.nameEn}-${index}`}
                  item={item}
                  index={index}
                  activeTab={activeTab}
                  t={t}
                  toggleWishlist={toggleWishlist}
                  isWishlisted={isWishlisted}
                  openQuickAddToCart={openQuickAddToCart}
                  setSelectedProduct={setSelectedProduct}
                  getProductImages={getProductImages}
                />
              ))
            ) : (
              // Search Results Empty State (only if not loading and filteredData is 0)
              null
            )}
          </AnimatePresence>
        </div>

        {/* Load More Observer Target & Manual Button Fallback */}
        {filteredData.length > displayLimit && (
          <div ref={loadMoreCallbackRef} className="w-full flex flex-col items-center justify-center my-10 gap-3">
            <button
              onClick={() => setDisplayLimit(prev => prev + 24)}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles size={16} />
              {t.lang === 'en' ? 'Load More Items' : 'আরও আইটেম দেখুন'} ({filteredData.length - displayLimit} {t.lang === 'en' ? 'remaining' : 'বাকী আছে'})
            </button>
          </div>
        )}
        
        {/* Search Results Empty State */}
        {!loading && filteredData.length === 0 && (
          <div className="text-center py-20">
             <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-slate-400" />
             </div>
             <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                {t.lang === 'en' ? 'No items found matching your search.' : 'আপনার সন্ধানের সাথে মেলে এমন কোনো আইটেম পাওয়া যায়নি।'}
             </p>
          </div>
        )}
        
        {activeTab === 'Signature' && (
          <div className="flex justify-center mt-12 pb-24">
            <button
               onClick={() => {
                 setActiveTab('Gifting');
                 const element = document.getElementById('menu');
                 if (element) {
                   const yOffset = -80;
                   const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                   window.scrollTo({ top: y, behavior: 'smooth' });
                 }
               }}
               className="group flex flex-col items-center gap-4 transition-all hover:scale-105"
            >
               <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 group-hover:text-pink-500 transition-colors">
                  Explore Gifting Categories
               </span>
               <div className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-white/10 flex items-center justify-center group-hover:border-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all text-slate-400">
                  <ChevronRight size={20} className="rotate-90 group-hover:translate-y-1 transition-transform" />
               </div>
            </button>
          </div>
        )}

        {activeTab === 'Gifting' && (
          <div className="flex justify-center mt-12 pb-24">
            <button
               onClick={() => {
                 setActiveTab('More');
                 const element = document.getElementById('menu');
                 if (element) {
                   const yOffset = -80;
                   const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                   window.scrollTo({ top: y, behavior: 'smooth' });
                 }
               }}
               className="group flex flex-col items-center gap-4 transition-all hover:scale-105"
            >
               <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 group-hover:text-pink-500 transition-colors">
                  Explore More Categories
               </span>
               <div className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-white/10 flex items-center justify-center group-hover:border-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-all text-slate-400">
                  <ChevronRight size={20} className="rotate-90 group-hover:translate-y-1 transition-transform" />
               </div>
            </button>
          </div>
        )}
      </div>

      {/* Pop-up Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-3xl overflow-hidden"
            onClick={() => setSelectedProduct(null)}
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
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative flex flex-col md:flex-row bg-white/90 dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-slate-900/10 dark:border-white/20 shadow-[0_0_100px_rgba(236,72,153,0.1)] dark:shadow-[0_0_100px_rgba(236,72,153,0.2)] w-full max-w-5xl max-h-[90vh] overflow-y-auto hide-scrollbar mx-auto my-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Top Controls: Wishlist & Close Buttons */}
              <div className="absolute top-3 right-3 md:top-6 md:right-6 z-[650] flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playSound('ding');
                    toggleWishlist(selectedProduct);
                  }}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200/60 dark:bg-slate-800/60 md:bg-black/20 dark:md:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center hover:bg-pink-500 hover:text-white hover:scale-110 active:scale-95 transition-all border border-slate-900/10 dark:border-white/20 shadow-lg backdrop-blur-md"
                  title={isWishlisted(selectedProduct.nameEn) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={20} className={isWishlisted(selectedProduct.nameEn) ? "fill-rose-500 text-rose-500 animate-pulse" : ""} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200/60 dark:bg-slate-800/60 md:bg-black/20 dark:md:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center hover:bg-pink-500 hover:text-white hover:scale-110 active:scale-95 transition-all border border-slate-900/10 dark:border-white/20 shadow-lg backdrop-blur-md"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Slider Side */}
              <div className="w-full md:w-3/5 aspect-[4/5] relative flex items-center justify-center bg-slate-100 dark:bg-black/30 overflow-hidden shrink-0">
                <motion.div 
                  className="absolute inset-0 z-10"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -50) handleNext();
                    if (info.offset.x > 50) handlePrev();
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${selectedProduct.nameEn}-${currentImageIndex}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 w-full h-full flex items-center justify-center bg-pink-100 dark:bg-zinc-800"
                    >
                      <div className="absolute inset-0 w-full h-full animate-pulse bg-pink-200/50 dark:bg-black/20" />
                      <img 
                        src={getOptimizedImageUrl(
                          (getProductImages(selectedProduct.nameEn)[currentImageIndex]) || selectedProduct.img || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png", 
                          900, 
                          85
                        ) || (getProductImages(selectedProduct.nameEn)[currentImageIndex]) || selectedProduct.img || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png"}
                        alt={selectedProduct.nameEn}
                        className="w-full h-full object-cover pointer-events-none relative z-10"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.triedOriginal) {
                            target.dataset.triedOriginal = 'true';
                            target.src = getProductImages(selectedProduct.nameEn)[currentImageIndex] || selectedProduct.img || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png";
                          } else {
                            target.src = "https://i.ibb.co/Xx2kxrrg/LOGO-1.png";
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-20" />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Product Logo Overlay */}
                <div className="absolute top-4 left-4 md:top-8 md:left-8 w-12 h-12 md:w-20 md:h-20 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl pointer-events-none z-20 overflow-hidden">
                  <img src="https://i.ibb.co/Xx2kxrrg/LOGO-1.png" alt="Logo" className="w-full h-full object-cover" />
                </div>
                  
                {/* Controls */}
                {getProductImages(selectedProduct.nameEn).length > 1 && (
                  <>
                    <button 
                      onClick={handlePrev}
                      className="flex absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-[610] w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-black/40 md:bg-white/5 text-white items-center justify-center hover:bg-pink-500/20 hover:scale-110 active:scale-95 transition-all border border-white/10 group/btn shadow-2xl backdrop-blur-md"
                    >
                        <ChevronLeft size={24} className="group-hover/btn:-translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={handleNext}
                      className="flex absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-[610] w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-black/40 md:bg-white/5 text-white items-center justify-center hover:bg-pink-500/20 hover:scale-110 active:scale-95 transition-all border border-white/10 group/btn shadow-2xl backdrop-blur-md"
                    >
                        <ChevronRight size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    {/* Small Image Thumbnail Previews */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-40 bg-black/60 p-1.5 rounded-2xl backdrop-blur-md border border-white/20 max-w-[90%] overflow-x-auto hide-scrollbar">
                      {getProductImages(selectedProduct.nameEn).map((imgUrl, i) => (
                        <button 
                          key={i} 
                          type="button"
                          onClick={() => setCurrentImageIndex(i)}
                          className={cn(
                            "w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer",
                            i === currentImageIndex 
                              ? "border-pink-500 scale-105 shadow-md shadow-pink-500/50 ring-2 ring-pink-400" 
                              : "border-white/30 opacity-60 hover:opacity-100"
                          )}
                        >
                          <img src={imgUrl} alt={`preview-${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Info Side */}
              <div className="w-full md:w-2/5 p-6 md:p-8 shrink flex flex-col justify-between bg-white/70 dark:bg-slate-900/60 md:bg-transparent dark:md:bg-transparent overflow-y-auto max-h-[55vh] md:max-h-none hide-scrollbar gap-4">
                 <div>
                   <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.1 }}
                   >
                     <p className="text-pink-500 font-extrabold tracking-[0.25em] uppercase text-[9px] md:text-[10px] mb-1">
                        {t.lang === 'en' ? 'MENU ITEM' : 'মেনু আইটেম'}
                     </p>
                     
                     {/* Smaller Sleeker Title */}
                     <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-[1.2] mb-4 md:mb-5 tracking-tight uppercase italic pr-12">
                        {t.lang === 'en' ? selectedProduct.nameEn : selectedProduct.nameBn}
                     </h2>

                     {/* Action Buttons Section - Shifted UP directly under title */}
                     <div className="grid grid-cols-1 gap-2.5 mb-6">
                        <button 
                          onClick={() => {
                            const itemToCart = selectedProduct;
                            setSelectedProduct(null);
                            if (openQuickAddToCart && itemToCart) {
                              openQuickAddToCart(itemToCart);
                            }
                          }}
                          className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-pink-500/20 group hover:opacity-95 active:scale-95"
                        >
                           <ShoppingCart size={16} className="group-hover:scale-110 transition-transform" /> 
                           {t.lang === 'en' ? 'Add to Cart' : 'কার্টে যোগ করুন'}
                        </button>

                        <button 
                          onClick={() => {
                            setSelectedProduct(null);
                            setOrderModalOpen(true);
                          }}
                          className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all hover:bg-slate-800 dark:hover:bg-slate-700 active:scale-95"
                        >
                           <ShoppingBag size={15} /> Direct Custom Order
                        </button>
                        
                        <button 
                          onClick={() => setIsReviewsModalOpen(true)}
                          className="w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-amber-500/30 shadow-sm cursor-pointer active:scale-95"
                        >
                           <Star size={15} className="fill-amber-400 text-amber-400" />
                           {t.lang === 'en' ? 'Product Reviews & Feedback (12)' : 'প্রোডাক্ট রিভিউ ও ফিডব্যাক (১২)'}
                        </button>

                        <a 
                          href="https://www.facebook.com/flavoursbymusu/photos"
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-white/10 shadow-sm active:scale-95"
                        >
                           <Globe size={15} className="text-pink-600" /> VIEW MORE IMAGE
                        </a>
                     </div>

                     {/* Description Text - Shifted DOWN directly above pricing note */}
                     <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-white/10">
                        <div className="text-slate-600 dark:text-slate-300 text-[11px] md:text-xs leading-relaxed font-medium whitespace-pre-wrap max-h-[18vh] overflow-y-auto pr-2 custom-scrollbar">
                           {t.lang === 'en' 
                            ? selectedProduct.descEn || `✨ The Magic of Classic ${selectedProduct.nameEn}! 🎂\nMake your special days even sweeter with Bake n' Flake's super soft, fluffy, and premium ${selectedProduct.nameEn}! 🤍`
                            : selectedProduct.descBn || `✨ ক্লাসিক ${selectedProduct.nameBn || selectedProduct.nameEn} এর স্নিগ্ধ জাদুকরী স্বাদ! 🎂\nআপনার স্পেশাল দিনগুলোকে আরও মিষ্টি করে তুলতে Bake n' Flake নিয়ে এসেছে একদম নরম, তুলতুলে এবং প্রিমিয়াম ${selectedProduct.nameBn || selectedProduct.nameEn}! 🤍`}
                        </div>

                        <div className="w-10 md:w-12 h-1 bg-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.6)] mt-2" />
                     </div>
                   </motion.div>
                 </div>

                 <div className="pt-2 text-center md:text-left">
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 italic uppercase tracking-[0.2em] font-medium">
                       * Pricing will be based on your customization choices
                    </p>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        product={selectedProduct}
        lang={t.lang}
      />
    </section>
  );
}
