@echo off
echo ==========================================
echo Starting Stock Analysis Application
echo ==========================================

echo CHECKING AND UPDATING SECTOR DATA...
python predict_sector.py
echo Data update complete.

echo Starting Backend API...
start "Backend API" cmd /k "python backend/api.py"

echo Waiting for Backend to initialize...
timeout /t 2 /nobreak >nul

echo Starting Frontend...
cd frontend
start "Frontend App" cmd /k "npm run dev"

echo Waiting for Frontend to initialize...
timeout /t 4 /nobreak >nul

echo Opening Application in Browser...
start http://localhost:5173

echo ==========================================
echo Application Started!
echo Close the command windows to stop the servers.
echo ==========================================
pause
