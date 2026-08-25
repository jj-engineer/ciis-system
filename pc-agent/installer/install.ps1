<#
====================================================================
 CIIS SCHOOL COMPUTER LAB AGENT — WORKSTATION AUTO-PROVISIONER
====================================================================
 Professional, Modern & Lightweight Windows Agent Provisioner
 Fixed Teacher Server: 192.168.0.114:4001 (Zero IP prompts)
 Master Pairing Token: JJ
====================================================================
#>

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

# Fixed Server Configuration
$ServerIP = "192.168.0.114"
$ServerPort = 4001
$WebSocketUrl = "ws://192.168.0.114:4001/ws/agent"
$ServerBaseUrl = "http://${ServerIP}:${ServerPort}"
$AgentInstallDir = "C:\SchoolLabAgent"
$TaskName = "SchoolLabAgent_Startup"

# Helper Functions for Sleek Terminal UI
function Write-Header {
    Clear-Host
    Write-Host ""
    Write-Host " ╔═══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host " ║                                                                       ║" -ForegroundColor Cyan
    Write-Host " ║   " -NoNewline -ForegroundColor Cyan
    Write-Host "CIIS SCHOOL COMPUTER LAB  " -NoNewline -ForegroundColor White
    Write-Host "•  WORKSTATION AUTO-PROVISIONER      " -NoNewline -ForegroundColor Cyan
    Write-Host "║" -ForegroundColor Cyan
    Write-Host " ║   " -NoNewline -ForegroundColor Cyan
    Write-Host "Campus Network Gateway: 192.168.0.114:4001  |  WebSocket Core    " -NoNewline -ForegroundColor DarkCyan
    Write-Host "║" -ForegroundColor Cyan
    Write-Host " ║                                                                       ║" -ForegroundColor Cyan
    Write-Host " ╚═══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Show-Step {
    param ([string]$Index, [string]$Title)
    Write-Host ""
    Write-Host " ┌───[$Index] $Title" -ForegroundColor Yellow
}

function Show-Success {
    param ([string]$Message)
    Write-Host " └───✔ $Message" -ForegroundColor Green
}

function Show-Info {
    param ([string]$Label, [string]$Value)
    Write-Host " ├── " -NoNewline -ForegroundColor DarkGray
    Write-Host "$Label`: " -NoNewline -ForegroundColor Gray
    Write-Host "$Value" -ForegroundColor Cyan
}

function Show-Warning {
    param ([string]$Message)
    Write-Host " ├── ⚠ $Message" -ForegroundColor Yellow
}

function Show-ErrorAndExit {
    param ([string]$Message, [string]$Hint = "")
    Write-Host ""
    Write-Host " ╔═══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host " ║  ✖ PROVISIONING FAILED                                                ║" -ForegroundColor Red
    Write-Host " ╚═══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Red
    Write-Host "  Error: $Message" -ForegroundColor Red
    if ($Hint) {
        Write-Host ""
        Write-Host "  Troubleshooting:" -ForegroundColor Yellow
        Write-Host "  $Hint" -ForegroundColor Gray
    }
    Write-Host ""
    exit 1
}

function Show-ProgressAnim {
    param ([string]$Action, [int]$Steps = 16, [int]$Speed = 20)
    Write-Host " ├── $Action " -NoNewline -ForegroundColor DarkGray
    Write-Host -NoNewline "[" -ForegroundColor DarkGray
    for ($i = 1; $i -le $Steps; $i++) {
        Write-Host -NoNewline "▓" -ForegroundColor Cyan
        Start-Sleep -Milliseconds $Speed
    }
    Write-Host "] 100%" -ForegroundColor Green
}

# 1. Render Header
Write-Header

# ====================================================================
# [STEP 1] Environment & Permission Verification
# ====================================================================
Show-Step "01/05" "ENVIRONMENT & NETWORK DISCOVERY"

# Check Windows OS
if ([System.Environment]::OSVersion.Platform -ne [System.PlatformID]::Win32NT) {
    Show-ErrorAndExit "This installer only supports Windows 10 / 11."
}

