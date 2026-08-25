@echo off
title Installing CIIS School Lab Agent
echo ========================================================
echo   CIIS Windows School Lab Agent Installation
echo ========================================================
echo.

REM Create Assignments Directory
if not exist "C:\SchoolLab\Assignments" (
    mkdir "C:\SchoolLab\Assignments"
    echo [OK] Created assignment directory C:\SchoolLab\Assignments
)

REM Add to Windows Startup Registry (Current User)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "CIISSchoolLabAgent" /t REG_SZ /d "\"node\" \"%~dp0..\src\agent.js\"" /f

echo.
echo ========================================================
echo   Installation Successful!
echo   Agent is configured to start with Windows.
echo ========================================================
pause
