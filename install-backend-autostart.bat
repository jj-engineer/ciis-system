@echo off
title Install Backend Auto-Start & Firewall Rule
echo ========================================================
echo   Installing CIIS PC Agent Backend to Windows Startup
echo ========================================================
echo.

:: Check Admin for Firewall Rule
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Requesting Administrator privileges for Firewall configuration...
    powershell -NoProfile -Command "Start-Process cmd -ArgumentList '/c \"\"%~dpnx0\"\"' -Verb RunAs"
    exit /b
)

:: 1. Add Windows Firewall Inbound Rule for Port 4001
echo [1/3] Configuring Windows Firewall for Port 4001...
netsh advfirewall firewall delete rule name="CIIS School PC Agent Server (Port 4001)" >nul 2>&1
netsh advfirewall firewall add rule name="CIIS School PC Agent Server (Port 4001)" dir=in action=allow protocol=TCP localport=4001 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo       [OK] Port 4001 allowed through Windows Firewall.
) else (
    echo       [WARNING] Could not set firewall rule.
)

:: 2. Create Windows Startup Shortcut
echo [2/3] Adding shortcut to Windows Startup folder...
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "TARGET_VBS=%~dp0start-backend-silent.vbs"

powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%STARTUP_DIR%\CIIS_School_Backend.lnk'); $s.TargetPath = 'wscript.exe'; $s.Arguments = '\"%TARGET_VBS%\"'; $s.WorkingDirectory = '%~dp0'; $s.Save()"

if %ERRORLEVEL% EQU 0 (
    echo       [OK] Auto-start shortcut created successfully.
) else (
    echo       [ERROR] Failed to create startup shortcut.
)

:: 3. Start Backend Server Now
echo [3/3] Starting backend server in background...
wscript.exe "%TARGET_VBS%"
echo       [OK] Backend server is running.
echo.
echo ========================================================
echo   SUCCESS: Setup Complete!
echo ========================================================
echo.
pause
