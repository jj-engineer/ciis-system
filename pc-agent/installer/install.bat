@echo off
rem ====================================================================
rem CIIS School Computer Lab Agent — CMD Installer Launcher
rem Launches PowerShell Installer with ExecutionPolicy Bypass as Administrator
rem ====================================================================

title CIIS School Computer Lab Agent Installer

>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo [!] Requesting Administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"\"%~dp0install.bat\"\"' -Verb RunAs"
    exit /b
)

echo ========================================================
echo   CIIS School Computer Lab Agent Installer
echo ========================================================
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install.ps1"

echo.
pause
