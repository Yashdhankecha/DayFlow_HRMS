@echo off
echo ==========================================
echo      HackStack Setup (SQLite Version)
echo ==========================================

cd backend
echo.
echo [1/4] Installing Backend Dependencies...
call npm install
echo.
echo [2/4] Setting up Database (SQLite)...
rem Ensure .env exists with sqlite config
if not exist .env copy .env.sqlite .env
rem Run migration (force reset if needed)
call npx prisma migrate reset --force
call npx prisma migrate dev --name init
echo.
echo [3/4] Seeding Database...
call npm run seed

cd ..\frontend
echo.
echo [4/4] Installing Frontend Dependencies...
call npm install

echo.
echo ==========================================
echo        Setup Complete!
echo ==========================================
echo Now run: start-dev.bat
pause
