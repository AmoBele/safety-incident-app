@echo off
echo Starting Safety Incident Reporting Backend...
echo.

cd /d "%~dp0backend"

if not exist .env (
    echo ERROR: .env file not found!
    echo Please run setup_backend.bat first
    pause
    exit /b 1
)

echo Backend API starting on http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python main.py
