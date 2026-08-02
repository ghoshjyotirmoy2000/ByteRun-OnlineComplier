import { requestShutdown, startQueueConsumer } from "./src/queue/queueConsumer";

const shutdown = (signal: string) => {
  console.log(`Received ${signal}, shutting down after current job...`);
  requestShutdown();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

startQueueConsumer();
