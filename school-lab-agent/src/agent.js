/**
 * ====================================================================
 * CIIS Windows School Lab Agent — Main Service Entry Point
 * ====================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SafeCommandHandler } from './commands/handler.js';
import { AgentWebSocketClient } from './websocket/client.js';
import { HeartbeatSender } from './heartbeat/sender.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Configuration
const configPath = path.resolve(__dirname, '../config/agent.json');
let config = {
  serverUrl: 'ws://localhost:4001/ws/agent',
  computerCode: 'LAB-01',
  labGroup: 'Lab A',
  agentToken: 'ciis_agent_secret_token_lab01_v1',
  agentVersion: 'v1.0.4',
  heartbeatIntervalMs: 5000,
  assignmentsDirectory: 'C:\\SchoolLab\\Assignments'
};

if (fs.existsSync(configPath)) {
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    config = { ...config, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Using default configuration. Error loading agent.json:', e);
  }
}

console.log(`
=========================================================
  CIIS WINDOWS SCHOOL LAB AGENT (${config.agentVersion})
=========================================================
  * Computer Code: ${config.computerCode}
  * Lab Group:     ${config.labGroup}
  * Server Target: ${config.serverUrl}
  * Work Directory:${config.assignmentsDirectory}
=========================================================
`);

// Initialize Command Handler, WebSocket Client & Heartbeat Engine
const commandHandler = new SafeCommandHandler(config);
const wsClient = new AgentWebSocketClient(config, commandHandler);
let heartbeatSender = null;

wsClient.onHeartbeatReady = (socket) => {
  if (heartbeatSender) heartbeatSender.stop();
  heartbeatSender = new HeartbeatSender(socket, config, commandHandler);
  heartbeatSender.start();
};

// Start Agent Connection
wsClient.connect();
