
import React, { useState } from 'react';
import { getRandomDiscovery } from '../services/discoveryService';
import { ExtractionResponse } from '../types';

const RandomPick: React.FC = () => {
  const [randomResult, setRandomResult] = useState<ExtractionResponse | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoll = async () => {
    setIsRolling(true);
    setError(null);
    try {
      const data = await getRandomDiscovery();
      setRandomResult(data);
    } catch (err) {
      console.error(err);
      setError("Archive node unreachable. Attempting local reboot...");
    } finally {
      setIsRolling(false);
    }
  };

  return (
    <div className="mb-24">
      <div className="flex flex-col items-center justify-center space-y-12 mb-16">
        <button 
          onClick={handleRoll}
          disabled={isRolling}
          className="group relative px-16 py-8 bg-[#050505] border border-white/5 hover:border-white/20 transition-all duration-700 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/[0.03] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <div className="relative flex flex-col items-center gap-2">
            <span className="text-[11px] font-black text-white uppercase tracking-[1.2em] italic">
              {isRolling ? 'Decrypting Node...' : 'Access Random Node'}
            </span>
            {!isRolling && <span className="text-[8px] text-gray-800 uppercase tracking-widest font-mono">POOL_SIZE: ENDLESS_ARCHIVE</span>}
          </div>
        </button>
        {error && <p className="text-[9px] text-red-950 uppercase tracking-widest italic">{error}</p>}
      </div>

      {isRolling && (
        <div className="flex flex-col items-center py-32 animate-pulse space-y-4">
          <div className="text-3xl font-black retro-font tracking-tighter uppercase text-white/10 italic">Scanning Deep Web Archives...</div>
          <div className="text-[10px] font-mono text-gray-900 tracking-widest">CONNECTING_TO_SOPHIES_FLOORBOARD_API...</div>
          <div className="w-64 h-px bg-white/5 relative overflow-hidden mt-6">
             <div className="absolute inset-0 bg-white/40 animate-[shimmer_0.8s_infinite]"></div>
          </div>
        </div>
      )}

      {randomResult && !isRolling && (
        <div className="animate-in fade-in zoom-in-95 duration-1000">
          <div className="max-w-3xl mx-auto">
            {randomResult.discoveries.slice(0, 1).map((item) => (
              <div key={item.id} className="bg-[#070707] border border-white/10 p-16 md:p-24 transition-all hover:bg-[#090909] group relative">
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-20 transition-opacity">
                   <span className="text-6xl font-black retro-font text-white select-none">?</span>
                </div>
                
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="mb-12 flex items-center gap-4">
                    <span className="w-8 h-px bg-white/10"></span>
                    <span className="text-[9px] font-mono text-gray-800 tracking-[0.8em] uppercase">
                      {item.era} // {item.geography}
                    </span>
                    <span className="w-8 h-px bg-white/10"></span>
                  </div>
                  
                  <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4 group-hover:tracking-normal transition-all duration-700 italic">
                    {item.artist}
                  </h3>
                  <p className="text-xl md:text-3xl text-gray-600 font-light italic tracking-tight mb-16">
                    {item.releaseTitle}
                  </p>
                  
                  <div className="w-full max-w-md h-px bg-white/5 mb-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_infinite]"></div>
                  </div>

                  {item.excerpt && (
                    <div className="max-w-lg mb-16 px-4">
                      <p className="text-[11px] md:text-xs text-gray-500 font-mono italic leading-relaxed text-center">
                        "{item.excerpt}"
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center gap-4">
                    {item.labels.map((l, i) => (
                      <span key={i} className="text-[9px] uppercase tracking-[0.3em] font-black text-gray-800 border border-white/5 px-5 py-2 hover:text-white/60 transition-colors">
                        {l}
                      </span>
                    ))}
                  </div>
                  
                  {randomResult.groundingSources.length > 0 && (
                     <div className="mt-16 pt-8 border-t border-white/5 w-full flex justify-center">
                        <a 
                          href={randomResult.groundingSources[0].uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[8px] text-gray-900 uppercase tracking-[0.5em] hover:text-white transition-colors flex items-center gap-2"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          VERIFY_ON_LOG_01
                        </a>
                     </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomPick;
