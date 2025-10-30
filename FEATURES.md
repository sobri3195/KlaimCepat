# 🚀 Expense Claims System - Feature Documentation

## Core Features (Fitur Utama)

### 1. OCR & Auto Data Extraction ✅

**Implemented Features:**
- ✅ OCR processing using Tesseract.js for text extraction from receipts
- ✅ AI-powered parsing using OpenAI GPT-4 for structured data extraction
- ✅ Support for images (JPEG, PNG) and PDF documents
- ✅ Automatic detection of:
  - Transaction date
  - Total amount
  - Vendor/merchant name
  - Expense category
  - Line items with quantities and prices
  - Tax amount and rate
  - Currency detection
- ✅ Confidence scoring for OCR results
- ✅ Image preprocessing (resize, grayscale, normalize, sharpen)
- ✅ GPT-4 Vision API integration for enhanced accuracy

**API Endpoints:**
- `POST /api/v1/claims/upload-receipt` - Upload and process receipt

**Technologies:**
- Tesseract.js for OCR
- OpenAI GPT-4 & GPT-4 Vision for AI parsing
- Sharp for image preprocessing

---

### 2. Digital Approval Workflow ✅

**Implemented Features:**
- ✅ Multi-level approval system (employee → manager → finance → CFO)
- ✅ Configurable approval policies based on:
  - Department
  - Claim type
  - Amount thresholds
  - Position/role
- ✅ Dynamic approval routing
- ✅ Real-time notifications via:
  - ✅ Email (SMTP/Nodemailer)
  - ✅ WhatsApp (Twilio)
  - ✅ In-app notifications
- ✅ Approval actions (approve/reject with comments)
- ✅ Approval history and audit trail
- ✅ Escalation support

**API Endpoints:**
- `GET /api/v1/approvals/pending` - Get pending approvals
- `POST /api/v1/approvals/:id/approve` - Approve a claim
- `POST /api/v1/approvals/:id/reject` - Reject a claim

**Database Models:**
- `Approval` - Approval records
- `ApprovalPolicy` - Configurable approval rules

---

### 3. Policy Compliance Engine ✅

**Implemented Features:**
- ✅ Automatic validation against company policies
- ✅ Policy violation detection:
  - Amount exceeded limits
  - Missing receipts (for amounts > Rp50,000)
  - Unauthorized categories
  - Duplicate claims
- ✅ Severity levels (LOW, MEDIUM, HIGH, CRITICAL)
- ✅ Policy waiver functionality
- ✅ Real-time validation during claim creation
- ✅ Audit support with detailed violation reports

**Violation Types:**
- `AMOUNT_EXCEEDED` - Exceeds policy limits (e.g., daily meal allowance)
- `UNAUTHORIZED_CATEGORY` - Invalid expense category
- `MISSING_RECEIPT` - No receipt attached
- `DUPLICATE_CLAIM` - Possible duplicate submission
- `POLICY_BREACH` - General policy violation

**API Endpoints:**
- Policy validation is automatic during claim creation/submission

**Example Policy Rules:**
```javascript
{
  "Daily Meal Allowance": {
    "maxAmount": 100000,  // Rp100,000
    "currency": "IDR",
    "perDay": true
  },
  "Accommodation": {
    "domestic": { "maxAmount": 1000000 },
    "international": { "maxAmount": 2000000 }
  }
}
```

---

### 4. Payroll & Accounting Integration ✅

**Implemented Features:**
- ✅ Payroll batch creation for approved claims
- ✅ Export formats:
  - ✅ JSON
  - ✅ CSV
  - ✅ XLSX (basic structure)
- ✅ ERP system integration support:
  - Jurnal.id
  - Accurate
  - SAP
  - QuickBooks
- ✅ Batch processing with period selection
- ✅ Automated payment tracking
- ✅ Reconciliation support

**API Endpoints:**
- `POST /api/v1/payroll/batch` - Create payroll batch
- `POST /api/v1/payroll/batch/:id/export` - Export batch
- `POST /api/v1/payroll/batch/:id/sync` - Sync with ERP

