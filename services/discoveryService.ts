
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResponse } from '../types';

const ARCHIVE_PROMPT_BASE = `Act as a cold, objective music archivist for underground scenes (Emo, Screamo, Hardcore, Post-Punk). 
Focus on specific archives like Sophie's Floorboard, Brooklyn Vegan, Washed Up Emo, and No Echo.
For every release you find, provide ONLY the following raw metadata:
1. Artist and Release Title.
2. Labels, Era (Year), and Geography (City/State).
DO NOT provide descriptions, reasoning, vibe contexts, or genre tags. 
Keep the output purely factual and archival. Do not tip your hand on what the music sounds like.`;

const DISCOVERY_ITEM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    artist: { type: Type.STRING },
    releaseTitle: { type: Type.STRING },
    labels: { type: Type.ARRAY, items: { type: Type.STRING } },
    era: { type: Type.STRING },
    geography: { type: Type.STRING }
  },
  required: ["id", "artist", "releaseTitle", "labels", "era", "geography"]
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    discoveries: {
      type: Type.ARRAY,
      items: DISCOVERY_ITEM_SCHEMA
    },
    sourceSummary: { type: Type.STRING }
  },
  required: ["discoveries", "sourceSummary"]
};

export const getMusicDiscovery = async (query: string): Promise<ExtractionResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `${ARCHIVE_PROMPT_BASE} Locate releases associated with: "${query}".`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA
    }
  });

  return parseGeminiResponse(response);
};

export const getRandomDiscovery = async (): Promise<ExtractionResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `${ARCHIVE_PROMPT_BASE} Randomly select one obscure release from the archives.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA
    }
  });

  return parseGeminiResponse(response);
};

function parseGeminiResponse(response: any): ExtractionResponse {
  const rawText = response.text;
  if (!rawText) throw new Error("The archives returned an empty signal.");
  
  const parsed = JSON.parse(rawText);
  
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const groundingSources = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web?.title || "Archive Source",
      uri: chunk.web?.uri || "#"
    }));

  return {
    ...parsed,
    groundingSources: groundingSources.slice(0, 5)
  };
}
