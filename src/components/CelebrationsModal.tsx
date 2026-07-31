import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Plus, Trash2, Gift, Heart, Sparkles, Cake, Bell, ChevronRight, Edit3 } from 'lucide-react';
import { playSound } from '../lib/sounds';
import { googleSignIn, getAccessToken, fetchGoogleCalendarEvents } from '../lib/googleWorkspace';

export interface CelebrationEvent {
  id: string;
  personName: string;
  relationship: string;
  date: string; // YYYY-MM-DD
  type: 'birthday' | 'anniversary' | 'other';
  notes?: string;
  isGoogleCalendar?: boolean;
}

const DEFAULT_CELEBRATIONS: CelebrationEvent[] = [];

export function getStoredCelebrations(): CelebrationEvent[] {
  try {
    const saved = localStorage.getItem('bakenflake_celebrations');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveStoredCelebrations(list: CelebrationEvent[]) {
  try {
    localStorage.setItem('bakenflake_celebrations', JSON.stringify(list));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error(e);
  }
}

interface CelebrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
  onOrderForCelebration?: (celebration: CelebrationEvent) => void;
}

export default function CelebrationsModal({ isOpen, onClose, lang, onOrderForCelebration }: CelebrationsModalProps) {
  const [celebrations, setCelebrations] = useState<CelebrationEvent[]>([]);
  const [personName, setPersonName] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'birthday' | 'anniversary' | 'other'>('birthday');
  const [notes, setNotes] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [isGCalSyncing, setIsGCalSyncing] = useState(false);
  const [gcalMsg, setGcalMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCelebrations(getStoredCelebrations());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSyncGoogleCalendar = async () => {
    setIsGCalSyncing(true);
    setGcalMsg('');
    playSound('ding');

    try {
      let token = getAccessToken();
      if (!token) {
        const res = await googleSignIn();
        if (res) token = res.accessToken;
      }

      if (!token) {
        throw new Error('Google Sign-In required');
      }

      const calEvents = await fetchGoogleCalendarEvents(token);
      const existingNames = new Set(celebrations.map(c => c.personName.toLowerCase()));

      const syncedList: CelebrationEvent[] = [];
      calEvents.forEach(ev => {
        const name = ev.summary || 'Google Calendar Event';
        if (!existingNames.has(name.toLowerCase())) {
          const evDate = ev.start.date || (ev.start.dateTime ? ev.start.dateTime.split('T')[0] : '');
          if (evDate) {
            syncedList.push({
              id: 'gcal_' + ev.id,
              personName: name,
              relationship: 'Google Calendar',
              date: evDate,
              type: name.toLowerCase().includes('anniversary') ? 'anniversary' : 'birthday',
              notes: ev.description || 'Synced from Google Calendar 🗓️',
              isGoogleCalendar: true
            });
          }
        }
      });

      const updated = [...celebrations, ...syncedList];
      setCelebrations(updated);
      saveStoredCelebrations(updated);

      setIsGCalSyncing(false);
      setGcalMsg(
        lang === 'en' 
          ? `Synced ${syncedList.length} events from Google Calendar!` 
          : `গুগল ক্যালেন্ডার থেকে ${syncedList.length} টি ইভেন্ট মার্জ করা হয়েছে!`
      );
      setTimeout(() => setGcalMsg(''), 4000);
    } catch (err: any) {
      console.error(err);
      setIsGCalSyncing(false);
      setGcalMsg(lang === 'en' ? 'Google Calendar sync cancelled or failed.' : 'গুগল ক্যালেন্ডার মার্জ ব্যর্থ হয়েছে।');
      setTimeout(() => setGcalMsg(''), 4000);
    }
  };

  const createGoogleCalendarUrl = (item: CelebrationEvent) => {
    const title = encodeURIComponent(`${item.personName}'s ${item.type === 'birthday' ? 'Birthday' : 'Anniversary'} 🎂 - Bake n Flake Cake Order`);
    const details = encodeURIComponent(`Order a special cake from Bake n Flake! ${item.notes ? `Note: ${item.notes}` : ''}`);
    const dateStr = item.date.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}&details=${details}`;
  };

  const handleAddCelebration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personName.trim() || !date) return;

    const newEvent: CelebrationEvent = {
      id: 'cel_' + Date.now(),
      personName: personName.trim(),
      relationship,
      date,
      type,
      notes: notes.trim()
    };

    const updated = [newEvent, ...celebrations];
    setCelebrations(updated);
    saveStoredCelebrations(updated);
    playSound('ding');

    // Reset Form
    setPersonName('');
    setDate('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = celebrations.filter(c => c.id !== id);
    setCelebrations(updated);
    saveStoredCelebrations(updated);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-pink-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                <Calendar size={22} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold tracking-wide">
                  {lang === 'en' ? 'Birthday & Event Reminders' : 'জন্মদিন ও স্পেশাল দিন রিমাইন্ডার'}
                </h3>
                <p className="text-xs text-white/90 font-medium">
                  {lang === 'en' ? 'Never miss a cake moment with loved ones' : 'প্রিয়জনদের জন্মদিন ও অ্যানিভার্সারি মনে রাখুন'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* Google Calendar Sync Bar */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-pink-50 dark:from-slate-800 dark:via-indigo-950/40 dark:to-slate-800 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
                    <path fill="#34A853" d="M7 10h5v5H7z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    {lang === 'en' ? 'Google Calendar Sync' : 'গুগল ক্যালেন্ডার মার্জ'}
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                      LIVE
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">
                    {lang === 'en' ? 'Merge with your Google Calendar birthdays & events.' : 'আপনার গুগল ক্যালেন্ডার থেকে রিমাইন্ডার ইমপোর্ট করুন।'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncGoogleCalendar}
                disabled={isGCalSyncing}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 shrink-0"
              >
                {isGCalSyncing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {lang === 'en' ? 'Syncing...' : 'মার্জ হচ্ছে...'}
                  </>
                ) : (
                  <>
                    <Calendar size={13} />
                    {lang === 'en' ? 'Sync Google Calendar' : 'গুগল ক্যালেন্ডার মার্জ'}
                  </>
                )}
              </button>
            </div>

            {gcalMsg && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl text-center animate-fade-in">
                {gcalMsg}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Bell size={14} className="text-pink-500" />
                {lang === 'en' ? `Saved Dates (${celebrations.length})` : `সংরক্ষিত তারিখ (${celebrations.length})`}
              </span>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-full transition-all flex items-center gap-1.5 shadow-md shadow-pink-500/20 active:scale-95"
              >
                <Plus size={14} />
                {lang === 'en' ? 'Add Celebration' : 'নতুন দিন যোগ করুন'}
              </button>
            </div>

            {/* Add Celebration Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddCelebration}
                  className="p-4 bg-pink-50/70 dark:bg-slate-800/60 rounded-2xl border border-pink-200/80 dark:border-pink-900/40 space-y-3.5"
                >
                  <h4 className="text-xs font-black text-pink-700 dark:text-pink-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles size={14} />
                    {lang === 'en' ? 'New Celebration Details' : 'নতুন দিনের তথ্য'}
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'en' ? 'Person Name' : 'নাম'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={lang === 'en' ? 'e.g. Mom, Anirban' : 'যেমন: মা, অনির্বাণ'}
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'en' ? 'Event Type' : 'অনুষ্ঠানের ধরন'}
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      >
                        <option value="birthday">🎂 Birthday / জন্মদিন</option>
                        <option value="anniversary">🥂 Anniversary / অ্যানিভার্সারি</option>
                        <option value="other">🎉 Special Day / স্পেশাল ডে</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'en' ? 'Date' : 'তারিখ'}
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'en' ? 'Relationship' : 'সম্পর্ক'}
                      </label>
                      <input
                        type="text"
                        placeholder={lang === 'en' ? 'e.g. Sister, Friend' : 'যেমন: বোন, বন্ধু'}
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'en' ? 'Cake Preference / Notes (Optional)' : 'পছন্দের কেক বা নোট'}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === 'en' ? 'e.g. Loves Chocolate Truffle' : 'যেমন: চকলেট ট্রাফল কেক পছন্দ করে'}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-200/50 rounded-xl"
                    >
                      {lang === 'en' ? 'Cancel' : 'বাতিল'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs bg-pink-600 text-white font-bold rounded-xl shadow-md hover:bg-pink-700"
                    >
                      {lang === 'en' ? 'Save Date 💖' : 'সংরক্ষণ করুন 💖'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* List of Celebrations */}
            {celebrations.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <Cake size={36} className="mx-auto text-pink-400 mb-2 opacity-80" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {lang === 'en' ? 'No celebrations saved yet!' : 'কোনো স্পেশাল দিন সংরক্ষিত নেই!'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {lang === 'en' ? 'Click "Add Celebration" above to save birthdays & anniversaries.' : 'উপরে "নতুন দিন যোগ করুন" ক্লিক করে প্রিয়জনের তারিখ সংরক্ষণ করুন।'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {celebrations.map((item) => {
                  const eventDate = new Date(item.date);
                  const formattedDate = eventDate.toLocaleDateString(lang === 'en' ? 'en-US' : 'bn-IN', {
                    month: 'short',
                    day: 'numeric'
                  });

                  return (
                    <div
                      key={item.id}
                      className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between gap-3 hover:border-pink-300 dark:hover:border-pink-800 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-100 to-amber-100 dark:from-pink-950 dark:to-amber-950 flex items-center justify-center text-pink-600 dark:text-pink-400 font-bold text-lg shadow-inner">
                          {item.type === 'birthday' ? '🎂' : item.type === 'anniversary' ? '🥂' : '🎉'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {item.personName}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300">
                              {item.relationship}
                            </span>
                            {item.isGoogleCalendar && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
                                🗓️ Google Cal
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5 flex items-center gap-1">
                            <Calendar size={12} />
                            {formattedDate} ({item.type.toUpperCase()})
                          </p>
                          {item.notes && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic mt-0.5">
                              "{item.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <a
                          href={createGoogleCalendarUrl(item)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-300 rounded-xl transition-all flex items-center gap-1"
                          title="Save to Google Calendar"
                        >
                          <Calendar size={12} className="text-blue-500" />
                          <span className="hidden sm:inline">Google Cal</span>
                        </a>

                        {onOrderForCelebration && (
                          <button
                            onClick={() => {
                              onOrderForCelebration(item);
                              onClose();
                            }}
                            className="px-3 py-1.5 text-xs font-extrabold bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
                          >
                            <Cake size={13} />
                            {lang === 'en' ? 'Order' : 'অর্ডার'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
