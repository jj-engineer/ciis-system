# CIIS School Computer Lab Agent — One-Command Installer & Monitoring System

Complete Windows Installer, Registration, and Live Presence Monitoring System for School Computer Lab Laptops (`01` – `30`).

---

## 1. Teacher / Server Configuration

The teacher/server computer has a fixed local LAN address:

```text
Server IP      : 192.168.0.114
Backend Port   : 4001
WebSocket URL  : ws://192.168.0.114:4001/ws/agent
Installer URL  : http://192.168.0.114:4001/install.ps1
```

> **Security & Zero-Config Note:** The teacher server IP (`192.168.0.114:4001`) is pre-configured directly into the installer. Technicians and teachers are **never** asked to type the server IP manually.

---

## 2. Ultra-Short Commands (Student Laptops)

Open **PowerShell as Administrator** on any student laptop:

### Option A: 1-Click Auto Install (Zero Typing — Recommended)
Copy the exact command generated from the Teacher Dashboard:
```powershell
irm 192.168.0.114:4001/01/REG-01-9F2A|iex
```
*(Instantly registers Laptop 01 and enables background monitoring without asking any questions)*

### Option B: 2-Word Generic Command
```powershell
irm 192.168.0.114:4001|iex
```
*(Prompts for Laptop Number and Pairing Token interactively)*

---

## 3. Directory Layout

```text
pc-agent/
├── agent/
│   ├── agent.ps1          # Pure native PowerShell WebSocket worker (zero dependencies)
│   ├── agent.js           # Node.js WebSocket worker
│   ├── package.json       # Node package manifest
│   ├── runner.vbs         # Silent invisible launcher (no console window)
│   └── start-agent.bat    # Windows service/startup launcher
├── installer/
│   ├── install.ps1        # Main automated PowerShell installer
│   ├── install.bat        # CMD double-click installer wrapper
│   └── uninstall.ps1      # Clean uninstaller script
├── backend/
│   └── src/
│       ├── server.js      # REST registration API & WebSocket hub
│       ├── database.js    # In-memory device registry & pairing tokens
│       └── watchdog.js    # 15-second offline watchdog service
└── README.md
```

---

## 4. Installation Lifecycle & Security Flow

```text
Teacher Dashboard
       │
       │ Generate 15-min single-use pairing token
       ▼
REG-01-9F2A
       │
       ▼
Student Laptop 01 (PowerShell Admin)
       │
       ▼
irm http://192.168.0.114:4001/install.ps1 | iex
       │
       ├── [1/6] Check network & ping 192.168.0.114:4001
       ├── [2/6] Validate Laptop Number (01-30) & Token
       ├── [3/6] POST /api/agents/register Handshake
       ├── [4/6] Save C:\SchoolLabAgent\config.json (stores permanent deviceToken)
       ├── [5/6] Register background Windows Service / Scheduled Task (SchoolLabAgent)
       └── [6/6] Verify live WebSocket connection & start 5-second heartbeats
       │
       ▼
ws://192.168.0.114:4001/ws/agent
       │
       ▼
Teacher Dashboard
       └── 💻 Laptop 01: 🟢 ONLINE
```

---

## 5. Local Configuration File (`C:\SchoolLabAgent\config.json`)

After successful registration, permanent device credentials are saved locally:

```json
{
  "serverIp": "192.168.0.114",
  "serverPort": 4001,
  "websocketUrl": "ws://192.168.0.114:4001/ws/agent",
  "laptopNumber": "01",
  "deviceId": "device_01",
  "deviceToken": "agent-sec-01-1771914...",
  "agentVersion": "1.0.0",
  "heartbeatIntervalMs": 5000
}
```

*Note: The one-time pairing token is permanently discarded after registration.*

---

## 6. Background Service & Automatic Startup

- **Service Name**: `SchoolLabAgent`
- **Display Name**: `School Computer Lab Agent`
- **Execution Mode**: Silent background process (`runner.vbs` + `agent.ps1`)
- **Memory Footprint**: < 20 MB RAM, 0% CPU idle
- **Non-Intrusive**: No interference with Word, Excel, Chrome, or student typing tests.
- **Auto-Recovery**: Automatically restarts if interrupted or when Wi-Fi reconnects.

---

## 7. Troubleshooting & Network Diagnostics

If the installer cannot reach the server, it runs socket diagnostics:

```text
[FAIL] Cannot connect to teacher server.
Teacher server: 192.168.0.114:4001

Please check:
1. Student laptop is connected to the same school Wi-Fi network as the teacher.
2. Teacher computer is turned on with IP 192.168.0.114.
3. Backend server is running (backend\start-server.bat).
4. Windows Firewall on Teacher PC allows incoming TCP port 4001.
```

---

## 8. Uninstallation

To cleanly remove the agent from a student laptop:

```powershell
powershell -ExecutionPolicy Bypass -File C:\SchoolLabAgent\uninstall.ps1
```

Or from the installer directory:

```powershell
irm http://192.168.0.114:4001/uninstall.ps1 | iex
```

This stops the agent, removes the scheduled task/service, and cleans `C:\SchoolLabAgent`.
