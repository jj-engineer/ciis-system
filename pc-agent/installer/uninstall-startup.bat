@echo off
title Uninstalling CIIS School PC Agent
echo ========================================================
echo   Removing CIIS School PC Agent Startup
echo ========================================================
echo.

reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "CIISSchoolPcAgent" /f

echo.
echo [OK] Removed from Windows Startup registry.
pause
