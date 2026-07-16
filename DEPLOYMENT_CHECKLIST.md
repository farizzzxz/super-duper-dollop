# Checklist Deploy Publik

## 1. Persiapan Dasar

- [ ] Node.js terinstal di komputer kamu.
- [ ] Git terinstal di komputer kamu.
- [ ] Folder project berisi:
  - `server.js`
  - `package.json`
  - `owner.html`
  - `donor.html`
  - `overlay.html`
  - `owner.js`
  - `donor.js`
  - `styles.css`
  - `qris.svg`
  - `donations.json`
- [ ] `ngrok.exe` ada di folder project untuk akses publik sementara.
- [ ] `Dockerfile` dan `Procfile` ada jika ingin deploy ke layanan yang mendukung Docker/Heroku.
- [ ] `download_tools.bat` ada untuk membuka halaman download installer.
- [ ] `setup_env.bat` ada untuk memeriksa lingkungan.
- [ ] `init_git.bat` ada untuk inisialisasi repository Git.

## 2. Jika ingin akses publik sementara dengan ngrok

- [ ] Download `ngrok` dari https://ngrok.com/download
- [ ] Letakkan `ngrok.exe` di folder project atau tambahkan ke PATH
- [ ] Jalankan `start_public.bat`
- [ ] Salin URL publik `https://...`
- [ ] Bagikan `https://.../donor.html` dan `https://.../overlay.html`

## 3. Jika ingin deploy permanen ke hosting publik

- [ ] Buat akun di salah satu layanan:
  - Railway
  - Render
  - Heroku
- [ ] Upload project ke GitHub atau deploy langsung dari local
- [ ] Pastikan layanan menjalankan:
  - `npm install`
  - `npm start`
- [ ] Setelah deploy selesai, catat URL publik yang diberikan
- [ ] Akses:
  - `https://<url>/owner.html`
  - `https://<url>/donor.html`
  - `https://<url>/overlay.html`

## 4. Jika ingin pakai GitHub

- [ ] Install Git
- [ ] Inisialisasi repository:
  - `git init`
  - `git add .`
  - `git commit -m "initial deploy"
- [ ] Push ke GitHub jika perlu
- [ ] Sambungkan repo ke layanan hosting
