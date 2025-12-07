import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// We assume process.env.API_KEY is available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a fun or interesting fact about a specific duration.
 * @param seconds The duration in seconds to generate a fact about.
 * @returns A promise resolving to the fact string.
 */
export const generateDurationFact = async (seconds: number): Promise<string> => {
  try {
    const prompt = `
      Tell me a brief, interesting, scientific, or fun fact related to the duration of exactly ${seconds} seconds.
      If it's a short duration, compare it to something fast (e.g., animal speed, light travel).
      If it's longer, compare it to a historical event or daily activity.
      Keep it under 2 sentences. Fun and engaging tone.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for simple tasks to reduce latency
        temperature: 0.9,
      }
    });

    return response.text || "Time is relative, but that was exactly " + seconds + " seconds.";
  } catch (error) {
    console.error("Error generating fact:", error);
    return "Could not generate a time fact at this moment. But great timing!";
  }
};
