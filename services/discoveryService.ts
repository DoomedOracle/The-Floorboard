
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractionResponse } from '../types';

export const getMusicDiscovery = async (query: string): Promise<ExtractionResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Get user location for better grounding if available
  let locationText = "unknown location";
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      }
    });
    locationText = `${pos.coords.latitude}, ${pos.coords.longitude}`;
  } catch (e) {
    console.log("Location not available for grounding, proceeding with general search.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Discover music related to: "${query}". 
    Focus on underground scenes, archives (like Sophie's Floorboard, Brooklyn Vegan, No Echo, Washed Up Emo), and stylistic matches. 
    Context: User is currently near ${locationText}.
    Provide a detailed, structured response in JSON format.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sceneLayer: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                artist: { type: Type.STRING },
                labels: { type: Type.ARRAY, items: { type: Type.STRING } },
                era: { type: Type.STRING },
                geography: { type: Type.STRING },
                coMentions: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["id", "artist", "labels", "era", "geography", "coMentions"]
            }
          },
          soundsLikeLayer: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                artist: { type: Type.STRING },
                releaseTitle: { type: Type.STRING },
                descriptiveKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                vibeContext: { type: Type.STRING },
                reasoning: { type: Type.STRING }
              },
              required: ["id", "artist", "releaseTitle", "descriptiveKeywords", "vibeContext", "reasoning"]
            }
          },
          sourceSummary: { type: Type.STRING }
        },
        required: ["sceneLayer", "soundsLikeLayer", "sourceSummary"]
      }
    }
  });

  const rawText = response.text;
  if (!rawText) {
    throw new Error("No response content from discovery engine.");
  }

  const parsed = JSON.parse(rawText);
  
  // Extract URLs from grounding metadata
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const groundingSources = groundingChunks
    .filter(chunk => chunk.web)
    .map(chunk => ({
      title: chunk.web?.title || "Archive Source",
      uri: chunk.web?.uri || "#"
    }));

  return {
    ...parsed,
    groundingSources: groundingSources.slice(0, 5)
  };
};
