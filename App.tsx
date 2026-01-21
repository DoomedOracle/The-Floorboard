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
      setError("The archive could not be parsed for this discovery. Please try another entry.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-12">
        {!results && !loading && <RandomPick />}

        <section>
          <SearchBox onSearch={handleSearch} isLoading={loading} />
        </section>

        {error && (
          <div className="bg-red-950/10 border border-red-900/20 p-8 text-red-900 text-[10px] mb-8 uppercase tracking-[0.4em] text-center font-black italic">
            {error}
          </div>
        )}

        <section className="pb-32">
          {!results && !loading && (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-px h-16 bg-white/5 mb-8"></div>
              <p className="text-[10px] uppercase tracking-[1em] text-white/10 font-black italic">
                Ready to explore the scene archives...
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