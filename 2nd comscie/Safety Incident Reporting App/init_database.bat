@echo off
echo.
echo ========================================
echo  Initialize Safety App Database
echo ========================================
echo.

cd /d "%~dp0backend"

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo.
    echo Please run setup_backend.bat first to create the .env file.
    echo.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    echo.
    pause
    exit /b 1
)

REM Check if python-dotenv is installed
python -c "import dotenv" >nul 2>&1
if errorlevel 1 (
    echo Installing required package: python-dotenv...
    pip install python-dotenv
    echo.
)

REM Check if mysql-connector-python is installed
python -c "import mysql.connector" >nul 2>&1
if errorlevel 1 (
    echo Installing required package: mysql-connector-python...
    pip install mysql-connector-python
    echo.
)

echo Starting database initialization...
echo.
echo This will create the following tables in MySQL:
echo   - users
echo   - incidents  
echo   - evidence
echo   - safety_zones
echo   - community_posts
echo.
echo Make sure MySQL is running before continuing!
echo.
pause

python init_database.py

if errorlevel 1 (
    echo.
    echo Database initialization failed!
    echo Please check the error messages above.
) else (
    echo.
    echo Database initialization completed successfully!
)

echo.
pause
