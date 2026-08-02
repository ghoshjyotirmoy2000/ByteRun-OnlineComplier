import { createClient } from "redis";

export const redisSubscriber = createClient({
  url: process.env.REDIS_URL,
});

redisSubscriber.on("error", (err) => {
  console.error("Redis Subscriber Error:", err);
});
