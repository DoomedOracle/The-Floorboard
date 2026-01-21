
import React, { useState } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  const suggestions = [
    "Jade Tree era Midwest emo",
    "90s San Diego post-hardcore",
    "Modern screamo labels",
    "Bands sounding like American Football",
    "2024 Hardcore year-end lists"
  ];

  return (
    <div className="bg-[#050505] border border-white/5 p-6 md:p-10 rounded-none mb-16 relative group">
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[length:15px_15px] pointer-events-none"></div>
      
      <form onSubmit={handleSubmit} className="relative z-10">
        <div className="flex flex-col space-y-4">
          <div className="relative group border-b border-white/10 focus-within:border-white/40 transition-all duration-500">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to discover?"
              className="w-full bg-transparent text-white py-4 md:py-6 pr-12 md:pr-14 text-lg sm:text-xl md:text-2xl font-bold focus:outline-none placeholder-gray-800 rounded-none tracking-tighter"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-800 group-hover:text-white/60 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className="mt-8 md:mt-10 flex flex-wrap gap-x-6 md:gap-x-8 gap-y-4 relative z-10">
        <span className="text-[9px] text-gray-700 uppercase tracking-widest self-center border-r border-white/5 pr-6 md:pr-8">Contexts</span>
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => {
              setQuery(s);
              onSearch(s);
            }}
            className="text-[9px] md:text-[10px] text-gray-600 hover:text-white transition-all uppercase tracking-tighter font-black border-b border-transparent hover:border-white/40"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBox;
