@echo off
setlocal

echo ==========================================
echo Starting Stock Analysis App
echo ==========================================

cd /d "%~dp0"

echo.
echo [1/4] Checking Backend Environment...
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    python -m venv backend\venv
)

echo Activating virtual environment and installing dependencies...
call backend\venv\Scripts\activate.bat
pip install -r backend\requirements.txt

echo.
echo [2/4] Checking Frontend Environment...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)
cd ..

echo.
echo [3/4] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

echo.
echo [4/4] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo App is running!
echo Backend:   http://localhost:8000/docs
echo Frontend:  http://localhost:5173
echo ==========================================
pause