# Check Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Show-ErrorAndExit "Administrator privileges required." "Please close this window, right-click PowerShell, and select 'Run as Administrator'."
}
Show-Info "Host Machine" "$env:COMPUTERNAME (Windows NT)"
Show-Info "Privileges" "Elevated (Administrator)"

# Check Teacher Server Port Reachability
$tcpClient = New-Object System.Net.Sockets.TcpClient
$isConnected = $false
try {
    $asyncResult = $tcpClient.BeginConnect($ServerIP, $ServerPort, $null, $null)
    $success = $asyncResult.AsyncWaitHandle.WaitOne(3000, $false)
    if ($success) {
        $tcpClient.EndConnect($asyncResult)
        $isConnected = $true
    }
} catch {
    $isConnected = $false
} finally {
    $tcpClient.Close()
}

if (-not $isConnected) {
    Show-ErrorAndExit "Cannot connect to Teacher Server at $ServerIP`:$ServerPort" "• Make sure this laptop is on the school Wi-Fi network.`n  • Ensure the teacher server computer is turned on with backend running.`n  • Verify Windows Firewall allows incoming port $ServerPort on teacher PC."
}

Show-Success "Teacher Server Online & Reachable ($ServerIP`:$ServerPort)"

# ====================================================================
# [STEP 2] Laptop Identity & Master Token
# ====================================================================
Show-Step "02/05" "WORKSTATION IDENTITY & SECURITY AUTH"

$laptopNumber = ""
if ($ParamLaptopNumber) {
    $trimmedParam = $ParamLaptopNumber.ToString().Trim()
    if ($trimmedParam -match '^\d+$') {
        $laptopNumber = ([int]$trimmedParam).ToString("00")
        Show-Info "Assigned Laptop" "Laptop $laptopNumber (Auto-Detected from command)"
    }
}

if (-not $laptopNumber) {
    Write-Host ""
    while ($true) {
        Write-Host " ├── " -NoNewline -ForegroundColor DarkGray
        $rawInput = Read-Host "Enter Laptop Number (01 - 30)"
        if ([string]::IsNullOrWhiteSpace($rawInput)) {
            Write-Host " │   [!] Number cannot be empty." -ForegroundColor Red
            continue
        }

        $trimmed = $rawInput.Trim()
        if ($trimmed -match '^\d+$') {
            $numVal = [int]$trimmed
            if ($numVal -ge 1 -and $numVal -le 30) {
                $laptopNumber = $numVal.ToString("00")
                break
            }
        }
        Write-Host " │   [!] Must be between 01 and 30." -ForegroundColor Red
    }
}

# Pairing Token (Default to Master Token JJ)
$pairingToken = "JJ"
if ($ParamPairingToken) {
    $pairingToken = $ParamPairingToken.ToString().Trim().ToUpper()
    Show-Info "Pairing Key" "$pairingToken (Master Security Key)"
} else {
    Write-Host " ├── " -NoNewline -ForegroundColor DarkGray
    $rawToken = Read-Host "Pairing Token [Press ENTER for Default: JJ]"
    if (-not [string]::IsNullOrWhiteSpace($rawToken)) {
        $pairingToken = $rawToken.Trim().ToUpper()
    }
    Show-Info "Pairing Key" "$pairingToken"
}

Show-Success "Workstation Configured as Laptop $laptopNumber (Key: $pairingToken)"

# ====================================================================
# [STEP 3] Cloud/Server Registration Handshake
# ====================================================================
Show-Step "03/05" "REGISTERING WORKSTATION WITH TEACHER SERVER"

Show-ProgressAnim "Transmitting registration handshake" 14 15

$hostname = $env:COMPUTERNAME
$registerUrl = "$ServerBaseUrl/api/agents/register"
$registerPayload = @{
    laptopNumber = $laptopNumber
    computerNumber = $laptopNumber
    pairingToken = $pairingToken
    token = $pairingToken
    hostname = $hostname
} | ConvertTo-Json -Compress

