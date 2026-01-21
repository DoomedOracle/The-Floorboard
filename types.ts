
export interface DiscoveryItem {
  id: string;
  artist: string;
  releaseTitle: string;
  labels: string[];
  era: string;
  geography: string;
  excerpt?: string;
  vibeScore?: number;
  vibeReason?: 'Sounds like' | 'Related via scene' | 'Protocol match';
}

export interface ExtractionResponse {
  discoveries: DiscoveryItem[];
  sourceSummary: string;
  groundingSources: Array<{
    title: string;
    uri: string;
  }>;
}
