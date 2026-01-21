
import React from 'react';
import { ExtractionResponse, DiscoveryItem } from '../types';

interface AlbumDisplayProps {
  results: ExtractionResponse | null;
  isLoading: boolean;
}

const DiscoveryCard: React.FC<{ item: DiscoveryItem }> = ({ item }) => {
  return (
    <div className="bg-[#070707] border border-white/5 p-6 flex flex-col h-full transition-all duration-300 hover:bg-white/[0.01] hover:border-white/10">
      <div className="flex flex-col h-full">
        {/* Top Meta */}
        <div className="flex justify-between items-start mb-6">
          <span className="text-[9px] font-mono text-gray-600 tracking-[0.4em] uppercase">
            {item.era} // {item.geography}
          </span>
        </div>

        {/* Primary Info */}
        <div className="mb-8">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">
            {item.artist}
          </h3>
          <p className="text-lg text-gray-500 font-light italic tracking-tight">
            {item.releaseTitle}
          </p>
        </div>

        {/* Labels & Tags */}
        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <div className="space-y-1">
            <span className="text-[7px] text-gray-700 uppercase tracking-widest font-black block">Archival Node (Labels):</span>
            <span className="text-[9px] text-gray-500 font-mono tracking-tighter uppercase">{item.labels.join(', ')}</span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {item.descriptiveKeywords.map((kw, i) => (
              <span key={i} className="text-[9px] text-gray-700 italic lowercase">#{kw}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AlbumDisplay: React.FC<AlbumDisplayProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="text-4xl font-black retro-font tracking-tighter uppercase animate-pulse text-gray-600">Accessing Node...</div>
        <div className="w-48 h-px bg-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/20 animate-[shimmer_1.5s_infinite]"></div>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="space-y-24 animate-in fade-in duration-700">
      <div className="flex items-center gap-6 mb-12">
        <div className="h-px flex-grow bg-white/5"></div>
        <h2 className="text-[10px] font-black text-gray-800 uppercase tracking-[1em] whitespace-nowrap">
          Archival Ledger
        </h2>
        <div className="h-px flex-grow bg-white/5"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {results.discoveries.map((item) => (
          <DiscoveryCard key={item.id} item={item} />
        ))}
      </div>

      {results.groundingSources.length > 0 && (
        <div className="mt-48 pt-20 border-t border-dashed border-white/5">
          <div className="max-w-xl mx-auto">
            <h4 className="text-[9px] font-black text-gray-800 mb-12 uppercase tracking-[1em] text-center">
              Source Extraction Log
            </h4>
            <div className="space-y-2">
              {results.groundingSources.map((source, i) => (
                <a 
                  key={i}
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block group/link"
                >
                  <div className="flex items-center justify-between py-2 px-6 hover:bg-white/[0.01] transition-colors border border-white/5">
                    <span className="text-[9px] font-mono text-gray-800 group-hover/link:text-gray-500 tracking-tighter">NODE_0{i + 1}</span>
                    <span className="text-[10px] text-gray-700 uppercase tracking-widest font-bold truncate max-w-[250px]">
                      {source.title.split(' - ')[0]}
                    </span>
                    <span className="text-[8px] text-gray-800 group-hover/link:text-white/40 uppercase tracking-widest font-black italic">
                      [ RAW ]
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumDisplay;
