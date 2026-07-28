import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard, Search, ShoppingBag, Send, Globe, Sun, Moon, RefreshCw, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
  onTriggerSearch: () => void;
  onTriggerOrder: () => void;
  onTriggerMenu: () => void;
  onTriggerLang: () => void;
  onTriggerTheme: () => void;
  onTriggerForceRefresh?: () => void;
  lastSyncedTime?: string | null;
  syncStatus?: 'synced' | 'syncing' | 'offline';
}

export default function ShortcutsModal({
  isOpen,
  onClose,
  lang,
  onTriggerSearch,
  onTriggerOrder,
  onTriggerMenu,
  onTriggerLang,
  onTriggerTheme,
  onTriggerForceRefresh,
  lastSyncedTime,
  syncStatus = 'synced'
}: ShortcutsModalProps) {
  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const cmdKey = isMac ? '⌘' : 'Ctrl';

  const shortcutsList = [
    {
      key: `${cmdKey} + K`,
      descriptionEn: 'Quick Search Items',
      descriptionBn: 'দ্রুত পণ্য খুঁজুন',
      icon: Search,
      action: onTriggerSearch
    },
    {
      key: `${cmdKey} + O`,
      descriptionEn: 'Open Custom Order Modal',
      descriptionBn: 'কাস্টম অর্ডার ফর্ম খুলুন',
      icon: Send,
      action: onTriggerOrder
    },
    {
      key: `${cmdKey} + M`,
      descriptionEn: 'Jump to Delicious Menu',
      descriptionBn: 'মেনু সেকশনে যান',
      icon: ShoppingBag,
      action: onTriggerMenu
    },
    {
      key: `${cmdKey} + L`,
      descriptionEn: 'Switch Language (English / বাংলা)',
      descriptionBn: 'ভাষা পরিবর্তন করুন (English / বাংলা)',
      icon: Globe,
      action: onTriggerLang
    },
    {
      key: `${cmdKey} + T`,
      descriptionEn: 'Toggle Theme (Light / Dark)',
      descriptionBn: 'থিম পরিবর্তন করুন (লাইট / ডার্ক)',
      icon: Sun,
      action: onTriggerTheme
    },
    ...(onTriggerForceRefresh ? [{
      key: `${cmdKey} + R`,
      descriptionEn: 'Force Refresh Gallery Cache',
      descriptionBn: 'গ্যালারি ক্যাশে রিলোড করুন',
      icon: RefreshCw,
      action: onTriggerForceRefresh
    }] : []),
    {
      key: 'Esc',
      descriptionEn: 'Close Modal / Popups',
      descriptionBn: 'পপ-আপ অথবা মডাল বন্ধ করুন',
      icon: X,
      action: onClose
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="relative w-full max-w-sm sm:max-w-md md:max-w-lg bg-white dark:bg-[#181124] rounded-3xl sm:rounded-[2.5rem] shadow-2xl border border-pink-500/20 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 pb-3 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-pink-500/10 via-transparent to-amber-500/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-pink-500 text-white shadow-lg shadow-pink-500/30">
                  <Keyboard size={20} />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {lang === 'en' ? 'Keyboard Shortcuts' : 'কীবোর্ড শর্টকাট'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-pink-600 dark:text-pink-400 font-bold uppercase tracking-wider">
                    {lang === 'en' ? 'Quick Controls' : 'দ্রুত কন্ট্রোল'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 bg-slate-100 dark:bg-white/10 rounded-xl hover:bg-pink-500 hover:text-white text-slate-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sync Info Panel inside Modal */}
            {lastSyncedTime && (
              <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "w-2.5 h-2.5 rounded-full shrink-0",
                    syncStatus === 'synced' ? "bg-emerald-500 animate-pulse" : syncStatus === 'syncing' ? "bg-sky-500 animate-ping" : "bg-amber-500"
                  )} />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {syncStatus === 'synced' ? 'Synced with Sheets' : syncStatus === 'syncing' ? 'Syncing...' : 'Offline Cache'}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">({lastSyncedTime})</span>
                </div>

                {onTriggerForceRefresh && (
                  <button
                    onClick={() => {
                      onTriggerForceRefresh();
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-[10px] uppercase tracking-wider transition-colors shadow-sm flex items-center gap-1"
                  >
                    <RefreshCw size={12} className={cn(syncStatus === 'syncing' && "animate-spin")} />
                    <span>Force Refresh</span>
                  </button>
                )}
              </div>
            )}

            {/* List of shortcuts */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-2.5 sm:space-y-3">
              {shortcutsList.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-white/10 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform shadow-sm">
                      <item.icon size={16} />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {lang === 'en' ? item.descriptionEn : item.descriptionBn}
                    </span>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/15 text-[10px] sm:text-xs font-mono font-black text-slate-700 dark:text-pink-300 border border-slate-300 dark:border-white/20 shadow-sm flex-shrink-0">
                    {item.key}
                  </span>
                </button>
              ))}
            </div>

            {/* Footer Tip */}
            <div className="p-3 sm:p-4 bg-slate-50 dark:bg-white/[0.03] border-t border-slate-100 dark:border-white/10 text-center text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
              {lang === 'en'
                ? 'Tip: Press ? anytime on desktop to view shortcuts!'
                : 'পরামর্শ: ডেস্কটপে কীবোর্ডের ? প্রেস করলেই এই তালিকা দেখতে পাবেন!'}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
