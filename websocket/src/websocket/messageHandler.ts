import type { RawData, WebSocket } from "ws";
import connectionManager from "./connectionManager";

/**
 * Parses an incoming socket message and applies its side effects.
 * Returns the userId if this message authenticated the connection.
 */
export function handleMessage(
  socket: WebSocket,
  raw: RawData,
): string | undefined {
  let data: any;
  try {
    data = JSON.parse(raw.toString());
  } catch {
    console.error("Received non-JSON message:", raw.toString());
    return undefined;
  }

  console.log("Received:", data);

  if (data.type === "AUTH") {
    connectionManager.addConnection(data.userId, socket);
    return data.userId;
  }

  return undefined;
}
