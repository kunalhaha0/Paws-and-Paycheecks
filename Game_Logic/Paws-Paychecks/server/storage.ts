import { GameHistory, InsertGameHistory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getPlayerName(): Promise<string | null>;
  setPlayerName(name: string): Promise<void>;
  getGameHistory(): Promise<GameHistory[]>;
  addGameHistory(game: InsertGameHistory): Promise<GameHistory>;
}

export class MemStorage implements IStorage {
  private playerName: string | null = null;
  private gameHistory: GameHistory[] = [];

  async getPlayerName(): Promise<string | null> {
    return this.playerName;
  }

  async setPlayerName(name: string): Promise<void> {
    this.playerName = name;
  }

  async getGameHistory(): Promise<GameHistory[]> {
    return this.gameHistory;
  }

  async addGameHistory(game: InsertGameHistory): Promise<GameHistory> {
    const id = randomUUID();
    const history: GameHistory = { 
      ...game, 
      id,
      completedAt: new Date().toISOString()
    };
    this.gameHistory.push(history);
    return history;
  }
}

export const storage = new MemStorage();
