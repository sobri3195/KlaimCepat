# Enterprise Expense Claims System

A comprehensive expense management platform with OCR, digital approval workflows, and payroll integration.

## 🚀 Core Features

### 1. OCR & Auto Data Extraction
- AI-powered OCR to read receipts, invoices, and travel tickets
- Automatic detection of transaction date, amount, category, and vendor
- Multi-format support (images, PDF, email invoices)

### 2. Digital Approval Workflow
- Multi-level approval system (employee → manager → finance)
- Configurable approval paths based on position, amount, or department
- Real-time notifications via WhatsApp, email, and mobile app

### 3. Policy Compliance Engine
- Automatic validation against company policies
- Auto-flagging of policy violations
- Efficient audit support for finance teams

### 4. Payroll & Accounting Integration
- Direct sync with Jurnal, Accurate, SAP, QuickBooks
- Export to CSV, XLSX, and API JSON
- Automated reconciliation

### 5. Analytics Dashboard
- Real-time insights and KPI tracking
- Visual reports for executives
- Cost analysis by division/project

## 💡 Value-Added Features

### 1. Smart Trip Planner
- Business trip management
- Auto-claim after trip completion
- Integration with travel booking systems

### 2. Multi-Currency & Tax Automation
- Auto-conversion using Bank Indonesia rates
- VAT and tax recognition for international claims

### 3. Budget Control
- Budget allocation per project/department
- Real-time budget monitoring and alerts

### 4. E-Receipt & Vendor Integration
- Direct integration with Grab, Traveloka, Tokopedia
- Automatic e-receipt retrieval

### 5. Audit Trail & Security
- Complete audit logging
- ISO 27001 compliant encryption
- Automatic cloud backup

## 🏗️ Architecture

```
expense-claims-system/
├── apps/
│   ├── api/          # Express REST API
│   └── web/          # React frontend
└── packages/
    ├── database/     # Prisma schemas and migrations
    ├── types/        # Shared TypeScript types
    └── config/       # Shared configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 14
- Redis (for caching and queues)

### Installation

```bash
npm install
```

### Setup Database

```bash
cd packages/database
npx prisma migrate dev
npx prisma generate
```

### Environment Variables

Create `.env` files in each app directory:

**apps/api/.env:**
```
DATABASE_URL="postgresql://user:password@localhost:5432/expense_claims"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-key"
AWS_S3_BUCKET="your-bucket"
AWS_ACCESS_KEY_ID="your-key"
AWS_SECRET_ACCESS_KEY="your-secret"
```

### Development

```bash
npm run dev
```

- API: http://localhost:3001
- Web: http://localhost:3000

## 🚢 Deployment

### Netlify (Frontend)

The easiest way to deploy the frontend is using Netlify:

```bash
# The project includes netlify.toml configuration
# Simply connect your repository to Netlify
```

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed instructions.

### Full Deployment

For complete deployment instructions including backend and database setup, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📦 Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, TypeScript, TailwindCSS
- **Database**: PostgreSQL with Prisma ORM
- **OCR**: Tesseract.js + OpenAI GPT-4 Vision
- **Authentication**: JWT with refresh tokens
- **Storage**: AWS S3 / MinIO
- **Queue**: Bull with Redis
- **Email**: Nodemailer
- **WhatsApp**: Twilio API

## 📄 License

Proprietary - All rights reserved