**Export Data Structure:**
```json
{
  "batchNumber": "PAY-202401-0001",
  "periodStart": "2024-01-01",
  "periodEnd": "2024-01-31",
  "totalAmount": 50000000,
  "claims": [
    {
      "employeeId": "EMP001",
      "employeeName": "John Doe",
      "amount": 500000,
      "description": "Business trip expenses"
    }
  ]
}
```

---

### 5. Analytics Dashboard ✅

**Implemented Features:**
- ✅ Real-time statistics:
  - Total claims count
  - Total amount
  - Pending approvals
  - Average approval time
- ✅ Visual reports:
  - Claims by status
  - Claims by department
  - Monthly trend analysis
  - Category breakdown (pie chart)
  - Top spenders
- ✅ KPI cards for executives
- ✅ Approval metrics
- ✅ Policy violation statistics
- ✅ Filterable by department and date range

**API Endpoints:**
- `GET /api/v1/analytics/dashboard` - Dashboard statistics
- `GET /api/v1/analytics/top-spenders` - Top spending employees
- `GET /api/v1/analytics/category-breakdown` - Expense by category
- `GET /api/v1/analytics/approval-metrics` - Approval performance
- `GET /api/v1/analytics/policy-violations` - Violation statistics

**Charts & Visualizations:**
- Bar charts for monthly trends
- Pie charts for category distribution
- Tables for detailed breakdowns

---

## Value-Added Features (Fitur Tambahan)

### 1. Smart Trip Planner ✅

**Implemented Features:**
- ✅ Trip request creation
- ✅ Travel details tracking:
  - Destination
  - Departure & return dates
  - Purpose
  - Transport mode
  - Accommodation
- ✅ Estimated cost planning
- ✅ Advance payment tracking
- ✅ Automatic claim creation after trip completion
- ✅ Trip status management (DRAFT, APPROVED, IN_PROGRESS, COMPLETED)

**Database Model:**
- `TripRequest` with full trip lifecycle tracking

---

### 2. Multi-Currency & Tax Automation ✅

**Implemented Features:**
- ✅ Multi-currency support (IDR, USD, SGD, EUR, etc.)
- ✅ Exchange rate management
- ✅ Daily rate updates from Bank Indonesia API
- ✅ Automatic currency conversion
- ✅ Tax calculation:
  - Tax amount tracking
  - Tax rate (PPN/VAT)
- ✅ International travel support

**Database Model:**
- `ExchangeRate` with daily rate tracking

**Currency Features:**
- Automatic conversion to base currency (IDR)
- Historical exchange rate tracking
- Support for custom exchange rates

---

### 3. Budget Control ✅

**Implemented Features:**
- ✅ Budget allocation per:
  - Department
  - Project
  - Fiscal period (Q1-Q4, Monthly)
- ✅ Real-time budget monitoring
- ✅ Budget utilization tracking:
  - Total amount
  - Allocated amount
  - Spent amount
  - Remaining amount
- ✅ Alert thresholds (default 80%)
- ✅ Automatic notifications when threshold reached
- ✅ Budget forecasting
- ✅ Over-budget detection

**API Endpoints:**
- `POST /api/v1/budgets` - Create budget
- `GET /api/v1/budgets/:id/status` - Get budget status
- `GET /api/v1/budgets/department/:id` - Department budgets
- `GET /api/v1/budgets/:id/forecast` - Budget forecast

---

### 4. E-Receipt & Vendor Integration ✅

**Implemented Features:**
- ✅ Vendor integration framework
- ✅ Supported vendors:
  - Grab (ride-hailing)
  - Traveloka (travel booking)
  - Tokopedia (e-commerce)
- ✅ E-receipt storage and matching
- ✅ Automatic receipt retrieval (API structure ready)
- ✅ Transaction synchronization

**Database Models:**
- `VendorIntegration` - Vendor API configurations
- `EReceipt` - Electronic receipt storage

**Integration Points:**
- API key management
- Webhook support
- Automatic transaction import

---

### 5. Audit Trail & Security ✅

