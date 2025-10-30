# Netlify Deployment Guide

This guide will help you deploy the Expense Claims System frontend to Netlify.

## Prerequisites

- A Netlify account (sign up at https://netlify.com)
- Your repository pushed to GitHub, GitLab, or Bitbucket
- Node.js 18+ (handled automatically by Netlify)

## Quick Deploy

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. **Login to Netlify**
   - Go to https://app.netlify.com
   - Login or create an account

2. **Import your project**
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure build settings**
   
   The `netlify.toml` file in the root directory contains all the necessary configuration. Netlify will automatically detect it. Verify these settings:
   
   - **Base directory**: (leave empty or use `.`)
   - **Build command**: `npx turbo run build --filter=@expense-claims/web`
   - **Publish directory**: `apps/web/dist`
   - **Node version**: 18
   
   Note: Netlify automatically installs dependencies, so we don't include `npm install` in the build command.

4. **Deploy**
   - Click "Deploy site"
   - Wait for the build to complete (usually 2-5 minutes)
   - Your site will be available at a random Netlify subdomain

5. **Custom domain (Optional)**
   - Go to "Domain settings"
   - Add your custom domain
   - Follow DNS configuration instructions

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from project root
cd /path/to/expense-claims-system
netlify deploy --prod
```

## Configuration

### Environment Variables

If your frontend needs to connect to a backend API:

1. Go to your site's dashboard in Netlify
2. Navigate to "Site settings" → "Environment variables"
3. Add the following variables:

```
VITE_API_URL=https://your-backend-api.com/api
```

### API Backend Integration

The frontend is configured to use relative API paths (`/api/v1`). You have two options:

#### Option A: Deploy backend separately
1. Deploy your backend to a service like Heroku, Railway, or AWS
2. Update `netlify.toml` to proxy API requests:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-api-domain.com/api/:splat"
  status = 200
  force = true
```

#### Option B: Use Netlify Functions
Convert your API to Netlify serverless functions (requires code refactoring).

## Build Configuration

The project uses:
- **Turborepo**: For monorepo management
- **Vite**: For building the React app
- **Node 18**: Specified in `netlify.toml`

Build command breakdown:
```bash
# Netlify automatically runs: npm install (with dependencies from package-lock.json)
npx turbo run build --filter=@expense-claims/web  # Build only the web app
```

## Troubleshooting

### Build Fails with "Command not found"

**Issue**: Turbo or other dependencies not found

**Solution**: Make sure `netlify.toml` has the correct build command:
```toml
command = "npx turbo run build --filter=@expense-claims/web"
```

Note: Netlify automatically installs dependencies before running this command.

### Page Refresh Returns 404

**Issue**: SPA routing not configured

**Solution**: The `_redirects` file in `apps/web/public/` handles this. Ensure it contains:
```
/*    /index.html   200
```

### Build Succeeds but Site Shows Error

**Issue**: Usually an API connection problem

**Solution**: 
1. Check browser console for errors
2. Verify API URL is correct
3. Check CORS settings on your backend
4. Ensure backend is running and accessible

### TypeScript Build Errors

**Issue**: Strict TypeScript checking

**Solution**: All TypeScript errors must be fixed before deployment. Run locally:
```bash
npm install
npx turbo run build --filter=@expense-claims/web
```

### Large Bundle Size Warning

**Issue**: Build completes but shows bundle size warning

**Solution**: This is just a warning. To optimize:
- Implement code splitting
- Use dynamic imports for large dependencies
- Consider lazy loading routes

## Performance Optimization

### Enable Build Optimization

Netlify automatically:
- ✓ Serves assets via CDN
- ✓ Compresses assets with Brotli/Gzip
- ✓ Optimizes images
- ✓ Provides HTTPS by default

### Cache Configuration

The `netlify.toml` includes caching headers for static assets:
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Continuous Deployment

Once connected to Git:
- ✓ Automatic deploys on push to main branch
- ✓ Deploy previews for pull requests
- ✓ Rollback to previous deploys anytime

### Branch Deploys

Configure in Netlify dashboard:
1. Go to "Site settings" → "Build & deploy"
2. Set up branch deploy settings
3. Enable deploy previews for PRs

## Security Headers

Security headers are configured in `netlify.toml`:
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## Monitoring

### Build Status
Check build logs in Netlify dashboard under "Deploys" tab

### Analytics
Enable Netlify Analytics in site settings for:
- Page views
- Unique visitors
- Top pages
- Traffic sources

## Cost

- **Free tier**: 100GB bandwidth, 300 build minutes/month
- Perfect for development and small production sites
- Upgrade as needed for higher traffic

## Support

For Netlify-specific issues:
- Documentation: https://docs.netlify.com
- Community: https://answers.netlify.com
- Status: https://www.netlifystatus.com

For application issues:
- Check application logs
- Review browser console
- Verify environment variables
- Test API endpoints manually

## Next Steps After Deployment

1. ✓ Test all features on the deployed site
2. ✓ Configure custom domain
3. ✓ Set up SSL certificate (automatic with Netlify)
4. ✓ Enable form submissions (if using Netlify Forms)
5. ✓ Set up monitoring and alerts
6. ✓ Configure deploy notifications (Slack, email, etc.)

---

**Deployment Checklist:**

- [ ] Repository connected to Netlify
- [ ] Build completes successfully
- [ ] Site loads without errors
- [ ] Environment variables configured
- [ ] API connection working (if applicable)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] All routes accessible
- [ ] Forms working (if applicable)
- [ ] Analytics enabled (optional)
