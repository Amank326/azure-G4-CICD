@echo off
REM Windows Setup Script
setlocal enabledelayedexpansion

echo.
echo ========================================
echo Cloud File Manager - Windows Setup
echo ========================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo WARNING: Please update .env with your Azure credentials
    pause
    exit /b 1
)

echo [OK] .env file found
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo [OK] Found %%i

REM Check if npm is installed
echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do echo [OK] Found npm %%i

REM Check if Docker is installed
echo Checking Docker installation...
docker --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Docker is not installed
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    echo.
) else (
    for /f "tokens=*" %%i in ('docker --version') do echo [OK] Found %%i
)

REM Install dependencies
echo.
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed
    pause
    exit /b 1
)
cd ..
echo [OK] Backend dependencies installed

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed
    pause
    exit /b 1
)
cd ..
echo [OK] Frontend dependencies installed

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update .env with your Azure credentials
echo 2. Run: docker-compose up
echo 3. Access http://localhost
echo.
echo For more information, see DEPLOYMENT.md
echo.
pause
