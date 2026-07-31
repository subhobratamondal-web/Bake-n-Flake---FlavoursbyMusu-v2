import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Sparkles, Cake, ChevronRight, Bell, Gift } from 'lucide-react';
import { getStoredCelebrations, CelebrationEvent } from './CelebrationsModal';
import { playSound } from '../lib/sounds';

interface CelebrationsBannerProps {
  lang: 'en' | 'bn';
  onOpenModal: () => void;
  onOrderForCelebration: (item: CelebrationEvent) => void;
}

export default function CelebrationsBanner({ lang, onOpenModal, onOrderForCelebration }: CelebrationsBannerProps) {
  const [upcomingEvent, setUpcomingEvent] = useState<{ event: CelebrationEvent; daysAway: number } | null>(null);

  useEffect(() => {
    const updateNearest = () => {
      const list = getStoredCelebrations();
      if (!list || list.length === 0) {
        setUpcomingEvent(null);
        return;
      }

      const today = new Date();
      let nearest: { event: CelebrationEvent; daysAway: number } | null = null;

      list.forEach(item => {
        const eDate = new Date(item.date);
        // Set to current year
        const targetDate = new Date(today.getFullYear(), eDate.getMonth(), eDate.getDate());
        if (targetDate < today) {
          targetDate.setFullYear(today.getFullYear() + 1);
        }

        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (!nearest || diffDays < nearest.daysAway) {
          nearest = { event: item, daysAway: diffDays };
        }
      });

      setUpcomingEvent(nearest);
    };

    updateNearest();
    window.addEventListener('storage', updateNearest);
    const interval = setInterval(updateNearest, 2000);
    return () => {
      window.removeEventListener('storage', updateNearest);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white shadow-md relative z-30">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
        {upcomingEvent ? (
          <div className="flex items-center gap-2.5 flex-1 min-w-[260px]">
            <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-base shadow-sm animate-bounce">
              🎉
            </span>
            <div className="leading-tight">
              <span className="font-extrabold text-amber-200 uppercase tracking-wide text-[10px] sm:text-xs block">
                {lang === 'en' ? 'Upcoming Celebration!' : 'আসন্ন বিশেষ দিন!'}
              </span>
              <p className="text-white text-xs sm:text-sm font-bold">
                {upcomingEvent.event.personName}'s {upcomingEvent.event.type.toUpperCase()}{' '}
                <span className="bg-white/20 px-2 py-0.5 rounded-md text-amber-100 font-extrabold ml-1">
                  {upcomingEvent.daysAway === 0 
                    ? (lang === 'en' ? 'Today! 🎂' : 'আজকেই! 🎂')
                    : upcomingEvent.daysAway === 1 
                    ? (lang === 'en' ? 'Tomorrow! 🎈' : 'আগামীকাল! 🎈')
                    : (lang === 'en' ? `in ${upcomingEvent.daysAway} days` : `${upcomingEvent.daysAway} দিন বাকি`)}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-1 min-w-[260px]">
            <Sparkles className="text-amber-200 animate-spin" size={16} />
            <p className="text-xs sm:text-sm text-white font-bold">
              {lang === 'en' 
                ? 'Sync Google Calendar or add dates to get automatic cake reminders!' 
                : 'গুগল ক্যালেন্ডার মার্জ করুন অথবা তারিখ যোগ করে কেক রিমাইন্ডার পান।'}
            </p>
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {upcomingEvent && (
            <button
              onClick={() => {
                playSound('ding');
                onOrderForCelebration(upcomingEvent.event);
              }}
              className="px-3.5 py-1 bg-white text-pink-600 hover:bg-pink-50 text-xs font-black rounded-full shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1"
            >
              <Cake size={13} />
              {lang === 'en' ? 'Order Cake' : 'কেক অর্ডার'}
            </button>
          )}

          <button
            onClick={() => {
              playSound('ding');
              onOpenModal();
            }}
            className="px-3 py-1 bg-black/20 hover:bg-black/30 border border-white/30 text-white text-xs font-bold rounded-full transition-all flex items-center gap-1"
          >
            <Calendar size={13} />
            {lang === 'en' ? 'Manage Reminders' : 'রিমাইন্ডার তালিকা'}
          </button>
        </div>
      </div>
    </div>
  );
}
