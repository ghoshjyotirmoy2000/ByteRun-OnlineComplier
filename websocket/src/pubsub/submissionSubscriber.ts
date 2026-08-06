import { redisSubscriber } from "../config/redis";
import connectionManager from "../websocket/connectionManager";

export async function startSubmissionResultSubscriber() {
  await redisSubscriber.connect();

  await redisSubscriber.subscribe("submission.completed", (message) => {
    const { submission } = JSON.parse(message);
    const socket = connectionManager.getConnection(submission.userId);

    if (!socket) return;

    socket.send(
      JSON.stringify({
        type: "SUBMISSION_RESULT",
        submission,
      }),
    );
  });

  console.log("✅ Subscribed to submission.completed");
}
