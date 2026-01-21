
import { DiscoveryItem } from '../types';
import { albums } from '../data/albums';
import { archiveData } from '../data/archive';

// Combine datasets and ensure all have excerpts for the vibe engine
const rawData: any[] = [
  ...albums,
  ...archiveData.map(a => ({
    band: a.artist,
    album: a.releaseTitle,
    genre: a.labels[0] || 'underground',
    scene: a.geography,
    year: parseInt(a.era) || 2000,
    excerpt: `Classic archival release from the ${a.geography} scene. Representative of ${a.labels.join(', ')} sound.`
  }))
];

const processedData: DiscoveryItem[] = rawData.map((d, i) => ({
  id: `vibe-${i}`,
  artist: d.band || d.artist,
  releaseTitle: d.album || d.releaseTitle,
  labels: d.genre ? [d.genre] : d.labels,
  era: d.year ? d.year.toString() : d.era,
  geography: d.scene || d.geography,
  excerpt: d.excerpt
}));

// Build Vocabulary
const generateVocabulary = (items: DiscoveryItem[]) => {
  const textPool = items.map(item => 
    `${item.artist} ${item.releaseTitle} ${item.excerpt} ${item.geography} ${item.labels.join(' ')}`.toLowerCase()
  );
  const words = textPool.join(' ').split(/\W+/).filter(w => w.length > 2);
  return Array.from(new Set(words));
};

const vocabulary = generateVocabulary(processedData);

// Vectorization (Bag-of-words)
const getVector = (text: string, vocab: string[]) => {
  const words = text.toLowerCase().split(/\W+/);
  const vector = new Array(vocab.length).fill(0);
  words.forEach(word => {
    const idx = vocab.indexOf(word);
    if (idx !== -1) vector[idx]++;
  });
  return vector;
};

// Cosine Similarity
const cosineSimilarity = (vecA: number[], vecB: number[]) => {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    mA += vecA[i] * vecA[i];
    mB += vecB[i] * vecB[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  if (mA === 0 || mB === 0) return 0;
  return dotProduct / (mA * mB);
};

// Pre-calculate vectors for performance
const itemVectors = processedData.map(item => ({
  id: item.id,
  vector: getVector(`${item.artist} ${item.excerpt} ${item.geography}`, vocabulary)
}));

export const searchVibe = (query: string): DiscoveryItem[] => {
  const queryVector = getVector(query, vocabulary);
  const queryLower = query.toLowerCase();

  const results = processedData.map(item => {
    const itemVec = itemVectors.find(v => v.id === item.id)!.vector;
    const similarity = cosineSimilarity(queryVector, itemVec);
    
    // Determine Relationship Reason
    let reason: DiscoveryItem['vibeReason'] = 'Protocol match';
    if (similarity > 0.3) {
      reason = 'Sounds like';
    } else if (item.geography.toLowerCase().includes(queryLower) || queryLower.includes(item.geography.toLowerCase())) {
      reason = 'Related via scene';
    }

    return { ...item, vibeScore: similarity, vibeReason: reason };
  });

  // Sort by score and filter out irrelevant ones unless it's a scene match
  return results
    .filter(r => r.vibeScore! > 0 || r.vibeReason === 'Related via scene')
    .sort((a, b) => b.vibeScore! - a.vibeScore!);
};

export const getLibrary = () => processedData;

// Fixed: Added exported member getAlbumOfTheDay to resolve error in AlbumOfTheDay.tsx
export const getAlbumOfTheDay = (): DiscoveryItem => {
  const day = new Date().getDate();
  const index = day % processedData.length;
  return processedData[index];
};
