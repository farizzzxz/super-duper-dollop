# Deployment Publik

Aplikasi ini sudah siap dipublikasikan. Gunakan platform Node.js deployment berikut:

## 0. Akses publik cepat dengan ngrok

1. Download `ngrok` dari https://ngrok.com/download
2. Letakkan `ngrok.exe` di folder aplikasi atau tambahkan ke PATH.
3. Jalankan `start_public.bat` di folder ini.
4. `start_public.bat` akan menjalankan server lokal dan membuat tunnel publik.
5. Salin URL publik `https://...` yang muncul di terminal ngrok.
6. Bagikan URL tersebut ke penonton.

> Catatan: ngrok memberikan akses publik sementara; setiap kali ditutup, URL berubah.

## 1. Railway

1. Buat akun di https://railway.app
2. Buat project baru dan pilih `Deploy from GitHub repo` atau `New Project > Node.js`
3. Jika deploy dari repo, upload folder ini ke GitHub terlebih dahulu.
4. Railway akan otomatis membaca `package.json`.
5. Pastikan perintah build/run di Railway adalah:
   - Install: `npm install`
   - Start: `npm start`
6. Setelah deploy selesai, Railway memberi URL publik.
7. Buka `https://<railway-url>/owner.html` untuk owner.
8. Gunakan `https://<railway-url>/donor.html` untuk donor.
9. Gunakan `https://<railway-url>/overlay.html` untuk OBS.

## 2. Render

1. Buat akun di https://render.com
2. Buat `New Web Service`
3. Pilih `Connect account` jika ingin repo GitHub, atau pilih `Manual deploy` lalu upload folder.
4. Pilih branch repo atau upload.
5. Render akan menggunakan `package.json`.
6. Set `Start Command` menjadi `npm start`.
7. Deploy.
8. Setelah selesai, gunakan URL publik yang diberikan.

## 3. Heroku

1. Buat akun di https://heroku.com
2. Install Heroku CLI di komputer:
   ```powershell
   npm install -g heroku
   ```
3. Login ke Heroku:
   ```powershell
   heroku login
   ```
4. Buat aplikasi baru:
   ```powershell
   heroku create nama-aplikasi-kamu
   ```
5. Inisialisasi Git kalau belum:
   ```powershell
   git init
   git add .
   git commit -m "initial deploy"
   ```
6. Deploy ke Heroku:
   ```powershell
   git push heroku main
   ```
7. Tunggu proses selesai, lalu buka:
   ```powershell
   heroku open
   ```
8. Gunakan URL publik untuk owner/donor/overlay.

## Catatan penting

- `package.json` sudah berisi:
  - `start`: `node server.js`
- `server.js` sudah memakai Express
- `donor.html` dan `overlay.html` sudah siap untuk diakses publik
- Jika kamu ingin deploy lewat GitHub, cukup push folder ini ke repo lalu sambungkan ke platform hosting.

## File penting untuk deployment

- `server.js`
- `package.json`
- `owner.html`
- `donor.html`
- `overlay.html`
- `owner.js`
- `donor.js`
- `styles.css`
- `qris.svg`
- `donations.json` (untuk penyimpanan donasi lokal)
- `Dockerfile` (opsional untuk layanan Docker)
- `Procfile` (opsional untuk Heroku)
- `.gitignore`

## Tips supaya langsung jalan

- Pastikan file `donations.json` ada dan `server.js` bisa menulis ke folder.
- Jika menggunakan GitHub deploy, pastikan semua file sudah commit.
- Setelah deploy, URL publik akan menjadi domain utama; tambahkan `/donor.html` dan `/overlay.html` sesuai kebutuhan.
