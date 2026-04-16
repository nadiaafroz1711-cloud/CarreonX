@echo off
title CarreonX Automated Launcher
color 0B
echo ====================================================
echo      🚀 CarreonX - Automated System Launcher 🚀
echo ====================================================
echo.

:: 1. Launch FastAPI Backend
echo [1/3] Starting FastAPI Backend on Port 8000...
start "CarreonX Backend" /MIN cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn main:app --reload"

:: 2. Launch Next.js Frontend
echo [2/3] Starting Next.js Frontend on Port 3000...
start "CarreonX Frontend" /MIN cmd /k "cd CarreonX-Web && npm run dev"

:: 3. Give servers a moment to spin up
echo [3/3] Waiting for servers to initialize...
timeout /t 7 /nobreak > nul

:: 4. Launch the Default Browser
echo Launching the application in your browser...
start http://localhost:3000

echo.
echo ✅ Everything is running! You can close this console.
timeout /t 3 > nul
exit
