import { WebSocketServer } from "ws";
import connectionManager from "./connectionManager";
import { handleMessage } from "./messageHandler";

export function createWebSocketServer(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (socket) => {
    console.log("A client connected!");

    let authedUserId: string | undefined;

    socket.send("Welcome to the Online Compiler WebSocket Server!");

    socket.on("message", (message) => {
      const userId = handleMessage(socket, message);
      if (userId) authedUserId = userId;
    });

    socket.on("close", () => {
      console.log("❌ Client disconnected");
      if (authedUserId) {
        connectionManager.removeConnection(authedUserId);
      }
    });
  });

  console.log(`WebSocket Server running on ws://localhost:${port}`);

  return wss;
}
