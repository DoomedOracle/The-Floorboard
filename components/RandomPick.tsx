
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
      setError("Archive signal lost.");
    } finally {
      setIsRolling(false);
    }
  };

  return (
    <div className="mb-16">
      <div className="flex flex-col items-center justify-center space-y-8 mb-12">
        <button 
          onClick={handleRoll}
          disabled={isRolling}
          className="group relative px-10 py-4 bg-transparent border border-white/5 hover:border-white/20 transition-all duration-500 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/[0.01] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <span className="relative text-[10px] font-black text-gray-700 group-hover:text-gray-400 uppercase tracking-[0.8em] italic">
            {isRolling ? 'Accessing Archive...' : 'Pull Random Node'}
          </span>
        </button>
        {error && <p className="text-[9px] text-red-950 uppercase tracking-widest italic">{error}</p>}
      </div>

      {isRolling && (
        <div className="flex flex-col items-center py-24 space-y-6 animate-pulse">
          <div className="text-3xl font-black retro-font tracking-tighter uppercase text-white/5 italic">Scanning...</div>
        </div>
      )}

      {randomResult && !isRolling && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="max-w-xl mx-auto">
            {randomResult.discoveries.slice(0, 1).map((item) => (
              <div key={item.id} className="bg-[#070707] border border-white/10 p-12 transition-all">
                <div className="flex flex-col items-center text-center">
                  <span className="text-[9px] font-mono text-gray-700 tracking-[0.4em] uppercase mb-6 block">
                    {item.era} // {item.geography}
                  </span>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-3">
                    {item.artist}
                  </h3>
                  <p className="text-xl text-gray-500 font-light italic tracking-tight mb-8">
                    {item.releaseTitle}
                  </p>
                  
                  <div className="w-12 h-px bg-white/5 mb-8"></div>

                  <div className="space-y-4">
                    <span className="text-[8px] text-gray-800 uppercase tracking-[0.3em] font-black block">Labels:</span>
                    <div className="flex flex-wrap justify-center gap-4">
                      {item.labels.map((l, i) => (
                        <span key={i} className="text-[10px] uppercase tracking-widest font-black text-gray-600 border border-white/5 px-3 py-1">{l}</span>
                      ))}
                    </div>
                  </div>
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
