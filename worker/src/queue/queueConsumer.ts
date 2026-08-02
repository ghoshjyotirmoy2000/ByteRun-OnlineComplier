import { reportSubmissionResult } from "../api/submissionResult";
import { redisClient } from "../config/redis";
import { runCode } from "../runners";
import type { SubmissionJob } from "../types";

const QUEUE_KEY = "problems";
const POLL_INTERVAL_MS = 1000;

let isShuttingDown = false;

export const requestShutdown = () => {
  isShuttingDown = true;
};

export const startQueueConsumer = async () => {
  await redisClient.connect();

  console.log("Redis Connected...");
  console.log("Queue consumer started...");

  while (!isShuttingDown) {
    try {
      const response = await redisClient.rPop(QUEUE_KEY);

      if (!response) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        continue;
      }

      let job: SubmissionJob;
      try {
        job = JSON.parse(response);
      } catch (parseErr) {
        console.error("Dropping malformed queue message:", response, parseErr);
        continue;
      }

      console.log("proceescing the code for user.... " + job.userId);

      const result = await runCode(job);

      console.log(result);
      await reportSubmissionResult(job.submissionId, result);
    } catch (err) {
      console.error("Queue consumer error:", err);
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
  }

  console.log("Queue consumer stopped....");
  await redisClient.disconnect();
  console.log("Redis Disconnected");
};
