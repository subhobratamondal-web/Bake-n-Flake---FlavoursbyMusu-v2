import React, { useState, useEffect, useContext } from 'react';
import { Menu, X, Sun, Moon, Globe, ShoppingBag, BookOpen, Image as ImageIcon, Phone, Send, LogIn } from 'lucide-react';
import { AppContext } from '../App';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const { lang, setLang, t, theme, toggleTheme, galleryData, setOrderModalOpen } = useContext(AppContext);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const headerLogoItem = galleryData['Header']?.[1];
  const logoUrl = (headerLogoItem 
    ? (typeof headerLogoItem === 'string' ? headerLogoItem : (headerLogoItem as any).img) || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png"
    : "https://i.ibb.co/Xx2kxrrg/LOGO-1.png") || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'menu', icon: ShoppingBag },
    { id: 'story', icon: BookOpen },
    { id: 'gallery', icon: ImageIcon },
    { id: 'contact', icon: Phone }
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
      scrolled ? "py-0" : "py-2"
    )}>
      <div className="w-full">
        <div className={cn(
          "flex justify-between items-center h-20 px-4 md:px-8 transition-all duration-500",
          scrolled ? "glass-3d shadow-2xl shadow-pink-500/10 rounded-none border-x-0 w-full" : "max-w-7xl mx-auto px-6 md:px-12 bg-transparent"
        )}>
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-pink-200 shadow-md transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                   <img src={logoUrl} alt="Logo" className="w-full h-full object-cover scale-150" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-slate-800 dark:text-white leading-none tracking-tight group-hover:text-pink-600 transition-colors">
                {t.brand}
              </span>
              <span className="text-[10px] text-pink-600 dark:text-pink-400 font-black tracking-widest uppercase mt-1">
                {t.tag}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="flex items-center gap-2 px-4 py-2 text-[11px] font-black text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 transition-all uppercase tracking-widest hover:bg-pink-50 dark:hover:bg-white/5 rounded-full group"
                >
                  <item.icon size={14} className="group-hover:scale-110 transition-transform" />
                  {t.nav[item.id]}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setOrderModalOpen(true)}
              className="px-8 py-3 bg-pink-600 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all order-btn-neon flex items-center gap-2"
            >
              <Send size={14} />
              Order Now
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-white/10">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full glass-3d hover:bg-pink-500 hover:text-white text-slate-600 dark:text-slate-300 transition-all transform hover:rotate-12"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-2 px-4 py-2 rounded-full glass-3d text-pink-600 dark:text-pink-400 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-pink-50 dark:hover:bg-pink-900/40"
              >
                <Globe size={14} />
                {t.nav.langToggle}
              </button>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 glass-3d text-slate-800 dark:text-white rounded-2xl active:scale-90 transition-transform"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[90] md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] sm:w-[350px] bg-white dark:bg-[#1a1a1a] z-[110] md:hidden shadow-2xl border-l border-white/10 overflow-y-auto"
            >
              <div className="p-8 pt-24 flex flex-col gap-4">
                <div className="flex flex-col gap-2 mb-6">
                   <span className="font-serif text-2xl font-bold text-slate-800 dark:text-white leading-none tracking-tight">
                    {t.brand}
                  </span>
                  <span className="text-[10px] text-pink-600 dark:text-pink-400 font-black tracking-widest uppercase">
                    {t.tag}
                  </span>
                </div>

                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-4 px-6 py-5 text-sm font-black text-slate-800 dark:text-white hover:text-pink-600 text-left hover:bg-pink-50 dark:hover:bg-white/5 rounded-2xl transition-all uppercase tracking-[0.2em] group"
                  >
                    <item.icon size={20} className="text-pink-500 group-hover:scale-110 transition-transform" />
                    {t.nav[item.id]}
                  </button>
                ))}
                
                <div className="h-px bg-slate-200 dark:bg-white/10 my-4" />
                
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={toggleTheme} className="flex flex-col items-center justify-center gap-2 h-20 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-white font-bold transition-all active:scale-95 border border-slate-200 dark:border-white/10">
                      {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />}
                      <span className="text-[10px] uppercase tracking-widest">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                    </button>
                    <button
                      onClick={() => { setLang(lang === 'en' ? 'bn' : 'en'); setMobileMenuOpen(false); }}
                      className="w-full h-20 rounded-2xl bg-slate-100 dark:bg-white/10 text-pink-600 dark:text-pink-400 font-black uppercase tracking-widest text-[10px] shadow-sm active:scale-95 transition-all border border-pink-200 dark:border-pink-500/20 flex flex-col items-center justify-center gap-2"
                    >
                      <Globe size={20} />
                      {t.nav.langToggle}
                    </button>
                  </div>
                  
                  <button
                    onClick={() => { setOrderModalOpen(true); setMobileMenuOpen(false); }}
                    className="w-full h-16 bg-pink-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl shadow-pink-500/20 active:scale-95 transition-all mt-2"
                  >
                    <Send size={18} />
                    Order Now
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
