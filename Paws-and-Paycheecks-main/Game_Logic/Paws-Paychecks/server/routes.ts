import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameHistorySchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/player", async (req, res) => {
    const name = await storage.getPlayerName();
    res.json({ name });
  });

  app.post("/api/player", async (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name is required" });
    }
    await storage.setPlayerName(name);
    res.json({ success: true });
  });

  app.get("/api/history", async (req, res) => {
    const history = await storage.getGameHistory();
    res.json(history);
  });

  app.post("/api/history", async (req, res) => {
    const result = insertGameHistorySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }
    const history = await storage.addGameHistory(result.data);
    res.json(history);
  });

  return httpServer;
}
