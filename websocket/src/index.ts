import { WebSocketServer } from "ws";
import connectionManager from "./websocket/connectionManager";

const PORT = Number(process.env.PORT);

const wss = new WebSocketServer({
  port: PORT,
});

wss.on("connection", (socket) => {
  console.log("✅ A client connected!");

  socket.send("Welcome to the Online Compiler WebSocket Server!");

  socket.on("message", (message) => {
    const data = JSON.parse(message.toString());
    console.log("Received:", data);

    if (data.type === "AUTH") {
      connectionManager.addConnection(data.userId, socket);
    }
  });

  socket.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

console.log(`WebSocket Server running on ws://localhost:${PORT}`);
