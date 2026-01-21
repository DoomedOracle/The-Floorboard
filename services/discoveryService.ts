
import { archiveData } from '../data/archive';
import { sourcesData } from '../data/sources';
import { ExtractionResponse, SceneEntry, StylisticMatch } from '../types';

export const getMusicDiscovery = async (query: string): Promise<ExtractionResponse> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const lowerQuery = query.toLowerCase();

  const matches = archiveData.filter(item => {
    return (
      item.artist.toLowerCase().includes(lowerQuery) ||
      item.releaseTitle.toLowerCase().includes(lowerQuery) ||
      item.labels.some(l => l.toLowerCase().includes(lowerQuery)) ||
      item.geography.toLowerCase().includes(lowerQuery) ||
      item.descriptiveKeywords.some(k => k.toLowerCase().includes(lowerQuery))
    );
  });

  const results = matches.length > 0 ? matches : archiveData.slice(0, 4);

  const sceneLayer: SceneEntry[] = results.map(r => ({
    id: r.id + '_scene',
    artist: r.artist,
    labels: r.labels,
    era: r.era,
    geography: r.geography,
    coMentions: r.coMentions
  }));

  const soundsLikeLayer: StylisticMatch[] = results.map(r => ({
    id: r.id + '_match',
    artist: r.artist,
    releaseTitle: r.releaseTitle,
    descriptiveKeywords: r.descriptiveKeywords,
    vibeContext: r.vibeContext,
    reasoning: r.reasoning
  }));

  const groundingSources = results.map(r => {
    const source = sourcesData.find(s => s.slug === r.sourceSlug);
    return {
      title: source ? source.name : "Archival Source",
      uri: source ? source.base_url : "#"
    };
  }).filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i); 

  return {
    sceneLayer,
    soundsLikeLayer,
    sourceSummary: `Archive search returned ${results.length} relevant entries.`,
    groundingSources
  };
};
