@echo off
title Installing CIIS School PC Agent Startup
echo ========================================================
echo   CIIS School PC Agent - Windows Startup Auto-Launch
echo ========================================================
echo.

REM Configure Windows Startup Registry (Current User)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "CIISSchoolPcAgent" /t REG_SZ /d "\"node\" \"%~dp0..\runner\agent.js\"" /f

echo.
echo ========================================================
echo   [OK] Installation Successful!
echo   Agent will start automatically with Windows.
echo ========================================================
pause
