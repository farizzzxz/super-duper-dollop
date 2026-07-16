@echo off
cd /d "%~dp0"

rem Prioritize Node.js when available; otherwise run the PowerShell fallback server
node --version >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  echo Menjalankan server lokal dengan Node.js...
  node server.js
  exit /b
)

echo Node.js tidak tersedia — menjalankan PowerShell fallback server.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
  python3 server.py
