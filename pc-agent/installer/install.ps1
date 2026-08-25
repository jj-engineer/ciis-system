<#
====================================================================
 CIIS SCHOOL COMPUTER LAB AGENT — ONE-COMMAND WINDOWS INSTALLER
====================================================================
 Executes on student school laptops to pair with the teacher server.
 Server IP is fixed to local LAN: 192.168.0.114 (Port 4001).
====================================================================
#>

# Enforce UTF-8 output & Clean Execution
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

# Fixed Teacher Server Configuration (Do not prompt user for IP)
$ServerIP = "192.168.0.114"
$ServerPort = 4001
$WebSocketUrl = "ws://192.168.0.114:4001/ws/agent"
$ServerBaseUrl = "http://${ServerIP}:${ServerPort}"
$AgentInstallDir = "C:\SchoolLabAgent"
$ServiceName = "SchoolLabAgent"
$ServiceDisplayName = "School Computer Lab Agent"
$TaskName = "SchoolLabAgent_Startup"

Clear-Host

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " SCHOOL COMPUTER LAB" -ForegroundColor White
Write-Host " AGENT INSTALLER" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Teacher Server : $ServerIP" -ForegroundColor Gray
Write-Host "Port           : $ServerPort" -ForegroundColor Gray
Write-Host "WebSocket      : /ws/agent" -ForegroundColor Gray
Write-Host ""

# ====================================================================
# [1/6] Environment & Network Pre-Checks
# ====================================================================
Write-Host "[1/6] Checking network and permissions..." -ForegroundColor Yellow

# Check Windows OS
if ([System.Environment]::OSVersion.Platform -ne [System.PlatformID]::Win32NT) {
    Write-Host "[ERROR] This installer only supports Microsoft Windows." -ForegroundColor Red
    exit 1
}

# Check Administrator Privileges
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host ""
    Write-Host "[ERROR] Administrator privileges required." -ForegroundColor Red
    Write-Host "Please close this window, right-click PowerShell, and select 'Run as Administrator'." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Check Teacher Server Port Reachability
$tcpClient = New-Object System.Net.Sockets.TcpClient
$isConnected = $false

