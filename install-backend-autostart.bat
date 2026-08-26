@echo off
title Install Backend Auto-Start
echo ========================================================
echo   Installing CIIS PC Agent Backend to Windows Startup
echo ========================================================
echo.

set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "TARGET_VBS=%~dp0start-backend-silent.vbs"

echo Creating shortcut in Startup folder:
echo %STARTUP_DIR%
echo.

powershell -NoProfile -Command "$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%STARTUP_DIR%\CIIS_School_Backend.lnk'); $s.TargetPath = 'wscript.exe'; $s.Arguments = '\"%TARGET_VBS%\"'; $s.WorkingDirectory = '%~dp0'; $s.Save()"

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Backend server will now start automatically whenever Windows boots up!
) else (
    echo [ERROR] Failed to create startup shortcut.
)

echo.
pause
