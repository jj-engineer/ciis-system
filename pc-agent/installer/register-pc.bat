@echo off
title Register School Laptop - CIIS School System
echo ========================================================
echo   CIIS School PC Agent - Laptop Setup Assistant
echo ========================================================
echo.
echo Use this on the School Laptop to connect to Teacher Dashboard.
echo.

set /p SERVER_IP="Enter Teacher/Server IP Address (e.g. 192.168.1.50 or press Enter for localhost): "
if "%SERVER_IP%"=="" set SERVER_IP=localhost

set /p COMP_NUM="Enter Laptop Number (e.g. 01, 02, ... 30): "
set /p REG_TOKEN="Enter Pairing Token from Teacher Dashboard (e.g. REG-01-XXXX): "

echo.
echo Saving configuration for Laptop %COMP_NUM%...
echo Server Target: ws://%SERVER_IP%:4001/ws/agent

REM Write runner/config.json
(
  echo {
  echo   "serverUrl": "ws://%SERVER_IP%:4001/ws/agent",
  echo   "computerNumber": "%COMP_NUM%",
  echo   "agentToken": "%REG_TOKEN%",
  echo   "agentVersion": "0.1.0",
  echo   "heartbeatIntervalMs": 5000,
  echo   "autoStartWithWindows": true
  echo }
) > "%~dp0..\runner\config.json"

REM Write csharp/Config/appsettings.json
(
  echo {
  echo   "serverUrl": "ws://%SERVER_IP%:4001/ws/agent",
  echo   "computerNumber": "%COMP_NUM%",
  echo   "agentToken": "%REG_TOKEN%",
  echo   "agentVersion": "0.1.0",
  echo   "heartbeatIntervalSeconds": 5,
  echo   "autoStartWithWindows": true
  echo }
) > "%~dp0..\csharp\Config\appsettings.json"

echo.
echo ========================================================
echo   [OK] Laptop %COMP_NUM% configured successfully!
echo ========================================================
echo.
echo Would you like to start the Agent now?
pause

start "" "%~dp0..\runner\run-agent.bat"
