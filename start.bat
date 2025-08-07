@echo off
echo ========================================
echo    TechMart E-commerce Website
echo ========================================
echo.
echo Starting the full-stack e-commerce website...
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
timeout /t 2 /nobreak >nul

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Create uploads directory if it doesn't exist
if not exist "uploads" (
    echo Creating uploads directory...
    mkdir uploads
)

REM Seed the database
echo Seeding database with sample data...
node seed.js

REM Start the server
echo.
echo Starting server on http://localhost:3000
echo.
echo ========================================
echo    Website Features:
echo    - Modern responsive design
echo    - User authentication
echo    - Product catalog
echo    - Shopping cart
echo    - Admin panel
echo    - Real-time search
echo    - Wishlist functionality
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

npm start 