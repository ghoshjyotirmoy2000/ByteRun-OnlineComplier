import { WebSocket } from "ws";

class ConnectionManager {
  private connections = new Map<string, WebSocket>();

  public async addConnection(userId : string , socket : WebSocket){
     this.connections.set(userId , socket);
     console.log(`User ${userId} connected`);
  }

  
}

export default new ConnectionManager();