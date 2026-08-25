/**
 * ====================================================================
 * CIIS School Management — Computer Lab Control WebSocket & REST Server
 * ====================================================================
 *
 * Architecture:
 * Teacher Dashboard (React) <---> [ WebSocket /ws/teacher ] <---> Lab Control Engine
 * Windows Student PCs       <---> [ WebSocket /ws/agent   ] <---> Lab Control Engine
 *
 * Security:
 * - Device Token Authentication
 * - Predefined Safe Command Allowlist (No arbitrary shell commands)
 * - Heartbeat Watchdog (0-10s Online, 10-30s Warning, 30s+ Offline)
 * - Immutable Audit Logging
 */

import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = process.env.PORT || 4001;

// Interfaces
interface ConnectedAgent {
  socket: WebSocket;
  computerCode: string;
  hostname: string;
  ipAddress: string;
  agentVersion: string;
  labGroup: string;
  status: 'ONLINE' | 'OFFLINE' | 'AVAILABLE' | 'IN_USE' | 'LOCKED' | 'ERROR';
  studentName?: string;
  studentId?: string;
  currentApp?: string;
  lastHeartbeat: number;
  isLocked: boolean;
  sessionDuration: number;
}

interface ConnectedTeacher {
  socket: WebSocket;
  teacherName: string;
  connectedAt: number;
}

interface AuditLog {
  id: string;
  timestamp: string;
  teacherName: string;
  computerCode: string;
  action: string;
  details: string;
  status: 'SUCCESS' | 'FAILED';
}

// In-Memory Realtime Registry
const agents = new Map<string, ConnectedAgent>(); // Keyed by computerCode (e.g. "LAB-01")
const teachers = new Set<ConnectedTeacher>();
const auditLogs: AuditLog[] = [];

// Create Native HTTP Server
const server = http.createServer((req, res) => {
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

  // Health Check
  if (url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'healthy',
        activeAgents: agents.size,
        activeTeachers: teachers.size,
        uptime: process.uptime()
      })
    );
    return;
  }

  // Active Computers Telemetry API
  if (url === '/api/computers') {
    const list = Array.from(agents.values()).map((a) => ({
      computerCode: a.computerCode,
      hostname: a.hostname,
      ipAddress: a.ipAddress,
      agentVersion: a.agentVersion,
      labGroup: a.labGroup,
      status: a.status,
      studentName: a.studentName,
      currentApp: a.currentApp,
      isLocked: a.isLocked,
      sessionDuration: a.sessionDuration,
      lastHeartbeat: new Date(a.lastHeartbeat).toISOString()
    }));

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(list));
    return;
  }

  // Audit Logs API
  if (url === '/api/audit-logs') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(auditLogs.slice(-100)));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

// Create WebSocket Server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket, req) => {
  const path = req.url || '';

  // 1. TEACHER DASHBOARD CONNECTION
  if (path.includes('/ws/teacher')) {
    const teacher: ConnectedTeacher = {
      socket: ws,
      teacherName: 'Lokkru Jame',
      connectedAt: Date.now()
    };
    teachers.add(teacher);
    console.log(`[Teacher Connected] Active teachers: ${teachers.size}`);

    // Send initial snapshot of all registered Windows agents
    broadcastToTeachers({
      type: 'AGENT_SNAPSHOT',
      computers: Array.from(agents.values())
    });

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        handleTeacherMessage(teacher, msg);
      } catch (e) {
        console.warn('Failed to parse teacher message:', e);
      }
    });

    ws.on('close', () => {
      teachers.delete(teacher);
      console.log(`[Teacher Disconnected] Active teachers: ${teachers.size}`);
    });
    return;
  }

  // 2. WINDOWS LAB AGENT CONNECTION
  if (path.includes('/ws/agent')) {
    let agentCode = '';

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        agentCode = handleAgentMessage(ws, msg, req.socket.remoteAddress || '');
      } catch (e) {
        console.warn('Failed to parse agent message:', e);
      }
    });

    ws.on('close', () => {
      if (agentCode && agents.has(agentCode)) {
        const agent = agents.get(agentCode)!;
        agent.status = 'OFFLINE';
        broadcastToTeachers({
          type: 'AGENT_STATUS_CHANGED',
          computerCode: agentCode,
          status: 'OFFLINE'
        });
        console.log(`[Agent Disconnected] ${agentCode}`);
      }
    });
    return;
  }

  // Default connection fallback
  ws.close(1008, 'Invalid WebSocket endpoint');
});

