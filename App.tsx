
import React, { useState } from 'react';
import Layout from './components/Layout';
import SearchBox from './components/SearchBox';
import AlbumDisplay from './components/AlbumDisplay';
import RandomPick from './components/RandomPick';
import { getMusicDiscovery } from './services/discoveryService';
import { ExtractionResponse } from './types';

const App: React.FC = () => {
  const [results, setResults] = useState<ExtractionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMusicDiscovery(query);
      setResults(data);
    } catch (err) {
      setError("System failure: The archive could not be accessed. Terminal reboot recommended.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-12">
        {!results && !loading && (
          <div className="animate-in fade-in duration-1000">
            <RandomPick />
          </div>
        )}

        <section>
          <SearchBox onSearch={handleSearch} isLoading={loading} />
        </section>

        {error && (
          <div className="bg-red-950/20 border border-red-900/40 p-12 text-red-700 text-[10px] mb-8 uppercase tracking-[0.5em] text-center font-black italic">
            {error}
          </div>
        )}

        <section className="pb-32">
          {results && results.discoveries.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-24 border border-white/5 bg-white/[0.01]">
               <p className="text-[10px] uppercase tracking-[1em] text-gray-700 font-black italic text-center px-4">
                No matching archival nodes found for this protocol.
              </p>
            </div>
          )}

          {!results && !loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-px h-16 bg-white/5 mb-8"></div>
              <p className="text-[10px] uppercase tracking-[1em] text-white/10 font-black italic">
                Awaiting input protocol...
              </p>
            </div>
          )}
          
          <AlbumDisplay results={results} isLoading={loading} />
        </section>
      </div>
    </Layout>
  );
};

export default App;
