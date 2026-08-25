/**
 * ====================================================================
 * CIIS School PC Agent Backend — Realtime Monitoring Server
 * ====================================================================
 *
 * REST API:
 * - GET  /health
 * - GET  /api/computers
 * - POST /api/generate-token  { computerNumber }
 * - POST /api/register-agent  { computerNumber, token, hostname }
 * - POST /api/revoke-agent    { computerNumber }
 *
 * WebSockets:
 * - ws://localhost:4001/ws/agent    (Windows Student Laptops)
 * - ws://localhost:4001/ws/teacher  (Teacher Computer Lab Dashboard)
 */

import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { ComputerDatabase } from './database.js';
import { startWatchdog } from './watchdog.js';

const PORT = process.env.PORT || 4001;

// Active WebSocket Connections
const activeAgentSockets = new Map(); // computerNumber -> WebSocket
const activeTeacherSockets = new Set(); // WebSocket clients

// Helper: Broadcast to all active teacher dashboards
export function broadcastToTeachers(payload) {
  const data = JSON.stringify(payload);
  for (const ws of activeTeacherSockets) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  }
}

// Helper: Parse JSON Body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url || '';

  // 1. Health Check
  if (url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'healthy',
        activeLaptops: activeAgentSockets.size,
        activeTeachers: activeTeacherSockets.size,
        uptimeSeconds: Math.round(process.uptime())
      })
    );
    return;
  }

  // 2. Get All 30 Computers Telemetry
  if (url === '/api/computers' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(ComputerDatabase.getAll()));
    return;
  }

  // 3. Generate One-Time Registration Token
  if (url === '/api/generate-token' && req.method === 'POST') {
    const body = await parseBody(req);
    const { computerNumber } = body;

    if (!computerNumber) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'computerNumber is required (e.g. "01")' }));
      return;
    }

    const result = ComputerDatabase.generateRegistrationToken(computerNumber);
    console.log(`[Token Generated] Computer ${computerNumber}: Token ${result.token}`);

    broadcastToTeachers({
      type: 'TOKEN_GENERATED',
      computerNumber,
      token: result.token,
      expiresAt: result.expiresAt
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, ...result }));
    return;
  }

  // 4. Register Agent via Token (REST Handshake before WS connection)
  if (url === '/api/register-agent' && req.method === 'POST') {
    const body = await parseBody(req);
    const { computerNumber, token, hostname } = body;
    const ip = (req.socket.remoteAddress || '').replace('::ffff:', '');

    const result = ComputerDatabase.registerAgentWithToken(token, computerNumber, hostname, ip);

    if (result.success) {
      console.log(`[Agent Registered] Computer ${computerNumber} (${hostname}) registered successfully`);
      broadcastToTeachers({
        type: 'AGENT_REGISTERED',
        computer: ComputerDatabase.getByNumber(computerNumber)
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
    return;
  }

  // 5. Revoke Agent
  if (url === '/api/revoke-agent' && req.method === 'POST') {
    const body = await parseBody(req);
    const { computerNumber } = body;

    const success = ComputerDatabase.revokeAgent(computerNumber);
    if (success) {
      // Disconnect active socket if currently connected
      const ws = activeAgentSockets.get(String(computerNumber).padStart(2, '0'));
      if (ws) {
        ws.close(4003, 'Agent Revoked by Administrator');
        activeAgentSockets.delete(String(computerNumber).padStart(2, '0'));
      }

      broadcastToTeachers({
        type: 'AGENT_REVOKED',
        computerNumber
      });

      console.log(`[Agent Revoked] Computer ${computerNumber} revoked by admin`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: `Computer ${computerNumber} revoked.` }));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Computer ${computerNumber} not found.` }));
    }
    return;
  }

  // Not Found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

// Create WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const path = req.url || '';
  const ip = (req.socket.remoteAddress || '').replace('::ffff:', '');

  // 1. TEACHER DASHBOARD STREAM (/ws/teacher)
  if (path.includes('/ws/teacher')) {
    activeTeacherSockets.add(ws);
    console.log(`[Teacher WS Connected] Total active dashboards: ${activeTeacherSockets.size}`);

    // Send initial snapshot of all 30 computers
    ws.send(
      JSON.stringify({
        type: 'INITIAL_SNAPSHOT',
        computers: ComputerDatabase.getAll()
      })
    );

    ws.on('close', () => {
      activeTeacherSockets.delete(ws);
      console.log(`[Teacher WS Disconnected] Active: ${activeTeacherSockets.size}`);
    });
    return;
  }

  // 2. WINDOWS PC AGENT STREAM (/ws/agent)
  if (path.includes('/ws/agent')) {
    let boundComputerNumber = '';

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        // A. Agent Authentication Handshake
        if (msg.type === 'auth') {
          const { computerNumber, agentToken, hostname, agentVersion } = msg;
          const num = String(computerNumber).padStart(2, '0');
          const comp = ComputerDatabase.getByNumber(num);

          if (!comp || comp.status === 'REVOKED') {
            ws.send(JSON.stringify({ type: 'auth_error', message: 'Unauthorized or Revoked Computer' }));
            ws.close(4001, 'Unauthorized');
            return;
          }

          boundComputerNumber = num;
          activeAgentSockets.set(num, ws);
          ComputerDatabase.updateHeartbeat(num, ip);

          console.log(`[Agent Authenticated] 💻 Computer ${num} (${hostname || 'Windows PC'}) connected`);

          ws.send(
            JSON.stringify({
              type: 'auth_success',
              computerNumber: num,
              status: 'ONLINE',
              serverTime: new Date().toISOString()
            })
          );

          // Broadcast ONLINE status to Teacher Dashboard
          broadcastToTeachers({
            type: 'COMPUTER_STATUS_CHANGED',
            computerNumber: num,
            status: 'ONLINE',
            lastSeen: new Date().toISOString()
          });
          return;
        }

        // B. Heartbeat Message (Every 5 seconds)
        if (msg.type === 'heartbeat') {
          const num = String(msg.computerNumber || boundComputerNumber).padStart(2, '0');
          const success = ComputerDatabase.updateHeartbeat(num, ip);

          if (success) {
            // Heartbeat Acknowledgement
            ws.send(
              JSON.stringify({
                type: 'heartbeat_ack',
                computerNumber: num,
                timestamp: new Date().toISOString()
              })
            );

            // Broadcast status tick to Teacher Dashboard
            broadcastToTeachers({
              type: 'COMPUTER_HEARTBEAT',
              computerNumber: num,
              lastSeen: new Date().toISOString()
            });
          }
          return;
        }
      } catch (err) {
        console.warn('[Agent Message Error]', err);
      }
    });

    ws.on('close', () => {
      if (boundComputerNumber) {
        activeAgentSockets.delete(boundComputerNumber);
        console.log(`[Agent Socket Closed] 💻 Computer ${boundComputerNumber}`);
      }
    });
    return;
  }

  // Fallback
  ws.close(1008, 'Invalid WebSocket path');
});

// Start Watchdog Service
startWatchdog((event) => {
  broadcastToTeachers(event);
});

// Start Listening
server.listen(PORT, () => {
  console.log(`
=========================================================
  CIIS SCHOOL PC AGENT MONITORING SERVER (MVP)
=========================================================
  * REST API:       http://localhost:${PORT}/health
  * Teacher WS:     ws://localhost:${PORT}/ws/teacher
  * Windows Agent:  ws://localhost:${PORT}/ws/agent
=========================================================
`);
});
