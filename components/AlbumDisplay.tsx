
import React from 'react';
import { ExtractionResponse, DiscoveryItem } from '../types';

interface AlbumDisplayProps {
  results: ExtractionResponse | null;
  isLoading: boolean;
}

const DiscoveryCard: React.FC<{ item: DiscoveryItem }> = ({ item }) => {
  return (
    <div className="bg-[#070707] border border-white/5 p-8 flex flex-col h-full transition-all duration-500 hover:border-white/10 select-none">
      <div className="flex flex-col h-full">
        {/* Header Metadata */}
        <div className="flex justify-between items-start mb-10">
          <span className="text-[9px] font-mono text-gray-800 tracking-[0.4em] uppercase">
            {item.era} // {item.geography}
          </span>
        </div>

        {/* Primary Data */}
        <div className="mb-14">
          <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-3">
            {item.artist}
          </h3>
          <p className="text-xl text-gray-600 font-light italic tracking-tight">
            {item.releaseTitle}
          </p>
        </div>

        {/* Catalog Info */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <span className="text-[10px] text-gray-700 font-mono tracking-tighter uppercase block">
            {item.labels.join(' / ')}
          </span>
        </div>
      </div>
    </div>
  );
};

const AlbumDisplay: React.FC<AlbumDisplayProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-8">
        <div className="text-4xl font-black retro-font tracking-tighter uppercase animate-pulse text-gray-900">Accessing Ledger...</div>
        <div className="w-32 h-px bg-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-[shimmer_1.5s_infinite]"></div>
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
    <div className="space-y-32 animate-in fade-in duration-700">
      <div className="flex items-center gap-6 mb-16">
        <div className="h-px flex-grow bg-white/5"></div>
        <h2 className="text-[10px] font-black text-gray-900 uppercase tracking-[1em] whitespace-nowrap">
          Archival Data Nodes
        </h2>
        <div className="h-px flex-grow bg-white/5"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
        {results.discoveries.map((item) => (
          <DiscoveryCard key={item.id} item={item} />
        ))}
      </div>

      {results.groundingSources.length > 0 && (
        <div className="mt-64 pt-20 border-t border-dashed border-white/5">
          <div className="max-w-xl mx-auto">
            <h4 className="text-[9px] font-black text-gray-900 mb-16 uppercase tracking-[1.5em] text-center">
              Verified Documentation
            </h4>
            <div className="space-y-px bg-white/5 border border-white/5">
              {results.groundingSources.map((source, i) => (
                <a 
                  key={i}
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block group/link bg-[#030303]"
                >
                  <div className="flex items-center justify-between py-3 px-8 hover:bg-white/[0.01] transition-colors">
                    <span className="text-[9px] font-mono text-gray-900 group-hover/link:text-gray-700 tracking-tighter">NODE_0{i + 1}</span>
                    <span className="text-[10px] text-gray-800 uppercase tracking-widest font-bold truncate max-w-[250px]">
                      {source.title.split(' - ')[0]}
                    </span>
                    <span className="text-[8px] text-gray-900 group-hover/link:text-white/40 uppercase tracking-widest font-black italic">
                      [ RAW_ACCESS ]
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
