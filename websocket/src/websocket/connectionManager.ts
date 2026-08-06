import { WebSocket } from "ws";

class ConnectionManager {
  private connections = new Map<string, WebSocket>();

  public async addConnection(userId : string , socket : WebSocket){
     this.connections.set(userId , socket);
     console.log(`User ${userId} connected`);
  }

  public getConnection(userId: string) {
    return this.connections.get(userId);
  }

  public removeConnection(userId: string) {
    this.connections.delete(userId);
    console.log(`User ${userId} disconnected`);
  }
}

export default new ConnectionManager();