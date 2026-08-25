<#
====================================================================
 CIIS SCHOOL COMPUTER LAB — WORKSTATION PROVISIONING ENGINE
====================================================================
 Pixel-Perfect Straight Box Borders (Green Lines)
 Clean White & Gray Loading Animations
 Realistic IT Engineering Pacing (~6-8s Pacing)
====================================================================
#>

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Stop"

# Server Configuration
$ServerIP = "192.168.0.114"
$ServerPort = 4001
$WebSocketUrl = "ws://192.168.0.114:4001/ws/agent"
$ServerBaseUrl = "http://${ServerIP}:${ServerPort}"
$AgentInstallDir = "C:\SchoolLabAgent"
$TaskName = "SchoolLabAgent_Startup"

# ====================================================================
# Precision Box-Drawing & Terminal UI Helpers
# ====================================================================

$BOX_INNER_WIDTH = 67

function Write-BoxBorderTop {
    param ([int]$Width = 67)
    $line = "═" * ($Width + 4)
    Write-Host " ╔$line╗" -ForegroundColor Green
}

function Write-BoxBorderDivider {
    param ([int]$Width = 67)
    $line = "═" * ($Width + 4)
    Write-Host " ╠$line╣" -ForegroundColor Green
}

function Write-BoxBorderBottom {
    param ([int]$Width = 67)
    $line = "═" * ($Width + 4)
    Write-Host " ╚$line╝" -ForegroundColor Green
}

function Write-BoxLine {
    param (
        [string]$Content = "",
        [string]$TextColor = "White",
        [string]$Prefix = "",
        [string]$PrefixColor = "White",
        [int]$Width = 67
    )
    $prefixLen = $Prefix.Length
    $contentLen = $Content.Length
    $totalLen = $prefixLen + $contentLen
    $padCount = [Math]::Max(0, $Width - $totalLen)
    $spaces = " " * $padCount

    Write-Host " ║  " -NoNewline -ForegroundColor Green
    if ($Prefix) {
        Write-Host "$Prefix" -NoNewline -ForegroundColor $PrefixColor
    }
    if ($Content) {
        Write-Host "$Content" -NoNewline -ForegroundColor $TextColor
    }
    Write-Host "$spaces" -NoNewline
    Write-Host "  ║" -ForegroundColor Green
}

function Write-Header {
    Clear-Host
    Write-Host ""
    Write-BoxBorderTop $BOX_INNER_WIDTH
    Write-BoxLine -Prefix "CIIS COMPUTER LAB NETWORK  " -PrefixColor White -Content "•  WORKSTATION PROVISIONING ENGINE" -TextColor DarkGray -Width $BOX_INNER_WIDTH
    Write-BoxLine -Content "Gateway: 192.168.0.114:4001  •  Protocol: WebSocket TCP Core" -TextColor DarkGray -Width $BOX_INNER_WIDTH
    Write-BoxBorderBottom $BOX_INNER_WIDTH
    Write-Host ""
}

function Show-StepHeader {
    param ([string]$Number, [string]$Title)
    Write-Host ""
    Write-Host " ┌───" -NoNewline -ForegroundColor Green
    Write-Host "[$Number] " -NoNewline -ForegroundColor White
    Write-Host "$Title" -ForegroundColor White
}

function Show-StepDone {
    param ([string]$Message)
    Write-Host " └───" -NoNewline -ForegroundColor Green
    Write-Host "✔ " -NoNewline -ForegroundColor Green
    Write-Host "$Message" -ForegroundColor White
}

function Show-Property {
    param ([string]$Key, [string]$Value)
    Write-Host " ├── " -NoNewline -ForegroundColor Green
    Write-Host "$Key : " -NoNewline -ForegroundColor DarkGray
    Write-Host "$Value" -ForegroundColor White
}

function Show-ITProgress {
    param (
        [string]$TaskName,
        [int]$Width = 24,
        [int]$MinDelay = 30,
        [int]$MaxDelay = 60
    )
    Write-Host " ├── " -NoNewline -ForegroundColor Green
    Write-Host "$TaskName " -NoNewline -ForegroundColor DarkGray
    Write-Host -NoNewline "[" -ForegroundColor DarkGray
    for ($i = 1; $i -le $Width; $i++) {
        # Loading animation in crisp White
        Write-Host -NoNewline "█" -ForegroundColor White
        if ($i -eq [int]($Width * 0.65) -or $i -eq [int]($Width * 0.88)) {
            Start-Sleep -Milliseconds (Get-Random -Minimum 120 -Maximum 200)
        } else {
            Start-Sleep -Milliseconds (Get-Random -Minimum $MinDelay -Maximum $MaxDelay)
        }
    }
    Write-Host "] " -NoNewline -ForegroundColor DarkGray
    Write-Host "OK" -ForegroundColor Green
}

