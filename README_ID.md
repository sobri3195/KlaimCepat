# Sistem Expense Claims - Mode Demo

## 🎉 Sudah Siap Pakai!

Aplikasi sudah dikonfigurasi dengan **Mode Demo** sehingga Anda bisa langsung login dan mencoba tanpa perlu setup backend atau database!

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Jalankan aplikasi
cd apps/web
npm run dev
```

Buka browser di **http://localhost:3000**

## 👥 Login Demo

Di halaman login, klik salah satu tombol:

| Role | Button | Akses |
|------|--------|-------|
| **Admin** 👨‍💼 | Login as Admin | Full access + Approve/Reject |
| **Employee** 👤 | Login as Employee | Buat & lihat klaim sendiri |

**Tidak perlu password!** Tinggal klik tombol dan langsung masuk.

## 📦 Apa yang Sudah Ada?

✅ **15 dummy expense claims** dengan berbagai status
✅ **Dashboard analytics** dengan grafik dan statistik  
✅ **Workflow lengkap** untuk manage klaim expense
✅ **Mock API** yang simulate backend real
✅ **Auto-login** untuk testing cepat

## 📖 Dokumentasi Lengkap

- 🇮🇩 [Cara Login Demo (Bahasa Indonesia)](./CARA_LOGIN_DEMO.md)
- 🇬🇧 [Demo Mode Documentation (English)](./DEMO_MODE.md)
- 📘 [Full README (English)](./README.md)

## 💡 Fitur Utama

- OCR & Auto Data Extraction
- Digital Approval Workflow  
- Policy Compliance Engine
- Payroll & Accounting Integration
- Analytics Dashboard
- Multi-Currency Support

## 🌐 Deploy

### Netlify (Recommended)
```bash
# Mode Demo sudah aktif, tinggal deploy!
# Set env: VITE_DEMO_MODE=true
```

### Dengan Backend Real
Lihat [DEPLOYMENT.md](./DEPLOYMENT.md) untuk setup lengkap

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Node.js + Express (optional untuk demo)
- **Database**: PostgreSQL (tidak perlu untuk demo)
- **Build**: Vite + Turbo
- **Deploy**: Netlify Ready

## ⚡ Development

```bash
# Install
npm install

# Dev mode (all apps)
npm run dev

# Build
npm run build

# Format
npm run format

# Clean
npm run clean
```

## 📝 Catatan

- Mode Demo: Data hilang saat refresh (in-memory only)
- Untuk production: Set `VITE_DEMO_MODE=false` dan setup backend
- Dokumentasi lengkap di folder docs

---

**Happy Testing! 🎉**

Ada pertanyaan? Buka [CARA_LOGIN_DEMO.md](./CARA_LOGIN_DEMO.md)
