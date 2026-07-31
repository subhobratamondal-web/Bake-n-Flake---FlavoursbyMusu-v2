import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Phone, Mail, MapPin, CheckCircle, ShieldCheck, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogin: (profile: Omit<UserProfile, 'id' | 'isLoggedIn'>) => void;
  onLogout: () => void;
  lang: 'en' | 'bn';
}

export default function AuthModal({ isOpen, onClose, user, onLogin, onLogout, lang }: AuthModalProps) {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onLogin({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim() || 'Kamalgazi, Kolkata'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 p-6 text-white relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <User size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {user?.isLoggedIn 
                    ? (lang === 'en' ? 'My Account' : 'আমার অ্যাকাউন্ট') 
                    : (lang === 'en' ? 'Customer Login / Sign Up' : 'কাস্টমার লগইন / সাইন আপ')}
                </h3>
                <p className="text-xs text-white/80">
                  {lang === 'en' ? 'Bake n\' Flake ~ Flavours by Musu' : 'বেক অ্যান্ড ফ্লেক ~ ফ্লেভার্স বাই মুসু'}
                </p>
              </div>
            </div>
          </div>

          {user?.isLoggedIn ? (
            /* Logged in View */
            <div className="p-6 space-y-6">
              <div className="p-4 bg-pink-50 dark:bg-pink-950/30 rounded-2xl border border-pink-100 dark:border-pink-900/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                    <ShieldCheck size={12} /> {lang === 'en' ? 'Logged In' : 'লগইন করা আছে'}
                  </span>
                  <button
                    onClick={onLogout}
                    className="text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <LogOut size={12} /> {lang === 'en' ? 'Log Out' : 'লগ আউট'}
                  </button>
                </div>

                <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-pink-500 shrink-0" />
                    <span className="font-bold">{user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-pink-500 shrink-0" />
                    <span>{user.phone}</span>
                  </div>
                  {user.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-pink-500 shrink-0" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 pt-1 border-t border-pink-200/50 dark:border-pink-900/30">
                    <MapPin size={16} className="text-pink-500 shrink-0 mt-0.5" />
                    <span className="text-xs leading-relaxed">{user.address}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
                </button>
              </div>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {submitted ? (
                <div className="py-8 text-center space-y-2">
                  <CheckCircle size={48} className="text-emerald-500 mx-auto animate-bounce" />
                  <p className="font-bold text-slate-800 dark:text-white">
                    {lang === 'en' ? 'Welcome Back!' : 'স্বাগতম!'}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                      {lang === 'en' ? 'Full Name *' : 'আপনার নাম *'}
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={lang === 'en' ? 'e.g. Rahul Roy' : 'যেমন: রাহুল রায়'}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                      {lang === 'en' ? 'WhatsApp Phone Number *' : 'হোয়াটসঅ্যাপ মোবাইল নম্বর *'}
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input 
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={lang === 'en' ? 'e.g. 9876543210' : 'যেমন: ৯৮৭৬৫৪৩২১০'}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                      {lang === 'en' ? 'Email Address (Optional)' : 'ইমেল ঠিকানা (ঐচ্ছিক)'}
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                      {lang === 'en' ? 'Delivery Address' : 'ডেলিভারি ঠিকানা'}
                    </label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                      <textarea 
                        rows={2}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder={lang === 'en' ? 'Full Street / Landmark / City' : 'সম্পূর্ণ ঠিকানা / ল্যান্ডমার্ক / শহর'}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold shadow-lg shadow-pink-500/25 hover:opacity-95 transition-all"
                  >
                    {lang === 'en' ? 'Save & Continue' : 'সংরক্ষণ করুন ও এগিয়ে যান'}
                  </button>
                </>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
