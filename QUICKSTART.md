# 🚀 Quick Start Guide - Expense Claims System

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker** and **Docker Compose** (recommended for database setup)

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Navigate to project directory
cd /home/engine/project

# Install all dependencies
npm install
```

### 2. Start Database Services

Using Docker Compose (recommended):
```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379

Or manually install PostgreSQL and Redis and update the connection strings in `.env` files.

### 3. Setup Database

```bash
# Navigate to database package
cd packages/database

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Go back to root
cd ../..
```

### 4. Configure Environment

The `.env` file is already created in `apps/api/.env`. Update these values if needed:

**Required for OCR features:**
- `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys

**Optional (for notifications):**
- Email settings (SMTP)
- Twilio settings (WhatsApp)

### 5. Start Development Servers

```bash
# Start all services (API + Web)
npm run dev
```

This will start:
- **API Server**: http://localhost:3001
- **Web App**: http://localhost:3000

### 6. Access the Application

Open your browser and navigate to: **http://localhost:3000**

**Default Login Credentials:**
```
Admin:
Email: admin@company.com
Password: Admin123!

Employee:
Email: employee@company.com
Password: Admin123!

Manager:
Email: manager@company.com
Password: Admin123!

CFO:
Email: cfo@company.com
Password: Admin123!
```

## Testing Features

### 1. Create a Claim (Employee)
1. Login as `employee@company.com`
2. Click **"New Claim"**
3. Fill in claim details
4. Add expense items
5. Click **"Create Claim"**
6. Submit for approval

### 2. Approve Claims (Manager)
1. Login as `manager@company.com`
2. Go to **"Approvals"**
3. Review pending claims
4. Click **"Approve"** or **"Reject"**

### 3. View Analytics (Manager/Finance/CFO)
1. Login with appropriate role
2. Go to **"Analytics"**
3. View dashboard with:
   - Claims statistics
   - Monthly trends
   - Top spenders
   - Category breakdown

### 4. Test OCR (All Users)
1. Create a new claim
2. Click **"Upload Receipt"** (feature available in claim items)
3. Upload an image of a receipt
4. OCR will extract: date, amount, vendor, category

## API Documentation

### Health Check
```bash
curl http://localhost:3001/health
```

### Login
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"employee@company.com","password":"Admin123!"}'
```

### Get My Claims
```bash
curl http://localhost:3001/api/v1/claims/my \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Claim
```bash
curl -X POST http://localhost:3001/api/v1/claims \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Business Trip to Jakarta",
    "description": "Client meeting expenses",
    "claimType": "TRAVEL",
    "items": [
      {
        "date": "2024-01-15",
        "category": "TRANSPORTATION",
        "description": "Taxi to airport",
        "amount": 150000,
        "vendor": "Grab"
      }
    ]
  }'
```

## Project Structure

```
expense-claims-system/
├── apps/
│   ├── api/              # Backend API (Express + TypeScript)
│   │   └── src/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── middleware/
│   │       └── routes/
│   └── web/              # Frontend (React + TypeScript)
│       └── src/
│           ├── components/
│           ├── pages/
│           ├── services/
│           └── stores/
├── packages/
│   ├── database/         # Prisma schema and migrations
│   └── types/            # Shared TypeScript types
└── docker-compose.yml    # Database services
```

## Common Commands

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Build all packages
npm run build

# Run tests
npm run test

# Format code
npm run format

# Database commands
cd packages/database
npm run db:migrate        # Run migrations
npm run db:generate       # Generate Prisma client
npm run db:seed           # Seed data
npm run db:studio         # Open Prisma Studio
```

## Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker ps

# Restart database
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Cannot Connect to Database
1. Ensure Docker containers are running: `docker-compose ps`
2. Check DATABASE_URL in `apps/api/.env`
3. Try: `docker-compose down && docker-compose up -d`

### OCR Not Working
1. Ensure `OPENAI_API_KEY` is set in `apps/api/.env`
2. Check API key is valid
3. Verify image format (JPEG, PNG supported)

## Next Steps

1. **Explore Features**: Try creating claims, approvals, and viewing analytics
2. **Customize Policies**: Add company-specific expense policies
3. **Configure Notifications**: Set up email and WhatsApp notifications
4. **Add Users**: Create additional users for testing
5. **Review Documentation**: Check FEATURES.md for detailed feature list

## Support

For issues or questions:
1. Check the FEATURES.md documentation
2. Review API logs: `cd apps/api && npm run dev`
3. Check browser console for frontend errors
4. Review DEPLOYMENT.md for production setup

## Features Overview

✅ **OCR & AI Parsing** - Automatic receipt data extraction  
✅ **Multi-level Approvals** - Configurable workflow  
✅ **Policy Compliance** - Automatic validation  
✅ **Payroll Integration** - Export to ERP systems  
✅ **Analytics Dashboard** - Real-time insights  
✅ **Budget Control** - Department/project budgets  
✅ **Multi-currency** - Exchange rate support  
✅ **Audit Trail** - Complete activity logging  

**Happy Claiming! 🎉**
