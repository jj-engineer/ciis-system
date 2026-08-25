@echo off
rem CIIS School Computer Lab Agent — Background Service Launcher
cd /d "C:\SchoolLabAgent"
start /b "" powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "C:\SchoolLabAgent\agent.ps1"
