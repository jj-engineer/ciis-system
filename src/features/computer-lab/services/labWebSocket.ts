// ====================================================================
// Client-Side WebSocket Client for Computer Lab Control System
// ====================================================================

import { LabCommand, LabCommandType } from '../types/lab';

type MessageHandler = (data: any) => void;

class LabWebSocketClient {
  private socket: WebSocket | null = null;
  private reconnectInterval: number = 5000;
  private reconnectTimer: any = null;
  private isExplicitlyClosed: boolean = false;
  private listeners: Map<string, Set<MessageHandler>> = new Map();
  private connectionStatusListeners: Set<(connected: boolean) => void> = new Set();
  public isConnected: boolean = false;

  private getWsUrl(): string {
    if (typeof window !== 'undefined' && window.location) {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.')) {
        return `ws://${host}:4001/ws/teacher`;
      }
      return 'ws://192.168.0.107:4001/ws/teacher';
    }
    return 'ws://192.168.0.107:4001/ws/teacher';
  }

  constructor() {
    // Lazy connect when mounted in teacher dashboard
  }

  public connect(customUrl?: string): void {
    const targetUrl = customUrl || this.getWsUrl();
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isExplicitlyClosed = false;

    try {
      this.socket = new WebSocket(targetUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.notifyStatus(true);
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }

        // Send teacher authentication handshake
        this.send({
          type: 'TEACHER_AUTH',
          client: 'CIIS_TEACHER_DASHBOARD',
          timestamp: new Date().toISOString()
        });
      };

      this.socket.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          this.dispatch(parsed.type || 'message', parsed);
        } catch (e) {
          console.warn('Failed to parse WebSocket message:', event.data);
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.notifyStatus(false);
        if (!this.isExplicitlyClosed) {
          this.scheduleReconnect();
        }
      };

      this.socket.onerror = () => {
        this.isConnected = false;
        this.notifyStatus(false);
        // Error will trigger onclose which handles reconnect
      };
    } catch (e) {
      this.isConnected = false;
      this.notifyStatus(false);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer || this.isExplicitlyClosed) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.reconnectInterval);
  }

  public disconnect(): void {
    this.isExplicitlyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.notifyStatus(false);
  }

  public send(payload: any): boolean {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(payload));
      return true;
    }
    return false;
  }

  public sendCommand(
    commandType: LabCommandType,
    computerId: string,
    computerCode: string,
    payload?: any
  ): LabCommand {
    const commandId = `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const commandObj: LabCommand = {
      commandId,
      teacherId: 'teacher-current',
      computerId,
      computerCode,
      commandType,
      payload,
      status: this.isConnected ? 'sent' : 'pending',
      dispatchedAt: new Date().toISOString()
    };

    const sent = this.send({
      type: 'DISPATCH_COMMAND',
      command: commandObj
    });

    if (!sent) {
      // Local fallback in demo mode
      commandObj.status = 'acknowledged';
    }

    return commandObj;
  }

  public on(eventType: string, handler: MessageHandler): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(handler);

    return () => {
      this.listeners.get(eventType)?.delete(handler);
    };
  }

  public onStatusChange(handler: (connected: boolean) => void): () => void {
    this.connectionStatusListeners.add(handler);
    handler(this.isConnected);
    return () => {
      this.connectionStatusListeners.delete(handler);
    };
  }

  private dispatch(eventType: string, data: any): void {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.forEach(h => {
        try {
          h(data);
        } catch (err) {
          console.error(`Error in WebSocket handler for ${eventType}:`, err);
        }
      });
    }
  }

  private notifyStatus(connected: boolean): void {
    this.connectionStatusListeners.forEach(h => h(connected));
  }
}

export const labWsClient = new LabWebSocketClient();
