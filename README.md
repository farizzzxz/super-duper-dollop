# Donasi Stream Lokal

Aplikasi ini sudah menyediakan 3 halaman:

- `owner.html` — dashboard creator/streamer
- `donor.html` — halaman penonton untuk donasi
- `overlay.html` — halaman overlay notifikasi untuk OBS
- `qris.svg` — placeholder QRIS; ganti dengan QRIS asli kamu

## Cara Menjalankan

1. Buka folder `c:\Users\PC\Documents\donate sendiri`
2. Jalankan `start.bat`
   - Jika Python tersedia, file ini akan menjalankan `server.py` pada port `3000`
3. Buka browser di PC streamer:
   - `http://localhost:3000/owner.html`
4. Di owner page, salin alamat LAN yang muncul di bagian `Link Donatur`:
   - Contoh: `http://192.168.1.12:3000/donor.html`
5. Bagikan alamat tersebut ke penonton yang ada di jaringan Wi-Fi/LAN yang sama
6. Untuk OBS:
   - tambahkan Browser Source
   - masukkan URL `http://<IP-LAN>:3000/overlay.html`

## Siapkan Dulu

Sebelum deploy publik, siapkan hal berikut:

- Node.js terinstal di PC untuk menjalankan `server.js`.
- Git terinstal di PC jika ingin deploy ke GitHub, Railway, Render, atau Heroku.
- `package.json`, `server.js`, `owner.html`, `donor.html`, `overlay.html`, `owner.js`, `donor.js`, `styles.css`, `qris.svg`, dan `donations.json` ada di folder project.
- `ngrok.exe` ada di folder project untuk akses publik sementara.
- Jika belum punya alat yang diperlukan, jalankan `download_tools.bat` untuk membuka halaman download.
- Setelah alat terpasang, jalankan `setup_env.bat` untuk memeriksa Node, npm, Git, dan ngrok.
- Jika belum punya GitHub repo, jalankan `init_git.bat` setelah Git terpasang.

## Tools helper

- `download_tools.bat` — membuka halaman download resmi untuk Node.js, Git, dan ngrok.
- `setup_env.bat` — memeriksa pemasangan Node, npm, Git, dan ngrok.
- `init_git.bat` — inisialisasi repository Git dan membuat commit awal.
- `start_public.bat` — jalankan server lokal dan buat tunnel publik melalui ngrok.
- `DEPLOY_NOW.bat` — buka GitHub repo baru dan Railway deploy cepat.
- `DEPLOY_PERMANENT.md` — panduan deploy permanen lengkap.

## Siap Deploy Sekarang

### Opsi 1: Akses publik sementara dengan ngrok
1. Download `ngrok`.
2. Letakkan `ngrok.exe` di folder project atau tambahkan ke PATH.
3. Jalankan `start_public.bat`.
4. Salin URL publik yang muncul.
5. Gunakan `https://.../donor.html` untuk penonton dan `https://.../overlay.html` untuk OBS.

### Opsi 2: Deploy permanen ke hosting publik
1. Siapkan akun di Railway, Render, atau Heroku.
2. Upload folder project ke GitHub atau deploy langsung dari local jika layanan mendukung.
3. Pastikan perintah `npm install` dan `npm start` dijalankan.
4. Akses URL publik yang diberikan layanan.

## Cara Ganti QRIS Asli

1. Siapkan file QRIS asli dalam format SVG atau gambar
2. Ganti file `qris.svg` di folder ini dengan file QRIS asli
3. Halaman `donor.html` dan `owner.html` akan menampilkan QRIS asli tersebut

## Catatan

- Pastikan streamer dan penonton berada di jaringan yang sama saat membuka `donor.html` secara lokal
- `owner.html` hanya untuk kamu sebagai streamer
- `donor.html` untuk penonton mendonasi
- `overlay.html` untuk notifikasi donasi di OBS

## Hosting Publik

Agar orang lain bisa mengakses `donor.html` dari luar jaringan lokal kamu, deploy aplikasi ini ke layanan hosting publik seperti Render, Railway, atau VPS.

### Akses publik cepat dari PC kamu dengan ngrok

1. Download `ngrok` dari https://ngrok.com/download
2. Letakkan `ngrok.exe` di folder aplikasi atau tambahkan ke PATH.
3. Jalankan `start_public.bat` di folder ini.
4. `start_public.bat` akan membuka server lokal dan membuat tunnel publik ke `http://localhost:3000`.
5. Salin URL publik `https://...` yang muncul di terminal ngrok.
6. Bagikan URL tersebut ke penonton.

> Catatan: ngrok membuat akses publik sementara. Setiap kali terminal dimatikan, URL publik berubah.

### Langkah cepat deploy ke hosting

1. Pastikan file `server.js`, `owner.html`, `donor.html`, `overlay.html`, `owner.js`, `donor.js`, dan `styles.css` berada di satu folder.
2. Pilih layanan hosting yang mendukung Node.js.
3. Upload folder atau sambungkan repository GitHub ke layanan tersebut.
4. Jalankan perintah berikut pada hosting:
   - `npm install`
   - `npm start`
5. Akses URL publik yang diberikan hosting.
6. Pada `owner.html`, link `donor.html` dan `overlay.html` akan otomatis menjadi publik di domain tersebut.

### Hosting publik menggunakan Docker

File `Dockerfile` sudah dibuat agar kamu bisa deploy ke layanan yang mendukung Docker.

Contoh perintah lokal:

```bash
docker build -t donate-stream .
docker run -p 3000:3000 donate-stream
```

Kemudian buka `http://localhost:3000/owner.html`.

### Host tanpa Node.js

Jika kamu hanya ingin pakai hosting statis, kamu masih bisa meng-host `owner.html`, `donor.html`, dan `overlay.html` di layanan statis, tetapi fitur donasi tidak akan tersimpan di server. Untuk penggunaan penuh, gunakan hosting Node.js.
