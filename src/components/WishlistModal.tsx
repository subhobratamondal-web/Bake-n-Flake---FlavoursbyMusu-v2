import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { AppContext } from '../App';
import { Product } from '../types';
import { playSound } from '../lib/sounds';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistModal({ isOpen, onClose }: WishlistModalProps) {
  const { wishlist, toggleWishlist, openQuickAddToCart, lang, t } = useContext(AppContext);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-6 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Heart size={20} className="fill-white text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {lang === 'en' ? 'My Saved Wishlist' : 'আমার পছন্দের আইটেম (উইশলিস্ট)'}
                </h3>
                <p className="text-xs text-white/80">
                  {wishlist.length} {lang === 'en' ? 'items saved for later' : 'টি সেভ করা আইটেম'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {wishlist.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900/40">
                  <Heart size={32} />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-700 dark:text-slate-200">
                    {lang === 'en' ? 'Your Wishlist is Empty' : 'আপনার উইশলিস্ট খালি'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {lang === 'en'
                      ? 'Click the heart icon on any cake or gift in the menu to save it here for quick access later!'
                      : 'যেকোনো কেক বা গিফটের পাশের হার্ট আইকনে ক্লিক করে এখানে সেভ করুন!'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white text-xs font-bold shadow-md shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <span>{lang === 'en' ? 'Explore Menu' : 'মেনু দেখুন'}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map((product) => (
                  <div
                    key={product.nameEn}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex gap-3 items-center group relative shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-pink-200 dark:border-pink-900/40 bg-pink-100/50">
                      <img
                        src={product.img || 'https://i.ibb.co/Xx2kxrrg/LOGO-1.png'}
                        alt={product.nameEn}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {lang === 'en' ? product.nameEn : product.nameBn}
                      </h4>
                      <p className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold mt-0.5">
                        {product.category || 'Premium Bake'}
                      </p>

                      <button
                        onClick={() => {
                          playSound('ding');
                          openQuickAddToCart(product);
                        }}
                        className="mt-2 py-1.5 px-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <ShoppingCart size={13} />
                        {lang === 'en' ? 'Add to Cart' : 'কার্টে যোগ করুন'}
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => toggleWishlist(product)}
                      className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
