@echo off
title CIIS School PC Agent (Background Monitor)
echo ========================================================
echo   CIIS School PC Agent MVP - Running in Background
echo ========================================================
echo.

node "%~dp0agent.js"

pause
