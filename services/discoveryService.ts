
import { GoogleGenAI, Type } from "@google/genai";
import { DiscoveryItem, ExtractionResponse } from '../types';
import { searchVibe } from './vibeService';

const DISCOVERY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    discoveries: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          artist: { type: Type.STRING },
          releaseTitle: { type: Type.STRING },
          labels: { type: Type.ARRAY, items: { type: Type.STRING } },
          era: { type: Type.STRING },
          geography: { type: Type.STRING },
          excerpt: { type: Type.STRING }
        },
        required: ["id", "artist", "releaseTitle", "labels", "era", "geography"]
      }
    },
    sourceSummary: { type: Type.STRING }
  },
  required: ["discoveries", "sourceSummary"]
};

const cleanJsonResponse = (text: string) => {
  return text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
};

export const getMusicDiscovery = async (query: string): Promise<ExtractionResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `SEARCH PROTOCOL: "${query}". Find archival matches. Use your search tool to verify against underground music blogs (Sophie's Floorboard, Brooklyn Vegan, No Echo, Blogspot archives). Focus on niche, physical-media era releases. Strictly avoid "gateway" bands like American Football or Sunny Day Real Estate unless the user specifically asks for them.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: DISCOVERY_SCHEMA,
        temperature: 0.8
      }
    });

    const cleanedText = cleanJsonResponse(response.text || '');
    const data = JSON.parse(cleanedText);
    
    const discoveries = data.discoveries.map((d: any) => ({
      ...d,
      vibeReason: 'Protocol match'
    }));

    return {
      discoveries,
      sourceSummary: data.sourceSummary,
      groundingSources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }))
    };
  } catch (err) {
    console.warn("Global Network Error. Reverting to local scan.", err);
    const localMatches = searchVibe(query);
    return {
      discoveries: localMatches,
      sourceSummary: "Retrieved from Local Archival Ledger (Vibe Engine).",
      groundingSources: [{ title: "Internal Database", uri: "#" }]
    };
  }
};

const RANDOM_SCENES = [
  "90s San Diego post-hardcore (Gravity Records)",
  "Early 2000s Japanese screamo (Envy/Heaven in Her Arms)",
  "Late 90s Gainesville Florida emo",
  "French screamo scene 2000-2010 (Daitro/Aina)",
  "Midwest emo obscure 1992-1996",
  "Richmond Virginia punk/hardcore 1998-2005",
  "D.C. Revolution Summer leftovers",
  "New Jersey basement emo 1999-2003",
  "90s Washington State math rock",
  "Late 90s Philadelphia skramz",
  "German screamo/hardcore (Per Koro style)",
  "Italian emotional hardcore 90s",
  "Swedish hardcore late 90s",
  "Brazilian mid-2000s screamo",
  "Kansas City/Lawrence emo 1994-1998",
  "90s Houston post-hardcore",
  "90s Massachusetts emotional hardcore",
  "Malaysian screamo scene",
  "Early 2000s UK post-hardcore/emo",
  "Deep-cut labels like Level Plane or Honey Bear"
];

const DESCRIPTORS = [
  "chaotic/mathy", "twinkly/bittersweet", "raw/unproduced", "atmospheric",
  "angular/dissonant", "spoken-word sections", "violin/cello included",
  "4-track home recording", "obscure one-off 7-inch", "melodic/aggressive"
];

export const getRandomDiscovery = async (): Promise<ExtractionResponse> => {
  try {
    const scene = RANDOM_SCENES[Math.floor(Math.random() * RANDOM_SCENES.length)];
    const descriptor = DESCRIPTORS[Math.floor(Math.random() * DESCRIPTORS.length)];
    const entropy = Math.random().toString(36).substring(7);
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `PULL RANDOM NODE [ID: ${entropy}]. SCENE: "${scene}". SOUND: "${descriptor}". 
      MISSION: Find ONE highly obscure band that most people have forgotten.
      MANDATORY: 
      1. Do NOT repeat bands from previous common searches. 
      2. If you find a band with only 1 release, prioritize it.
      3. Verify the band exists via search tools (Discogs/Archive.org/Blogs).`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: DISCOVERY_SCHEMA,
        temperature: 1.0
      }
    });

    const cleanedText = cleanJsonResponse(response.text || '');
    const data = JSON.parse(cleanedText);
    
    return {
      discoveries: data.discoveries.map((d: any) => ({ ...d, vibeReason: 'Protocol match' })),
      sourceSummary: `Extracted from Sector: ${scene}. Profile: ${descriptor}.`,
      groundingSources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }))
    };
  } catch (err) {
    console.error("Discovery error", err);
    const vibeLib = searchVibe("");
    const item = vibeLib[Math.floor(Math.random() * vibeLib.length)];
    return {
      discoveries: [{ ...item, vibeReason: 'Related via scene' }],
      sourceSummary: "Random archival entry (Local Fallback).",
      groundingSources: [{ title: "Internal Archive", uri: "#" }]
    };
  }
};
