$backendDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $backendDir

# Auto-restarting background supervisor for CIIS School Computer Lab Agent Server
while ($true) {
    try {
        & node "src\server.js"
    } catch {
        Start-Sleep -Seconds 1
    }
    Start-Sleep -Seconds 2
}
