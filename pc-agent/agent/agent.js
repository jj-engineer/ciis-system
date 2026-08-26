/**
 * ====================================================================
 * CIIS School Computer Lab Agent — Node.js Worker
 * ====================================================================
 * Non-intrusive online/offline presence detection & heartbeat reporting.
 * Automatically loads C:\SchoolLabAgent\config.json
 * ====================================================================
 */

import { WebSocket } from 'ws';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Search config in standard C:\SchoolLabAgent\config.json or local dir
const defaultSystemPath = 'C:\\SchoolLabAgent\\config.json';
const localPath = path.resolve(__dirname, 'config.json');

let configPath = fs.existsSync(defaultSystemPath) ? defaultSystemPath : localPath;

let config = {
  serverIp: '192.168.0.107',
  serverPort: 4001,
  websocketUrl: 'ws://192.168.0.107:4001/ws/agent',
  laptopNumber: '01',
  deviceId: 'device_01',
  deviceToken: 'token_01',
  agentVersion: '1.0.0',
  heartbeatIntervalMs: 5000
};

if (fs.existsSync(configPath)) {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    config = { ...config, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('[Config Error]', e.message);
  }
}

const serverTarget = config.websocketUrl || `ws://${config.serverIp || '192.168.0.107'}:${config.serverPort || 4001}/ws/agent`;

console.log(`
=========================================================
  CIIS SCHOOL PC AGENT v${config.agentVersion} (Node Runtime)
=========================================================
  * Laptop Number: ${config.laptopNumber}
  * Device ID:     ${config.deviceId}
  * Server Target: ${serverTarget}
  * Heartbeat:     ${config.heartbeatIntervalMs / 1000}s
=========================================================
`);

let ws = null;
let heartbeatTimer = null;
let reconnectTimer = null;

function connect() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  console.log(`[${new Date().toLocaleTimeString()}] Connecting to ${serverTarget}...`);

  try {
    ws = new WebSocket(serverTarget);

    ws.on('open', () => {
      console.log(`[${new Date().toLocaleTimeString()}] Connected! Authenticating Laptop ${config.laptopNumber}...`);

      // 1. Send Authentication Handshake
      ws.send(
        JSON.stringify({
          type: 'auth',
          computerNumber: config.laptopNumber,
          laptopNumber: config.laptopNumber,
          deviceId: config.deviceId,
          agentToken: config.deviceToken,
          deviceToken: config.deviceToken,
          hostname: os.hostname(),
          agentVersion: config.agentVersion
        })
      );

      // 2. Start Periodic Heartbeat
      startHeartbeat();
    });

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'auth_success') {
          console.log(`[${new Date().toLocaleTimeString()}] Authenticated! Status: ONLINE`);
        } else if (msg.type === 'heartbeat_ack') {
          // Acknowledged
        }
      } catch (err) {}
    });

    ws.on('close', () => {
      stopHeartbeat();
      console.log(`[${new Date().toLocaleTimeString()}] Disconnected. Reconnecting in 5s...`);
      scheduleReconnect();
    });

    ws.on('error', (err) => {
      console.warn(`[${new Date().toLocaleTimeString()}] Connection error: ${err.message}`);
    });
  } catch (e) {
    scheduleReconnect();
  }
}

function startHeartbeat() {
  stopHeartbeat();
  sendHeartbeat();
  heartbeatTimer = setInterval(sendHeartbeat, config.heartbeatIntervalMs || 5000);
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

function sendHeartbeat() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    const payload = {
      type: 'heartbeat',
      computerNumber: config.laptopNumber,
      laptopNumber: config.laptopNumber,
      deviceId: config.deviceId,
      status: 'online',
      timestamp: new Date().toISOString()
    };
    ws.send(JSON.stringify(payload));
  }
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, 5000);
}

// Start Agent Lifecycle
connect();
