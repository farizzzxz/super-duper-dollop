@echo off
cd /d "%~dp0"

echo Membuka halaman download untuk Node.js, Git, dan ngrok...
start "" "https://nodejs.org/download/"
start "" "https://git-scm.com/download/win"
start "" "https://ngrok.com/download"

echo Selesai. Silakan install semua alat yang dibutuhkan.
pause
