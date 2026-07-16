@echo off
cd /d "%~dp0"

echo Automated publish: create GitHub repo (gh CLI) and deploy to Railway (optional).

where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Git tidak ditemukan. Install Git: https://git-scm.com/download/win
  pause
  exit /b 1
)

where gh >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo GitHub CLI (gh) tidak ditemukan. Install: https://cli.github.com/
  pause
  exit /b 1
)

echo Pastikan kamu sudah login ke GitHub via `gh auth login` sebelum lanjut.
set /p REPO_NAME=Masukkan nama repo GitHub yang akan dibuat (contoh: donate-sendiri): 

if "%REPO_NAME%"=="" (
  echo Nama repo kosong. Batal.
  pause
  exit /b 1
)

echo Membuat repo %REPO_NAME% dan mendorong kode...
gh repo create %REPO_NAME% --public --source . --remote origin --push
if %ERRORLEVEL% NEQ 0 (
  echo Gagal membuat atau push ke GitHub. Periksa pesan di atas.
  pause
  exit /b 1
)

echo Repo dibuat dan kode telah dipush ke https://github.com/%REPO_NAME%

where railway >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  echo Railway CLI terdeteksi.
  set /p RAILWAY_NOW=Deploy ke Railway sekarang? (y/n): 
  if /i "%RAILWAY_NOW%"=="y" (
    echo Men-deploy dengan Railway CLI (mungkin akan membuka browser untuk login)...
    railway up
  ) else (
    echo Lewati deploy Railway. Kamu bisa deploy dari web UI: https://railway.app
  )
) else (
  echo Railway CLI tidak ditemukan. Untuk deploy cepat, buka https://railway.app dan sambungkan repo.
)

echo Selesai.
pause
