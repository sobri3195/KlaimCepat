# 📚 API Documentation - Expense Claims System

Base URL: `http://localhost:3001/api/v1`

## Authentication

All endpoints except `/auth/*` require authentication via JWT Bearer token.

### Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 🔐 Authentication Endpoints

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "employee@company.com",
  "password": "Admin123!"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid",
    "email": "employee@company.com",
    "firstName": "Bob",
    "lastName": "Johnson",
    "employeeId": "EMP004",
    "role": "EMPLOYEE",
    "department": {
      "id": "uuid",
      "name": "Engineering",
      "code": "ENG"
    },
    "position": "Software Engineer"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "newuser@company.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "employeeId": "EMP999",
  "departmentId": "uuid-optional"
}
```

**Response:** `201 Created` - Same as login response

### Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

---

## 📄 Claims Endpoints

### Create Claim
```http
POST /claims
```

**Request Body:**
```json
{
  "title": "Business Trip to Jakarta",
  "description": "Client meeting and training session",
  "claimType": "TRAVEL",
  "currency": "IDR",
  "departmentId": "uuid-optional",
  "projectId": "uuid-optional",
  "items": [
    {
      "date": "2024-01-15",
      "category": "TRANSPORTATION",
      "description": "Taxi to client office",
      "amount": 150000,
      "currency": "IDR",
      "vendor": "Grab"
    },
    {
      "date": "2024-01-15",
      "category": "MEAL",
      "description": "Lunch with client",
      "amount": 250000,
      "currency": "IDR",
      "vendor": "Restaurant ABC"
    }
  ]
}
```

**Claim Types:**
- `TRAVEL`
- `MEAL`
- `ACCOMMODATION`
- `TRANSPORTATION`
- `ENTERTAINMENT`
- `EQUIPMENT`
- `OTHER`

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "claimNumber": "CLM-202401-00001",
  "title": "Business Trip to Jakarta",
  "description": "Client meeting and training session",
  "claimType": "TRAVEL",
  "totalAmount": 400000,
  "currency": "IDR",
  "status": "DRAFT",
  "submittedAt": null,
  "hasViolations": false,
  "user": {
    "id": "uuid",
    "firstName": "Bob",
    "lastName": "Johnson",
    "employeeId": "EMP004"
  },
  "items": [...],
  "approvals": [],
  "policyViolations": [],
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### Get Claim by ID
```http
GET /claims/:id
```

**Response:** `200 OK` - Full claim object with items, approvals, and violations

### Get My Claims
```http
GET /claims/my
```

**Query Parameters:**
- `status` - Filter by status (DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, PAID)
- `fromDate` - ISO date string
- `toDate` - ISO date string
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Example:**
```http
GET /claims/my?status=APPROVED&page=1&limit=20
```

**Response:** `200 OK`
```json
{
  "claims": [...],
  "total": 45
}
```

### Submit Claim for Approval
```http
POST /claims/:id/submit
```

**Response:** `200 OK` - Updated claim with approvals assigned

### Upload Receipt
```http
POST /claims/upload-receipt
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `receipt` - Image file (JPEG, PNG, PDF)

**Response:** `200 OK`
```json
{
  "filename": "receipt-1234567890.jpg",
  "path": "/uploads/receipt-1234567890.jpg",
  "ocrResult": {
    "success": true,
    "data": {
      "date": "2024-01-15",
      "amount": 150000,
      "vendor": "Grab Indonesia",
      "category": "TRANSPORTATION",
      "currency": "IDR",
      "taxAmount": 15000,
      "taxRate": 10
    },
    "confidence": 85,
    "rawText": "Extracted OCR text..."
  }
}
```

---

## ✅ Approval Endpoints

