// HacxGPT AI Client using OpenRouter/DeepSeek API
// Based on HacxGPT by BlackTechX - https://github.com/BlackTechX011/Hacx-GPT

import OpenAI from "openai";
import { HACXGPT_SYSTEM_PROMPT } from "@shared/schema";

const PROVIDERS = {
  openrouter: {
    baseURL: "https://openrouter.ai/api/v1",
    model: "deepseek/deepseek-chat-v3-0324:free",
  },
  deepseek: {
    baseURL: "https://api.deepseek.com",
    model: "deepseek-chat",
  },
};

// Default to openrouter
const provider = PROVIDERS.openrouter;

export class HacxGPTClient {
  private client: OpenAI;
  private conversationHistory: Map<string, Array<{ role: string; content: string }>>;

  constructor() {
    const apiKey = process.env.HACXGPT_API_KEY || "";
    
    this.client = new OpenAI({
      apiKey,
      baseURL: provider.baseURL,
      defaultHeaders: {
        "HTTP-Referer": "https://replit.com/@milesai",
        "X-Title": "MilesAI-HacxGPT",
      },
    });

    this.conversationHistory = new Map();
  }

  initializeConversation(userId: string) {
    if (!this.conversationHistory.has(userId)) {
      this.conversationHistory.set(userId, [
        { role: "system", content: HACXGPT_SYSTEM_PROMPT },
      ]);
    }
  }

  async *streamResponse(userId: string, userMessage: string) {
    this.initializeConversation(userId);
    
    const history = this.conversationHistory.get(userId)!;
    history.push({ role: "user", content: userMessage });

    try {
      const stream = await this.client.chat.completions.create({
        model: provider.model,
        messages: history as any,
        stream: true,
        temperature: 0.7,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          yield content;
        }
      }

      if (fullResponse) {
        history.push({ role: "assistant", content: fullResponse });
      }
    } catch (error) {
      console.error("HacxGPT API Error:", error);
      throw new Error("Failed to get response from HacxGPT");
    }
  }

  clearHistory(userId: string) {
    this.conversationHistory.set(userId, [
      { role: "system", content: HACXGPT_SYSTEM_PROMPT },
    ]);
  }

  getHistory(userId: string) {
    return this.conversationHistory.get(userId) || [];
  }
}

export const hacxgptClient = new HacxGPTClient();
