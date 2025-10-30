# Development Guide

## Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Redis (for caching and queues)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

```bash
cd packages/database
npx prisma migrate dev
npx prisma generate
cd ../..
```

### 3. Configure Environment Variables

**Backend API** (`apps/api/.env`):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/expense_claims"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key-change-in-production"
CORS_ORIGIN="http://localhost:3000"
PORT=3001

# Optional - for OCR features
OPENAI_API_KEY="your-openai-key"

# Optional - for file uploads
AWS_S3_BUCKET="your-bucket"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
```

**Frontend** (`apps/web/.env`):
```env
# For local development with Vite proxy (recommended)
# Leave commented to use default proxy configuration in vite.config.ts
# VITE_API_URL=http://localhost:3001/api/v1

# Or set explicitly if needed
VITE_API_URL=http://localhost:3001/api/v1
```

### 4. Start Development Servers

Start both frontend and backend:
```bash
npm run dev
```

Or start them separately:

**Backend only:**
```bash
cd apps/api
npm run dev
```

**Frontend only:**
```bash
cd apps/web
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## Common Issues

### 404 Errors on `/api/v1/auth/login`

This happens when:
1. **Backend is not running** - Make sure the API server is running on port 3001
2. **Database is not setup** - Run database migrations first
3. **Port conflict** - Check if another process is using port 3001

**Solution**:
```bash
# Check if backend is running
curl http://localhost:3001/health

# If not running, start it
cd apps/api
npm run dev
```

### CORS Errors

If you see CORS errors in the browser console:
1. Check that `CORS_ORIGIN` in `apps/api/.env` matches your frontend URL
2. Default is `http://localhost:3000`

### Database Connection Errors

If you see database connection errors:
1. Make sure PostgreSQL is running
2. Check the `DATABASE_URL` in `apps/api/.env`
3. Verify database exists: `psql -U user -d expense_claims`

## Development Workflow

### Making API Changes

1. Update controllers in `apps/api/src/controllers/`
2. Update routes in `apps/api/src/routes/`
3. Test with curl or Postman:
   ```bash
   curl -X POST http://localhost:3001/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@company.com","password":"Admin123!"}'
   ```

### Making Frontend Changes

1. Update components in `apps/web/src/`
2. Hot reload will automatically refresh the browser
3. Check browser console for errors

### Database Changes

1. Update schema in `packages/database/prisma/schema.prisma`
2. Create migration:
   ```bash
   cd packages/database
   npx prisma migrate dev --name your_migration_name
   ```
3. Regenerate Prisma client:
   ```bash
   npx prisma generate
   ```

## Testing

### Manual Testing

Use the demo credentials:
- Admin: `admin@company.com` / `Admin123!`
- Employee: `employee@company.com` / `Admin123!`

### API Testing

Test endpoints with curl:
```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"Admin123!"}'

# Get claims (requires auth token)
curl http://localhost:3001/api/v1/claims/my \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Debugging

### Backend Logs

The backend runs with nodemon and shows detailed logs:
- Request logs
- Database queries
- Error stack traces

### Frontend Logs

Open browser DevTools:
- Console: Shows JavaScript errors and logs
- Network: Shows API requests and responses
- React DevTools: Inspect component state

## Production Build

Build for production:
```bash
npm run build
```

This builds both apps:
- Frontend: `apps/web/dist/`
- Backend: `apps/api/dist/`

## Need Help?

- Check [API.md](./API.md) for API documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions
- Review [README.md](./README.md) for project overview
