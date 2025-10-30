# Enterprise Expense Claims System

A comprehensive expense management platform with OCR, digital approval workflows, and payroll integration.

## 🚀 Quick Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

Proyek ini sudah siap untuk di-deploy ke Netlify! Lihat [NETLIFY_QUICK_START.md](./NETLIFY_QUICK_START.md) untuk panduan lengkap dalam Bahasa Indonesia.

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
│   └── web/          # React frontend (with built-in demo data)
└── packages/
    └── types/        # Shared TypeScript types
```

## 🚀 Getting Started

### Frontend Only - No Backend Required! 🎭

This application runs entirely in your browser with built-in demo data. No backend setup needed!

#### Installation

```bash
npm install
```

#### Development

```bash
npm run dev
```

Visit http://localhost:3000 and a login modal will automatically appear. Click "Login as Admin" or "Login as Employee" to explore the app with 15 pre-loaded expense claims.

The application uses:
- Mock API with realistic delays
- Pre-loaded sample data (15 expense claims)
- Full feature demonstration
- No database or backend required

## 🚢 Deployment

### Netlify

The easiest way to deploy is using Netlify:

```bash
# The project includes netlify.toml configuration
# Simply connect your repository to Netlify and deploy!
```

No environment variables or backend setup required. The application works entirely in the browser with built-in demo data.

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed instructions.

## 📦 Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **State Management**: Zustand
- **Routing**: React Router
- **UI Components**: Lucide React Icons
- **Data**: Built-in mock API with sample data
- **Styling**: Tailwind CSS
- **Notifications**: React Hot Toast

## 📄 License

Proprietary - All rights reserved
