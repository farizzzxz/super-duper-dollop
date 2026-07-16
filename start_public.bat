@echo off
cd /d "%~dp0"

echo Memulai server lokal...
start "Donasi Local Server" cmd /k "start.bat"

echo Menunggu server lokal mulai pada port 3000...
timeout /t 5 /nobreak >nul

if exist "%~dp0ngrok.exe" (
  set "NGROK_PATH=%~dp0ngrok.exe"
) else (
  where ngrok >nul 2>nul
  if %ERRORLEVEL% EQU 0 (
    set "NGROK_PATH=ngrok"
  ) else (
    echo ngrok tidak ditemukan di folder ini atau PATH.
    echo Download ngrok dari https://ngrok.com/download dan letakkan di folder ini atau tambahkan ke PATH.
    pause
    exit /b 1
  )
)

echo Membuka tunnel publik ke http://localhost:3000
"%NGROK_PATH%" http 3000
