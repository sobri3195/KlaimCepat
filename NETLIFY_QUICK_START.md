# Netlify Quick Start Guide

## Persiapan Deploy ke Netlify

Proyek ini sudah dikonfigurasi untuk deploy otomatis ke Netlify.

### 1. Prerequisites
- Akun Netlify (gratis di https://netlify.com)
- Repository sudah di push ke GitHub/GitLab/Bitbucket

### 2. Langkah Deploy

#### Via Netlify Dashboard (Paling Mudah)

1. **Login ke Netlify**
   - Buka https://app.netlify.com
   - Login atau buat akun baru

2. **Import Project**
   - Klik "Add new site" → "Import an existing project"
   - Pilih Git provider (GitHub/GitLab/Bitbucket)
   - Pilih repository ini

3. **Konfigurasi Build**
   
   Netlify akan otomatis mendeteksi `netlify.toml`. Pastikan settingan berikut:
   
   - **Base directory**: `.` (atau kosongkan)
   - **Build command**: `npx turbo run build --filter=@expense-claims/web`
   - **Publish directory**: `apps/web/dist`
   - **Node version**: 18 (sudah di set di netlify.toml)

4. **Environment Variables (WAJIB untuk production)**
   
   **Penting**: Aplikasi ini memerlukan backend API untuk berfungsi. Tambahkan environment variable:
   - Pergi ke "Site settings" → "Environment variables"
   - Tambahkan: `VITE_API_URL=https://your-backend-api.com/api/v1`
   
   Tanpa backend API, aplikasi akan menampilkan error 404 untuk semua API calls.

5. **Deploy**
   - Klik "Deploy site"
   - Tunggu build selesai (2-5 menit)
   - Site akan otomatis tersedia di subdomain Netlify

#### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### 3. Konfigurasi Tambahan

#### Custom Domain
1. Pergi ke "Domain settings" di dashboard Netlify
2. Tambahkan custom domain Anda
3. Ikuti instruksi konfigurasi DNS

#### API Backend
Jika Anda deploy backend terpisah, update `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-api-domain.com/api/:splat"
  status = 200
  force = true
```

### 4. Verifikasi Deploy

Setelah deploy berhasil:
- ✓ Buka URL site Anda
- ✓ Pastikan halaman loading dengan benar
- ✓ Check browser console untuk error
- ✓ Test navigasi antar halaman
- ✓ Test koneksi API (jika sudah dikonfigurasi)

### 5. Continuous Deployment

Setelah tersambung ke Git:
- Push ke branch `main` akan otomatis trigger deploy
- Pull Request akan mendapatkan deploy preview
- Rollback kapanpun dari dashboard Netlify

### 6. Troubleshooting

#### Build Failed
- Check build log di dashboard Netlify
- Pastikan dependencies terinstall dengan benar
- Coba build local: `npm install && npx turbo run build --filter=@expense-claims/web`

#### Page Refresh 404
- Sudah ditangani oleh `_redirects` file di `apps/web/public/`
- File ini otomatis ter-copy ke dist saat build

#### API Connection Error
- Pastikan environment variable `VITE_API_URL` sudah diset
- Check CORS settings di backend
- Verifikasi backend sudah running dan accessible

### 7. Biaya

- **Free tier**: 100GB bandwidth, 300 build minutes/bulan
- Cocok untuk development dan production kecil
- Upgrade jika butuh bandwidth lebih tinggi

### 8. Support

- Dokumentasi: https://docs.netlify.com
- Community: https://answers.netlify.com
- Status: https://www.netlifystatus.com

---

**Checklist Deploy:**

- [ ] Repository connected ke Netlify
- [ ] Build berhasil tanpa error
- [ ] Site loading dengan benar
- [ ] Environment variables dikonfigurasi (jika perlu)
- [ ] Custom domain dikonfigurasi (opsional)
- [ ] SSL certificate aktif (otomatis)
- [ ] Semua routes accessible
- [ ] API connection working (jika applicable)
