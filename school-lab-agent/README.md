# CIIS School Windows Lab Agent

Lightweight background agent for student Windows workstations in the CIIS Computer Lab.

---

## 1. Features
- **Auto Startup**: Launches silently on Windows boot via startup registry.
- **Predefined Safe Commands**: Responds strictly to authorized school commands (`PING`, `GET_STATUS`, `START_SESSION`, `END_SESSION`, `LOCK_WORKSTATION`, `UNLOCK_WORKSTATION`, `OPEN_ASSIGNMENT`, `COLLECT_FILES`).
- **Assignment Automation**: Automatically launches approved Microsoft Word / Excel templates from `C:\SchoolLab\Assignments\`.
- **Automated Collection**: Safely uploads student work to the Teacher Control Center upon teacher collection request.
- **Heartbeat & Telemetry**: Sends periodic status and resource telemetry every 5 seconds.

---

## 2. Configuration (`config/agent.json`)
```json
{
  "serverUrl": "ws://192.168.10.1:4001/ws/agent",
  "computerCode": "LAB-01",
  "labGroup": "Lab A",
  "agentToken": "ciis_agent_secret_token_v1",
  "agentVersion": "v1.0.4",
  "heartbeatIntervalMs": 5000,
  "assignmentsDirectory": "C:\\SchoolLab\\Assignments"
}
```

---

## 3. Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start agent:
   ```bash
   npm start
   ```
3. Auto-install for Windows boot:
   Double-click `installer/install.bat`.
