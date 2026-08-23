@echo off
echo Setting up 'open ciis-system' and 'ciis-system' commands...

:: Create open.cmd in User Profile folder
(
echo @echo off
echo if /i "%%~1"=="ciis-system" (
echo     start "" "https://ciis-system.vercel.app/"
echo ^) else if "%%~1"=="" (
echo     start "" "https://ciis-system.vercel.app/"
echo ^) else (
echo     start "" "%%~1"
echo ^)
) > "%USERPROFILE%\open.cmd"

:: Create ciis-system.cmd in User Profile folder
(
echo @echo off
echo start "" "https://ciis-system.vercel.app/"
) > "%USERPROFILE%\ciis-system.cmd"

:: Add User Profile folder to PATH if not present
setx PATH "%PATH%;%USERPROFILE%" >nul 2>&1

echo =========================================================
echo [SUCCESS] Commands successfully configured!
echo.
echo You can now type in Command Prompt:
echo   1. open ciis-system
echo   2. ciis-system
echo =========================================================
pause
