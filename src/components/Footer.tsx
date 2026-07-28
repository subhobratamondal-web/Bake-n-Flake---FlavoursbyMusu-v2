import React, { useContext, useState } from 'react';
import { Heart, MapPin, Phone, Mail, Navigation, Users, Plus, Facebook, Instagram, Youtube, Pin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppContext } from '../App';
import { cn } from '../lib/utils';

export default function Footer() {
  const { t, galleryData, serverDate, lastSyncedTime, syncStatus, handleForceRefresh } = useContext(AppContext);
  const [isLinksVisible, setIsLinksVisible] = useState(false);
  const headerLogoItem = galleryData['Header']?.[1];
  const logoUrl = (headerLogoItem 
    ? (typeof headerLogoItem === 'string' ? headerLogoItem : (headerLogoItem as any).img) || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png"
    : "https://i.ibb.co/Xx2kxrrg/LOGO-1.png") || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png";

  const navItems = ['menu', 'story', 'gallery', 'contact'] as const;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-ash dark:bg-matte border-t border-slate-200 dark:border-white/10 pt-24 pb-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20 text-center md:text-left">
          {/* Brand Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-10 bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/40 dark:border-white/10 shadow-xl"
          >
             <div className="flex items-center gap-4 mb-8 justify-center md:justify-start group cursor-pointer" onClick={scrollToTop}>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pink-500 shadow-lg transition-transform group-hover:scale-110">
                   <img src={logoUrl || "https://i.ibb.co/Xx2kxrrg/LOGO-1.png"} alt="Logo" className="w-full h-full object-cover scale-150" referrerPolicy="no-referrer" />
                </div>
                <div className="text-left">
                   <a 
                     href="https://maps.app.goo.gl/fKCd6DHYYPHMLEbg6" 
                     target="_blank" 
                     rel="noreferrer"
                     className="font-serif text-2xl font-bold text-slate-900 dark:text-white leading-none hover:text-pink-500 transition-colors block"
                   >
                     Bake n' Flake
                   </a>
                   <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest leading-loose">~ Flavours by Musu ~</span>
                </div>
             </div>
             <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {t.footer.desc}
             </p>
          </motion.div>

          {/* Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-10 bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/40 dark:border-white/10 shadow-xl flex flex-col items-center"
          >
             <div className="inline-flex items-center gap-2 mb-8 text-pink-500 font-bold uppercase tracking-[0.2em] text-xs">
                <Navigation size={16} /> NAVIGATION
             </div>
             <div className="grid grid-cols-1 gap-4 w-full px-4">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                        const el = document.getElementById(item);
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="py-3 px-6 bg-white/50 dark:bg-black/20 rounded-2xl text-xs font-bold text-slate-600 dark:text-white uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all border border-white/40 dark:border-white/5"
                  >
                    {t.nav[item]}
                  </button>
                ))}
             </div>
          </motion.div>

          {/* Support & Connect */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-10 bg-white/40 dark:bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/40 dark:border-white/10 shadow-xl"
          >
             <div className="inline-flex items-center gap-2 mb-8 text-pink-500 font-bold uppercase tracking-[0.2em] text-xs justify-center w-full">
                <Users size={16} /> SUPPORT & CONNECT
             </div>
             
             <div className="flex gap-4 mb-6 text-left">
                <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center shrink-0">
                   <MapPin size={20} className="text-pink-500" />
                </div>
                <a 
                   href="https://maps.app.goo.gl/B5ZzfftE7RUzeyqb9" 
                   target="_blank" 
                   rel="noreferrer"
                   className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter leading-relaxed hover:text-pink-500 transition-colors"
                >
                   C9XR+4CQ, Kamalgazi, Rajpur Sonarpur, Kolkata, WB 700103
                </a>
             </div>

             <button 
               onClick={() => setIsLinksVisible(!isLinksVisible)}
               className="w-full py-4 bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-[1.5rem] border border-white/30 dark:border-white/5 shadow-inner flex items-center justify-center gap-3 mb-8 group transition-all"
             >
                <div className="flex items-center gap-3">
                   <div className="w-5 h-0.5 bg-slate-900 dark:bg-white rounded-full" />
                   <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">
                      {isLinksVisible ? 'Hide' : 'Quick Link'}
                   </span>
                </div>
             </button>

             <AnimatePresence>
               {isLinksVisible && (
                 <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="overflow-hidden"
                 >
                   <div className="flex flex-wrap justify-center gap-4 mt-2 pb-8">
                      <a href="https://www.facebook.com/flavoursbymusu/" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/50 dark:bg-black/20 rounded-2xl flex items-center justify-center text-blue-600 hover:scale-110 transition-all shadow-lg border border-white/40 dark:border-white/5">
                         <Facebook size={20} />
                      </a>
                      <a href="#" className="w-12 h-12 bg-white/50 dark:bg-black/20 rounded-2xl flex items-center justify-center text-purple-600 hover:scale-110 transition-all shadow-lg border border-white/40 dark:border-white/5">
                         <Users size={20} />
                      </a>
                      <a href="https://instagram.com/flavoursbymusu" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/50 dark:bg-black/20 rounded-2xl flex items-center justify-center text-pink-600 hover:scale-110 transition-all shadow-lg border border-white/40 dark:border-white/5">
                         <Instagram size={20} />
                      </a>
                      <a href="https://in.pinterest.com/khanmegha99/" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/50 dark:bg-black/20 rounded-2xl flex items-center justify-center text-red-600 hover:scale-110 transition-all shadow-lg border border-white/40 dark:border-white/5">
                         <Pin size={20} />
                      </a>
                      <a href="https://youtube.com/@MuskanKhan-pk3qt" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/50 dark:bg-black/20 rounded-2xl flex items-center justify-center text-red-600 hover:scale-110 transition-all shadow-lg border border-white/40 dark:border-white/5">
                         <Youtube size={20} />
                      </a>
                      <a href="mailto:subhobratamondal@gmail.com" className="w-12 h-12 bg-white/50 dark:bg-black/20 rounded-2xl flex items-center justify-center text-orange-500 hover:scale-110 transition-all shadow-lg border border-white/40 dark:border-white/5">
                         <Mail size={20} />
                      </a>
                      <a href="https://wa.me/919875563329" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/50 dark:bg-black/20 rounded-2xl flex items-center justify-center text-emerald-500 hover:scale-110 transition-all shadow-lg border border-white/40 dark:border-white/5">
                         <Phone size={20} />
                      </a>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>
        </div>

        <div className="pt-12 border-t border-slate-200 dark:border-white/5 text-center flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-2">
             <p className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-[0.3em]">
               &copy; {serverDate?.year || new Date().getFullYear()} BAKE N' FLAKE ~ FLAVOURS BY MUSU | {serverDate?.date ? `LAST UPDATED: ${serverDate.date}` : 'KOLKATA, WB'}
             </p>
             {lastSyncedTime && (
               <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                 <span className={cn(
                   "w-2 h-2 rounded-full inline-block",
                   syncStatus === 'synced' ? "bg-emerald-500 animate-pulse" : syncStatus === 'syncing' ? "bg-sky-500 animate-ping" : "bg-amber-500"
                 )} />
                 <span>Google Sheets Sync: <strong className="text-pink-600 dark:text-pink-400">{lastSyncedTime}</strong></span>
                 {handleForceRefresh && (
                   <button 
                     onClick={() => handleForceRefresh()}
                     className="ml-1 text-[9px] underline font-bold uppercase hover:text-pink-500 transition-colors"
                     title="Force re-sync data"
                   >
                     Refetch
                   </button>
                 )}
               </div>
             )}
          </div>

          <div className="flex gap-8 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
             <a href="#menu" className="hover:text-pink-500 transition-colors">Menu</a>
             <a href="#gallery" className="hover:text-pink-500 transition-colors">Gallery</a>
             <a href="#reviews" className="hover:text-pink-500 transition-colors">Reviews</a>
             <a href="#contact" className="hover:text-pink-500 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
