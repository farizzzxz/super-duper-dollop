@echo off
cd /d "%~dp0"

echo Memeriksa Node.js...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  node --version
) else (
  echo Node.js tidak ditemukan.
)

echo.
echo Memeriksa npm...
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  npm --version
) else (
  echo npm tidak ditemukan.
)

echo.
echo Memeriksa Git...
where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  git --version
) else (
  echo Git tidak ditemukan.
)

echo.
echo Memeriksa ngrok...
if exist "%~dp0ngrok.exe" (
  echo ngrok.exe ditemukan di folder project.
) else (
  where ngrok >nul 2>nul
  if %ERRORLEVEL% EQU 0 (
    ngrok version
  ) else (
    echo ngrok tidak ditemukan.
  )
)

echo.
echo Pemeriksaan selesai.
pause
