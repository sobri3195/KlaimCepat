# Cara Login Demo - Sistem Expense Claims

## 🎭 Mode Demo Sudah Aktif!

Aplikasi sudah dikonfigurasi untuk mode demo. Anda bisa langsung masuk tanpa perlu backend API atau database.

## 🚀 Cara Menjalankan

### 1. Install Dependencies (jika belum)
```bash
npm install
```

### 2. Jalankan Aplikasi
```bash
cd apps/web
npm run dev
```

### 3. Buka Browser
Buka http://localhost:3000

## 👥 Cara Login

Di halaman login, Anda akan melihat 2 tombol untuk login otomatis:

### **Login sebagai Admin** 👨‍💼
- Klik tombol **"Login as Admin"**
- Akses penuh ke semua fitur termasuk persetujuan klaim
- Email: admin@company.com
- Role: ADMIN

### **Login sebagai Employee** 👤
- Klik tombol **"Login as Employee"**
- Akses standar untuk membuat dan melihat klaim sendiri
- Email: employee@company.com
- Role: EMPLOYEE

## 📊 Data Demo

Setelah login, Anda akan mendapatkan:
- **15 klaim expense** yang sudah dibuat
- Berbagai status: Draft (1), Pending (3), Approved (7), Rejected (1), Paid (3)
- Total nilai klaim: ~18.4 juta IDR
- Dashboard analytics dengan grafik dan statistik
- Workflow lengkap untuk create, update, approve, reject klaim

## ✨ Fitur yang Bisa Dicoba

### Sebagai Employee:
- ✅ Lihat daftar klaim expense pribadi
- ✅ Buat klaim baru (draft)
- ✅ Edit klaim yang masih draft
- ✅ Submit klaim untuk persetujuan
- ✅ Lihat detail klaim dengan receipt
- ✅ Hapus klaim yang masih draft

### Sebagai Admin:
- ✅ Semua fitur employee
- ✅ Approve/Reject klaim yang pending
- ✅ Lihat analytics dashboard
- ✅ Monitor semua klaim di sistem
- ✅ Lihat statistik dan trends

## 🔄 Reset Data

Data demo disimpan di memory saja. Untuk reset ke kondisi awal:
1. Refresh browser (F5)
2. Data akan kembali ke 15 klaim awal

## ⚠️ Catatan Penting

- **Mode Demo** hanya untuk testing dan showcase
- Data tidak disimpan ke database (hilang saat refresh)
- Upload receipt menggunakan placeholder images
- Tidak ada validasi backend yang kompleks
- **Jangan deploy mode demo ke production!**

## 🎯 Tips Penggunaan

1. **Coba sebagai Employee dulu** untuk melihat user experience
2. **Switch ke Admin** untuk approve/reject klaim
3. **Perhatikan perubahan status** setelah approve/reject
4. **Lihat dashboard analytics** untuk insights

## 🔧 Troubleshooting

**Q: Tombol demo tidak muncul?**
- Pastikan file `.env` ada di `apps/web/`
- Isi file: `VITE_DEMO_MODE=true`
- Restart server (`Ctrl+C` lalu `npm run dev` lagi)

**Q: Error saat login?**
- Lihat console browser (F12)
- Pastikan tidak ada error di terminal
- Coba refresh browser

**Q: Data berubah-ubah?**
- Normal, data di memory bisa diubah selama session
- Refresh untuk reset ke kondisi awal

## 🌐 Deploy Demo

Untuk deploy mode demo ke Netlify/Vercel:
1. Set environment variable `VITE_DEMO_MODE=true`
2. Build dan deploy seperti biasa
3. Aplikasi akan jalan tanpa perlu backend

---

**Selamat mencoba! Jika ada pertanyaan, lihat [DEMO_MODE.md](./DEMO_MODE.md) untuk dokumentasi lengkap.**
