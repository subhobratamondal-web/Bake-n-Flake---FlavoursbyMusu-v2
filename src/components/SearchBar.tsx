import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, X, Clock, Trash2, Sparkles, TrendingUp } from 'lucide-react';
import { Language } from '../types';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  language: Language;
}

const STORAGE_KEY = 'bnf_recent_searches';
const DEFAULT_SUGGESTIONS = ['Chocolate Cake', 'Doll Cakes', 'Rasmalai Cake', 'Bento Cakes', 'Cupcakes', 'Pizza Buns'];

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, language }) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      } else {
        setRecentSearches(DEFAULT_SUGGESTIONS.slice(0, 4));
      }
    } catch {
      setRecentSearches(DEFAULT_SUGGESTIONS.slice(0, 4));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveSearchTerm = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    const updated = [trimmed, ...recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectTerm = (term: string) => {
    setSearchTerm(term);
    saveSearchTerm(term);
    setIsFocused(false);
  };

  const handleRemoveItem = (e: React.MouseEvent, itemToRemove: string) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== itemToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="relative max-w-2xl mx-auto mb-12" ref={containerRef}>
      <div className="relative z-10">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-pink-500">
          <SearchIcon className="h-5 w-5" />
        </div>
        <input
          type="text"
          className="block w-full pl-16 pr-12 py-5 border-2 border-slate-200 dark:border-white/10 rounded-full leading-5 bg-white/80 dark:bg-white/5 backdrop-blur-md placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-lg shadow-sm text-slate-800 dark:text-white font-medium"
          placeholder={language === 'en' ? "Search for cakes, menu items or answers..." : "কেক, মেনু বা প্রশ্নের উত্তর খুঁজুন..."}
          value={searchTerm}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              saveSearchTerm(searchTerm);
              setIsFocused(false);
            }
          }}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-6 flex items-center text-slate-400 hover:text-pink-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Recent Searches Dropdown */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 z-50 space-y-4">
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-pink-500" />
                  {language === 'en' ? 'Recent Searches' : 'সাম্প্রতিক সার্চসমূহ'}
                </span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[11px] text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} />
                  {language === 'en' ? 'Clear All' : 'মুছে ফেলুন'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <span
                    key={item}
                    onClick={() => handleSelectTerm(item)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 dark:hover:bg-pink-950/40 text-slate-700 dark:text-slate-200 hover:text-pink-600 dark:hover:text-pink-400 text-xs font-medium cursor-pointer transition-all border border-slate-200 dark:border-slate-700"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveItem(e, item)}
                      className="p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Popular Trending Suggestions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-amber-500" />
              {language === 'en' ? 'Popular Suggestions' : 'জনপ্রিয় কেক সাজেশন'}
            </div>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_SUGGESTIONS.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleSelectTerm(sug)}
                  className="px-3 py-1 rounded-xl bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 hover:bg-pink-100 text-xs font-semibold transition-all border border-pink-200 dark:border-pink-900/30 flex items-center gap-1"
                >
                  <Sparkles size={11} className="text-amber-400" />
                  {sug}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