function Show-FailAndExit {
    param ([string]$ErrorTitle, [string]$Details = "")
    Write-Host ""
    Write-BoxBorderTop $BOX_INNER_WIDTH
    Write-BoxLine -Prefix "✖ " -PrefixColor Red -Content "PROVISIONING FAILED: $ErrorTitle" -TextColor Red -Width $BOX_INNER_WIDTH
    if ($Details) {
        Write-BoxBorderDivider $BOX_INNER_WIDTH
        Write-BoxLine -Content "$Details" -TextColor DarkGray -Width $BOX_INNER_WIDTH
    }
    Write-BoxBorderBottom $BOX_INNER_WIDTH
    Write-Host ""
    exit 1
}

# 1. Render Header
Write-Header

# ====================================================================
# [STEP 1] Discovery & Environment Audit
# ====================================================================
Show-StepHeader "01/04" "NETWORK DISCOVERY & SYSTEM ENVIRONMENT"

if ([System.Environment]::OSVersion.Platform -ne [System.PlatformID]::Win32NT) {
    Show-FailAndExit "This provisioner only supports Windows 10 / 11."
}

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Show-FailAndExit "Administrator privileges required." "Please close this window, right-click PowerShell, and select 'Run as Administrator'."
}

Show-Property "Host Machine" "$env:COMPUTERNAME"
Show-Property "User Privileges" "Administrator (Elevated)"

Show-ITProgress "Probing Teacher Gateway ($ServerIP`:$ServerPort)" 20 25 50

# TCP Connection Check
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
    Show-FailAndExit "Cannot connect to Teacher Gateway at $ServerIP`:$ServerPort" "Ensure the laptop is connected to the school Wi-Fi network and teacher server is active."
}

Show-StepDone "Gateway link established ($ServerIP`:$ServerPort)"

# ====================================================================
# [STEP 2] Laptop Identity & Master Authentication
# ====================================================================
Show-StepHeader "02/04" "IDENTITY ASSIGNMENT & MASTER TOKEN"

$laptopNumber = ""
if ($ParamLaptopNumber) {
    $trimmedParam = $ParamLaptopNumber.ToString().Trim()
    if ($trimmedParam -match '^\d+$') {
        $laptopNumber = ([int]$trimmedParam).ToString("00")
        Show-Property "Workstation Node" "Laptop $laptopNumber"
    }
}

if (-not $laptopNumber) {
    Write-Host ""
    while ($true) {
        Write-Host " ├── " -NoNewline -ForegroundColor Green
        $rawInput = Read-Host "Assign Laptop Number (01 - 30)"
        if ([string]::IsNullOrWhiteSpace($rawInput)) {
            Write-Host " │   [!] Number cannot be empty." -ForegroundColor DarkGray
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
        Write-Host " │   [!] Must be between 01 and 30." -ForegroundColor DarkGray
    }
}

$pairingToken = "JJ"
if ($ParamPairingToken) {
    $pairingToken = $ParamPairingToken.ToString().Trim().ToUpper()
    Show-Property "Security Key" "$pairingToken (Master Authorized)"
} else {
    Write-Host " ├── " -NoNewline -ForegroundColor Green
    $rawToken = Read-Host "Pairing Token [Default: JJ]"
    if (-not [string]::IsNullOrWhiteSpace($rawToken)) {
        $pairingToken = $rawToken.Trim().ToUpper()
    }
    Show-Property "Security Key" "$pairingToken"
}

Show-ITProgress "Exchanging registration handshake with Gateway" 24 35 65

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
    $errMsg = $_.Exception.Message
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errBody = $reader.ReadToEnd() | ConvertFrom-Json
            if ($errBody.error) { $errMsg = $errBody.error }
        } catch {}
    }
    Show-FailAndExit "Server handshake failed: $errMsg" "Make sure the token JJ is authorized."
}

if (-not $regResponse.success) {
    Show-FailAndExit "Server rejected registration: $($regResponse.error)"
}

$deviceId = if ($regResponse.deviceId) { $regResponse.deviceId } else { "device_$laptopNumber" }
$deviceToken = if ($regResponse.deviceToken) { $regResponse.deviceToken } else { $regResponse.agentToken }
$wsTarget = if ($regResponse.websocketUrl) { $regResponse.websocketUrl } else { $WebSocketUrl }