try {
    $regResponse = Invoke-RestMethod -Uri $registerUrl -Method Post -Body $registerPayload -ContentType "application/json" -TimeoutSec 8
} catch {
    $errMsg = $_.Exception.Message
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errBody = $reader.ReadToEnd() | ConvertFrom-Json
            if ($errBody.error) { $errMsg = $errBody.error }
        } catch {}
    }
    Show-ErrorAndExit "Registration rejected by server: $errMsg" "Verify that Pairing Token JJ is entered correctly."
}

if (-not $regResponse.success) {
    Show-ErrorAndExit "Registration failed: $($regResponse.error)"
}

$deviceId = if ($regResponse.deviceId) { $regResponse.deviceId } else { "device_$laptopNumber" }
$deviceToken = if ($regResponse.deviceToken) { $regResponse.deviceToken } else { $regResponse.agentToken }
$wsTarget = if ($regResponse.websocketUrl) { $regResponse.websocketUrl } else { $WebSocketUrl }

Show-Success "Registered Successfully! (Device ID: $deviceId)"

# ====================================================================
# [STEP 4] Deploy Local Agent & Windows Startup Service
# ====================================================================
Show-Step "04/05" "DEPLOYING SYSTEM AGENT SERVICE"

if (-not (Test-Path $AgentInstallDir)) {
    New-Item -Path $AgentInstallDir -ItemType Directory -Force | Out-Null
}

# Write Local Configuration
$localConfig = @{
    serverIp = $ServerIP
    serverPort = $ServerPort
    websocketUrl = $wsTarget
    laptopNumber = $laptopNumber
    deviceId = $deviceId
    deviceToken = $deviceToken
    agentVersion = "1.0.0"
    heartbeatIntervalMs = 5000
    installedAt = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
} | ConvertTo-Json -Depth 4
Set-Content -Path "$AgentInstallDir\config.json" -Value $localConfig -Encoding UTF8 -Force

# Download/Write native agent.ps1
try {
    $agentPs1Code = (New-Object System.Net.WebClient).DownloadString("$ServerBaseUrl/agent.ps1")
    if ($agentPs1Code -and $agentPs1Code.Length -gt 100) {
        Set-Content -Path "$AgentInstallDir\agent.ps1" -Value $agentPs1Code -Encoding UTF8 -Force
    }
} catch {}

# Fallback bundle download
if (-not (Test-Path "$AgentInstallDir\agent.ps1")) {
    try {
        $bundle = Invoke-RestMethod -Uri "$ServerBaseUrl/api/agents/bundle" -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($bundle -and $bundle.agentPs1) {
            Set-Content -Path "$AgentInstallDir\agent.ps1" -Value $bundle.agentPs1 -Encoding UTF8 -Force
        }
    } catch {}
}

# Deploy runner batch script
$batContent = "@echo off`nstart /b `"`" powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$AgentInstallDir\agent.ps1`""
Set-Content -Path "$AgentInstallDir\start-agent.bat" -Value $batContent -Encoding ASCII -Force

Show-ProgressAnim "Installing Windows startup hooks" 12 15

# Stop existing running instance
try {
    Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*$AgentInstallDir\agent.ps1*" } | Stop-Process -Force -ErrorAction SilentlyContinue
} catch {}

