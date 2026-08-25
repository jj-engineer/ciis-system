/**
 * ====================================================================
 * CIIS School PC Agent MVP — Windows Online/Offline Monitor
 * ====================================================================
 *
 * Scope: Strictly non-invasive presence detection & heartbeat reporting.
 * Students use Word, Excel, and their laptops completely normally.
 */

import { WebSocket } from 'ws';
import os from 'os';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Local Configuration
const configPath = path.resolve(__dirname, 'config.json');
let config = {
  serverUrl: 'ws://localhost:4001/ws/agent',
  computerNumber: '01',
  agentToken: 'token-01-auth',
  agentVersion: '0.1.0',
  heartbeatIntervalMs: 5000
};

if (fs.existsSync(configPath)) {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    config = { ...config, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('[Config] Using default configuration:', e.message);
  }
}

console.log(`
=========================================================
  CIIS SCHOOL PC AGENT MVP (v${config.agentVersion})
=========================================================
  * Computer Number: ${config.computerNumber}
  * Server Target:   ${config.serverUrl}
  * Heartbeat Rate:  ${config.heartbeatIntervalMs / 1000}s
  * Scope:           Privacy-Respecting Online Monitor
=========================================================
`);

let ws = null;
let heartbeatTimer = null;
let reconnectDelaySec = 1;
const MAX_RECONNECT_SEC = 30;

function connect() {
  console.log(`[${new Date().toLocaleTimeString()}] Connecting to server...`);

  try {
    ws = new WebSocket(config.serverUrl);

    ws.on('open', () => {
      console.log(`[${new Date().toLocaleTimeString()}] Connected! Authenticating as Computer ${config.computerNumber}...`);
      reconnectDelaySec = 1;

      // 1. Send Authentication Handshake
      ws.send(
        JSON.stringify({
          type: 'auth',
          computerNumber: config.computerNumber,
          agentToken: config.agentToken,
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
          console.log(`[${new Date().toLocaleTimeString()}] ✅ Authenticated! Status: 🟢 ONLINE`);
        } else if (msg.type === 'heartbeat_ack') {
          // Heartbeat acknowledged by server
        }
      } catch {}
    });

    ws.on('close', (code, reason) => {
      stopHeartbeat();
      console.log(`[${new Date().toLocaleTimeString()}] Disconnected. Reconnecting in ${reconnectDelaySec}s...`);
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
      computerNumber: config.computerNumber,
      timestamp: new Date().toISOString()
    };
    ws.send(JSON.stringify(payload));
    console.log(`[${new Date().toLocaleTimeString()}] 💓 Heartbeat sent (Laptop ${config.computerNumber})`);
  }
}

function scheduleReconnect() {
  setTimeout(() => {
    connect();
    reconnectDelaySec = Math.min(reconnectDelaySec * 2, MAX_RECONNECT_SEC);
  }, reconnectDelaySec * 1000);
}

// Start Agent Lifecycle
connect();
