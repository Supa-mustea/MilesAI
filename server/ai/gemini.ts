// Gemini AI Client for Therapy and Life Coaching
// Using the javascript_gemini blueprint integration

import { GoogleGenAI } from "@google/genai";
import { GEMINI_THERAPY_PROMPT } from "@shared/schema";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export class GeminiTherapistClient {
  private conversationHistory: Map<string, Array<{ role: string; content: string }>>;

  constructor() {
    this.conversationHistory = new Map();
  }

  initializeConversation(userId: string) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, [
        { role: "system", content: GEMINI_THERAPY_PROMPT },
      ]);
    }
  }

  async *streamResponse(userId: string, userMessage: string) {
    this.initializeConversation(userId);
    
    const history = this.conversationHistory.get(userId)!;
    
    // Build conversation history for Gemini
    const contents: any[] = [];
    for (let i = 1; i < history.length; i++) { // Skip system message
      const msg = history[i];
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    try {
      const response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash-exp",
        config: {
          systemInstruction: GEMINI_THERAPY_PROMPT,
          temperature: 0.8,
          topP: 0.95,
        },
        contents: contents,
      });

      let fullResponse = "";

      for await (const chunk of response.stream) {
        const chunkText = chunk.text || "";
        if (chunkText) {
          fullResponse += chunkText;
          yield chunkText;
        }
      }

      if (fullResponse) {
        history.push({ role: "user", content: userMessage });
        history.push({ role: "assistant", content: fullResponse });
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to get response from Gemini therapist");
    }
  }

  clearHistory(userId: string) {
    this.conversationHistory.set(userId, [
      { role: "system", content: GEMINI_THERAPY_PROMPT },
    ]);
  }

  getHistory(userId: string) {
    return this.conversationHistory.get(userId) || [];
  }

  async analyzeEmotionalState(context: any): Promise<any> {
    try {
      const prompt = `Analyze the following user context and provide emotional insights:
      
Energy Level: ${context.energyLevel}/10
Stress Level: ${context.stressLevel}/10
Recent Activities: ${JSON.stringify(context.recentActivities || [])}
Mood Indicators: ${JSON.stringify(context.moodIndicators || [])}

Provide a JSON response with:
- primaryEmotion: string (the main emotion detected)
- underlyingCauses: string[] (list of 3-5 root causes)
- therapeuticApproach: string (recommended therapy approach)
- immediateInterventions: string[] (list of 3-5 actionable interventions)

Response must be valid JSON only.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        config: {
          responseMimeType: "application/json",
        },
        contents: prompt,
      });

      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Emotional analysis error:", error);
      return {
        primaryEmotion: "Neutral",
        underlyingCauses: ["Unable to analyze at this time"],
        therapeuticApproach: "Supportive listening",
        immediateInterventions: ["Take deep breaths", "Stay present"],
      };
    }
  }
}

export const geminiClient = new GeminiTherapistClient();
