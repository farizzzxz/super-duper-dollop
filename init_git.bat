@echo off
cd /d "%~dp0"

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Git tidak ditemukan.
  echo Install Git terlebih dahulu dari https://git-scm.com/download/win
  pause
  exit /b 1
)

git init
if %ERRORLEVEL% NEQ 0 (
  echo Gagal inisialisasi Git.
  exit /b 1
)

git add .
git commit -m "Initial commit for public deployment"
if %ERRORLEVEL% NEQ 0 (
  echo Gagal membuat commit. Pastikan ada file yang bisa di-commit.
  exit /b 1
)

echo Git repository sudah dibuat dan commit awal selesai.
pause
