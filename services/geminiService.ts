import { GoogleGenAI, Type } from "@google/genai";
import { OsmTags } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const suggestTagsFromDescription = async (description: string): Promise<Partial<OsmTags>> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract OpenStreetMap tags from this description: "${description}". 
    Focus on amenity, name, cuisine, address details, contact info. 
    Return only valid OSM tags.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          amenity: { type: Type.STRING },
          name: { type: Type.STRING },
          cuisine: { type: Type.STRING },
          "addr:street": { type: Type.STRING },
          "addr:housenumber": { type: Type.STRING },
          "addr:city": { type: Type.STRING },
          "addr:postcode": { type: Type.STRING },
          phone: { type: Type.STRING },
          website: { type: Type.STRING },
          opening_hours: { type: Type.STRING },
          wheelchair: { type: Type.STRING }
        }
      }
    }
  });

  const text = response.text;
  if (!text) return {};
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {};
  }
};

export const validateOsmData = async (xml: string): Promise<{ isValid: boolean; suggestions: string[] }> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this OpenStreetMap XML node for common errors or missing recommended tags for a restaurant/shop.
    XML: 
    \`\`\`xml
    ${xml}
    \`\`\`
    Provide a list of brief suggestions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

   const text = response.text;
  if (!text) return { isValid: true, suggestions: [] };
  
  try {
    return JSON.parse(text);
  } catch (e) {
    return { isValid: false, suggestions: ["Could not parse validation result."] };
  }
};
