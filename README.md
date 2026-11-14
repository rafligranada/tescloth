# PanduOto — Panduan Perawatan Mobil & Diagnostik 3D

Portal edukasi perawatan kendaraan bermotor yang dirancang mengikuti standar kualitas konten **Google AdSense**, dilengkapi inspeksi komponen kendaraan **3D interaktif (Three.js)**, kalkulator jadwal servis, dan navigasi bergerak yang responsif.

## Fitur Utama
- **8+ Artikel Teknis Mendalam**: Panduan praktis perawatan mesin, oli, rem ABS, aki, ban & kaki-kaki, transmisi CVT/AT, AC kabin, hingga detailing bodi.
- **Inspeksi Mobil 3D Interaktif**: Model kendaraan multi-komponen berbasis Three.js dengan fitur bedah bodi (X-Ray/Exploded View), fokus subsistem kamera, pemilihan warna bodi, dan hotspot klik untuk melihat panduan terkait.
- **Kalkulator Jadwal Servis**: Hitung komponen yang perlu diperiksa atau diganti berdasarkan odometer (km), jenis mobil, dan kondisi jalan.
- **Kepatuhan Google AdSense**: Halaman Tentang Kami, Kontak (`rafligranada@gmail.com`), Kebijakan Privasi (termasuk pengungkapan cookie Google AdSense), Ketentuan Layanan, Disclaimer Teknis, dan Kebijakan Editorial, serta `robots.txt`, `sitemap.xml`, dan `public/ads.txt` (`ca-pub-6423598819881009`).

## Cara Upload ke GitHub & Deploy ke Vercel

1. **Inisialisasi & Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: PanduOto automotive guide"
   git branch -M main
   git remote add origin https://github.com/USERNAME/panduoto.git
   git push -u origin main
   ```

2. **Deploy ke Vercel**
   - Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
   - Klik **Add New Project** → pilih repository `panduoto` (domain produksi: `panduoto.vercel.app`).
   - Framework Preset otomatis terdeteksi sebagai **Vite** (`npm run build`, output `dist`).
   - Klik **Deploy**. File `vercel.json` sudah dikonfigurasi agar seluruh URL artikel, halaman legal, `ads.txt`, `robots.txt`, dan `sitemap.xml` berjalan mulus tanpa error 404.

3. **Langkah Persiapan Pengajuan Google AdSense**
   - Pastikan `https://panduoto.vercel.app/ads.txt` dan `https://panduoto.vercel.app/sitemap.xml` dapat diakses publik.
   - Submit `https://panduoto.vercel.app/sitemap.xml` di Google Search Console agar seluruh rute dan 8+ artikel terindeks.
   - Skrip verifikasi AdSense (`ca-pub-6423598819881009`) dan meta tag `google-adsense-account` sudah terpasang otomatis di `index.html`.

## Kontak Redaksi
Email: `rafligranada@gmail.com`
