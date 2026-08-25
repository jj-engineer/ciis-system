/**
 * Secure WebSocket Client for Windows School Lab Agent
 * Manages auto-reconnect, authentication handshake, and command reception
 */

import { WebSocket } from 'ws';
import os from 'os';

export class AgentWebSocketClient {
  constructor(config, commandHandler) {
    this.config = config;
    this.commandHandler = commandHandler;
    this.socket = null;
    this.reconnectTimer = null;
    this.onHeartbeatReady = null;
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    console.log(`[Connecting to Server] ${this.config.serverUrl}...`);

    try {
      this.socket = new WebSocket(this.config.serverUrl);

      this.socket.on('open', () => {
        console.log(`[Connected] Authenticating ${this.config.computerCode}...`);

        // Send Device Registration
        this.socket.send(
          JSON.stringify({
            type: 'AGENT_REGISTER',
            computerCode: this.config.computerCode,
            hostname: os.hostname(),
            token: this.config.agentToken,
            agentVersion: this.config.agentVersion,
            labGroup: this.config.labGroup,
            isLocked: this.commandHandler.isLocked,
            currentApp: this.commandHandler.currentApp
          })
        );

        if (this.onHeartbeatReady) {
          this.onHeartbeatReady(this.socket);
        }
      });

      this.socket.on('message', async (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          if (msg.type === 'EXECUTE_COMMAND') {
            const result = await this.commandHandler.execute(msg.commandType, msg.payload);
            this.socket.send(
              JSON.stringify({
                type: 'COMMAND_RESULT',
                commandId: msg.commandId,
                commandType: msg.commandType,
                computerCode: this.config.computerCode,
                success: result.success,
                data: result
              })
            );
          }
        } catch (err) {
          console.warn('[Command Processing Error]', err);
        }
      });

      this.socket.on('close', () => {
        console.log('[Disconnected] Reconnecting in 5s...');
        this.scheduleReconnect();
      });

      this.socket.on('error', (err) => {
        console.warn('[WebSocket Error]', err.message);
      });
    } catch (e) {
      this.scheduleReconnect();
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 5000);
  }
}