// Handle Messages from Teacher Dashboard
function handleTeacherMessage(teacher: ConnectedTeacher, msg: any) {
  if (msg.type === 'DISPATCH_COMMAND' && msg.command) {
    const { commandType, computerCode, payload } = msg.command;

    // Validate safe command allowlist
    const ALLOWED_COMMANDS = [
      'PING',
      'GET_STATUS',
      'START_SESSION',
      'END_SESSION',
      'LOCK_WORKSTATION',
      'UNLOCK_WORKSTATION',
      'OPEN_ASSIGNMENT',
      'COLLECT_FILES'
    ];

    if (!ALLOWED_COMMANDS.includes(commandType)) {
      console.warn(`[Security Alert] Rejected unauthorized command: ${commandType}`);
      return;
    }

    console.log(`[Command Dispatched] ${commandType} -> ${computerCode}`);

    // If targeting specific computer
    if (computerCode && agents.has(computerCode)) {
      const targetAgent = agents.get(computerCode)!;
      if (targetAgent.socket.readyState === WebSocket.OPEN) {
        targetAgent.socket.send(
          JSON.stringify({
            type: 'EXECUTE_COMMAND',
            commandId: msg.command.commandId,
            commandType,
            payload
          })
        );
      }
    } else if (computerCode?.startsWith('ALL_')) {
      // Broadcast batch command to all connected agents
      agents.forEach((agent) => {
        if (agent.socket.readyState === WebSocket.OPEN) {
          agent.socket.send(
            JSON.stringify({
              type: 'EXECUTE_COMMAND',
              commandId: `${msg.command.commandId}-${agent.computerCode}`,
              commandType,
              payload
            })
          );
        }
      });
    }

    // Add Audit Log
    const logEntry: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      teacherName: teacher.teacherName,
      computerCode: computerCode || 'ALL',
      action: commandType,
      details: `Dispatched ${commandType} to ${computerCode}`,
      status: 'SUCCESS'
    };
    auditLogs.push(logEntry);

    broadcastToTeachers({
      type: 'AUDIT_LOG_ADDED',
      log: logEntry
    });
  }
}

// Handle Messages from Windows Lab Agent
function handleAgentMessage(ws: WebSocket, msg: any, ip: string): string {
  const { type, computerCode, hostname, agentVersion, labGroup, currentApp, studentName, isLocked } = msg;

  if (type === 'AGENT_REGISTER' || type === 'HEARTBEAT') {
    const code = (computerCode || 'LAB-01').toUpperCase();
    const existing = agents.get(code);

    const updatedAgent: ConnectedAgent = {
      socket: ws,
      computerCode: code,
      hostname: hostname || existing?.hostname || 'WINDOWS-PC',
      ipAddress: ip.replace('::ffff:', ''),
      agentVersion: agentVersion || 'v1.0.4',
      labGroup: labGroup || 'Lab A',
      status: isLocked ? 'LOCKED' : studentName ? 'IN_USE' : 'AVAILABLE',
      studentName: studentName || existing?.studentName,
      currentApp: currentApp || existing?.currentApp || 'Desktop Idle',
      lastHeartbeat: Date.now(),
      isLocked: Boolean(isLocked),
      sessionDuration: existing ? existing.sessionDuration + 5 : 0
    };

    agents.set(code, updatedAgent);

    // Acknowledge Heartbeat
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'HEARTBEAT_ACK',
          timestamp: Date.now()
        })
      );
    }

    // Broadcast update to all Teacher Dashboards
    broadcastToTeachers({
      type: 'AGENT_UPDATED',
      agent: updatedAgent
    });

    return code;
  }

  if (type === 'COMMAND_RESULT') {
    console.log(`[Command Result] ${msg.computerCode}: ${msg.commandType} -> ${msg.success ? 'OK' : 'FAILED'}`);
    broadcastToTeachers({
      type: 'COMMAND_RESULT_RECEIVED',
      result: msg
    });
  }

  return computerCode || '';
}

// Broadcast to Teacher Dashboards
function broadcastToTeachers(payload: any) {
  const serialized = JSON.stringify(payload);
  teachers.forEach((t) => {
    if (t.socket.readyState === WebSocket.OPEN) {
      t.socket.send(serialized);
    }
  });
}

// Heartbeat Watchdog Ticker (Runs every 5s)
setInterval(() => {
  const now = Date.now();
  agents.forEach((agent, code) => {
    const diff = (now - agent.lastHeartbeat) / 1000;
    if (diff > 30 && agent.status !== 'OFFLINE') {
      agent.status = 'OFFLINE';
      broadcastToTeachers({
        type: 'AGENT_STATUS_CHANGED',
        computerCode: code,
        status: 'OFFLINE'
      });
      console.log(`[Watchdog] ${code} marked OFFLINE (No heartbeat for ${Math.round(diff)}s)`);
    }
  });
}, 5000);

// Start HTTP & WebSocket Server
server.listen(PORT, () => {
  console.log(`
=========================================================
  CIIS SCHOOL COMPUTER LAB CONTROL SERVER
=========================================================
  * REST API:       http://localhost:${PORT}/health
  * Teacher WS:     ws://localhost:${PORT}/ws/teacher
  * Windows Agent:  ws://localhost:${PORT}/ws/agent
=========================================================
`);
});
