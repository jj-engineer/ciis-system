# CIIS School PC Agent MVP — Windows Online/Offline Monitoring

Lightweight, privacy-respecting Windows background monitoring agent for school laptops (`01` through `30`).

---

## 1. Overview & Scope
- **Pure Online/Offline Monitor**: Reports heartbeat telemetry every 5 seconds.
- **Privacy-First**: No remote desktop, no keylogging, no screen recording, no command execution, and no file browsing.
- **Student Freedom**: Students use Microsoft Word, Microsoft Excel, and normal Windows apps with zero interference.

---

## 2. Directory Layout
```text
pc-agent/
├── csharp/            # C# / .NET 8 Enterprise Project with System Tray
│   ├── SchoolPcAgent.csproj
│   ├── Program.cs
│   ├── build.bat
│   └── Config/appsettings.json
│
├── runner/            # Instant-Run Windows Agent (Zero Setup)
│   ├── agent.js
│   ├── config.json
│   └── run-agent.bat
│
└── installer/         # Windows Setup & Registration
    ├── install-startup.bat
    ├── uninstall-startup.bat
    └── register-pc.bat
```

---

## 3. Quick Start (Administrator)
1. **Start Backend Server**:
   Run `backend/start-server.bat` (Port 4001).
2. **Generate Token in Teacher Dashboard**:
   Open `/teacher/computer-lab` -> Click Laptop `01` -> Click **Generate Registration Token**.
3. **Register Laptop**:
   Run `pc-agent/installer/register-pc.bat` and enter the Laptop Number and Token.
4. **Auto-Start on Boot**:
   Run `pc-agent/installer/install-startup.bat`.
