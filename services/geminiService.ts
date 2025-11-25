import { GoogleGenAI, Type } from "@google/genai";
import { Dish } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMenuContent = async (theme: string): Promise<{ dishes: Dish[], restaurantName: string, tagline: string }> => {
  const model = "gemini-2.5-flash";
  
  const systemInstruction = `
    You are a world-class menu engineer and chef. 
    Create a list of 10 distinct, gourmet dishes for a restaurant with the theme: "${theme}".
    The output must be in Russian language.
    
    You must designate:
    - 1 item as a 'special' (High profit, visually stunning, meant for the optical center).
    - 2 items as 'starter'.
    - 5 items as 'main'.
    - 2 items as 'dessert'.
    
    Also provide a creative Restaurant Name and a short, elegant tagline suitable for an upscale paper menu.
    Prices should be realistic for a high-end restaurant in Rubles (e.g., 850₽, 1200₽).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: `Generate the menu for theme: ${theme}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          restaurantName: { type: Type.STRING },
          tagline: { type: Type.STRING },
          dishes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                price: { type: Type.STRING },
                category: { type: Type.STRING, enum: ['starter', 'main', 'dessert', 'special'] },
                highlight: { type: Type.BOOLEAN, description: "True if this is a high margin item meant for the golden triangle" }
              },
              required: ["id", "name", "description", "price", "category"]
            }
          }
        },
        required: ["restaurantName", "tagline", "dishes"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text);
  }

  throw new Error("Failed to generate menu content");
};