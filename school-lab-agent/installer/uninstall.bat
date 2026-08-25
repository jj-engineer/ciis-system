@echo off
title Uninstalling CIIS School Lab Agent
echo ========================================================
echo   Removing CIIS Windows School Lab Agent
echo ========================================================
echo.

reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "CIISSchoolLabAgent" /f

echo.
echo [OK] Removed from Windows Startup.
pause
