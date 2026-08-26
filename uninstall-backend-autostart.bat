@echo off
title Remove Backend Auto-Start
echo ========================================================
echo   Removing CIIS PC Agent Backend from Windows Startup
echo ========================================================
echo.

set "STARTUP_SHORTCUT=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\CIIS_School_Backend.lnk"

if exist "%STARTUP_SHORTCUT%" (
    del /f /q "%STARTUP_SHORTCUT%"
    echo [SUCCESS] Startup shortcut removed.
) else (
    echo [INFO] Startup shortcut not found.
)

echo.
pause
