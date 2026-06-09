@echo off
echo ===================================
echo  Starting Backend Server
echo ===================================
echo.

cd /d "%~dp0"

if not exist .env (
    echo ERROR: .env file not found!
    echo.
    echo Please create .env file by copying .env.example
    echo Example: copy .env.example .env
    echo Then edit .env with your MongoDB connection string
    echo.
    pause
    exit /b 1
)

echo Starting server in development mode...
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
