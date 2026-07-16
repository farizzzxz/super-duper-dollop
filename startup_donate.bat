@echo off
cd /d "%~dp0"

REM Jalankan server donasi otomatis di jendela terpisah
start "Donasi Stream" /min "%~dp0start.bat"
exit /b
