@echo off
echo.
echo ========================================
echo  Starting Safety Incident Reporting App
echo ========================================
echo.

REM Check if backend is configured
if not exist "backend\.env" (
    echo ERROR: Backend not configured!
    echo Please run setup_backend.bat first
    echo.
    pause
    exit /b 1
)

REM Check if frontend dependencies are installed
if not exist "node_modules" (
    echo ERROR: Frontend dependencies not installed!
    echo Please run: npm install
    echo.
    pause
    exit /b 1
)

echo Starting Backend Server...
start "Backend API - http://localhost:8000" cmd /k start_backend.bat

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Frontend App - http://localhost:3000" cmd /k npm run dev

echo.
echo ========================================
echo  Both servers are starting!
echo ========================================
echo.
echo Backend API:     http://localhost:8000
echo API Docs:        http://localhost:8000/docs
echo Frontend App:    http://localhost:3000
echo.
echo Press Ctrl+C in each window to stop servers
echo.
pause
