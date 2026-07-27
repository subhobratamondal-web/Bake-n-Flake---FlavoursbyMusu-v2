import React from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Language } from '../types';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  language: Language;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, language }) => {
  return (
    <div className="relative max-w-2xl mx-auto mb-16">
      <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-pink-500">
        <SearchIcon className="h-5 w-5" />
      </div>
      <input
        type="text"
        className="block w-full pl-16 pr-12 py-5 border-2 border-slate-200 dark:border-white/10 rounded-full leading-5 bg-white/60 dark:bg-white/5 backdrop-blur-md placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all text-lg shadow-sm text-slate-800 dark:text-white font-medium"
        placeholder={language === 'en' ? "Search for answers..." : "কিছু খুঁজুন..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
  );
};
