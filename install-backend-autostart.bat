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

:: 2. Create Windows Startup Shortcuts (Current User + All Users + Registry)
echo [2/3] Adding shortcut to Windows Startup folder & Registry...
set "USER_STARTUP=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "ALL_STARTUP=C:\ProgramData\Microsoft\Windows\Start Menu\Programs\Startup"
set "TARGET_VBS=%~dp0start-backend-silent.vbs"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; " ^
  "if (Test-Path '%USER_STARTUP%') { $s1 = $ws.CreateShortcut('%USER_STARTUP%\CIIS_School_Backend.lnk'); $s1.TargetPath = 'wscript.exe'; $s1.Arguments = '\"%TARGET_VBS%\"'; $s1.WorkingDirectory = '%~dp0'; $s1.Save() }; " ^
  "if (Test-Path '%ALL_STARTUP%') { $s2 = $ws.CreateShortcut('%ALL_STARTUP%\CIIS_School_Backend.lnk'); $s2.TargetPath = 'wscript.exe'; $s2.Arguments = '\"%TARGET_VBS%\"'; $s2.WorkingDirectory = '%~dp0'; $s2.Save() }; " ^
  "try { Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run' -Name 'CIIS_School_Backend' -Value 'wscript.exe \"%TARGET_VBS%\"' -Force } catch {}"

if %ERRORLEVEL% EQU 0 (
    echo       [OK] Auto-start shortcuts and Registry Run entry created successfully.
) else (
    echo       [WARNING] Could not create all shortcuts.
)

:: 3. Start Backend Server Supervisor Now
echo [3/3] Starting backend server supervisor in background...
wscript.exe "%TARGET_VBS%"
echo       [OK] Backend server supervisor is running silently.
echo.
echo ========================================================
echo   SUCCESS: CIIS Server is installed & running in background!
echo   Even if you close this window or IDE, the server stays online.
echo ========================================================
echo.
pause
