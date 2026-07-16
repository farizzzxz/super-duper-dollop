# Deploy Permanen Aplikasi Donasi

Dokumen ini menjelaskan langkah lengkap untuk meng-host aplikasi secara permanen ke layanan publik.

## Persyaratan

- Git terpasang di PC kamu
- Akun GitHub
- Akun salah satu layanan hosting: Railway, Render, atau Heroku
- `package.json`, `server.js`, `owner.html`, `donor.html`, `overlay.html`, `owner.js`, `donor.js`, `styles.css`, dan `qris.svg` berada di folder project
- `Dockerfile` dan `Procfile` sudah tersedia untuk layanan yang mendukungnya

## 1. Siapkan Git dan repository

1. Install Git:
   - Windows: https://git-scm.com/download/win

2. Di folder project, buka PowerShell dan jalankan:
   ```powershell
   cd "c:\Users\PC\Documents\donate sendiri"
   git init
   git add .
   git commit -m "Initial commit for public deployment"
   ```

3. Buat repository GitHub baru.
4. Ikuti instruksi GitHub untuk menambahkan remote dan push:
   ```powershell
   git remote add origin https://github.com/<username>/<repo>.git
   git branch -M main
   git push -u origin main
   ```

## 2. Deploy ke Railway

Railway adalah opsi yang paling mudah untuk Node.js.

1. Daftar di https://railway.app
2. Klik `New Project` > `Deploy from GitHub repo`
3. Pilih repository yang sudah kamu push
4. Pastikan Railway membaca `package.json`
5. Atur perintah deploy:
   - Install: `npm install`
   - Start: `npm start`
6. Deploy
7. Setelah selesai, akses URL publik yang diberikan

Contoh:
- `https://<railway-id>.railway.app/owner.html`
- `https://<railway-id>.railway.app/donor.html`
- `https://<railway-id>.railway.app/overlay.html`

## 3. Deploy ke Render

1. Daftar di https://render.com
2. Klik `New` > `Web Service`
3. Hubungkan akun GitHub dan pilih repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy

## 4. Deploy ke Heroku

1. Daftar di https://heroku.com
2. Install Heroku CLI:
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
5. Deploy dari Git:
   ```powershell
   git push heroku main
   ```
6. Buka aplikasi:
   ```powershell
   heroku open
   ```

## 5. Tips setelah deploy

- Pastikan `server.js` mendengarkan pada port `process.env.PORT || 3000`
- Untuk GitHub Pages atau hosting statis, app tidak akan menyimpan donasi karena butuh backend Express
- Jika menggunakan Docker, kamu bisa deploy ke layanan yang mendukung Docker image

## 6. Cara jalankan setelah deploy

- Owner: `https://<host>/owner.html`
- Donor: `https://<host>/donor.html`
- Overlay: `https://<host>/overlay.html`

---

Jika kamu ingin, saya bisa buatkan juga tutorial deploy permanen khusus ke Railway dengan screenshot dan perintah persis yang harus kamu jalankan.