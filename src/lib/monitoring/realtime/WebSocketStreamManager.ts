import type { StreamManager, WebSocketConfig } from '../core/types';

export class WebSocketStreamManager implements StreamManager {
  private isRunning = false;
  private connections: WebSocket[] = [];

  constructor(_config: WebSocketConfig) {
    // TODO: Use config for WebSocket configuration
  }

  async start(): Promise<void> {
    this.isRunning = true;
  }

  async stop(): Promise<void> {
    this.isRunning = false;
  }

  addConnection(connection: WebSocket): void {
    this.connections.push(connection);
  }

  removeConnection(connection: WebSocket): void {
    const index = this.connections.indexOf(connection);
    if (index > -1) {
      this.connections.splice(index, 1);
    }
  }

  broadcast(data: unknown): void {
    // Broadcast data to all connected clients
    this.connections.forEach(connection => {
      if (connection.readyState === WebSocket.OPEN) {
        connection.send(JSON.stringify(data));
      }
    });
  }

  getConnectionCount(): number {
    return this.connections.length;
  }

  isActive(): boolean {
    return this.isRunning;
  }
}