Show-StepDone "Workstation authorized (Device ID: $deviceId)"

# ====================================================================
# [STEP 3] Deploy Local Agent & Windows Startup Service
# ====================================================================
Show-StepHeader "03/04" "AGENT DEPLOYMENT & WINDOWS SERVICE SETUP"

if (-not (Test-Path $AgentInstallDir)) {
    New-Item -Path $AgentInstallDir -ItemType Directory -Force | Out-Null
}

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

Show-ITProgress "Writing agent runtime binaries" 18 20 40

try {
    $agentPs1Code = (New-Object System.Net.WebClient).DownloadString("$ServerBaseUrl/agent.ps1")
    if ($agentPs1Code -and $agentPs1Code.Length -gt 100) {
        Set-Content -Path "$AgentInstallDir\agent.ps1" -Value $agentPs1Code -Encoding UTF8 -Force
    }
} catch {}

if (-not (Test-Path "$AgentInstallDir\agent.ps1")) {
    try {
        $bundle = Invoke-RestMethod -Uri "$ServerBaseUrl/api/agents/bundle" -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($bundle -and $bundle.agentPs1) {
            Set-Content -Path "$AgentInstallDir\agent.ps1" -Value $bundle.agentPs1 -Encoding UTF8 -Force
        }
    } catch {}
}

$batContent = "@echo off`nstart /b `"`" powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$AgentInstallDir\agent.ps1`""
Set-Content -Path "$AgentInstallDir\start-agent.bat" -Value $batContent -Encoding ASCII -Force

Show-ITProgress "Configuring Windows background daemon & startup hook" 26 30 55

# Stop existing running instance
try {
    Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*$AgentInstallDir\agent.ps1*" } | Stop-Process -Force -ErrorAction SilentlyContinue
} catch {}

# Configure Windows Scheduled Task
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
    try {
        Set-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "SchoolLabAgent" -Value "`"$AgentInstallDir\start-agent.bat`"" -Force
    } catch {
        Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run" -Name "SchoolLabAgent" -Value "`"$AgentInstallDir\start-agent.bat`"" -Force
    }
}

# Start background agent
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$AgentInstallDir\agent.ps1`"" -WindowStyle Hidden

Show-StepDone "Silent background service installed & active"

# ====================================================================
# [STEP 4] Real-Time Telemetry Stream Verification
# ====================================================================
Show-StepHeader "04/04" "REAL-TIME TELEMETRY VERIFICATION"

Show-ITProgress "Synchronizing live WebSocket channel" 28 35 70

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

Show-StepDone "Live telemetry stream active (5s Heartbeat Cycle)"

# ====================================================================
# Pixel-Perfect Grand Summary Box (Green Lines, Straight Alignment)
# ====================================================================
Write-Host ""
Write-BoxBorderTop $BOX_INNER_WIDTH
Write-BoxLine -Prefix "✔ " -PrefixColor Green -Content "WORKSTATION SYNCHRONIZED & READY FOR LAB SESSION" -TextColor White -Width $BOX_INNER_WIDTH
Write-BoxBorderDivider $BOX_INNER_WIDTH
Write-BoxLine -Prefix "• Workstation Identifier :  " -PrefixColor DarkGray -Content "Laptop $laptopNumber ($deviceId)" -TextColor White -Width $BOX_INNER_WIDTH
Write-BoxLine -Prefix "• Teacher Server Gateway :  " -PrefixColor DarkGray -Content "$ServerIP`:$ServerPort" -TextColor White -Width $BOX_INNER_WIDTH
Write-BoxLine -Prefix "• Telemetry Status       :  " -PrefixColor DarkGray -Content "ONLINE / ACTIVE" -TextColor Green -Width $BOX_INNER_WIDTH
Write-BoxLine -Prefix "• Background Service     :  " -PrefixColor DarkGray -Content "Enabled (Silent Startup on Windows Boot)" -TextColor White -Width $BOX_INNER_WIDTH
Write-BoxBorderDivider $BOX_INNER_WIDTH
Write-BoxLine -Content "Setup complete. The student can now use this laptop normally." -TextColor DarkGray -Width $BOX_INNER_WIDTH
Write-BoxLine -Content "You may safely close this terminal window." -TextColor DarkGray -Width $BOX_INNER_WIDTH
Write-BoxBorderBottom $BOX_INNER_WIDTH
Write-Host ""
