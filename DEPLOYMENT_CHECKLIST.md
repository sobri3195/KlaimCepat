# Checklist Deploy ke Netlify

## ✅ Persiapan

- [x] Konfigurasi `netlify.toml` sudah ada
- [x] File `_redirects` untuk SPA routing sudah ada
- [x] Build command sudah dikonfigurasi
- [x] Environment variable types sudah didefinisikan
- [x] API baseURL menggunakan environment variable

## 📋 Langkah-langkah Deploy

### 1. Test Build Lokal

```bash
# Test build seperti di Netlify
./netlify-test.sh

# Atau manual
npm install
npx turbo run build --filter=@expense-claims/web
```

**Expected Output:**
- ✅ Build selesai tanpa error
- ✅ Folder `apps/web/dist` terbuat
- ✅ Files: `index.html`, `_redirects`, dan folder `assets`

### 2. Push ke Git Repository

```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### 3. Deploy ke Netlify

#### Option A: Via Dashboard (Recommended)

1. Login ke https://app.netlify.com
2. Klik "Add new site" → "Import an existing project"
3. Pilih Git provider dan repository
4. Settings akan auto-detect dari `netlify.toml`:
   - Base directory: `.`
   - Build command: `npx turbo run build --filter=@expense-claims/web`
   - Publish directory: `apps/web/dist`
5. Klik "Deploy site"

#### Option B: Via CLI

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### 4. Konfigurasi Environment Variables (Opsional)

Jika Anda punya backend API terpisah:

1. Buka site dashboard di Netlify
2. Pergi ke "Site settings" → "Environment variables"
3. Tambahkan:
   ```
   VITE_API_URL=https://your-backend-api.com/api/v1
   ```
4. Redeploy site (trigger manual atau push ulang)

### 5. Konfigurasi API Proxy (Opsional)

Jika backend di domain berbeda, uncomment di `netlify.toml`:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-api-domain.com/api/:splat"
  status = 200
  force = true
```

### 6. Custom Domain (Opsional)

1. Pergi ke "Domain settings" di dashboard
2. Klik "Add custom domain"
3. Masukkan domain Anda
4. Ikuti instruksi DNS configuration:
   - Tambah CNAME record atau A record
   - Tunggu propagasi DNS (5-30 menit)

## 🧪 Testing Setelah Deploy

- [ ] Buka URL Netlify Anda
- [ ] Verifikasi halaman loading dengan benar
- [ ] Test navigasi antar pages
- [ ] Cek browser console tidak ada error
- [ ] Test refresh halaman (tidak 404)
- [ ] Test API connection (jika sudah dikonfigurasi)
- [ ] Test di mobile browser
- [ ] Verifikasi HTTPS aktif

## 🔧 Troubleshooting

### Build Failed

**Gejala:** Build error di Netlify dashboard

**Solusi:**
1. Check build log untuk detail error
2. Test build lokal: `./netlify-test.sh`
3. Pastikan semua dependencies di `package.json`
4. Verifikasi Node version (18) di `netlify.toml`

### Page Refresh 404

**Gejala:** Refresh halaman atau direct URL return 404

**Solusi:**
- File `_redirects` harus ada di `apps/web/public/`
- Content: `/*    /index.html   200`
- File ini auto-copy ke `dist` saat build

### API Connection Error

**Gejala:** Error saat fetch API, CORS error

**Solusi:**
1. Pastikan `VITE_API_URL` diset di Netlify
2. Check backend CORS settings
3. Verifikasi backend accessible dari internet
4. Test API endpoint dengan curl/Postman

### Build Timeout

**Gejala:** Build terlalu lama atau timeout

**Solusi:**
- Free tier Netlify ada limit build time
- Optimize dependencies
- Consider upgrade Netlify plan

## 📊 Monitoring

### Build Status
- Check di Netlify dashboard → "Deploys"
- Set up deploy notifications (Slack, email)

### Analytics
- Enable Netlify Analytics di site settings
- Track visitors, page views, bandwidth

### Performance
- Check di Lighthouse / PageSpeed Insights
- Netlify auto-optimize dengan:
  - CDN distribution
  - Brotli/Gzip compression
  - Image optimization
  - HTTP/2

## 🔐 Security

### HTTPS
- ✅ Auto-enabled oleh Netlify
- ✅ Certificate auto-renew

### Headers
Security headers sudah dikonfigurasi di `netlify.toml`:
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy

## 💰 Biaya

### Free Tier Includes:
- 100GB bandwidth/bulan
- 300 build minutes/bulan
- Unlimited sites
- HTTPS/SSL
- Continuous deployment
- Deploy previews

### Upgrade jika:
- Traffic > 100GB/bulan
- Need more build minutes
- Custom build plugins
- Team collaboration features

## 📞 Support

- **Netlify Docs:** https://docs.netlify.com
- **Community Forum:** https://answers.netlify.com
- **Status:** https://www.netlifystatus.com

## 🎉 Success!

Jika semua checklist ✅, selamat! Aplikasi Anda sudah live di Netlify.

### Next Steps:
1. Setup custom domain
2. Enable analytics
3. Configure deploy notifications
4. Add deploy badge to README
5. Setup staging environment (branch deploys)
