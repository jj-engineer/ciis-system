/**
 * Heartbeat Telemetry Broadcaster for Windows School Lab Agent
 */

import os from 'os';

export class HeartbeatSender {
  constructor(socket, config, commandHandler) {
    this.socket = socket;
    this.config = config;
    this.commandHandler = commandHandler;
    this.timer = null;
  }

  start() {
    this.stop();
    this.sendHeartbeat();
    this.timer = setInterval(() => {
      this.sendHeartbeat();
    }, this.config.heartbeatIntervalMs || 5000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  sendHeartbeat() {
    if (!this.socket || this.socket.readyState !== 1) return; // 1 = OPEN

    const payload = {
      type: 'HEARTBEAT',
      computerCode: this.config.computerCode,
      hostname: os.hostname(),
      agentVersion: this.config.agentVersion,
      labGroup: this.config.labGroup,
      isLocked: this.commandHandler.isLocked,
      currentApp: this.commandHandler.currentApp,
      timestamp: Date.now()
    };

    try {
      this.socket.send(JSON.stringify(payload));
    } catch (e) {
      console.warn('[Heartbeat Error]', e);
    }
  }
}
