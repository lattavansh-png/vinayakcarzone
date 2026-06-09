@echo off
echo ===================================
echo  Installing Backend Dependencies
echo ===================================
echo.

cd /d "%~dp0"

echo Installing packages from package.json...
echo This may take 1-3 minutes...
echo.

call npm install --no-audit --no-fund

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================
    echo  Installation Successful!
    echo ===================================
    echo.
    echo Next steps:
    echo 1. Create your .env file (copy from .env.example)
    echo 2. Set up MongoDB Atlas: https://mongodb.com/atlas
    echo 3. Run: npm run seed:admin
    echo 4. Run: npm run dev
    echo.
) else (
    echo.
    echo ===================================
    echo  Installation Failed!
    echo ===================================
    echo Please check the error messages above.
)

pause
