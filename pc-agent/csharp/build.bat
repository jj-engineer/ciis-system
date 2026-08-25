@echo off
title Building CIIS School PC Agent (.NET 8)
echo ========================================================
echo   Building CIIS School PC Agent C# Project
echo ========================================================
echo.

dotnet build SchoolPcAgent.csproj -c Release
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed. Please ensure .NET 8 SDK is installed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [OK] Build completed successfully!
pause