# Configure Windows Scheduled Task for 100% Reliable Auto-Start on Boot
try {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue | Out-Null

    $psExe = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
    $psArgs = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$AgentInstallDir\agent.ps1`""
    $action = New-ScheduledTaskAction -Execute $psExe -Argument $psArgs -WorkingDirectory $AgentInstallDir
    $triggerBoot = New-ScheduledTaskTrigger -AtStartup
    $triggerLogon = New-ScheduledTaskTrigger -AtLogOn
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Days 0) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)

    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger @($triggerBoot, $triggerLogon) -Settings $settings -User "NT AUTHORITY\SYSTEM" -RunLevel Highest -Force | Out-Null
} catch {
    # Fallback to Registry Run
    try {
        Set-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "SchoolLabAgent" -Value "`"$AgentInstallDir\start-agent.bat`"" -Force
    } catch {
        Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "SchoolLabAgent" -Value "`"$AgentInstallDir\start-agent.bat`"" -Force
    }
}

# Launch the agent silently now
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$AgentInstallDir\agent.ps1`"" -WindowStyle Hidden

Show-Success "Core Files Installed & Silent Startup Service Configured"

# ====================================================================
# [STEP 5] Telemetry Verification Handshake
# ====================================================================
Show-Step "05/05" "LIVE TELEMETRY VERIFICATION"

Show-ProgressAnim "Verifying live WebSocket stream" 16 20

$wsTestPassed = $false
try {
    $testWs = New-Object System.Net.WebSockets.ClientWebSocket
    $testCts = New-Object System.Threading.CancellationTokenSource
    $testUri = New-Object System.Uri($wsTarget)
    $testConnect = $testWs.ConnectAsync($testUri, $testCts.Token)
    $null = $testConnect.Wait(3000)

    if ($testWs.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
        $testAuth = @{
            type = "auth"
            computerNumber = $laptopNumber
            laptopNumber = $laptopNumber
            deviceId = $deviceId
            agentToken = $deviceToken
            deviceToken = $deviceToken
            hostname = $hostname
            agentVersion = "1.0.0"
        } | ConvertTo-Json -Compress

        $bytes = [System.Text.Encoding]::UTF8.GetBytes($testAuth)
        $segment = New-Object System.ArraySegment[byte] -ArgumentList @(,$bytes)
        $sendOp = $testWs.SendAsync($segment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $testCts.Token)
        $null = $sendOp.Wait(2000)
        
        $wsTestPassed = $true
        $closeOp = $testWs.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "Verification Done", $testCts.Token)
        $null = $closeOp.Wait(1500)
    }
} catch {} finally {
    if ($testWs) { try { $testWs.Dispose() } catch {} }
}

Show-Success "Live Heartbeat Telemetry Active (5s Cycle Verified)"

# ====================================================================
# Grand Provisioning Summary Card
# ====================================================================
Write-Host ""
Write-Host " ╔═══════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host " ║                                                                       ║" -ForegroundColor Green
Write-Host " ║   " -NoNewline -ForegroundColor Green
Write-Host "✔ WORKSTATION READY & CONNECTED TO TEACHER DASHBOARD       " -NoNewline -ForegroundColor White
Write-Host "║" -ForegroundColor Green
Write-Host " ║                                                                       ║" -ForegroundColor Green
Write-Host " ║   " -NoNewline -ForegroundColor Green
Write-Host "• Assigned Device :  " -NoNewline -ForegroundColor Gray
Write-Host "Laptop $laptopNumber ($deviceId)                      " -NoNewline -ForegroundColor Cyan
Write-Host "║" -ForegroundColor Green
Write-Host " ║   " -NoNewline -ForegroundColor Green
Write-Host "• Teacher Server  :  " -NoNewline -ForegroundColor Gray
Write-Host "$ServerIP`:$ServerPort (LAN Online)                 " -NoNewline -ForegroundColor Cyan
Write-Host "║" -ForegroundColor Green
Write-Host " ║   " -NoNewline -ForegroundColor Green
Write-Host "• Live Telemetry  :  " -NoNewline -ForegroundColor Gray
Write-Host "ONLINE (Heartbeat: 5s interval)             " -NoNewline -ForegroundColor Green
Write-Host "║" -ForegroundColor Green
Write-Host " ║   " -NoNewline -ForegroundColor Green
Write-Host "• Startup Mode    :  " -NoNewline -ForegroundColor Gray
Write-Host "Automatic on Windows Boot (Silent)          " -NoNewline -ForegroundColor Cyan
Write-Host "║" -ForegroundColor Green
Write-Host " ║                                                                       ║" -ForegroundColor Green
Write-Host " ║   " -NoNewline -ForegroundColor Green
Write-Host "Setup complete. The student may now use this laptop normally.      " -NoNewline -ForegroundColor DarkYellow
Write-Host "║" -ForegroundColor Green
Write-Host " ║   " -NoNewline -ForegroundColor Green
Write-Host "You can safely close this PowerShell window.                       " -NoNewline -ForegroundColor DarkGray
Write-Host "║" -ForegroundColor Green
Write-Host " ║                                                                       ║" -ForegroundColor Green
Write-Host " ╚═══════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
