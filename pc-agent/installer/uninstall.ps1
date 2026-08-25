<#
====================================================================
 CIIS SCHOOL COMPUTER LAB AGENT — UNINSTALLER
====================================================================
 Stops background worker, removes service/task, and cleans C:\SchoolLabAgent
====================================================================
#>

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "SilentlyContinue"

$AgentInstallDir = "C:\SchoolLabAgent"
$TaskName = "SchoolLabAgent_Startup"
$ServiceName = "SchoolLabAgent"

Clear-Host

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " SCHOOL COMPUTER LAB" -ForegroundColor White
Write-Host " AGENT UNINSTALLER" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Administrator Privileges
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "[ERROR] Administrator privileges required to uninstall." -ForegroundColor Red
    Write-Host "Please right-click PowerShell and select 'Run as Administrator'." -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/3] Stopping background agent processes..." -ForegroundColor Yellow

# 1. Stop background process
try {
    Get-Process -Name "powershell" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*SchoolLabAgent*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*SchoolLabAgent*" } | Stop-Process -Force -ErrorAction SilentlyContinue
} catch {}

# 2. Remove Windows Service & Scheduled Task
Write-Host "[2/3] Removing service and startup task..." -ForegroundColor Yellow

try {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue | Out-Null
} catch {}

try {
    $runKey = "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run"
    Remove-ItemProperty -Path $runKey -Name "SchoolLabAgent" -ErrorAction SilentlyContinue | Out-Null
    $userRunKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
    Remove-ItemProperty -Path $userRunKey -Name "SchoolLabAgent" -ErrorAction SilentlyContinue | Out-Null
} catch {}

# 3. Remove local installation directory
Write-Host "[3/3] Removing agent files from $AgentInstallDir..." -ForegroundColor Yellow

if (Test-Path $AgentInstallDir) {
    try {
        Remove-Item -Path $AgentInstallDir -Recurse -Force -ErrorAction SilentlyContinue
    } catch {
        Write-Host "  [!] Some files could not be immediately deleted. They will be removed upon restart." -ForegroundColor DarkGray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " UNINSTALLATION COMPLETE" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "School Lab Agent has been removed successfully." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
