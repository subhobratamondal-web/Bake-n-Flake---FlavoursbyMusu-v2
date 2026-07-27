import React, { useState, useContext, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppContext } from '../App';
import { faqData } from '../data/faqs';
import { SearchBar } from './SearchBar';
import { CategorySection } from './CategorySection';
import { FAQ as FAQType, FAQCategory } from '../types';
import { HelpCircle, ChevronRight, MessageCircle, X, Search, MapPin, Cake, Palette, ShoppingCart, CreditCard, Truck, Leaf, PartyPopper, Refrigerator } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '../lib/utils';
import { playSound } from '../lib/sounds';

const FAQ: React.FC = () => {
  const { lang, galleryData } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isAllFaqsModalOpen, setIsAllFaqsModalOpen] = useState(false);

  // Prevent background scroll when modal is open
  React.useEffect(() => {
    if (selectedCategory || isAllFaqsModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedCategory, isAllFaqsModalOpen]);

  // Merge static FAQ data with dynamic data from Google Sheets if available
  const mergedData = useMemo(() => {
    const dynamicFaqs = galleryData.FAQ || [];
    const baseData = JSON.parse(JSON.stringify(faqData)) as FAQCategory[];
    
    if (dynamicFaqs.length === 0) return baseData;

    const categoryTranslations: Record<string, string> = {
      "Location & Contact": "অবস্থান এবং যোগাযোগ",
      "Cake Menu & Flavors": "কেক মেনু এবং ফ্লেভার",
      "Customization & Themes": "কাস্টমাইজেশন এবং থিম",
      "Ordering & Booking": "অর্ডার এবং বুকিং",
      "Payment & Pricing": "মূল্য এবং পেমেন্ট",
      "Delivery & Pick-up": "ডেলিভারি এবং পিক-আপ",
      "Delivery & Storage": "ডেলিভারি এবং সংরক্ষণ",
      "Ingredients & Dietary": "উপাদান এবং স্বাস্থ্যবিধি",
      "Events & Snacks": "অনুষ্ঠান এবং স্ন্যাকস",
      "Sizing & Portions": "আকার এবং পরিমাণ",
      "Storage & Consumption": "সংরক্ষণ এবং পরিবেশন",
      "Pricing & Discounts": "মূল্য এবং ডিসকাউন্ট",
      "Special Occasions": "বিশেষ অনুষ্ঠান",
      "Jar Cakes & Cupcakes": "জার কেক এবং কাপকেক",
      "Snacks & Savories": "স্ন্যাকস এবং চকোলেট",
      "Corporate & Bulk": "কর্পোরেট এবং বাল্ক",
      "Our Story & Brand": "আমাদের গল্প",
      "Social & Community": "সোশ্যাল ও কমিউনিটি",
      "Website & Social": "ওয়েবসাইট ও সোশ্যাল মিডিয়া",
      "Troubleshooting & Fixes": "সমস্যা সমাধান"
    };

    dynamicFaqs.forEach((item: any) => {
      const newFaq: FAQType = {
        ...item,
        questionEn: item.questionEn || item.title || '',
        questionBn: item.questionBn || item.titleBn || item.title || '',
        answerEn: item.answerEn || item.description || '',
        answerBn: item.answerBn || item.descriptionBn || item.description || ''
      };
      
      const categoryName = item.category || 'General';
      let category = baseData.find(c => c.titleEn === categoryName);
      if (!category) {
        category = {
          titleEn: categoryName,
          titleBn: categoryTranslations[categoryName] || categoryName,
          icon: 'HelpCircle',
          faqs: []
        };
        baseData.push(category);
      }
      category.faqs.push(newFaq);
    });

    return baseData;
  }, [galleryData.FAQ]);

  const categories = useMemo(() => {
    return ['All', ...mergedData.map(c => c.titleEn)];
  }, [mergedData]);

  const filteredData = useMemo(() => {
    return mergedData.map(category => {
      const filteredFaqs = category.faqs.filter(faq => {
        const query = searchTerm.toLowerCase();
        const searchPool = [
          faq.questionEn,
          faq.questionBn,
          faq.answerEn,
          faq.answerBn
        ].join(' ').toLowerCase();
        
        return searchPool.includes(query);
      });

      return {
        ...category,
        faqs: filteredFaqs
      };
    }).filter(category => {
      const hasFaqs = category.faqs.length > 0;
      const matchesFilter = filterCategory === 'All' || category.titleEn === filterCategory;
      return hasFaqs && matchesFilter;
    });
  }, [mergedData, searchTerm, filterCategory]);

  const handleCategoryClick = (category: FAQCategory) => {
    playSound('pop');
    setSelectedCategory(category);
  };

  const closePortal = () => {
    playSound('ding');
    setSelectedCategory(null);
  };

  const getIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName] || HelpCircle;
    return <IconComp size={24} />;
  };

  return (
    <section id="faq" className="py-24 px-4 bg-transparent relative overflow-hidden transition-colors duration-500">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-6 p-4 rounded-[2rem] glass-3d neon-border-pink group">
             <HelpCircle className="text-pink-500 transform group-hover:rotate-12 transition-transform drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" size={32} />
          </div>
          <h2 className="font-serif text-4xl md:text-7xl font-bold text-slate-900 dark:text-white mt-4 tracking-tighter">
            {lang === 'en' ? 'Common Questions' : 'সাধারণ জিজ্ঞাসা'}
          </h2>
          <p className="text-pink-600 dark:text-pink-400 font-black tracking-[0.3em] uppercase text-[10px] md:text-xs mt-4">
            {lang === 'en' ? 'Get all the details about our treats' : 'আমাদের সম্পর্কে সব তথ্য পাবেন এখানে'}
          </p>
        </motion.div>

        {/* FAQ Search Bar */}
        <div className="max-w-2xl mx-auto mb-16 px-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} language={lang} />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredData.length > 0 ? (
            filteredData.slice(0, searchTerm ? undefined : 6).map((category, index) => (
              <motion.button
                key={category.titleEn}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleCategoryClick(category)}
                whileHover="hover"
                className={cn(
                  "p-6 rounded-[2.5rem] flex items-center justify-between group transition-all duration-500 text-left",
                  "bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-pink-500/40 hover:bg-white hover:dark:bg-white/10 hover:shadow-2xl hover:shadow-pink-500/10"
                )}
              >
                <div className="flex items-center gap-5">
                  <motion.div 
                    variants={{
                      hover: {
                        scale: 1.15,
                        rotate: [0, -10, 10, -5, 0],
                        transition: { duration: 0.5, ease: "easeInOut" }
                      }
                    }}
                    className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-500 shadow-inner relative overflow-hidden"
                  >
                    <motion.div 
                      variants={{ hover: { opacity: 1, scale: 1.5 } }} 
                      initial={{ opacity: 0, scale: 0 }} 
                      className="absolute inset-0 bg-pink-400 blur-xl" 
                    />
                    <div className="relative z-10">
                      {getIcon(category.icon)}
                    </div>
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 font-serif leading-tight">
                      {lang === 'en' ? category.titleEn : category.titleBn}
                    </span>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-pink-500/60 mt-1 flex items-center gap-1.5">
                      <motion.span 
                        variants={{ hover: { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } }} 
                        transition={{ repeat: Infinity, duration: 1.5 }} 
                        className="inline-block"
                      >✨</motion.span>
                      {category.faqs.length} {lang === 'en' ? 'Questions' : 'প্রশ্ন'}
                    </span>
                  </div>
                </div>
                <motion.div 
                  variants={{ hover: { x: 5, color: '#ec4899' } }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 transition-all duration-500"
                >
                  <ChevronRight size={20} strokeWidth={3} />
                </motion.div>
              </motion.button>
            ))
          ) : (
            <div className="col-span-full">
              <div className="text-center py-20 bg-white/40 dark:bg-white/2 rounded-[3rem] border border-slate-200 dark:border-white/5">
                <HelpCircle className="mx-auto text-slate-200 dark:text-slate-800 mb-4" size={64} />
                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">
                  {lang === 'en' ? 'No featured categories for this filter' : 'এই ফিল্টারে কোনো ক্যাটাগরি নেই'}
                </p>
                <button 
                  onClick={() => setIsAllFaqsModalOpen(true)}
                  className="mt-6 px-8 py-3 bg-pink-500 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-pink-500/20 hover:scale-105 transition-all"
                >
                  {lang === 'en' ? 'Search All FAQs' : 'সকল জিজ্ঞাসা খুঁজুন'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Expand More FAQ Button (Moved Below) */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => {
               playSound('pop');
               setIsAllFaqsModalOpen(true);
            }}
            className="px-8 py-3 md:px-12 md:py-4 rounded-full text-[10px] md:text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 border bg-slate-900 dark:bg-pink-600 text-white border-slate-700 dark:border-pink-500/50 hover:scale-105 active:scale-95 shadow-2xl shadow-pink-500/20"
          >
            {lang === 'en' ? 'Expand More FAQ' : 'আরও জিজ্ঞাসা দেখুন'}
          </button>
        </div>

        {/* All FAQs Fullscreen Modal */}
        <AnimatePresence>
          {isAllFaqsModalOpen && !selectedCategory && (
            <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { setIsAllFaqsModalOpen(false); setSearchTerm(''); setFilterCategory('All'); }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-5xl h-[90vh] md:h-[85vh] bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 flex flex-col"
              >
                 <div className="px-6 md:px-10 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 flex items-center justify-between sticky top-0 z-20">
                    <h3 className="text-2xl font-bold font-serif dark:text-white flex items-center gap-3">
                       <Search className="text-pink-500" size={24} />
                       {lang === 'en' ? 'All FAQs & Search' : 'সকল জিজ্ঞাসা ও সার্চ'}
                    </h3>
                    <button 
                      onClick={() => { setIsAllFaqsModalOpen(false); setSearchTerm(''); setFilterCategory('All'); }}
                      className="p-3 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-pink-50 hover:text-pink-500 transition-all active:scale-90"
                    >
                      <X size={20} />
                    </button>
                 </div>

                 <div className="p-6 md:p-10 flex-shrink-0 flex flex-col md:flex-row gap-4 items-center bg-slate-50/30 dark:bg-slate-900/30">
                    <div className="flex-1 w-full">
                      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} language={lang} />
                    </div>
                    
                    <select 
                      value={filterCategory}
                      onChange={(e) => {
                        playSound('pop');
                        setFilterCategory(e.target.value);
                      }}
                      className="w-full md:w-64 px-4 py-4 rounded-2xl bg-white dark:bg-slate-800 font-bold text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm cursor-pointer appearance-none"
                      style={{ backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23ec4899%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
                    >
                       {categories.map((cat) => (
                         <option key={cat} value={cat}>{cat} ({mergedData.find(c => c.titleEn === cat)?.faqs.length || mergedData.reduce((acc, c)=>acc+c.faqs.length, 0)})</option>
                       ))}
                    </select>
                 </div>

                 <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-10 scrollbar-hide">
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {filteredData.length > 0 ? (
                        filteredData.map((category, index) => (
                          <button
                            key={category.titleEn}
                            onClick={() => handleCategoryClick(category)}
                            className={cn(
                              "p-5 rounded-[2rem] flex items-center justify-between group transition-all text-left block w-full",
                              "bg-slate-50 dark:bg-white/2 border border-slate-200 dark:border-white/5 hover:border-pink-500/40 hover:bg-white"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <motion.div 
                                whileHover={{ scale: 1.1, rotate: -10 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:bg-pink-500 group-hover:text-white transition-colors"
                              >
                                {getIcon(category.icon)}
                              </motion.div>
                              <div className="flex flex-col">
                                <span className="text-base font-bold text-slate-800 dark:text-slate-100 font-serif leading-tight line-clamp-1">
                                  {lang === 'en' ? category.titleEn : category.titleBn}
                                </span>
                                <span className="text-[9px] font-black tracking-[0.2em] uppercase text-pink-500/60 mt-1 flex items-center gap-1.5">
                                  <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>✨</motion.span>
                                  {category.faqs.length} {lang === 'en' ? 'Q&A' : 'প্রশ্ন'}
                                </span>
                              </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-pink-500 shrink-0" />
                          </button>
                        ))
                      ) : (
                        <div className="col-span-full py-20 text-center">
                          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">
                            {lang === 'en' ? 'No matches found' : 'কোনো ফলাফল পাওয়া যায়নি'}
                          </p>
                        </div>
                      )}
                   </div>
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Portal */}
        <AnimatePresence>
          {selectedCategory && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closePortal}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 flex flex-col"
              >
                {/* Modal Header */}
                <div className="px-8 py-8 flex items-center justify-between border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 sticky top-0 z-20">
                  <div className="flex items-center gap-5">
                    <div className="p-4 rounded-2xl bg-pink-500 text-white shadow-lg shadow-pink-500/20 shrink-0">
                      {getIcon(selectedCategory.icon)}
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-serif leading-tight">
                        {lang === 'en' ? selectedCategory.titleEn : selectedCategory.titleBn}
                      </h3>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
                        <p className="text-[10px] font-black tracking-[0.2em] uppercase text-pink-500">
                          {lang === 'en' ? 'Category Overview' : 'ক্যাটাগরি ওভারভিউ'}
                        </p>
                        {selectedCategory.categoryImages && (
                          <div className="flex items-center gap-1.5">
                            {selectedCategory.categoryImages.slice(0, 5).map((img, idx) => (
                              <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="w-8 h-8 rounded-lg border-2 border-white dark:border-slate-800 overflow-hidden bg-slate-100 shadow-sm"
                              >
                                <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={closePortal}
                    className="p-4 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-pink-50 hover:text-pink-500 transition-all active:scale-90 shrink-0"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto px-8 py-8 scrollbar-hide">
                  <CategorySection category={selectedCategory} language={lang} />
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2 text-center">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-relaxed">
                    {lang === 'en' ? "Can't find what you're looking for? Reach out to us below." : "যা খুঁজছেন তা পাচ্ছেন না? আমাদের সাথে যোগাযোগ করুন।"}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FAQ;
