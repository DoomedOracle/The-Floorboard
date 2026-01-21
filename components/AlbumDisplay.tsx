
import React from 'react';
import { ExtractionResponse } from '../types';

interface AlbumDisplayProps {
  results: ExtractionResponse | null;
  isLoading: boolean;
}

const AlbumDisplay: React.FC<AlbumDisplayProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6">
        <div className="text-4xl font-black retro-font tracking-tighter uppercase animate-pulse text-gray-400">Mapping the archives...</div>
        <div className="w-48 h-px bg-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/40 animate-[shimmer_1.5s_infinite]"></div>
        </div>
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
        <p className="text-gray-700 text-[9px] uppercase tracking-[0.6em] text-center italic">
          Ingesting scene metadata // Cross-referencing editorial lists
        </p>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div className="space-y-32 animate-in fade-in duration-1000">
      
      <section>
        <div className="flex items-center gap-6 mb-12">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
          <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.8em] whitespace-nowrap">
            Discovery Layer 01: Scene Context
          </h2>
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {results.sceneLayer.map((entry) => (
            <div key={entry.id} className="relative group border-l border-white/5 pl-8 py-4">
              <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="text-3xl font-black text-white/90 uppercase tracking-tighter group-hover:text-white transition-colors">
                  {entry.artist}
                </h3>
                <span className="text-[9px] font-mono text-gray-700 uppercase tracking-widest">{entry.era}</span>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {entry.labels.map((label, i) => (
                    <span key={i} className="text-[10px] text-gray-600 font-medium italic">
                      {label}
                    </span>
                  ))}
                </div>
                
                <p className="text-[11px] text-gray-500 font-mono tracking-tight uppercase">
                  {entry.geography}
                </p>

                <div className="pt-4 border-t border-white/5">
                  <span className="text-[8px] text-gray-800 uppercase tracking-widest block mb-2 font-black italic">Archive Presence:</span>
                  <div className="text-[10px] text-gray-600 leading-relaxed max-w-sm">
                    {entry.coMentions.join(' · ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-6 mb-16">
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-900 to-transparent"></div>
          <h2 className="text-[10px] font-black text-gray-600 uppercase tracking-[1em] whitespace-nowrap">
            Discovery Layer 02: Recommendations
          </h2>
          <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-900 to-transparent"></div>
        </div>

        <div className="space-y-24">
          {results.soundsLikeLayer.map((match) => (
            <div key={match.id} className="max-w-3xl mx-auto space-y-8">
              <div className="text-center">
                <h4 className="text-4xl font-black text-white uppercase tracking-tighter mb-1">{match.artist}</h4>
                <p className="text-xl text-gray-500 font-light italic tracking-tight">{match.releaseTitle}</p>
              </div>

              <div className="relative p-10 bg-[#070707] border border-white/5 rounded-sm">
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/10"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/10"></div>
                
                <p className="text-base text-gray-400 font-serif leading-relaxed italic text-center">
                  "{match.vibeContext}"
                </p>
                
                <div className="mt-8 flex justify-center flex-wrap gap-4 opacity-40">
                  {match.descriptiveKeywords.map((kw, i) => (
                    <span key={i} className="text-[9px] uppercase tracking-widest font-black text-white/50">{kw}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-center">
                 <div className="h-px w-8 bg-white/5"></div>
                 <p className="text-[10px] text-gray-700 uppercase tracking-widest font-medium italic">
                   {match.reasoning}
                 </p>
                 <div className="h-px w-8 bg-white/5"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {results.groundingSources.length > 0 && (
        <div className="mt-48 pt-20 border-t border-dashed border-white/10">
          <div className="max-w-xl mx-auto">
            <h4 className="text-[9px] font-black text-gray-800 mb-12 uppercase tracking-[1em] text-center">
              Source Extraction Log
            </h4>
            <div className="space-y-6">
              {results.groundingSources.map((source, i) => (
                <a 
                  key={i}
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block group/link"
                >
                  <div className="flex items-center justify-between py-2 px-4 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                    <span className="text-[10px] font-mono text-gray-700 group-hover/link:text-gray-400">ARCHIVE_LOG_0{i + 1}</span>
                    <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold truncate max-w-[250px]">
                      {source.title.split(' - ')[0]}
                    </span>
                    <span className="text-[8px] text-gray-800 group-hover/link:text-white/40 uppercase tracking-widest font-black italic">
                      View Original
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
