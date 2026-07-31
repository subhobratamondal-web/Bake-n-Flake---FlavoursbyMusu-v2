import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, CheckSquare, Plus, Trash2, RefreshCw, Check, LogOut, Sparkles, ExternalLink, AlertCircle } from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  googleSignOut, 
  getAccessToken, 
  initAuth,
  fetchGoogleCalendarEvents, 
  createGoogleCalendarEvent, 
  deleteGoogleCalendarEvent,
  fetchGoogleTasks, 
  createGoogleTask, 
  toggleGoogleTaskStatus, 
  deleteGoogleTask,
  GCalEvent, 
  GTask 
} from '../lib/googleWorkspace';
import { CelebrationEvent, saveStoredCelebrations, getStoredCelebrations } from './CelebrationsModal';
import { playSound } from '../lib/sounds';

interface GoogleWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'bn';
  initialTab?: 'calendar' | 'tasks';
}

export default function GoogleWorkspaceModal({
  isOpen,
  onClose,
  lang,
  initialTab = 'calendar'
}: GoogleWorkspaceModalProps) {
  const [activeTab, setActiveTab] = useState<'calendar' | 'tasks'>(initialTab);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Calendar State
  const [events, setEvents] = useState<GCalEvent[]>([]);
  const [calTitle, setCalTitle] = useState('');
  const [calDate, setCalDate] = useState('');
  const [calDesc, setCalDesc] = useState('');
  const [showAddCal, setShowAddCal] = useState(false);

  // Tasks State
  const [tasks, setTasks] = useState<GTask[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskDue, setTaskDue] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      // Initialize Auth check
      const unsubscribe = initAuth(
        (u, t) => {
          setUser(u);
          setToken(t);
        },
        () => {
          setUser(null);
          setToken(null);
        }
      );
      return () => unsubscribe();
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (user && token && isOpen) {
      loadData();
    }
  }, [user, token, isOpen, activeTab]);

  const loadData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      if (activeTab === 'calendar') {
        const calData = await fetchGoogleCalendarEvents(token);
        setEvents(calData);
      } else {
        const taskData = await fetchGoogleTasks(token);
        setTasks(taskData);
      }
    } catch (err: any) {
      console.error(err);
      setMessage(lang === 'en' ? 'Failed to fetch data from Google Workspace.' : 'গুগল ওয়ার্কস্পেস থেকে তথ্য লোড করা যায়নি।');
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setMessage('');
    playSound('ding');
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setMessage(lang === 'en' ? 'Successfully connected to Google Workspace!' : 'গুগল অ্যাকাউন্ট সফলভাবে সংযুক্ত হয়েছে!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      setMessage(lang === 'en' ? 'Google Sign-In was cancelled or failed.' : 'গুগল সাইন-ইন ব্যর্থ হয়েছে।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    playSound('pop');
    await googleSignOut();
    setUser(null);
    setToken(null);
    setEvents([]);
    setTasks([]);
  };

  // Calendar Handlers
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !calTitle || !calDate) return;
    playSound('ding');
    try {
      const newEv = await createGoogleCalendarEvent(token, {
        title: calTitle,
        description: calDesc,
        date: calDate
      });
      setEvents(prev => [newEv, ...prev]);
      setCalTitle('');
      setCalDate('');
      setCalDesc('');
      setShowAddCal(false);
      
      // Auto sync to app's celebrations storage as well
      const currentCels = getStoredCelebrations();
      const newCel: CelebrationEvent = {
        id: 'gcal_created_' + Date.now(),
        personName: calTitle,
        relationship: 'Google Calendar Event',
        date: calDate,
        type: 'other',
        notes: calDesc || 'Created in Google Calendar',
        isGoogleCalendar: true
      };
      saveStoredCelebrations([...currentCels, newCel]);

      setMessage(lang === 'en' ? 'Event added to Google Calendar & Cake Reminders!' : 'ক্যালেন্ডারে নতুন রিমাইন্ডার যোগ করা হয়েছে!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to create calendar event.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!token) return;
    const ok = await deleteGoogleCalendarEvent(token, eventId);
    if (ok) {
      playSound('pop');
      setEvents(prev => prev.filter(e => e.id !== eventId));
    }
  };

  const syncAllEventsToApp = () => {
    if (events.length === 0) return;
    playSound('ding');
    const existing = getStoredCelebrations();
    const existingNames = new Set(existing.map(c => c.personName.toLowerCase()));

    const newItems: CelebrationEvent[] = [];
    events.forEach(ev => {
      const name = ev.summary || 'Google Calendar Reminder';
      if (!existingNames.has(name.toLowerCase())) {
        const evDate = ev.start.date || (ev.start.dateTime ? ev.start.dateTime.split('T')[0] : '');
        if (evDate) {
          newItems.push({
            id: 'gcal_' + ev.id,
            personName: name,
            relationship: 'Google Calendar',
            date: evDate,
            type: name.toLowerCase().includes('anniversary') ? 'anniversary' : 'birthday',
            notes: ev.description || 'Synced from Google Calendar',
            isGoogleCalendar: true
          });
        }
      }
    });

    if (newItems.length > 0) {
      saveStoredCelebrations([...existing, ...newItems]);
      setMessage(lang === 'en' ? `Synced ${newItems.length} Google events to Cake Reminders!` : `${newItems.length} টি ইভেন্ট রিমাইন্ডারে মার্জ করা হয়েছে!`);
    } else {
      setMessage(lang === 'en' ? 'All events are already synced!' : 'সব ইভেন্ট ইতোমধ্যেই মার্জ করা আছে!');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  // Tasks Handlers
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !taskTitle) return;
    playSound('ding');
    try {
      const newTask = await createGoogleTask(token, {
        title: taskTitle,
        notes: taskNotes,
        due: taskDue
      });
      setTasks(prev => [newTask, ...prev]);
      setTaskTitle('');
      setTaskNotes('');
      setTaskDue('');
      setShowAddTask(false);
      setMessage(lang === 'en' ? 'Task created in Google Tasks!' : 'গুগল টাস্ক সফলভাবে তৈরি হয়েছে!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      alert('Failed to create task in Google Tasks.');
    }
  };

  const handleToggleTask = async (task: GTask) => {
    if (!token) return;
    playSound('ding');
    try {
      const updated = await toggleGoogleTaskStatus(token, task.id, task.status);
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!token) return;
    const ok = await deleteGoogleTask(token, taskId);
    if (ok) {
      playSound('pop');
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-2xl">
                <Calendar size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-serif font-black text-lg sm:text-xl flex items-center gap-2">
                  {lang === 'en' ? 'Google Calendar & Tasks' : 'গুগল ক্যালেন্ডার ও টাস্ক'}
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-white/20">
                    Official
                  </span>
                </h3>
                <p className="text-xs text-blue-100 font-medium">
                  {lang === 'en' ? 'Sync celebrations, cake reminders & order tasks directly.' : 'সরাসরি গুগল ক্যালেন্ডার ও টাস্কে রিমাইন্ডার যোগ ও মার্জ করুন।'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* User Auth Banner */}
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={user.photoURL || 'https://i.ibb.co/wrc3VVRg/PROFILE.jpg'} 
                    alt={user.displayName || 'User'} 
                    className="w-8 h-8 rounded-full border border-pink-500/40 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-none">
                      {user.displayName || user.email}
                    </p>
                    <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {lang === 'en' ? 'Connected to Google Workspace' : 'গুগল কানেক্টেড'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadData}
                    disabled={loadingData}
                    className="p-1.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 rounded-lg transition-colors"
                    title="Reload"
                  >
                    <RefreshCw size={15} className={loadingData ? 'animate-spin' : ''} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <LogOut size={13} />
                    {lang === 'en' ? 'Disconnect' : 'ডিসকানেক্ট'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full flex-wrap gap-2">
                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {lang === 'en' ? 'Connect your Google account to sync Calendar & Tasks.' : 'গুগল অ্যাকাউন্ট কানেক্ট করে ইভেন্ট ও টাস্ক মার্জ করুন।'}
                </div>

                {/* Official GSI Styled Material Sign-in Button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="gsi-material-button inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-sans font-bold text-xs text-slate-700 dark:text-slate-200 active:scale-95 disabled:opacity-50"
                >
                  <div className="w-4 h-4 shrink-0">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full block">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                  </div>
                  <span>{isLoggingIn ? (lang === 'en' ? 'Signing in...' : 'সাইন-ইন হচ্ছে...') : (lang === 'en' ? 'Sign in with Google' : 'গুগল দিয়ে সাইন ইন')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'calendar'
                  ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Calendar size={15} />
              {lang === 'en' ? 'Google Calendar' : 'গুগল ক্যালেন্ডার'}
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 py-3 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'tasks'
                  ? 'border-indigo-600 text-indigo-600 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <CheckSquare size={15} />
              {lang === 'en' ? 'Google Tasks' : 'গুগল টাস্ক'}
            </button>
          </div>

          {/* Notification Message */}
          {message && (
            <div className="mx-5 mt-4 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-xl flex items-center gap-2">
              <Sparkles size={14} className="text-blue-500 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* Modal Content */}
          <div className="p-5 overflow-y-auto flex-1 space-y-4">
            {!user ? (
              <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 mx-auto flex items-center justify-center mb-4">
                  {activeTab === 'calendar' ? <Calendar size={28} /> : <CheckSquare size={28} />}
                </div>
                <h4 className="font-serif font-black text-slate-800 dark:text-white text-base">
                  {lang === 'en' ? 'Connect Google Account' : 'গুগল অ্যাকাউন্ট সাইন ইন করুন'}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                  {lang === 'en'
                    ? 'Sign in with Google to view and create live events on Google Calendar and tasks in Google Tasks.'
                    : 'গুগল ক্যালেন্ডারে ইভেন্ট এবং গুগলের আসল টাস্ক লিস্টে কাজ দেখার জন্য সাইন ইন করুন।'}
                </p>

                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                    <path fill="#ffffff" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  </svg>
                  <span>{lang === 'en' ? 'Sign in with Google' : 'গুগল দিয়ে সাইন ইন করুন'}</span>
                </button>
              </div>
            ) : activeTab === 'calendar' ? (
              /* CALENDAR TAB */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {lang === 'en' ? `Upcoming Events (${events.length})` : `আসন্ন ইভেন্ট (${events.length})`}
                    </span>
                    {events.length > 0 && (
                      <button
                        onClick={syncAllEventsToApp}
                        className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 hover:bg-pink-200 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Sparkles size={11} />
                        {lang === 'en' ? 'Merge All to App' : 'অ্যাপে মার্জ করুন'}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setShowAddCal(!showAddCal)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                  >
                    <Plus size={14} />
                    {lang === 'en' ? 'Add Event' : 'ইভেন্ট যোগ করুন'}
                  </button>
                </div>

                {/* Add Event Form */}
                {showAddCal && (
                  <form onSubmit={handleCreateEvent} className="p-4 bg-blue-50/70 dark:bg-slate-800/80 rounded-2xl border border-blue-200 dark:border-slate-700 space-y-3 animate-fade-in">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      {lang === 'en' ? 'Add Google Calendar Event' : 'গুগল ক্যালেন্ডার ইভেন্ট যোগ'}
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">
                          {lang === 'en' ? 'Event Title / Person Name *' : 'ইভেন্ট শিরোনাম / নাম *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={calTitle}
                          onChange={(e) => setCalTitle(e.target.value)}
                          placeholder="Anirban's Birthday Cake Order"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">
                          {lang === 'en' ? 'Event Date *' : 'তারিখ *'}
                        </label>
                        <input
                          type="date"
                          required
                          value={calDate}
                          onChange={(e) => setCalDate(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">
                        {lang === 'en' ? 'Description / Cake Note' : 'বিবরণ / কেক নোট'}
                      </label>
                      <input
                        type="text"
                        value={calDesc}
                        onChange={(e) => setCalDesc(e.target.value)}
                        placeholder="Chocolate Truffle cake with 100% eggless option"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddCal(false)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        {lang === 'en' ? 'Cancel' : 'বাতিল'}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                      >
                        {lang === 'en' ? 'Save Event' : 'সংরক্ষণ করুন'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Calendar Events List */}
                {loadingData ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    {lang === 'en' ? 'Fetching Google Calendar events...' : 'গুগল ক্যালেন্ডার লোড হচ্ছে...'}
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    {lang === 'en' ? 'No upcoming events found on your Google Calendar.' : 'গুগল ক্যালেন্ডারে কোন ইভেন্ট পাওয়া যায়নি।'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {events.map((item) => {
                      const evDate = item.start.date || (item.start.dateTime ? item.start.dateTime.split('T')[0] : '');
                      return (
                        <div
                          key={item.id}
                          className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-sm hover:border-blue-300 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                              <Calendar size={18} />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                {item.summary || 'Google Event'}
                              </h5>
                              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                                🗓️ {evDate} {item.description ? `• ${item.description}` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {item.htmlLink && (
                              <a
                                href={item.htmlLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                title="Open in Google Calendar"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteEvent(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete from Google Calendar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* TASKS TAB */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {lang === 'en' ? `Google Tasks (${tasks.length})` : `গুগল টাস্ক তালিকা (${tasks.length})`}
                  </span>

                  <button
                    onClick={() => setShowAddTask(!showAddTask)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                  >
                    <Plus size={14} />
                    {lang === 'en' ? 'Add Task' : 'টাস্ক যোগ করুন'}
                  </button>
                </div>

                {/* Add Task Form */}
                {showAddTask && (
                  <form onSubmit={handleCreateTask} className="p-4 bg-indigo-50/70 dark:bg-slate-800/80 rounded-2xl border border-indigo-200 dark:border-slate-700 space-y-3 animate-fade-in">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      {lang === 'en' ? 'New Google Task' : 'নতুন গুগল টাস্ক'}
                    </h5>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">
                        {lang === 'en' ? 'Task Title *' : 'টাস্ক শিরোনাম *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Order Birthday Cake for Mom"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">
                          {lang === 'en' ? 'Due Date (Optional)' : 'তারিখ (ঐচ্ছিক)'}
                        </label>
                        <input
                          type="date"
                          value={taskDue}
                          onChange={(e) => setTaskDue(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">
                          {lang === 'en' ? 'Notes / Bakery Details' : 'নোট'}
                        </label>
                        <input
                          type="text"
                          value={taskNotes}
                          onChange={(e) => setTaskNotes(e.target.value)}
                          placeholder="Eggless Rasmalai Cake 2 Pound"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddTask(false)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        {lang === 'en' ? 'Cancel' : 'বাতিল'}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                      >
                        {lang === 'en' ? 'Create Task' : 'টাস্ক তৈরি করুন'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Tasks List */}
                {loadingData ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    {lang === 'en' ? 'Fetching Google Tasks...' : 'গুগল টাস্ক লোড হচ্ছে...'}
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    {lang === 'en' ? 'No tasks found in your Google Tasks account.' : 'কোন টাস্ক পাওয়া যায়নি।'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tasks.map((task) => {
                      const isDone = task.status === 'completed';
                      return (
                        <div
                          key={task.id}
                          className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            isDone 
                              ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60' 
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleTask(task)}
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                isDone 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                              }`}
                            >
                              {isDone && <Check size={12} strokeWidth={3} />}
                            </button>

                            <div>
                              <h5 className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                {task.title}
                              </h5>
                              {task.notes && (
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {task.notes}
                                </p>
                              )}
                              {task.due && (
                                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                                  📅 Due: {task.due.split('T')[0]}
                                </p>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
