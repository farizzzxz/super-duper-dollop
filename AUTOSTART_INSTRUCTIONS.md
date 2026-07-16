# Autostart Aplikasi Donasi

Agar aplikasi donasi otomatis berjalan ketika PC menyala, gunakan file `startup_donate.bat`.

## Langkah untuk Windows

1. Pastikan file `startup_donate.bat` berada di folder `c:\Users\PC\Documents\donate sendiri`
2. Tekan `Win + R`, ketik `shell:startup`, lalu tekan Enter.
3. Copy atau buat shortcut `startup_donate.bat` di folder Startup.
4. Restart PC.

Setelah restart, Windows akan menjalankan `startup_donate.bat`, yang akan memanggil `start.bat` dan menyalakan server donasi.

## Catatan

- Pastikan Python atau Node.js tersedia jika ingin menggunakan local server.
- Jika menggunakan `server.py`, `start.bat` sudah mengarahkan otomatis ke Python.
- Jika ingin aplikasi langsung muncul saat login, letakkan shortcut `startup_donate.bat` di folder Startup.
