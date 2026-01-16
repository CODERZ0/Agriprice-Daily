@echo off
title AgriPrice Daily - Full Stack Runner
color 0A

echo ===============================
echo   AGRIPRICE DAILY STARTING...
echo ===============================
echo.

REM ✅ Move to project root folder
cd /d "%~dp0"

echo ✅ Starting BACKEND...
start "AgriPrice Backend" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo ✅ Starting FRONTEND...
start "AgriPrice Frontend" cmd /k "npm run dev"

timeout /t 2 /nobreak >nul

echo ✅ Opening Browser...
start "" "http://localhost:5173/"

echo.
echo ===============================
echo ✅ App Started Successfully!
echo ===============================
echo.
exit
