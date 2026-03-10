@echo off
echo ======================================
echo   Starting Placement Portal Project
echo ======================================

REM ------ Start Backend ------
echo Starting Backend...
start "Backend" cmd /k "cd /d %~dp0\backend && if exist venv (call venv\Scripts\activate) && uvicorn main:app --reload --port 8000"

REM ------ Start Frontend ------
echo Starting Frontend...
start "Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo --------------------------------------
echo Both Backend and Frontend are running!
echo --------------------------------------

exit
