@echo off
REM Task Monitor Frontend - Installation & Setup Script for Windows
REM This script helps you get started with the Task Monitor application

echo.
echo ^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*
echo Task Monitor Frontend - Setup Script
echo ^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*^*
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js is not installed. Please install Node.js v16 or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js detected: 
node --version
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [X] npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo [OK] npm detected: 
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
call npm install

if errorlevel 1 (
    echo [X] Failed to install dependencies
    pause
    exit /b 1
)

echo [OK] Dependencies installed successfully
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo [OK] .env file created. Please update it with your API URL.
    echo.
    echo Edit .env and set:
    echo   VITE_API_URL=http://localhost:8080
) else (
    echo [OK] .env file already exists
)

echo.
echo [SUCCESS] Setup Complete!
echo.
echo Next steps:
echo   1. Update .env with your backend API URL
echo   2. Run: npm run dev
echo   3. Open: http://localhost:5173
echo.
echo Demo Credentials:
echo   Email: demo@example.com
echo   Password: password123
echo.
echo For more information, see:
echo   - README.md
echo   - QUICKSTART.md
echo   - DOCUMENTATION.md
echo.
pause
