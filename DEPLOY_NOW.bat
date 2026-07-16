@echo off
cd /d "%~dp0"

echo ================================
 echo Persiapan Deploy Permanen
echo ================================

echo Memeriksa Git...
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Git tidak ditemukan di sistem.
  echo Silakan install Git dari: https://git-scm.com/download/win
  start "" "https://git-scm.com/download/win"
  pause
  exit /b 1
)

echo Git tersedia.
echo.
echo 1. Buat repository GitHub baru di:
echo    https://github.com/new
start "" "https://github.com/new"

echo.
echo 2. Setelah repository dibuat, jalankan perintah berikut:
echo    git init
echo    git add .
echo    git commit -m "Initial public deploy"
echo    git branch -M main
echo    git remote add origin https://github.com/<username>/<repo>.git
echo    git push -u origin main

echo.
echo 3. Deploy ke Railway dengan membuka:
echo    https://railway.app/new/project
start "" "https://railway.app/new/project"

echo.
echo Setelah deploy ke Railway selesai, akses:
echo    https://<railway-url>/owner.html

echo.
echo NOTE: Jika kamu ingin gunakan layanan lain, lihat DEPLOY_PERMANENT.md
pause