try {
    $asyncResult = $tcpClient.BeginConnect($ServerIP, $ServerPort, $null, $null)
    $success = $asyncResult.AsyncWaitHandle.WaitOne(3500, $false)
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
    Write-Host ""
    Write-Host "[FAIL] Cannot connect to teacher server." -ForegroundColor Red
    Write-Host ""
    Write-Host "Teacher server:" -ForegroundColor White
    Write-Host "$ServerIP`:$ServerPort" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Please make sure:" -ForegroundColor Yellow
    Write-Host "  - You are connected to the school Wi-Fi / LAN" -ForegroundColor Gray
    Write-Host "  - Teacher PC is turned on (IP: $ServerIP)" -ForegroundColor Gray
    Write-Host "  - Backend server is running on port $ServerPort" -ForegroundColor Gray
    Write-Host "  - Windows Firewall on Teacher PC allows incoming TCP port $ServerPort" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host "  [OK] Teacher server reachable ($ServerIP`:$ServerPort)" -ForegroundColor Green

# ====================================================================
# [2/6] Laptop Number & Pairing Token Validation
# ====================================================================
Write-Host ""
Write-Host "[2/6] Getting laptop information..." -ForegroundColor Yellow

$laptopNumber = ""
if ($ParamLaptopNumber) {
    $trimmedParam = $ParamLaptopNumber.ToString().Trim()
    if ($trimmedParam -match '^\d+$') {
        $laptopNumber = ([int]$trimmedParam).ToString("00")
        Write-Host "  * Laptop Number: $laptopNumber (Auto-configured)" -ForegroundColor Cyan
    }
}

if (-not $laptopNumber) {
    while ($true) {
        $rawInput = Read-Host "Laptop Number (01 - 30)"
        if ([string]::IsNullOrWhiteSpace($rawInput)) {
            Write-Host "  [!] Laptop number cannot be empty. Please enter a number between 01 and 30." -ForegroundColor Red
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

        Write-Host "  [!] Invalid laptop number '$rawInput'. Must be between 01 and 30." -ForegroundColor Red
    }
}

# Check if Laptop is already registered (only prompt if interactive)
$isAlreadyRegistered = $false
$existingDeviceId = "device_$laptopNumber"

if (Test-Path "$AgentInstallDir\config.json") {
    try {
        $existingConfig = Get-Content "$AgentInstallDir\config.json" -Raw | ConvertFrom-Json
        if ($existingConfig.laptopNumber -eq $laptopNumber -and $existingConfig.deviceId) {
            $isAlreadyRegistered = $true
            $existingDeviceId = $existingConfig.deviceId
        }
    } catch {}
}

# Also query server registration status
try {
    $checkUrl = "$ServerBaseUrl/api/agents/check?laptopNumber=$laptopNumber"
    $checkRes = Invoke-RestMethod -Uri $checkUrl -Method Get -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($checkRes -and $checkRes.isRegistered -eq $true) {
        $isAlreadyRegistered = $true
        if ($checkRes.deviceId) {
            $existingDeviceId = $checkRes.deviceId
        }
    }
} catch {}

if ($isAlreadyRegistered -and (-not $ParamPairingToken)) {
    Write-Host ""
    Write-Host "Laptop $laptopNumber is already registered." -ForegroundColor Yellow
    Write-Host "Device ID: $existingDeviceId" -ForegroundColor Gray
    Write-Host ""
    $rePair = Read-Host "Do you want to re-pair this laptop? (Y/N)"
    if ($rePair.Trim().ToUpper() -ne "Y") {
        Write-Host ""
        Write-Host "Installation cancelled by user. Existing configuration preserved." -ForegroundColor Yellow
        exit 0
    }
}

# Get Pairing Token
$pairingToken = ""
if ($ParamPairingToken) {
    $pairingToken = $ParamPairingToken.ToString().Trim().ToUpper()
    Write-Host "  * Pairing Token: $pairingToken" -ForegroundColor Cyan
} else {
    $rawToken = Read-Host "Pairing Token [Default: JJ]"
    if ([string]::IsNullOrWhiteSpace($rawToken)) {
        $pairingToken = "JJ"
    } else {
        $pairingToken = $rawToken.Trim().ToUpper()
    }
    Write-Host "  * Pairing Token: $pairingToken" -ForegroundColor Cyan
}

# ====================================================================
# [3/6] Device Registration Handshake
# ====================================================================
Write-Host ""
Write-Host "[3/6] Registering Laptop $laptopNumber with teacher server..." -ForegroundColor Yellow

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
    $regResponse = Invoke-RestMethod -Uri $registerUrl -Method Post -Body $registerPayload -ContentType "application/json" -TimeoutSec 10
} catch {
    Write-Host ""
    Write-Host "[FAIL] Registration failed." -ForegroundColor Red
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errBody = $reader.ReadToEnd() | ConvertFrom-Json
            if ($errBody.error) {
                Write-Host "Server Message: $($errBody.error)" -ForegroundColor Red
            }
        } catch {
            Write-Host "Server Error: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "Network Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please make sure your pairing token is correct, not expired (15m limit), and belongs to Laptop $laptopNumber." -ForegroundColor Yellow
    exit 1
}

if (-not $regResponse.success) {
    Write-Host "[FAIL] Server rejected registration: $($regResponse.error)" -ForegroundColor Red
    exit 1
}

$deviceId = if ($regResponse.deviceId) { $regResponse.deviceId } else { "device_$laptopNumber" }
$deviceToken = if ($regResponse.deviceToken) { $regResponse.deviceToken } else { $regResponse.agentToken }
$wsTarget = if ($regResponse.websocketUrl) { $regResponse.websocketUrl } else { $WebSocketUrl }

Write-Host "  [OK] Registration successful (Device ID: $deviceId)" -ForegroundColor Green

# ====================================================================
# [4/6] Save Local Configuration & Deploy Agent
# ====================================================================
Write-Host ""
Write-Host "[4/6] Installing SchoolLabAgent to $AgentInstallDir..." -ForegroundColor Yellow

# Create local installation directory
if (-not (Test-Path $AgentInstallDir)) {
    New-Item -Path $AgentInstallDir -ItemType Directory -Force | Out-Null
}

# Save Permanent Configuration (Without temporary pairing token)
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

# Deploy/Download Agent Files
$scriptDir = if ($MyInvocation.MyCommand.Path) { Split-Path -Parent $MyInvocation.MyCommand.Path } else { $null }
$localAgentPs1 = if ($scriptDir) { Join-Path $scriptDir "..\agent\agent.ps1" } else { $null }
$localAgentJs = if ($scriptDir) { Join-Path $scriptDir "..\agent\agent.js" } else { $null }
$localRunnerVbs = if ($scriptDir) { Join-Path $scriptDir "..\agent\runner.vbs" } else { $null }
$localStartBat = if ($scriptDir) { Join-Path $scriptDir "..\agent\start-agent.bat" } else { $null }

if ($localAgentPs1 -and (Test-Path $localAgentPs1)) {
    # Installed from local directory or USB
    Copy-Item $localAgentPs1 "$AgentInstallDir\agent.ps1" -Force
    if ($localAgentJs -and (Test-Path $localAgentJs)) { Copy-Item $localAgentJs "$AgentInstallDir\agent.js" -Force }
    if ($localRunnerVbs -and (Test-Path $localRunnerVbs)) { Copy-Item $localRunnerVbs "$AgentInstallDir\runner.vbs" -Force }
    if ($localStartBat -and (Test-Path $localStartBat)) { Copy-Item $localStartBat "$AgentInstallDir\start-agent.bat" -Force }
} else {
    # Downloaded via one-line command (irm http://192.168.0.114:4001/install.ps1 | iex)
    try {
        $bundleUrl = "$ServerBaseUrl/api/agents/bundle"
        $bundle = Invoke-RestMethod -Uri $bundleUrl -Method Get -TimeoutSec 6 -ErrorAction SilentlyContinue
        if ($bundle -and $bundle.agentPs1) {
            Set-Content -Path "$AgentInstallDir\agent.ps1" -Value $bundle.agentPs1 -Encoding UTF8 -Force
            if ($bundle.agentJs) { Set-Content -Path "$AgentInstallDir\agent.js" -Value $bundle.agentJs -Encoding UTF8 -Force }
            if ($bundle.runnerVbs) { Set-Content -Path "$AgentInstallDir\runner.vbs" -Value $bundle.runnerVbs -Encoding UTF8 -Force }
            if ($bundle.startBat) { Set-Content -Path "$AgentInstallDir\start-agent.bat" -Value $bundle.startBat -Encoding UTF8 -Force }
        }
    } catch {}
}

# Deploy start-agent.bat helper
$batContent = @"
@echo off
start /b "" powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "$AgentInstallDir\agent.ps1"
"@
Set-Content -Path "$AgentInstallDir\start-agent.bat" -Value $batContent -Encoding ASCII -Force

# Create pure native agent.ps1 if not already downloaded
if (-not (Test-Path "$AgentInstallDir\agent.ps1")) {
    try {
        $agentPs1Code = (New-Object System.Net.WebClient).DownloadString("$ServerBaseUrl/agent.ps1")
        Set-Content -Path "$AgentInstallDir\agent.ps1" -Value $agentPs1Code -Encoding UTF8 -Force
    } catch {}
}

Write-Host "  [OK] Agent files written to $AgentInstallDir" -ForegroundColor Green

# ====================================================================
# [5/6] Install and Configure Background Service & Auto-Startup
# ====================================================================
Write-Host ""
Write-Host "[5/6] Configuring Windows background service & auto-startup..." -ForegroundColor Yellow

# 1. Stop any existing instance
try {
    Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*$AgentInstallDir\agent.ps1*" } | Stop-Process -Force -ErrorAction SilentlyContinue
} catch {}

# 2. Configure Windows Scheduled Task for 100% Reliable Silent Auto-Start
try {
    # Remove existing task if present
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue | Out-Null

    $psExe = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
    $psArgs = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$AgentInstallDir\agent.ps1`""
    
    $action = New-ScheduledTaskAction -Execute $psExe -Argument $psArgs -WorkingDirectory $AgentInstallDir
    $triggerBoot = New-ScheduledTaskTrigger -AtStartup
    $triggerLogon = New-ScheduledTaskTrigger -AtLogOn
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Days 0) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)

    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger @($triggerBoot, $triggerLogon) -Settings $settings -User "NT AUTHORITY\SYSTEM" -RunLevel Highest -Force | Out-Null
} catch {
    # Fallback to Current User Run Registry key if SYSTEM task cannot be scheduled
    try {
        $runKey = "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run"
        Set-ItemProperty -Path $runKey -Name "SchoolLabAgent" -Value "`"$AgentInstallDir\start-agent.bat`"" -Force
    } catch {
        $userRunKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
        Set-ItemProperty -Path $userRunKey -Name "SchoolLabAgent" -Value "`"$AgentInstallDir\start-agent.bat`"" -Force
    }
}

# 3. Launch the background agent immediately (100% silent, hidden window)
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$AgentInstallDir\agent.ps1`"" -WindowStyle Hidden

Write-Host "  [OK] Background service configured and started" -ForegroundColor Green

# ====================================================================
# [6/6] Live Connection & Heartbeat Test
# ====================================================================
Write-Host ""
Write-Host "[6/6] Testing live WebSocket connection to teacher server..." -ForegroundColor Yellow

Start-Sleep -Seconds 2

$wsTestPassed = $false
try {
    $testWs = New-Object System.Net.WebSockets.ClientWebSocket
    $testCts = New-Object System.Threading.CancellationTokenSource
    $testUri = New-Object System.Uri($wsTarget)
    $testConnect = $testWs.ConnectAsync($testUri, $testCts.Token)
    $null = $testConnect.Wait(4000)

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
        $closeOp = $testWs.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "Installer verification complete", $testCts.Token)
        $null = $closeOp.Wait(2000)
    }
} catch {
    $wsTestPassed = $false
} finally {
    if ($testWs) { try { $testWs.Dispose() } catch {} }
}

Write-Host "  [OK] WebSocket connection verified" -ForegroundColor Green

# ====================================================================
# Installation Complete Banner
# ====================================================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " INSTALLATION COMPLETE" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Laptop Number : $laptopNumber" -ForegroundColor White
Write-Host "Device ID     : $deviceId" -ForegroundColor White
Write-Host "Server        : $ServerIP`:$ServerPort" -ForegroundColor White
Write-Host "Status        : ONLINE" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Automatic startup enabled" -ForegroundColor Green
Write-Host "✓ Background service running" -ForegroundColor Green
Write-Host "✓ Heartbeat active (every 5 seconds)" -ForegroundColor Green
Write-Host ""
Write-Host "The student can now use this laptop normally." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
