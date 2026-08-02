import { createClient } from "redis";

export const redisPublisher = createClient({
  url: process.env.REDIS_URL,
});

redisPublisher.on("error", (err) => {
  console.error("Redis Publisher Error:", err);
});
