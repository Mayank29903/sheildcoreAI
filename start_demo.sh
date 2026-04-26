#!/usr/bin/env bash
# ShieldCore AI — One-Click Demo Launcher (Mac/Linux)
# Usage: chmod +x start_demo.sh && ./start_demo.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$SCRIPT_DIR/sportshield-ai/backend"
FRONTEND="$SCRIPT_DIR/sportshield-ai/frontend"

echo ""
echo "============================================================"
echo " SHIELDCORE AI — Google Solution Challenge 2026"
echo " One-Click Demo Launcher"
echo "============================================================"
echo ""

# Check prerequisites
command -v python3 >/dev/null 2>&1 || { echo "[ERROR] python3 not found"; exit 1; }
command -v node    >/dev/null 2>&1 || { echo "[ERROR] node not found"; exit 1; }

echo "[1/4] Starting Python FastAPI backend on port 8000..."
cd "$BACKEND"
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "      Backend PID: $BACKEND_PID"

echo "[2/4] Waiting 4s for backend to initialize..."
sleep 4

echo "[3/4] Starting React Vite frontend on port 5173..."
cd "$FRONTEND"
npm run dev &
FRONTEND_PID=$!
echo "      Frontend PID: $FRONTEND_PID"

echo "[4/4] Waiting 3s for frontend..."
sleep 3

echo ""
echo "============================================================"
echo " [READY] ShieldCore AI is running!"
echo ""
echo "  Frontend : http://localhost:5173"
echo "  Backend  : http://localhost:8000"
echo "  API Docs : http://localhost:8000/docs"
echo "============================================================"
echo ""
echo "[TIP] To seed demo data: cd sportshield-ai/backend && python3 seed_demo_data.py"
echo ""

# Open browser (works on Mac & most Linux)
if command -v open >/dev/null 2>&1; then
    open "http://localhost:5173"
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:5173"
fi

echo "Press Ctrl+C to stop all servers."
wait $BACKEND_PID $FRONTEND_PID
