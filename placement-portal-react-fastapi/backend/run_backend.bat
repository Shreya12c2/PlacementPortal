@echo off
echo --------------------------------------
echo Starting FASTAPI Backend on port 8000
echo --------------------------------------

REM Activate virtual environment if exists
if exist venv (
    call venv\Scripts\activate
    echo Virtual environment activated.
) else (
    echo No virtual environment found. Continuing without venv...
)

REM Start the backend in a new terminal
start "FastAPI Backend" cmd /k "uvicorn main:app --reload --port 8000"

exit
