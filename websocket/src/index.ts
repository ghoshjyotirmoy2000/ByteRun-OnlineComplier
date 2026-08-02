import { WebSocketServer } from "ws";
import connectionManager from "./websocket/connectionManager";
import { redisSubscriber } from "./config/redis";

const PORT = Number(process.env.PORT);

const wss = new WebSocketServer({
  port: PORT,
});

wss.on("connection", (socket) => {
  console.log("✅ A client connected!");

  let authedUserId: string | undefined;

  socket.send("Welcome to the Online Compiler WebSocket Server!");

  socket.on("message", (message) => {
    const data = JSON.parse(message.toString());
    console.log("Received:", data);

    if (data.type === "AUTH") {
      authedUserId = data.userId;
      connectionManager.addConnection(data.userId, socket);
    }
  });

  socket.on("close", () => {
    console.log("❌ Client disconnected");
    if (authedUserId) {
      connectionManager.removeConnection(authedUserId);
    }
  });
});

console.log(`WebSocket Server running on ws://localhost:${PORT}`);

async function startSubmissionResultSubscriber() {
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

startSubmissionResultSubscriber();
