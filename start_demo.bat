@echo off
title ShieldCore AI — Demo Launcher
color 0A

echo.
echo  ============================================================
echo   SHIELDCORE AI — Google Solution Challenge 2026
echo   One-Click Demo Launcher
echo  ============================================================
echo.

REM ── Check Python ──────────────────────────────────────────────
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python not found. Install Python 3.11+ first.
    pause
    exit /b 1
)

REM ── Check Node ────────────────────────────────────────────────
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Install Node.js 18+ first.
    pause
    exit /b 1
)

echo [1/4] Starting Python FastAPI backend on port 8000...
start "ShieldCore Backend" cmd /k "cd /d %~dp0sportshield-ai\backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/4] Waiting 4 seconds for backend to initialize...
timeout /t 4 /nobreak >nul

echo [3/4] Starting React Vite frontend on port 5173...
start "ShieldCore Frontend" cmd /k "cd /d %~dp0sportshield-ai\frontend && npm run dev"

echo [4/4] Waiting 3 seconds for frontend to start...
timeout /t 3 /nobreak >nul

echo.
echo  ============================================================
echo   [READY] ShieldCore AI is running!
echo.
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:8000
echo   API Docs : http://localhost:8000/docs
echo  ============================================================
echo.
echo  [TIP] To seed demo data, run:
echo    cd sportshield-ai\backend
echo    python seed_demo_data.py
echo.

start "" "http://localhost:5173"

pause
