
export interface DiscoveryItem {
  id: string;
  artist: string;
  releaseTitle: string;
  labels: string[];
  era: string;
  geography: string;
  descriptiveKeywords: string[];
}

export interface ExtractionResponse {
  discoveries: DiscoveryItem[];
  sourceSummary: string;
  groundingSources: Array<{
    title: string;
    uri: string;
  }>;
}
