@echo off
title CIIS School PC Agent Backend Server
echo ========================================================
echo   CIIS School PC Agent Backend Server (Port 4001)
echo ========================================================
echo.
node "%~dp0backend\src\server.js"
pause
