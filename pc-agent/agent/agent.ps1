<#
====================================================================
CIIS School Computer Lab Agent — Native Windows PowerShell Worker
====================================================================
Runs silently in background as a Windows Service / Startup Process.
Zero external runtime dependencies (pure .NET ClientWebSocket).
Non-intrusive: Students can use Word, Excel, Chrome completely normally.
====================================================================
#>

[CmdletBinding()]
param (
    [string]$ConfigFilePath = "C:\SchoolLabAgent\config.json"
)

$ErrorActionPreference = "SilentlyContinue"

# Load or locate configuration file
if (-not (Test-Path $ConfigFilePath)) {
    if ($MyInvocation.MyCommand.Path) {
        $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
        $altConfig = Join-Path $scriptDir "config.json"
        if (Test-Path $altConfig) {
            $ConfigFilePath = $altConfig
        }
    }
}

if (-not (Test-Path $ConfigFilePath)) {
    Write-Error "Configuration file not found at $ConfigFilePath"
    exit 1
}

try {
    $configJson = Get-Content -Path $ConfigFilePath -Raw -Encoding UTF8 | ConvertFrom-Json
} catch {
    Write-Error "Failed to parse configuration: $_"
    exit 1
}

$ServerIp = if ($configJson.serverIp) { $configJson.serverIp } else { "192.168.0.107" }
$ServerPort = if ($configJson.serverPort) { $configJson.serverPort } else { 4001 }
$WebSocketUrl = if ($configJson.websocketUrl) { $configJson.websocketUrl } else { "ws://$($ServerIp):$($ServerPort)/ws/agent" }
$LaptopNumber = if ($configJson.laptopNumber) { $configJson.laptopNumber } else { "01" }
$DeviceId = if ($configJson.deviceId) { $configJson.deviceId } else { "device_$($LaptopNumber)" }
$DeviceToken = if ($configJson.deviceToken) { $configJson.deviceToken } else { "token_$($LaptopNumber)" }
$HeartbeatIntervalMs = if ($configJson.heartbeatIntervalMs) { [int]$configJson.heartbeatIntervalMs } else { 5000 }
$AgentVersion = if ($configJson.agentVersion) { $configJson.agentVersion } else { "1.0.0" }
$Hostname = $env:COMPUTERNAME

Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  CIIS SCHOOL PC AGENT v$AgentVersion" -ForegroundColor White
Write-Host "=========================================================" -ForegroundColor Cyan
Write-Host "  * Laptop Number: $LaptopNumber"
Write-Host "  * Device ID:     $DeviceId"
Write-Host "  * Server Target: $WebSocketUrl"
Write-Host "  * Heartbeat:     $($HeartbeatIntervalMs / 1000)s"
Write-Host "=========================================================" -ForegroundColor Cyan

# Main Worker Loop with Automatic Reconnection
while ($true) {
    try {
        $ws = New-Object System.Net.WebSockets.ClientWebSocket
        $cts = New-Object System.Threading.CancellationTokenSource
        
        Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] Connecting to $WebSocketUrl..." -ForegroundColor Yellow
        $uri = New-Object System.Uri($WebSocketUrl)
        $connectTask = $ws.ConnectAsync($uri, $cts.Token)
        $null = $connectTask.Wait(8000)

        if ($ws.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
            Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] Connected! Authenticating Laptop $LaptopNumber..." -ForegroundColor Green

            # 1. Send Authentication Handshake
            $authPayload = @{
                type = "auth"
                computerNumber = $LaptopNumber
                laptopNumber = $LaptopNumber
                deviceId = $DeviceId
                agentToken = $DeviceToken
                deviceToken = $DeviceToken
                hostname = $Hostname
                agentVersion = $AgentVersion
            } | ConvertTo-Json -Compress

            $authBytes = [System.Text.Encoding]::UTF8.GetBytes($authPayload)
            $authSegment = New-Object System.ArraySegment[byte] -ArgumentList @(,$authBytes)
            $sendTask = $ws.SendAsync($authSegment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token)
            $null = $sendTask.Wait(4000)

            Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] Authenticated! Status: ONLINE" -ForegroundColor Green

            # 2. Heartbeat Loop
            $buffer = New-Object byte[] 4096
            $receiveSegment = New-Object System.ArraySegment[byte] -ArgumentList @(,$buffer)

            while ($ws.State -eq [System.Net.WebSockets.WebSocketState]::Open) {
                # Send Heartbeat
                $heartbeatPayload = @{
                    type = "heartbeat"
                    computerNumber = $LaptopNumber
                    laptopNumber = $LaptopNumber
                    deviceId = $DeviceId
                    status = "online"
                    timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                } | ConvertTo-Json -Compress

                $hbBytes = [System.Text.Encoding]::UTF8.GetBytes($heartbeatPayload)
                $hbSegment = New-Object System.ArraySegment[byte] -ArgumentList @(,$hbBytes)
                $hbTask = $ws.SendAsync($hbSegment, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token)
                $null = $hbTask.Wait(2000)

                # Wait for next heartbeat interval or check for incoming messages
                $sleepIterations = [Math]::Max(1, [int]($HeartbeatIntervalMs / 500))
                for ($i = 0; $i -lt $sleepIterations; $i++) {
                    if ($ws.State -ne [System.Net.WebSockets.WebSocketState]::Open) {
                        break
                    }
                    Start-Sleep -Milliseconds 500
                }
            }
        } else {
            Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] Could not establish WebSocket connection. State: $($ws.State)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] Connection error: $_" -ForegroundColor DarkGray
    } finally {
        if ($ws) {
            $closeStatus = $ws.CloseStatus
            $closeDesc = $ws.CloseStatusDescription
            try { $ws.Dispose() } catch {}

            # If laptop was unpaired or revoked by teacher, clean up and terminate
            if ($closeStatus -eq 4001 -or $closeStatus -eq 4003 -or $closeDesc -match "Unpaired|Unauthorized|Revoked") {
                Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] Laptop has been unpaired by teacher. Removing local config..." -ForegroundColor Red
                if (Test-Path $ConfigFilePath) {
                    Remove-Item -Path $ConfigFilePath -Force -ErrorAction SilentlyContinue
                }
                Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] Agent terminated gracefully." -ForegroundColor Yellow
                exit 0
            }
        }
    }

    # Wi-Fi Reconnect Backoff: Wait 5 seconds before retrying
    Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] Reconnecting in 5 seconds..." -ForegroundColor DarkYellow
    Start-Sleep -Seconds 5
}
