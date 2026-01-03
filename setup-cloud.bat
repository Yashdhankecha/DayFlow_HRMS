@echo off
echo ==========================================
echo    HackStack Setup (Postgres/Cloud)
echo ==========================================

cd backend
echo.
echo [1/3] Installing Dependencies...
call npm install
echo.
echo [2/3] Setting up Database (Postgres)...
echo ** ENSURE YOU HAVE PASTED YOUR CLOUD URL IN backend/.env **
pause
call npx prisma migrate dev --name init
echo.
echo [3/3] Seeding Database...
call npm run seed

cd ..\frontend
echo.
call npm install

echo.
echo ==========================================
echo        Shared Setup Complete!
echo ==========================================
pause
