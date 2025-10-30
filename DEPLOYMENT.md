# Deployment Guide - Expense Claims System

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 14
- Redis >= 6
- Docker & Docker Compose (optional)

## Environment Setup

### 1. Database Setup

#### Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

#### Manual PostgreSQL Setup
```bash
createdb expense_claims
createuser expense_claims -P
# Enter password: expense_claims_pass
```

### 2. Environment Variables

Create `.env` files in appropriate directories:

**apps/api/.env:**
```env
NODE_ENV=production
PORT=3001

DATABASE_URL="postgresql://expense_claims:expense_claims_pass@localhost:5432/expense_claims"

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

REDIS_URL=redis://localhost:6379

OPENAI_API_KEY=your-openai-api-key

AWS_REGION=ap-southeast-1
AWS_S3_BUCKET=expense-claims-receipts
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-email-password
EMAIL_FROM=noreply@company.com

TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

CORS_ORIGIN=https://your-domain.com
```

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Build Packages
```bash
cd packages/database
npm run db:generate
npm run db:migrate
npm run db:seed

cd ../..
npm run build
```

## Development

```bash
npm run dev
```

This will start:
- API server on http://localhost:3001
- Web app on http://localhost:3000

## Production Deployment

### Option 1: Traditional Deployment

#### Build
```bash
npm run build
```

#### Start API
```bash
cd apps/api
npm run start
```

#### Build & Serve Web App
```bash
cd apps/web
npm run build
# Serve the dist folder with nginx or any static server
```

### Option 2: Docker Deployment

Create `Dockerfile` for API:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN npm install
RUN npm run build

EXPOSE 3001

CMD ["node", "apps/api/dist/server.js"]
```

Build and run:
```bash
docker build -t expense-claims-api .
docker run -p 3001:3001 --env-file .env expense-claims-api
```

### Option 3: Cloud Deployment

#### AWS Elastic Beanstalk
1. Install EB CLI
2. Initialize: `eb init`
3. Create environment: `eb create production`
4. Deploy: `eb deploy`

#### Heroku
```bash
heroku create expense-claims-api
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
git push heroku main
```

#### Vercel (Frontend)
```bash
cd apps/web
vercel --prod
```

#### Railway
1. Connect GitHub repository
2. Add PostgreSQL and Redis services
3. Set environment variables
4. Deploy automatically on push

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/expense-claims/web;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Migration

```bash
cd packages/database
npx prisma migrate deploy
```

## Monitoring

### Application Logs
```bash
# API logs
tail -f apps/api/logs/app.log

# System logs
journalctl -u expense-claims-api -f
```

### Health Check
```bash
curl http://localhost:3001/health
```

### Performance Monitoring
- Set up New Relic or DataDog APM
- Enable PostgreSQL query logging
- Monitor Redis cache hit rates

## Backup & Recovery

### Database Backup
```bash
pg_dump expense_claims > backup_$(date +%Y%m%d).sql
```

### Automated Backup
```bash
crontab -e
# Add: 0 2 * * * pg_dump expense_claims > /backups/expense_$(date +\%Y\%m\%d).sql
```

### Recovery
```bash
psql expense_claims < backup_20240101.sql
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up rate limiting
- [ ] Enable CORS properly
- [ ] Scan for vulnerabilities: `npm audit`
- [ ] Keep dependencies updated
- [ ] Use environment-specific configs
- [ ] Enable database connection pooling
- [ ] Set up intrusion detection

## Scaling

### Horizontal Scaling
- Use load balancer (nginx, AWS ALB)
- Deploy multiple API instances
- Use Redis for session sharing

### Database Scaling
- Enable read replicas
- Implement connection pooling
- Add database indexes
- Use query caching

### Caching Strategy
```javascript
// Redis caching
import redis from 'redis';
const client = redis.createClient({ url: process.env.REDIS_URL });

// Cache dashboard stats for 5 minutes
const cacheKey = 'dashboard:stats';
const cached = await client.get(cacheKey);
if (cached) return JSON.parse(cached);

const stats = await computeStats();
await client.setEx(cacheKey, 300, JSON.stringify(stats));
```

## Troubleshooting

### Database Connection Issues
```bash
psql -U expense_claims -d expense_claims
# Test connection
```

### Port Already in Use
```bash
lsof -ti:3001 | xargs kill -9
```

### Build Failures
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Performance Optimization

1. **Enable Gzip Compression**
2. **Use CDN for Static Assets**
3. **Implement API Response Caching**
4. **Optimize Database Queries**
5. **Use Connection Pooling**
6. **Enable HTTP/2**
7. **Lazy Load Images**
8. **Code Splitting**

## Maintenance

### Update Dependencies
```bash
npm outdated
npm update
npm audit fix
```

### Database Maintenance
```bash
# Vacuum
psql -d expense_claims -c "VACUUM ANALYZE;"

# Reindex
psql -d expense_claims -c "REINDEX DATABASE expense_claims;"
```

## Support

For deployment issues:
1. Check logs: `npm run logs`
2. Verify environment variables
3. Test database connection
4. Check Redis connection
5. Review firewall rules

## Version History

- v1.0.0 - Initial release
