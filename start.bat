@echo off
echo 🌙 Starting Dream to Startup Generator...
echo.

echo 📦 Starting Backend...
cd backend
start "Backend" cmd /k "python run.py"
cd ..

echo.
echo ⚛️ Starting Frontend...
start "Frontend" cmd /k "npm start"

echo.
echo 🚀 Both servers are starting...
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend: http://localhost:5000
echo.
echo Press any key to exit this script (servers will continue running)
pause > nul 