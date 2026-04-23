@echo off
setlocal
title CarreonX Automated Launcher
color 0B

cd /d "%~dp0"

echo ====================================================
echo            CarreonX Automated Launcher
echo ====================================================
echo.

set "BACKEND_ACTIVATE="
if exist "%CD%\backend\venv\Scripts\activate.bat" set "BACKEND_ACTIVATE=%CD%\backend\venv\Scripts\activate.bat"
if not defined BACKEND_ACTIVATE if exist "%CD%\venv\Scripts\activate.bat" set "BACKEND_ACTIVATE=%CD%\venv\Scripts\activate.bat"

if not exist "%CD%\backend\main.py" (
  echo Backend entrypoint not found at backend\main.py
  pause
  exit /b 1
)

if not exist "%CD%\CarreonX-Web\package.json" (
  echo Frontend entrypoint not found at CarreonX-Web\package.json
  pause
  exit /b 1
)

echo [1/4] Checking Python environment...
if defined BACKEND_ACTIVATE (
  echo Using virtual environment: %BACKEND_ACTIVATE%
) else (
  echo No local virtual environment found. Using system Python.
)

echo [2/4] Starting FastAPI backend on http://localhost:8000 ...
if defined BACKEND_ACTIVATE (
  start "CarreonX Backend" /MIN cmd /k "cd /d \"%CD%\" && call \"%BACKEND_ACTIVATE%\" && python -m uvicorn backend.main:app --reload"
) else (
  start "CarreonX Backend" /MIN cmd /k "cd /d \"%CD%\" && python -m uvicorn backend.main:app --reload"
)

echo [3/4] Preparing Next.js frontend on http://localhost:3000 ...
if not exist "%CD%\CarreonX-Web\node_modules" (
  echo Frontend dependencies missing. Installing once before startup...
  cd /d "%CD%\CarreonX-Web"
  call npm install
  cd /d "%~dp0"
)
start "CarreonX Frontend" /MIN cmd /k "cd /d \"%CD%\CarreonX-Web\" && npm run dev"

echo [4/4] Waiting for services to initialize...
timeout /t 8 /nobreak > nul

echo Opening CarreonX in your browser...
start http://localhost:3000

echo.
echo CarreonX should now be running.
echo Backend:  http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo.
timeout /t 3 /nobreak > nul
exit /b 0
