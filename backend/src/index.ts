import app from "./app";
import { prisma } from "./config/prisma";
import { redisPublisher } from "./config/redisPublisher";
import { redisClient } from "./config/redisQueue";

async function startServer() {
  try {
    await prisma.$connect();

    console.log("✅ Database connected");
    
    await redisClient.connect();

    console.log("✅ Connected to Redis");

    await redisPublisher.connect();

    console.log("✅ Connected to Redis PubSub");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();