### Get Pending Approvals
```http
GET /approvals/pending
```

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "claimNumber": "CLM-202401-00001",
    "title": "Business Trip",
    "totalAmount": 500000,
    "currency": "IDR",
    "status": "PENDING_APPROVAL",
    "user": {
      "id": "uuid",
      "firstName": "Bob",
      "lastName": "Johnson",
      "employeeId": "EMP004"
    },
    "items": [...],
    "policyViolations": [...]
  }
]
```

### Approve Claim
```http
POST /approvals/:claimId/approve
```

**Request Body:**
```json
{
  "comments": "Approved - all receipts verified"
}
```

**Response:** `200 OK` - Updated claim object

### Reject Claim
```http
POST /approvals/:claimId/reject
```

**Request Body:**
```json
{
  "comments": "Missing receipts for transportation expenses"
}
```

**Response:** `200 OK` - Updated claim object with REJECTED status

---

## 📊 Analytics Endpoints

*Requires role: MANAGER, FINANCE, CFO, or ADMIN*

### Dashboard Statistics
```http
GET /analytics/dashboard
```

**Query Parameters:**
- `departmentId` - Filter by department
- `fromDate` - ISO date string
- `toDate` - ISO date string

**Response:** `200 OK`
```json
{
  "totalClaims": 150,
  "totalAmount": 75000000,
  "pendingApprovals": 12,
  "avgApprovalTime": 24.5,
  "claimsByStatus": {
    "DRAFT": 5,
    "PENDING_APPROVAL": 12,
    "APPROVED": 100,
    "REJECTED": 8,
    "PAID": 25
  },
  "claimsByDepartment": {
    "Engineering": 80,
    "Sales": 45,
    "Finance": 25
  },
  "claimsByMonth": [
    {
      "month": "Jan 2024",
      "amount": 12500000,
      "count": 25
    }
  ]
}
```

### Top Spenders
```http
GET /analytics/top-spenders
```

**Query Parameters:**
- `limit` - Number of top spenders (default: 10)
- `startDate` - ISO date string
- `endDate` - ISO date string

**Response:** `200 OK`
```json
[
  {
    "user": {
      "id": "uuid",
      "name": "Bob Johnson",
      "employeeId": "EMP004",
      "department": "Engineering"
    },
    "totalAmount": 5000000,
    "claimCount": 12,
    "avgClaimAmount": 416666
  }
]
```

### Category Breakdown
```http
GET /analytics/category-breakdown
```

**Query Parameters:**
- `departmentId` - Filter by department
- `startDate` - ISO date string
- `endDate` - ISO date string

**Response:** `200 OK`
```json
[
  {
    "category": "TRANSPORTATION",
    "totalAmount": 15000000,
    "count": 120,
    "avgAmount": 125000
  },
  {
    "category": "MEAL",
    "totalAmount": 10000000,
    "count": 150,
    "avgAmount": 66666
  }
]
```

### Approval Metrics
```http
GET /analytics/approval-metrics
```

*Requires role: MANAGER, FINANCE, CFO, or ADMIN*

**Response:** `200 OK`
```json
[
  {
    "level": 1,
    "avgTimeHours": 12.5,
    "medianTimeHours": 10.0,
    "count": 45
  },
  {
    "level": 2,
    "avgTimeHours": 18.3,
    "medianTimeHours": 16.0,
    "count": 35
  }
]
```

### Policy Violation Statistics
```http
GET /analytics/policy-violations
```

*Requires role: FINANCE, CFO, or ADMIN*

**Response:** `200 OK`
```json
{
  "total": 25,
  "byType": [
    {
      "type": "AMOUNT_EXCEEDED",
      "count": 15,
      "waived": 3
    },
    {
      "type": "MISSING_RECEIPT",
      "count": 8,
      "waived": 0
    }
  ],
  "bySeverity": {
    "HIGH": 18,
    "MEDIUM": 5,
    "LOW": 2
  }
}
```

---

## 💰 Budget Endpoints

*Coming soon - endpoints for budget management*

```http
POST /budgets                      # Create budget
GET /budgets/:id/status           # Get budget status
GET /budgets/department/:id       # Get department budgets
GET /budgets/:id/forecast         # Get budget forecast
```

---

## 💵 Payroll Endpoints

*Coming soon - endpoints for payroll integration*

```http
POST /payroll/batch                    # Create payroll batch
POST /payroll/batch/:id/export        # Export batch
POST /payroll/batch/:id/sync          # Sync with ERP
```

---

## 🔔 Notification Endpoints

*Coming soon - endpoints for notification management*

```http
GET /notifications                 # Get user notifications
PUT /notifications/:id/read       # Mark as read
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Claim not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Authentication**: 5 requests per minute
- **Standard endpoints**: 100 requests per minute
- **Upload endpoints**: 10 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## Webhooks

*Coming soon - webhook support for external integrations*

---

## SDK & Libraries

### JavaScript/TypeScript
```bash
npm install @expense-claims/sdk
```

```javascript
import { ExpenseClaimsClient } from '@expense-claims/sdk';

const client = new ExpenseClaimsClient({
  apiKey: 'your-api-key',
  baseURL: 'http://localhost:3001/api/v1'
});

const claim = await client.claims.create({
  title: 'Business Trip',
  items: [...]
});
```

---

## Postman Collection

Import the Postman collection for testing:
```
File: postman_collection.json
```

---

## Support

For API support:
- Documentation: See FEATURES.md
- Issues: GitHub Issues
- Email: api-support@company.com

**API Version:** v1  
**Last Updated:** 2024
