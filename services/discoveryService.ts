
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

export const getMusicDiscovery = async (query: string): Promise<ExtractionResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `SEARCH PROTOCOL: "${query}". Find archival matches. Use your search tool to verify against underground music blogs like Sophie's Floorboard or Brooklyn Vegan. Focus on niche, physical-media era releases.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: DISCOVERY_SCHEMA
      }
    });

    const data = JSON.parse(response.text);
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
    console.warn("Global Network Offline. Switching to Local Vibe Scan.");
    const localMatches = searchVibe(query);
    return {
      discoveries: localMatches,
      sourceSummary: "Retrieved from Local Archival Ledger via Vibe Similarity.",
      groundingSources: [{ title: "Local Vibe Database", uri: "#" }]
    };
  }
};

const RANDOM_SCENES = [
  "90s San Diego post-hardcore",
  "Early 2000s Japanese screamo",
  "Late 90s Gainesville Florida emo",
  "French screamo scene 2000-2010",
  "Midwest emo obscure 1994-1998",
  "Richmond Virginia punk archive",
  "D.C. Revolution Summer leftovers",
  "New Jersey basement emo 1999",
  "90s Washington State math rock",
  "Late 90s Philadelphia post-hardcore"
];

export const getRandomDiscovery = async (): Promise<ExtractionResponse> => {
  try {
    const scene = RANDOM_SCENES[Math.floor(Math.random() * RANDOM_SCENES.length)];
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Specifically asking for ONE obscure band to make it feel like a single deep pull
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `PULL RANDOM NODE: Focus on the "${scene}" scene. Find ONE highly obscure, critically respected but forgotten band. Provide a detailed excerpt about their sound.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: DISCOVERY_SCHEMA
      }
    });

    const data = JSON.parse(response.text);
    return {
      discoveries: data.discoveries.map((d: any) => ({ ...d, vibeReason: 'Protocol match' })),
      sourceSummary: `Random node extracted from the ${scene} archive sector.`,
      groundingSources: (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web)
        .map((c: any) => ({ title: c.web.title, uri: c.web.uri }))
    };
  } catch (err) {
    // Fallback to local random if API fails
    const vibeLib = searchVibe("");
    const item = vibeLib[Math.floor(Math.random() * vibeLib.length)];
    return {
      discoveries: [{ ...item, vibeReason: 'Related via scene' }],
      sourceSummary: "Random archival entry retrieved from Local Vibe engine (Fallback).",
      groundingSources: [{ title: "Internal Node Archive", uri: "#" }]
    };
  }
};
