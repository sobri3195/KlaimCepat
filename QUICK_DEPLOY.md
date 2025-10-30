# Quick Deploy to Netlify 🚀

## Prerequisites
✅ Git repository (GitHub, GitLab, or Bitbucket)
✅ Netlify account (free at netlify.com)

## Deploy in 3 Steps

### 1️⃣ Push to Git
```bash
git add .
git commit -m "Ready for Netlify deployment"
git push origin main
```

### 2️⃣ Connect to Netlify
1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider
4. Select your repository
5. Netlify will auto-detect settings from `netlify.toml` ✨

### 3️⃣ Deploy
Click **"Deploy site"** and wait 2-5 minutes ⏱️

## That's It! 🎉

Your site will be live at: `https://random-name-123456.netlify.app`

## Manual Configuration (If Auto-Detection Fails)

If Netlify doesn't auto-detect settings, use these:

| Setting | Value |
|---------|-------|
| **Base directory** | (leave empty) |
| **Build command** | `npx turbo run build --filter=@expense-claims/web` |
| **Publish directory** | `apps/web/dist` |
| **Node version** | 18 |

## Optional: Custom Domain

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow DNS instructions

## Optional: Environment Variables

If connecting to a backend API:

1. Go to **Site settings** → **Environment variables**
2. Add: `VITE_API_URL` = `https://your-api.com/api`

## Test Your Deployment

After deployment, check:
- ✅ Site loads without errors
- ✅ All pages are accessible
- ✅ Navigation works
- ✅ No 404 on page refresh

## Need Help?

📖 **Detailed Guide**: See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md)
📖 **Setup Summary**: See [NETLIFY_SETUP_SUMMARY.md](./NETLIFY_SETUP_SUMMARY.md)
📖 **Full Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Build Status

✅ **Tested and Working** - Build succeeds in ~10-15 seconds

---

**Happy Deploying!** 🎊
