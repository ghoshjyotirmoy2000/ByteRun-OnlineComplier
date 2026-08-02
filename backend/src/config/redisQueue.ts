// redis server
import { createClient } from "redis";

export const redisQueue = createClient({
  url: process.env.REDIS_URL,
});

redisQueue.on("error", (err) => {
  console.error("Redis Client Error:", err);
});