**Implemented Features:**
- ✅ Complete audit logging:
  - User actions
  - Entity changes
  - Before/after values
  - Timestamps
- ✅ Security features:
  - JWT authentication
  - Refresh token support
  - Role-based access control (RBAC)
  - Password hashing (bcrypt)
- ✅ Device tracking:
  - IP address
  - User agent
  - Device information
- ✅ Data encryption (in-transit via HTTPS)
- ✅ Secure file upload with validation

**Database Model:**
- `AuditLog` with comprehensive tracking

**Security Headers:**
- Helmet.js for HTTP security headers
- CORS configuration
- Rate limiting support

---

## Technical Implementation

### Tech Stack

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL with Prisma ORM
- Redis (for caching and queues)
- JWT authentication
- Multer (file upload)
- Nodemailer (email)
- Twilio (WhatsApp)

**Frontend:**
- React + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Zustand (state management)
- React Router (routing)
- Recharts (charts)
- React Hot Toast (notifications)

**AI & OCR:**
- Tesseract.js (OCR)
- OpenAI GPT-4 & GPT-4 Vision (AI parsing)
- Sharp (image processing)

**Infrastructure:**
- Docker & Docker Compose
- PostgreSQL 15
- Redis 7

---

## Database Schema

### Key Models:
1. **User** - Employee/user management
2. **Department** - Organizational structure
3. **Claim** - Expense claims
4. **ClaimItem** - Individual expense items
5. **Approval** - Approval workflow
6. **ApprovalPolicy** - Configurable approval rules
7. **PolicyViolation** - Policy compliance tracking
8. **CompanyPolicy** - Policy definitions
9. **TripRequest** - Business trip management
10. **Budget** - Budget allocation
11. **BudgetAllocation** - Budget distribution
12. **Project** - Project tracking
13. **PayrollBatch** - Payroll integration
14. **VendorIntegration** - External vendor APIs
15. **EReceipt** - Electronic receipts
16. **ExchangeRate** - Currency rates
17. **Notification** - User notifications
18. **AuditLog** - Audit trail

---

## API Endpoints Summary

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/refresh` - Refresh access token

### Claims
- `POST /api/v1/claims` - Create claim
- `GET /api/v1/claims/my` - Get user's claims
- `GET /api/v1/claims/:id` - Get claim details
- `POST /api/v1/claims/:id/submit` - Submit for approval
- `POST /api/v1/claims/upload-receipt` - Upload receipt

### Approvals
- `GET /api/v1/approvals/pending` - Get pending approvals
- `POST /api/v1/approvals/:id/approve` - Approve claim
- `POST /api/v1/approvals/:id/reject` - Reject claim

### Analytics
- `GET /api/v1/analytics/dashboard` - Dashboard stats
- `GET /api/v1/analytics/top-spenders` - Top spenders
- `GET /api/v1/analytics/category-breakdown` - Category analysis
- `GET /api/v1/analytics/approval-metrics` - Approval metrics
- `GET /api/v1/analytics/policy-violations` - Violation stats

---

## Installation & Setup

See README.md for detailed setup instructions.

## Future Enhancements

1. **Mobile App** - Native iOS/Android apps
2. **Blockchain Integration** - Immutable audit trail
3. **ML-based Fraud Detection** - Anomaly detection
4. **Advanced OCR** - Receipt categorization
5. **Multi-tenancy** - Support for multiple organizations
6. **Advanced Reporting** - Custom report builder
7. **Integration Marketplace** - Plugin ecosystem
8. **Voice Input** - Voice-to-expense conversion
9. **Geolocation** - Location-based validation
10. **Mileage Tracking** - Automatic distance calculation

---

## Compliance & Standards

- ✅ ISO 27001 security principles
- ✅ GDPR compliance ready
- ✅ SOC 2 Type II ready
- ✅ Audit trail for financial compliance
- ✅ Role-based access control
- ✅ Data encryption standards

---

## Support

For technical support or feature requests, please contact the development team.

**Version:** 1.0.0  
**Last Updated:** 2024
