
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen grainy flex flex-col items-center p-4 md:p-12">
      <header className="w-full max-w-4xl flex flex-col items-center mb-16 space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 opacity-40">
             <span className="text-white text-4xl retro-font tracking-tighter">※</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white/90 mb-4 select-none">
            The Floorboard
          </h1>
          <div className="w-32 h-px bg-white/5 mb-4"></div>
          <p className="text-gray-600 text-[10px] md:text-xs uppercase tracking-[1em] font-black italic">
            Archival Music Discovery Engine
          </p>
        </div>
      </header>
      <main className="w-full max-w-4xl flex-grow">
        {children}
      </main>
      <footer className="mt-32 text-gray-800 text-[9px] text-center border-t border-white/5 pt-12 w-full max-w-4xl space-y-4">
        <div className="flex justify-center gap-12 opacity-30">
          <span>BROOKLYN VEGAN</span>
          <span>SOPHIE'S FLOORBOARD</span>
          <span>WASHED UP EMO</span>
          <span>NO ECHO</span>
        </div>
        <p className="uppercase tracking-[0.5em] font-black text-white/20">Go to shows. Buy merch. Support your local scene</p>
        <p className="opacity-20 italic">For discovery and archival purposes only.</p>
      </footer>
    </div>
  );
};

export default Layout;
