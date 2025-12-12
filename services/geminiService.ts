import { GoogleGenAI, Type } from "@google/genai";

// Initialize the API client
// Note: In a real environment, ensure process.env.API_KEY is populated.
// We are using the pattern requested: new GoogleGenAI({ apiKey: process.env.API_KEY })
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateCourseOutline = async (topic: string, durationWeeks: number): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a structured course outline for a coaching course about "${topic}". The course should be ${durationWeeks} weeks long. Return a JSON object with a list of weeks, each having a title and a brief overview.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weeks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  weekNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  overview: { type: Type.STRING },
                },
                required: ["weekNumber", "title", "overview"]
              }
            }
          }
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback mock data if API fails or key is missing
    return {
      weeks: Array.from({ length: durationWeeks }, (_, i) => ({
        weekNumber: i + 1,
        title: `Week ${i + 1}: Foundations of ${topic}`,
        overview: "An introduction to the core concepts and setting goals for the journey ahead."
      }))
    };
  }
};

export const generateTaskDescription = async (taskTitle: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a friendly, encouraging description for a coaching task titled "${taskTitle}". Context of the course: ${context}. Keep it under 50 words.`,
    });
    return response.text || "Complete this task to move forward in your journey.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Please reflect on the topic above and complete the assigned activity.";
  }
};
