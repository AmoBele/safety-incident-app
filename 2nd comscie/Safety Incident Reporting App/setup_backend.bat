@echo off
echo ========================================
echo Safety Incident Reporting Backend Setup
echo ========================================
echo.

cd /d "%~dp0backend"

echo [1/4] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)
echo Python found!
echo.

echo [2/4] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo [3/4] Setting up environment file...
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo .env file created from template
        echo.
        echo IMPORTANT: Please edit backend\.env and set:
        echo - DATABASE_PASSWORD=your_mysql_password
        echo - SECRET_KEY=generate_random_32_chars
        echo - ENCRYPTION_KEY=generate_random_32_chars
        echo.
        echo Run this Python command to generate secure keys:
        echo python -c "import secrets; print('SECRET_KEY:', secrets.token_urlsafe(32)); print('ENCRYPTION_KEY:', secrets.token_urlsafe(32))"
        echo.
    ) else (
        echo ERROR: .env.example not found
        pause
        exit /b 1
    )
) else (
    echo .env file already exists
)
echo.

echo [4/4] Setup complete!
echo.
echo Next steps:
echo 1. Edit backend\.env with your MySQL credentials and secret keys
echo 2. Ensure MySQL is running on port 3306
echo 3. Run: init_database.bat (to create database tables)
echo 4. Run: start_backend.bat (to start the API server)
echo.
echo The API will be available at http://localhost:8000
echo API Documentation at http://localhost:8000/docs
echo.

pause
