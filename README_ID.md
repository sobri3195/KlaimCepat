# Sistem Expense Claims - Frontend Only

## 🎉 Sudah Siap Pakai!

Aplikasi sudah dikonfigurasi untuk berjalan 100% di browser tanpa perlu backend atau database!

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Jalankan aplikasi
npm run dev
```

Buka browser di **http://localhost:3000** - Modal login akan muncul otomatis

## 👥 Login dengan Modal

Modal login akan muncul otomatis. Klik salah satu tombol:

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
✅ **Auto-login via modal** untuk testing cepat

## 📖 Dokumentasi Lengkap

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
# Tidak perlu environment variable, tinggal deploy!
# Aplikasi berjalan 100% di browser
```

Lihat [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) untuk panduan lengkap

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS + Vite
- **State Management**: Zustand
- **Data**: Mock API dengan sample data built-in
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

- Data disimpan di browser (localStorage untuk auth)
- Data claims in-memory, akan reset saat refresh
- Backend tidak diperlukan - 100% frontend only

---

**Happy Testing! 🎉**

Aplikasi siap digunakan tanpa backend!
