import React, { useContext, useState } from 'react';
import { Sun, CloudRain, Cloud, Snowflake, RefreshCw, Sparkles, MapPin, Check, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppContext } from '../App';
import { WeatherCondition } from '../types';
import { WEATHER_THEMES } from '../utils/weatherTheme';
import { cn } from '../lib/utils';

export default function WeatherWidget() {
  const { weatherData, setWeatherCondition, setWeatherAuto, refreshWeather, t } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!weatherData) return null;

  const currentTheme = WEATHER_THEMES[weatherData.condition];

  const handleManualSelect = (cond: WeatherCondition) => {
    setWeatherCondition(cond);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshWeather();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isBn = t.lang === 'bn';

  return (
    <>
      {/* Floating / Embedded Weather Pill Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-xl shadow-md transition-all text-[11px] font-bold",
          "bg-white/80 dark:bg-white/10 text-slate-800 dark:text-slate-100",
          currentTheme.borderAccent
        )}
        title={isBn ? "আবহাওয়া ও ব্যাকগ্রাউন্ড কালার এডজাস্টার" : "Weather & Background Accent Adjuster"}
      >
        <span className="text-xs">{weatherData.icon}</span>
        <span className="font-extrabold text-[11px]">{weatherData.temp}°C</span>
        <span className="hidden sm:inline-block opacity-40 text-[9px]">•</span>
        <span className={cn("hidden sm:inline-block font-bold text-[10px]", currentTheme.textAccent)}>
          {isBn ? weatherData.labelBn : weatherData.labelEn}
        </span>
        <Sparkles size={11} className={cn("ml-0.5", currentTheme.textAccent)} />
      </motion.button>

      {/* Popover / Modal Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md p-6 sm:p-8 bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              {/* Top Glow bar matching current theme */}
              <div 
                className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(to right, ${currentTheme.accent}, ${currentTheme.accent}88)`
                }}
              />

              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{weatherData.icon}</span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {isBn ? "আবহাওয়া ভিত্তিক থিম এডজাস্টার" : "Weather Theme Adjuster"}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {isBn 
                      ? "আপনার এলাকার আবহাওয়ার উপর ভিত্তি করে সাইটের কালার অটোমেটিক এডজাস্ট হয়।" 
                      : "Dynamically shifts background & accent color highlights based on live weather."}
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Location & Status Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {weatherData.locationName}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {weatherData.temp}°C • {isBn ? weatherData.labelBn : weatherData.labelEn}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-xs flex items-center gap-1 font-bold"
                  title="Refresh weather"
                >
                  <RefreshCw size={14} className={cn(isRefreshing && "animate-spin")} />
                </button>
              </div>

              {/* Auto Sync Toggle */}
              <div className="flex items-center justify-between p-3.5 mb-6 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-pink-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isBn ? "অটো লোকাল ওয়েদার সিঙ্ক" : "Auto Local Weather Sync"}
                  </span>
                </div>
                <button
                  onClick={() => setWeatherAuto(!weatherData.isAuto)}
                  className={cn(
                    "relative w-12 h-6 rounded-full transition-colors p-1",
                    weatherData.isAuto ? "bg-pink-500" : "bg-slate-300 dark:bg-slate-700"
                  )}
                >
                  <motion.div
                    animate={{ x: weatherData.isAuto ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-4 h-4 rounded-full bg-white shadow-md"
                  />
                </button>
              </div>

              {/* Manual Weather Tone Options */}
              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  {isBn ? "ম্যানুয়াল ওয়েদার মুড নির্বাচন" : "Select Weather Accent Mood"}
                </span>

                {[
                  { id: 'sunny', icon: '☀️', labelEn: 'Sunny & Clear (Warmer Tones)', labelBn: 'রৌদ্রোজ্জ্বল (উষ্ণ সোনালী টোন)', color: '#f59e0b' },
                  { id: 'rainy', icon: '🌧️', labelEn: 'Rainy & Stormy (Cooler Tones)', labelBn: 'বৃষ্টিময় (শীতল নীল টোন)', color: '#06b6d4' },
                  { id: 'cloudy', icon: '⛅', labelEn: 'Cloudy & Foggy (Lavender Tones)', labelBn: 'মেঘলা (ল্যাভেন্ডার টোন)', color: '#a855f7' },
                  { id: 'cool', icon: '❄️', labelEn: 'Crisp Cool (Ice Mint Tones)', labelBn: 'শীতল সতেজ (পুদিনা টোন)', color: '#10b981' },
                ].map((opt) => {
                  const isSelected = weatherData.condition === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleManualSelect(opt.id as WeatherCondition)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all border text-xs font-bold",
                        isSelected
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-md"
                          : "bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-white/10 hover:border-pink-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{opt.icon}</span>
                        <span>{isBn ? opt.labelBn : opt.labelEn}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: opt.color }}
                        />
                        {isSelected && <Check size={14} className="text-pink-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Close Action */}
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-pink-500/20 active:scale-95"
              >
                {isBn ? "ঠিক আছে" : "Apply & Close"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
