
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
      setError("Archive node unreachable.");
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
          className="group relative px-12 py-5 bg-transparent border border-white/5 hover:border-white/10 transition-all duration-700 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/[0.01] translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
          <span className="relative text-[10px] font-black text-gray-900 group-hover:text-gray-500 uppercase tracking-[1em] italic">
            {isRolling ? 'Accessing Ledger...' : 'Access Random Node'}
          </span>
        </button>
        {error && <p className="text-[9px] text-red-950 uppercase tracking-widest italic">{error}</p>}
      </div>

      {isRolling && (
        <div className="flex flex-col items-center py-32 animate-pulse">
          <div className="text-3xl font-black retro-font tracking-tighter uppercase text-white/5 italic">Scanning Archive...</div>
        </div>
      )}

      {randomResult && !isRolling && (
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="max-w-2xl mx-auto">
            {randomResult.discoveries.slice(0, 1).map((item) => (
              <div key={item.id} className="bg-[#070707] border border-white/10 p-20 transition-all">
                <div className="flex flex-col items-center text-center">
                  <span className="text-[9px] font-mono text-gray-800 tracking-[0.5em] uppercase mb-12 block">
                    {item.era} // {item.geography}
                  </span>
                  <h3 className="text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                    {item.artist}
                  </h3>
                  <p className="text-2xl text-gray-600 font-light italic tracking-tight mb-16">
                    {item.releaseTitle}
                  </p>
                  
                  <div className="w-16 h-px bg-white/5 mb-16"></div>

                  <div className="flex flex-wrap justify-center gap-6">
                    {item.labels.map((l, i) => (
                      <span key={i} className="text-[12px] uppercase tracking-widest font-black text-gray-800 border border-white/5 px-6 py-3">{l}</span>
                    ))}
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
