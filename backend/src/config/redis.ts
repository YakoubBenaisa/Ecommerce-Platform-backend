// src/config/redis.ts
import { createClient } from "redis";
import { injectable, singleton } from "tsyringe";

@injectable()
@singleton()
export class RedisClient {
  private client;

  constructor() {
    this.client = createClient({
          url: "redis://localhost:6379"

    });
    this.client.connect();
    this.client.on("error", (err) => console.error("Redis Client Error", err));
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async setex(key: string, ttl: number, value: string): Promise<void> {
    await this.client.setEx(key, ttl, value);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}