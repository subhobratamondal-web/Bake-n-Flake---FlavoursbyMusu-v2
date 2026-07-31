import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Camera, Calendar, Pizza, Scale, MessageSquare, Phone, MessageCircle, ChevronDown, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { flavours } from '../constants/data';
import { cn } from '../lib/utils';
import { AppContext } from '../App';
import { playSound } from '../lib/sounds';

import { sendOrderToGoogleSheet } from '../utils/googleSheetsSync';

const triggerCelebratoryConfetti = () => {
  const count = 180;
  const defaults = { origin: { y: 0.65 } };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#ec4899', '#f43f5e', '#fbbf24', '#10b981']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#3b82f6', '#8b5cf6', '#ec4899']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
}

export default function OrderModal({ isOpen, onClose, lang }: OrderModalProps) {
  const { t, addOrder, user } = useContext(AppContext);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const initialForm = {
    name: '',
    deliveryDate: '',
    flavor: '',
    weight: '',
    message: '',
    requirements: ''
  };

  const [form, setForm] = useState(initialForm);
  const [copied, setCopied] = useState(false);
  const MAX_REQUIREMENTS = 1000;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isOpen]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const filteredFlavours = flavours.filter(f => 
    (lang === 'en' ? f.nameEn : f.nameBn).toLowerCase().includes(form.flavor.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (type: 'wa' | 'messenger') => {
    playSound('ding');
    if (!form.name || !form.deliveryDate) {
      alert(lang === 'en' ? 'Please fill in your name and delivery date' : 'আপনার নাম এবং ডেলিভারির তারিখ দিন');
      return;
    }

    setIsSyncing(true);
    
    try {
      const createdOrder = addOrder({
        customerName: form.name.trim(),
        customerPhone: user?.phone || 'WhatsApp Inquiry',
        customerEmail: user?.email || '',
        deliveryAddress: 'WhatsApp Custom Order Discussion',
        deliveryDate: form.deliveryDate,
        items: [
          {
            id: 'custom_' + Date.now(),
            productNameEn: form.flavor ? `Custom Cake (${form.flavor})` : 'Custom Cake Order',
            productNameBn: form.flavor ? `কাস্টম কেক (${form.flavor})` : 'কাস্টম কেক অর্ডার',
            img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
            weight: form.weight || 'Standard',
            price: 500,
            quantity: 1,
            customNote: `Message: ${form.message || 'N/A'}. Requirements: ${form.requirements || 'N/A'}`,
            category: 'Custom'
          }
        ],
        subtotal: 500,
        total: 500,
        notes: `Cake Message: ${form.message}. Req: ${form.requirements}`,
        paymentMethod: 'Cash on Delivery'
      });

      await sendOrderToGoogleSheet(createdOrder);
      triggerCelebratoryConfetti();
    } catch (err) {
      console.error('Order Sync Error:', err);
    } finally {
      setIsSyncing(false);
    }

    const text = `*New Order Request*%0A%0A*Name:* ${form.name}%0A*Delivery Date:* ${form.deliveryDate}%0A*Flavor:* ${form.flavor}%0A*Weight:* ${form.weight}%0A*Message on Cake:* ${form.message}%0A*Requirements:* ${form.requirements}%0A%0A*Note:* Customer will share sample design if needed.`;
    
    if (type === 'wa') {
      window.open(`https://wa.me/919875563329?text=${text}`, '_blank');
    } else {
      window.open(`https://m.me/flavoursbymusu?text=${text}`, '_blank');
    }

    // Reset form and close modal
    setForm(initialForm);
    setTimeout(() => onClose(), 100);
  };

  const copyToClipboard = () => {
    const text = `Order Request Details:
Name: ${form.name}
Delivery Date: ${form.deliveryDate}
Flavor: ${form.flavor}
Weight: ${form.weight}
Message on Cake: ${form.message}
Requirements: ${form.requirements}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-[96%] sm:max-w-xl md:max-w-2xl bg-white dark:bg-[#181124] rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 max-h-[92vh] md:max-h-[88vh] overflow-y-auto"
          >
            <div className="p-4 sm:p-6 md:p-10">
              <div className="flex justify-between items-center mb-5 md:mb-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">Order Custom Cake</h2>
                  <p className="text-pink-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest mt-1">{lang === 'en' ? 'Tell us your requirements' : 'আপনার প্রয়োজনীয়তা জানান'}</p>
                </motion.div>
                <button
                  onClick={onClose}
                  className="p-2.5 sm:p-3 bg-slate-100 dark:bg-white/10 rounded-xl md:rounded-2xl text-slate-500 hover:text-pink-500 transition-all flex-shrink-0"
                >
                  <X size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                </button>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 md:mb-8"
              >
                <div className="space-y-4 sm:space-y-6">
                  <motion.div variants={itemVariants}>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">
                      <Send size={12} /> Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl outline-none focus:border-pink-500 text-slate-800 dark:text-white transition-all text-xs sm:text-sm font-medium"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">
                      <Calendar size={12} /> Delivery Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl outline-none focus:border-pink-500 text-slate-800 dark:text-white transition-all text-xs sm:text-sm font-medium"
                      value={form.deliveryDate}
                      onChange={e => setForm({...form, deliveryDate: e.target.value})}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants} className="relative" ref={suggestionRef}>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">
                      <Pizza size={12} /> Cake Flavor
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl outline-none focus:border-pink-500 text-slate-800 dark:text-white transition-all text-xs sm:text-sm font-medium"
                        placeholder="e.g. Chocolate, Vanilla"
                        value={form.flavor}
                        onFocus={() => setShowSuggestions(true)}
                        onChange={e => {
                          setForm({...form, flavor: e.target.value});
                          setShowSuggestions(true);
                        }}
                      />
                      <ChevronDown size={16} className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    
                    <AnimatePresence>
                      {showSuggestions && filteredFlavours.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-20 w-full mt-2 bg-white dark:bg-[#2a2a2a] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto"
                        >
                          {filteredFlavours.map((f, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setForm({...form, flavor: lang === 'en' ? f.nameEn : f.nameBn});
                                setShowSuggestions(false);
                              }}
                              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 text-left text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-500/10 hover:text-pink-600 transition-colors"
                            >
                              {lang === 'en' ? f.nameEn : f.nameBn}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <motion.div variants={itemVariants}>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">
                      <Scale size={12} /> Cake Weight
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl outline-none focus:border-pink-500 text-slate-800 dark:text-white transition-all text-xs sm:text-sm font-medium"
                      placeholder="e.g. 1kg, 2lbs"
                      value={form.weight}
                      onChange={e => setForm({...form, weight: e.target.value})}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">
                      <MessageSquare size={12} /> Message on Cake
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl outline-none focus:border-pink-500 text-slate-800 dark:text-white transition-all text-xs sm:text-sm font-medium"
                      placeholder="Enter message..."
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center mb-1.5 px-1">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <MessageSquare size={12} /> Design Requirements
                      </label>
                      <span className={cn(
                        "text-[10px] font-bold tracking-widest uppercase",
                        form.requirements.length >= MAX_REQUIREMENTS ? "text-red-500" : "text-slate-400"
                      )}>
                        {form.requirements.length}/{MAX_REQUIREMENTS}
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={MAX_REQUIREMENTS}
                      className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl outline-none focus:border-pink-500 text-slate-800 dark:text-white transition-all text-xs sm:text-sm font-medium resize-none"
                      placeholder="Describe your design..."
                      value={form.requirements}
                      onChange={e => setForm({...form, requirements: e.target.value})}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-4 mb-6"
              >
                <button
                  onClick={copyToClipboard}
                  className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-200 dark:hover:bg-white/10 transition-all group"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="group-hover:scale-110 transition-transform" />}
                  {copied ? 'Copied to Clipboard!' : 'Copy Order Details'}
                </button>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    disabled={isSyncing}
                    onClick={() => handleSubmit('wa')}
                    className="flex-1 py-4 bg-[#25D366] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    <MessageCircle size={20} /> {isSyncing ? 'Syncing...' : 'Order via WhatsApp'}
                  </button>
                  <button
                    disabled={isSyncing}
                    onClick={() => handleSubmit('messenger')}
                    className="flex-1 py-4 bg-[#0084ff] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                  >
                    <MessageCircle size={20} /> {isSyncing ? 'Syncing...' : 'Order via Messenger'}
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
