# Dashboard Kehidupan Sehari-hari

Versi lengkap siap di-upload ke GitHub & gunakan GitHub Pages atau host statis lain.

## Fitur
- To‑do, Planner, Habit tracker
- Catatan, Daftar belanja, Pengeluaran
- Timer, Konverter cepat
- Cuaca via Open‑Meteo (tanpa API key)
- Export / Import JSON (localStorage)
- PWA dasar (manifest + service worker)

## Cara pakai
1. Upload seluruh folder ke repo GitHub.
2. Aktifkan **GitHub Pages** pada branch `main` (atau `gh-pages`) dan pilih folder `/` atau `/docs`.
3. Akses `<username>.github.io/<repo>`.

## Struktur file
- `index.html`
- `styles.css`
- `app.js`
- `manifest.json`
- `sw.js`
- `README.md`

## Catatan privasi
Semua data disimpan di `localStorage` browser. Tidak ada sinkronisasi cloud oleh default.

## Modifikasi
Mau saya bantu:
- Pisahkan CSS/JS ke bundler (Vite/Parcel)
- Tambahkan sinkronisasi (Google Drive / Firebase)
- Konversi ke React + Tailwind + PWA yang lebih kuat
