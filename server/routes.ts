import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { hacxgptClient } from "./ai/hacxgpt";
import { geminiClient } from "./ai/gemini";
import type { AIMode } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time chat streaming
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    ws.on('message', async (data: Buffer) => {
      try {
        const payload = JSON.parse(data.toString());
        const { type, message, mode } = payload;

        if (type === 'chat_message') {
          const userId = "user"; // In production, get from auth
          const aiMode: AIMode = mode || "therapy";

          // Save user message
          await storage.createMessage(userId, {
            userId,
            role: "user",
            content: message,
            model: aiMode === "therapy" ? "gemini" : "hacxgpt",
            mode: aiMode,
          });

          // Stream AI response
          const aiClient = aiMode === "therapy" ? geminiClient : hacxgptClient;
          let fullResponse = "";

          try {
            for await (const chunk of aiClient.streamResponse(userId, message)) {
              fullResponse += chunk;
              
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                  type: "stream_chunk",
                  content: chunk,
                }));
              }
            }

            // Save AI response
            const savedMessage = await storage.createMessage(userId, {
              userId,
              role: "assistant",
              content: fullResponse,
              model: aiMode === "therapy" ? "gemini" : "hacxgpt",
              mode: aiMode,
            });

            // Update mood if in therapy mode
            if (aiMode === "therapy") {
              const context = {
                energyLevel: Math.floor(Math.random() * 5) + 5,
                stressLevel: Math.floor(Math.random() * 5) + 3,
                recentActivities: ["chatting with therapist"],
                moodIndicators: ["seeking support"],
              };

              await storage.createMoodEntry(userId, {
                userId,
                energyLevel: context.energyLevel,
                stressLevel: context.stressLevel,
                primaryEmotion: "Engaged",
                context,
              });
            }

            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: "stream_complete",
                fullContent: fullResponse,
                messageId: savedMessage.id,
              }));
            }
          } catch (error: any) {
            console.error("AI streaming error:", error);
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: "error",
                error: error.message || "Failed to get AI response",
              }));
            }
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: "error",
            error: "Invalid message format",
          }));
        }
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // API Routes
  const userId = "user"; // In production, get from auth middleware

  // Profile routes
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile(userId);
      res.json(profile || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/profile", async (req, res) => {
    try {
      const profile = await storage.createOrUpdateProfile(userId, req.body);
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Opportunities routes
  app.get("/api/opportunities", async (req, res) => {
    try {
      const opportunities = await storage.getOpportunities(userId);
      res.json(opportunities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/opportunities", async (req, res) => {
    try {
      const opportunity = await storage.createOpportunity(userId, req.body);
      res.json(opportunity);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/opportunities/:id", async (req, res) => {
    try {
      const opportunity = await storage.updateOpportunity(req.params.id, req.body);
      res.json(opportunity);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  });

  // Therapy sessions routes
  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getSessions(userId);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    try {
      const session = await storage.createSession(userId, req.body);
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Mood tracking routes
  app.get("/api/mood/current", async (req, res) => {
    try {
      const mood = await storage.getCurrentMood(userId);
      res.json(mood || null);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/mood/history", async (req, res) => {
    try {
      const moods = await storage.getMoodEntries(userId);
      res.json(moods);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/mood", async (req, res) => {
    try {
      const mood = await storage.createMoodEntry(userId, req.body);
      res.json(mood);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats(userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Chat messages routes
  app.get("/api/messages", async (req, res) => {
    try {
      const mode = req.query.mode as string | undefined;
      const messages = await storage.getMessages(userId, mode);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
