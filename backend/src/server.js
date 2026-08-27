/**
 * ====================================================================
 * CIIS School PC Agent Backend — Realtime Monitoring & Registration Server
 * ====================================================================
 * Fixed Server: 192.168.0.114:4001
 *
 * REST API:
 * - GET  /health
 * - GET  /install.ps1       (One-command PowerShell installer)
 * - GET  /install.bat       (CMD batch launcher)
 * - GET  /uninstall.ps1     (PowerShell uninstaller)
 * - GET  /agent.ps1         (PowerShell native background agent)
 * - GET  /agent.js          (Node.js agent)
 * - GET  /api/agents/bundle (JSON bundle containing all agent scripts)
 * - GET  /api/agents/check  { laptopNumber }
 * - POST /api/agents/register (Registration with pairing token)
 * - POST /api/generate-token { laptopNumber }
 * - POST /api/revoke-agent   { laptopNumber }
 * - GET  /api/computers     (All 30 laptops telemetry)
 *
 * WebSockets:
 * - ws://192.168.0.114:4001/ws/agent    (Windows Student Laptops)
 * - ws://192.168.0.114:4001/ws/teacher  (Teacher Computer Lab Dashboard)
 * ====================================================================
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { ComputerDatabase } from './database.js';
import { startWatchdog } from './watchdog.js';
import { analyzeExcelImage } from './aiExcelService.js';
import { sendChatMessage } from './aiChatService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Automatic .env loader (workspace root and backend folder)
function loadEnv() {
  const envPaths = [
    path.resolve(__dirname, '../../.env'),
    path.resolve(__dirname, '../.env'),
    path.resolve(process.cwd(), '.env')
  ];
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      try {
        const lines = fs.readFileSync(p, 'utf8').split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            let val = trimmed.slice(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch (err) {
        console.warn('[Env] Error loading', p, err.message);
      }
    }
  }
}
loadEnv();

export function getLocalIp() {
  const interfaces = os.networkInterfaces();
  const validIps = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (!iface.address.startsWith('169.254.')) {
          validIps.push({ name, address: iface.address });
        }
      }
    }
  }

  const preferred = validIps.find(i => 
    i.name.toLowerCase().includes('wi-fi') || 
    i.name.toLowerCase().includes('ethernet') || 
    i.name.toLowerCase().includes('wlan') ||
    i.name.toLowerCase().includes('lan')
  ) || validIps[0];

  return preferred ? preferred.address : '192.168.0.107';
}

const PORT = process.env.PORT || 4001;
const SERVER_IP = process.env.SERVER_IP || getLocalIp();

// Locate pc-agent directories for static installer serving
const rootDir = path.resolve(__dirname, '../../');
const installerDir = path.resolve(rootDir, 'pc-agent/installer');
const agentDir = path.resolve(rootDir, 'pc-agent/agent');

// Active WebSocket Connections
const activeAgentSockets = new Map(); // laptopNumber -> WebSocket
const activeTeacherSockets = new Set(); // Teacher Dashboard WebSockets

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

// Helper: Safe Read File
function readFileSafe(filePath) {
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  return null;
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

  const parsedUrl = new URL(req.url || '/', `http://${SERVER_IP}:${PORT}`);
  const pathname = parsedUrl.pathname;

  // ==================================================================
  // 1. Static Installer & Agent Script Downloads
  // ==================================================================

  // Ultra-Short One-Line PowerShell Installers:
  // 1) irm 192.168.0.114:4001/01|iex   (Auto-pairs Laptop 01 with master token JJ)
  // 2) irm 192.168.0.114:4001|iex      (Prompts for laptop number, defaults to JJ)
  const singleNumMatch = pathname.match(/^\/(\d{1,2})$/);
  const fullParamMatch = pathname.match(/^\/(\d{1,2})\/([A-Za-z0-9\-_]+)$/);
  const isInstallerRoute =
    pathname === '/' ||
    pathname === '/i' ||
    pathname === '/in' ||
    pathname === '/install' ||
    pathname === '/install.ps1' ||
    !!singleNumMatch ||
    !!fullParamMatch;

  const reqHost = req.headers.host ? req.headers.host.split(':')[0] : SERVER_IP;

  if (isInstallerRoute && req.method === 'GET') {
    const installPs1Path = path.resolve(installerDir, 'install.ps1');
    const content = readFileSafe(installPs1Path);
    if (content) {
      let output = content.replace(/192\.168\.\d+\.\d+/g, reqHost);

      let paramLaptop = null;
      let paramToken = 'JJ'; // Default master token is JJ

      if (singleNumMatch) {
        paramLaptop = singleNumMatch[1];
        paramToken = 'JJ';
      } else if (fullParamMatch) {
        paramLaptop = fullParamMatch[1];
        paramToken = fullParamMatch[2] || 'JJ';
      }

      // Check Query Params (?pc=01&token=JJ)
      if (!paramLaptop) {
        paramLaptop = parsedUrl.searchParams.get('pc') || parsedUrl.searchParams.get('laptop') || parsedUrl.searchParams.get('n');
      }
      const qToken = parsedUrl.searchParams.get('token') || parsedUrl.searchParams.get('t');
      if (qToken) {
        paramToken = qToken;
      }

      let headerCode = '';
      if (paramLaptop) {
        const cleanNum = String(paramLaptop).replace(/\D/g, '').padStart(2, '0');
        headerCode += `$ParamLaptopNumber = "${cleanNum}";\n`;
      } else {
        headerCode += `$ParamLaptopNumber = $null;\n`;
      }
      if (paramToken) {
        headerCode += `$ParamPairingToken = "${paramToken.trim().toUpperCase()}";\n`;
      } else {
        headerCode += `$ParamPairingToken = $null;\n`;
      }

      if (headerCode) {
        output = headerCode + output;
      }

      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(output);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('# install.ps1 not found on server');
    }
    return;
  }

  // Batch Installer
  if (pathname === '/install.bat' && req.method === 'GET') {
    const batPath = path.resolve(installerDir, 'install.bat');
    const content = readFileSafe(batPath);
    if (content) {
      const output = content.replace(/192\.168\.\d+\.\d+/g, reqHost);
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(output);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('rem install.bat not found');
    }
    return;
  }

  // PowerShell Uninstaller
  if (pathname === '/uninstall.ps1' && req.method === 'GET') {
    const uninstPath = path.resolve(installerDir, 'uninstall.ps1');
    const content = readFileSafe(uninstPath);
    if (content) {
      const output = content.replace(/192\.168\.\d+\.\d+/g, reqHost);
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(output);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('# uninstall.ps1 not found');
    }
    return;
  }

  // Native Agent PowerShell Worker
  if (pathname === '/agent.ps1' && req.method === 'GET') {
    const agentPs1Path = path.resolve(agentDir, 'agent.ps1');
    const content = readFileSafe(agentPs1Path);
    if (content) {
      const output = content.replace(/192\.168\.\d+\.\d+/g, reqHost);
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(output);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('# agent.ps1 not found');
    }
    return;
  }

  // Node.js Agent
  if (pathname === '/agent.js' && req.method === 'GET') {
    const agentJsPath = path.resolve(agentDir, 'agent.js');
    const content = readFileSafe(agentJsPath);
    if (content) {
      const output = content.replace(/192\.168\.\d+\.\d+/g, reqHost);
      res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
      res.end(output);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('// agent.js not found');
    }
    return;
  }

  // Agent Bundle API (Fast single-payload download for remote laptops)
  if (pathname === '/api/agents/bundle' && req.method === 'GET') {
    const rawAgentPs1 = readFileSafe(path.resolve(agentDir, 'agent.ps1')) || '';
    const rawAgentJs = readFileSafe(path.resolve(agentDir, 'agent.js')) || '';
    const rawRunnerVbs = readFileSafe(path.resolve(agentDir, 'runner.vbs')) || '';
    const rawStartBat = readFileSafe(path.resolve(agentDir, 'start-agent.bat')) || '';

    const agentPs1 = rawAgentPs1.replace(/192\.168\.\d+\.\d+/g, reqHost);
    const agentJs = rawAgentJs.replace(/192\.168\.\d+\.\d+/g, reqHost);
    const runnerVbs = rawRunnerVbs.replace(/192\.168\.\d+\.\d+/g, reqHost);
    const startBat = rawStartBat.replace(/192\.168\.\d+\.\d+/g, reqHost);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        success: true,
        agentPs1,
        agentJs,
        runnerVbs,
        startBat
      })
    );
    return;
  }

  // ==================================================================
  // 2. Health & Telemetry REST Endpoints
  // ==================================================================

  // Health Check
  if (pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'healthy',
        server: `${SERVER_IP}:${PORT}`,
        activeLaptops: activeAgentSockets.size,
        activeTeachers: activeTeacherSockets.size,
        uptimeSeconds: Math.round(process.uptime())
      })
    );
    return;
  }

  // Available School Laptops Query
  if ((pathname === '/api/available-laptops' || pathname === '/api/laptops/available') && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(ComputerDatabase.getAvailableSchoolLaptops()));
    return;
  }

  // All Laptops Telemetry (School + BYOD)
  if (pathname === '/api/computers' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(ComputerDatabase.getAll()));
    return;
  }

  // Check Registration Status for a Laptop
  if (pathname === '/api/agents/check' && req.method === 'GET') {
    const laptopNumber = parsedUrl.searchParams.get('laptopNumber') || parsedUrl.searchParams.get('computerNumber');
    if (!laptopNumber) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'laptopNumber query parameter required' }));
      return;
    }

    const checkResult = ComputerDatabase.checkStatus(laptopNumber);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(checkResult));
    return;
  }

  // ==================================================================
  // 3. Token Generation & Registration Handshake
  // ==================================================================

  // Generate One-Time Registration Token (15-min validity)
  if ((pathname === '/api/generate-token' || pathname === '/api/agents/generate-token') && req.method === 'POST') {
    const body = await parseBody(req);
    const num = body.laptopNumber || body.computerNumber;

    if (!num) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'laptopNumber is required (e.g. "01")' }));
      return;
    }

    const result = ComputerDatabase.generateRegistrationToken(num);
    console.log(`[Token Generated] Laptop ${result.laptopNumber}: Pairing Token ${result.token}`);

    broadcastToTeachers({
      type: 'TOKEN_GENERATED',
      computerNumber: result.laptopNumber,
      laptopNumber: result.laptopNumber,
      token: result.token,
      expiresAt: result.expiresAt
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, ...result }));
    return;
  }

  // Register Agent with Pairing Token (Supports School & Personal BYOD Laptops)
  if ((pathname === '/api/agents/register' || pathname === '/api/register-agent') && req.method === 'POST') {
    const body = await parseBody(req);
    const num = body.laptopNumber || body.computerNumber;
    const token = body.pairingToken || body.token;
    const hostname = body.hostname;
    const ip = (req.socket.remoteAddress || '').replace('::ffff:', '');
    const deviceOwnership = body.deviceOwnership || 'SCHOOL';
    const studentName = body.studentName || '';
    const grade = body.grade || '';

    const result = ComputerDatabase.registerAgentWithToken(token, num, hostname, ip, {
      deviceOwnership,
      studentName,
      grade
    });

    if (result.success) {
      const assignedNum = result.laptopNumber || num;
      const registeredComp = ComputerDatabase.getByNumber(assignedNum);

      console.log(
        `[Agent Registered] ${deviceOwnership === 'PERSONAL' ? 'Personal Device' : 'School Laptop'} ${assignedNum} (${studentName ? studentName + ' - ' : ''}${hostname || 'Windows PC'}) registered successfully`
      );

      broadcastToTeachers({
        type: 'AGENT_REGISTERED',
        computer: registeredComp,
        laptopNumber: assignedNum,
        computerNumber: assignedNum,
        deviceOwnership,
        studentName: registeredComp?.studentName || studentName
      });

      broadcastToTeachers({
        type: 'COMPUTER_STATUS_CHANGED',
        computerNumber: assignedNum,
        laptopNumber: assignedNum,
        status: 'ONLINE',
        lastSeen: new Date().toISOString()
      });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    }
    return;
  }

  // Unpair / Remove Laptop Registration
  if (
    (pathname === '/api/unpair-laptop' ||
      pathname === '/api/agents/unpair' ||
      pathname === '/api/revoke-agent' ||
      pathname === '/api/agents/revoke') &&
    req.method === 'POST'
  ) {
    const body = await parseBody(req);
    const num = body.laptopNumber || body.computerNumber;

    const formattedNum = String(num).replace(/\D/g, '').padStart(2, '0');
    const success = ComputerDatabase.unpairLaptop(formattedNum);
    if (success) {
      const ws = activeAgentSockets.get(formattedNum);
      if (ws) {
        try {
          ws.send(JSON.stringify({ type: 'UNPAIRED', message: 'Laptop unpaired by teacher' }));
          ws.close(4003, 'Unpaired by Teacher');
        } catch {}
        activeAgentSockets.delete(formattedNum);
      }

      broadcastToTeachers({
        type: 'COMPUTER_STATUS_CHANGED',
        computerNumber: formattedNum,
        laptopNumber: formattedNum,
        status: 'UNREGISTERED'
      });

      console.log(`[Laptop Unpaired] Laptop ${formattedNum} reset to UNREGISTERED`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: `Laptop ${formattedNum} unpaired successfully.` }));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Laptop ${num} not found.` }));
    }
    return;
  }

  // Set Laptop to Offline
  if ((pathname === '/api/set-offline' || pathname === '/api/agents/set-offline') && req.method === 'POST') {
    const body = await parseBody(req);
    const num = body.laptopNumber || body.computerNumber;

    const formattedNum = String(num).replace(/\D/g, '').padStart(2, '0');
    const success = ComputerDatabase.setOffline(formattedNum);
    if (success) {
      const ws = activeAgentSockets.get(formattedNum);
      if (ws) {
        try {
          ws.close(4000, 'Set offline by Teacher');
        } catch {}
        activeAgentSockets.delete(formattedNum);
      }

      broadcastToTeachers({
        type: 'COMPUTER_STATUS_CHANGED',
        computerNumber: formattedNum,
        laptopNumber: formattedNum,
        status: 'OFFLINE',
        lastSeen: new Date().toISOString()
      });

      console.log(`[Laptop Offline] Laptop ${formattedNum} manually set to OFFLINE`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: `Laptop ${formattedNum} set to offline.` }));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Laptop ${num} not found.` }));
    }
    return;
  }

  // ==================================================================
  // 4. AI Excel Problem Solver & Teacher Assistant API
  // ==================================================================

  // Status check (check if GEMINI_API_KEY is configured on server)
  if ((pathname === '/api/ai/status' || pathname === '/api/ai/excel/status') && req.method === 'GET') {
    const hasKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '' && process.env.GEMINI_API_KEY !== 'your_gemini_api_key');
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      configured: hasKey,
      model
    }));
    return;
  }

  // AI Chat Assistant (Excel, Word, PowerPoint, CIIS School System)
  if (pathname === '/api/ai/chat' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const { messages, category, customContext } = body || {};

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'INVALID_PAYLOAD',
          message: 'Messages array is required.'
        }));
        return;
      }

      console.log(`[AI Chat] Received query (category: ${category || 'general'}, messages: ${messages.length})...`);
      const chatResult = await sendChatMessage({
        messages,
        category,
        customContext
      });

      if (chatResult.success) {
        console.log(`[AI Chat] Response generated via ${chatResult.modelUsed}.`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(chatResult));
      } else {
        console.warn(`[AI Chat] Failed: ${chatResult.error} - ${chatResult.message}`);
        const statusCode = chatResult.error === 'INVALID_API_KEY' ? 401 :
                           chatResult.error === 'RATE_LIMITED' ? 429 :
                           chatResult.error === 'GEMINI_API_KEY_MISSING' ? 503 : 400;
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(chatResult));
      }
    } catch (err) {
      console.error('[AI Chat] Server Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'SERVER_ERROR',
        message: err.message || 'An unexpected error occurred during chat.'
      }));
    }
    return;
  }

  // Analyze Excel Image with Gemini Vision
  if (pathname === '/api/ai/excel/analyze' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const base64Data = body.image || body.base64Data || body.file;
      const mimeType = body.mimeType || 'image/jpeg';
      const solveMode = body.solveMode || body.mode || 'all';

      if (!base64Data) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'NO_IMAGE_PROVIDED',
          message: 'Please upload an Excel exercise image.'
        }));
        return;
      }

      console.log(`[AI Excel Analyze] Starting analysis (mode: ${solveMode}, mime: ${mimeType})...`);
      const analysisResult = await analyzeExcelImage({
        base64Data,
        mimeType,
        solveMode
      });

      if (analysisResult.success) {
        console.log(`[AI Excel Analyze] Completed successfully via ${analysisResult.modelUsed}.`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(analysisResult));
      } else {
        console.warn(`[AI Excel Analyze] Failed: ${analysisResult.error} - ${analysisResult.message}`);
        const statusCode = analysisResult.error === 'INVALID_API_KEY' ? 401 :
                           analysisResult.error === 'RATE_LIMITED' ? 429 :
                           analysisResult.error === 'GEMINI_API_KEY_MISSING' ? 503 : 400;
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(analysisResult));
      }
    } catch (err) {
      console.error('[AI Excel Analyze] Server Error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'SERVER_ERROR',
        message: err.message || 'An unexpected error occurred during AI analysis. Please try again.'
      }));
    }
    return;
  }

  // Not Found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

// ====================================================================
// 4. WebSocket Server
// ====================================================================
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const pathUrl = req.url || '';
  const ip = (req.socket.remoteAddress || '').replace('::ffff:', '');

  // A. Teacher Dashboard Stream (/ws/teacher)
  if (pathUrl.includes('/ws/teacher')) {
    activeTeacherSockets.add(ws);
    console.log(`[Teacher WS Connected] Active dashboards: ${activeTeacherSockets.size}`);

    // Send full snapshot of all 30 laptops
    try {
      ws.send(
        JSON.stringify({
          type: 'INITIAL_SNAPSHOT',
          computers: ComputerDatabase.getAll()
        })
      );
    } catch {}

    ws.on('error', (err) => {
      console.warn('[Teacher WS Error]', err.message);
    });

    ws.on('close', () => {
      activeTeacherSockets.delete(ws);
      console.log(`[Teacher WS Disconnected] Active: ${activeTeacherSockets.size}`);
    });
    return;
  }

  // B. Windows Student Laptop Agent Stream (/ws/agent)
  if (pathUrl.includes('/ws/agent')) {
    let boundLaptopNumber = '';

    ws.on('error', (err) => {
      console.warn(`[Agent WS Error ${boundLaptopNumber}]`, err.message);
    });

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        // Handshake Authentication
        if (msg.type === 'auth') {
          const numRaw = msg.laptopNumber || msg.computerNumber || '';
          const token = msg.deviceToken || msg.agentToken;
          const hostname = msg.hostname;
          const isByod = String(numRaw).toUpperCase().startsWith('BYOD') || String(numRaw).toUpperCase().startsWith('PERS');
          const num = isByod ? String(numRaw).trim().toUpperCase() : String(numRaw).replace(/\D/g, '').padStart(2, '0');

          const authCheck = ComputerDatabase.validateAgentToken(num, token);

          if (!authCheck.valid) {
            console.log(`[Agent Rejected] Laptop ${num} rejected (Reason: ${authCheck.reason})`);
            try {
              ws.send(
                JSON.stringify({
                  type: 'auth_error',
                  reason: authCheck.reason,
                  message: 'Laptop is not paired. Please run registration with token JJ.'
                })
              );
              ws.close(4001, 'Unpaired');
            } catch {}
            return;
          }

          const comp = authCheck.computer;
          boundLaptopNumber = num;
          activeAgentSockets.set(num, ws);
          ComputerDatabase.updateHeartbeat(num, ip);

          console.log(`[Agent Authenticated] ${comp.isPersonal ? 'Personal Device' : 'Laptop'} ${num} (${comp.studentName ? comp.studentName + ' - ' : ''}${hostname || 'Windows PC'}) connected`);

          const currentStatus = comp.isManuallyOffline ? 'OFFLINE' : 'ONLINE';

          try {
            ws.send(
              JSON.stringify({
                type: 'auth_success',
                laptopNumber: num,
                computerNumber: num,
                studentName: comp.studentName || '',
                deviceOwnership: comp.deviceOwnership || (comp.isPersonal ? 'PERSONAL' : 'SCHOOL'),
                status: currentStatus,
                serverTime: new Date().toISOString()
              })
            );
          } catch {}

          // Broadcast status to Teacher Dashboard
          broadcastToTeachers({
            type: 'COMPUTER_STATUS_CHANGED',
            computerNumber: num,
            laptopNumber: num,
            studentName: comp.studentName || '',
            deviceOwnership: comp.deviceOwnership || (comp.isPersonal ? 'PERSONAL' : 'SCHOOL'),
            status: currentStatus,
            lastSeen: new Date().toISOString()
          });
          return;
        }

        // Heartbeat Message (Every 5s)
        if (msg.type === 'heartbeat') {
          const rawNum = msg.laptopNumber || msg.computerNumber || boundLaptopNumber || '';
          const isByod = String(rawNum).toUpperCase().startsWith('BYOD') || String(rawNum).toUpperCase().startsWith('PERS');
          const num = isByod ? String(rawNum).trim().toUpperCase() : String(rawNum).replace(/\D/g, '').padStart(2, '0');
          const comp = ComputerDatabase.getByNumber(num);

          if (!comp || comp.status === 'UNREGISTERED' || comp.status === 'REVOKED') {
            try {
              ws.send(JSON.stringify({ type: 'UNPAIRED', message: 'Laptop has been unpaired' }));
              ws.close(4003, 'Unpaired');
            } catch {}
            return;
          }

          ComputerDatabase.updateHeartbeat(num, ip);

          try {
            ws.send(
              JSON.stringify({
                type: 'heartbeat_ack',
                laptopNumber: num,
                timestamp: new Date().toISOString()
              })
            );
          } catch {}

          if (!comp.isManuallyOffline) {
            broadcastToTeachers({
              type: 'COMPUTER_HEARTBEAT',
              computerNumber: num,
              laptopNumber: num,
              studentName: comp.studentName || '',
              lastSeen: new Date().toISOString()
            });
          }
          return;
        }
      } catch (err) {
        console.warn('[Agent WS Message Error]', err);
      }
    });

    ws.on('close', () => {
      if (boundLaptopNumber) {
        activeAgentSockets.delete(boundLaptopNumber);
        console.log(`[Agent WS Closed] Laptop ${boundLaptopNumber}`);
      }
    });
    return;
  }

  // Fallback for invalid path
  try {
    ws.close(1008, 'Invalid WebSocket path');
  } catch {}
});

// Process Crash Guards
process.on('uncaughtException', (err) => {
  console.error('[Process Uncaught Exception]', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Process Unhandled Rejection]', reason);
});

// Start Watchdog Service (Marks offline if heartbeat absent > 15s)
startWatchdog((event) => {
  broadcastToTeachers(event);
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
=========================================================
  CIIS SCHOOL COMPUTER LAB AGENT BACKEND SERVER
=========================================================
  * Local LAN IP:    ${SERVER_IP}:${PORT}
  * Installer URL:   http://${SERVER_IP}:${PORT}/install.ps1
  * REST API:        http://${SERVER_IP}:${PORT}/health
  * Teacher WS:      ws://${SERVER_IP}:${PORT}/ws/teacher
  * Windows Agent:   ws://${SERVER_IP}:${PORT}/ws/agent
=========================================================
`);
});
