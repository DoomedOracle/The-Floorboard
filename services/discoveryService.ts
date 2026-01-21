
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResponse } from '../types';

const ARCHIVE_PROMPT_BASE = `Act as a senior music archivist for underground scenes (Emo, Screamo, Hardcore, Post-Punk). 
Focus on specific archives like Sophie's Floorboard, Brooklyn Vegan, Washed Up Emo, and No Echo.
For every release you find, provide ONLY raw metadata:
1. Artist and Release Title.
2. Labels, Era (Year), and Geography (City/State).
3. Short, descriptive tags.
DO NOT provide descriptions, reasoning, or vibe contexts. Keep it archival and objective.`;

const DISCOVERY_ITEM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    artist: { type: Type.STRING },
    releaseTitle: { type: Type.STRING },
    labels: { type: Type.ARRAY, items: { type: Type.STRING } },
    era: { type: Type.STRING },
    geography: { type: Type.STRING },
    descriptiveKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["id", "artist", "releaseTitle", "labels", "era", "geography", "descriptiveKeywords"]
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
    contents: `${ARCHIVE_PROMPT_BASE} Find releases related to: "${query}". 
    Return a minimal grid of metadata.`,
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
    contents: `${ARCHIVE_PROMPT_BASE} Pull one random release from the archives. 
    Focus on something rare or obscure.`,
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
