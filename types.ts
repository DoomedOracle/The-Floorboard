
export interface SceneEntry {
  id: string;
  artist: string;
  labels: string[];
  era: string;
  geography: string;
  coMentions: string[]; 
}

export interface StylisticMatch {
  id: string;
  artist: string;
  releaseTitle: string;
  descriptiveKeywords: string[];
  vibeContext: string; 
  reasoning: string; 
}

export interface ExtractionResponse {
  sceneLayer: SceneEntry[];
  soundsLikeLayer: StylisticMatch[];
  sourceSummary: string;
  groundingSources: Array<{
    title: string;
    uri: string;
  }>;
}
