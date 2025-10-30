# Demo Mode Documentation

This application includes a **Demo Mode** that allows you to test and showcase the expense claims system without requiring a backend API. Demo mode is perfect for:

- Testing the frontend in isolation
- Showcasing the application to stakeholders
- Development when the backend is unavailable
- Quick prototyping and UI demonstrations

## Features

### ✨ What's Included in Demo Mode

- **Auto-Login**: Click-to-login buttons for Admin and Employee roles
- **15 Pre-loaded Claims**: Various expense claims with different statuses
- **Full Workflow**: Test all claim statuses (Draft, Pending, Approved, Rejected, Paid)
- **Analytics Dashboard**: Pre-populated statistics and charts
- **Mock API**: Simulated backend responses with realistic delays
- **Persistent State**: Changes are maintained during the demo session

### 📊 Demo Data Overview

**Users:**
- **Admin User**: Full access, can approve/reject claims
  - Email: admin@company.com
  - Role: ADMIN
  
- **Employee User**: Standard access, can create and view own claims
  - Email: employee@company.com
  - Role: EMPLOYEE

**15 Dummy Claims Include:**
- Business travel expenses
- Client meetings and meals
- Office supplies and equipment
- Transportation costs
- Training and certification fees
- Various claim statuses: Draft (1), Pending (3), Approved (7), Rejected (1), Paid (3)
- Total mock expense amount: ~18.4 million IDR

## How to Enable Demo Mode

### Step 1: Configure Environment Variable

Create or modify `/apps/web/.env` file:

```bash
# Demo Mode Configuration
VITE_DEMO_MODE=true

# API Configuration (not needed in demo mode)
# VITE_API_URL=http://localhost:3001/api/v1
```

### Step 2: Start the Application

```bash
cd apps/web
npm install
npm run dev
```

The app will start at `http://localhost:3000`

### Step 3: Auto-Login

Visit the login page and you'll see two buttons:
- **Login as Admin** - Full access to all features including approvals
- **Login as Employee** - Standard user access

Click either button to automatically log in with mock credentials.

## Disabling Demo Mode

To use the real backend API, simply change the environment variable:

```bash
# In /apps/web/.env
VITE_DEMO_MODE=false

# Point to your real backend
VITE_API_URL=http://localhost:3001/api/v1
```

Or remove the `.env` file entirely and set `VITE_API_URL` in your deployment environment.

## Technical Details

### Architecture

Demo mode works by intercepting API calls and returning mock data:

1. **Mock Data** (`src/services/mockData.ts`)
   - Contains all dummy users, claims, and statistics
   - Pre-configured with realistic test data

2. **Mock API Service** (`src/services/mockApi.ts`)
   - Simulates backend API responses
   - Includes realistic delays (200-500ms)
   - Handles all CRUD operations in-memory

3. **API Wrapper** (`src/services/api.ts`)
   - Checks `VITE_DEMO_MODE` environment variable
   - Routes requests to mock API or real backend
   - Transparent to the rest of the application

### Available Mock Endpoints

Demo mode supports these API endpoints:

**Authentication:**
- `POST /auth/login` - Login with demo credentials
- `POST /auth/refresh` - Refresh auth tokens

**Claims:**
- `GET /claims/my` - Get user's claims (with filters)
- `GET /claims/:id` - Get claim details
- `POST /claims` - Create new claim
- `PUT /claims/:id` - Update claim
- `DELETE /claims/:id` - Delete claim
- `POST /claims/:id/submit` - Submit claim for approval

**Approvals (Admin only):**
- `GET /approvals/pending` - Get pending approvals
- `POST /approvals/:id/approve` - Approve a claim
- `POST /approvals/:id/reject` - Reject a claim

**Analytics:**
- `GET /analytics/dashboard` - Dashboard statistics
- `GET /analytics/top-spenders` - Top spending employees
- `GET /analytics/category-breakdown` - Expense by category

### Data Persistence

**Important**: Mock data is stored in memory and resets when you refresh the page. Changes made during a demo session (creating claims, approving/rejecting, etc.) will persist until page reload but are not saved to any database.

## Use Cases

### 1. Frontend Development
Test UI components and workflows without backend dependency:
```bash
VITE_DEMO_MODE=true npm run dev
```

### 2. Stakeholder Demos
Show the complete application flow to clients or team members without needing infrastructure setup.

### 3. UI/UX Testing
Test different user roles and permissions easily by switching between admin and employee logins.

### 4. Integration Testing
Write frontend tests that don't require a real backend:
```typescript
// In your test setup
process.env.VITE_DEMO_MODE = 'true';
```

## Customizing Demo Data

To modify the demo data, edit `/apps/web/src/services/mockData.ts`:

```typescript
// Add more users
export const mockUsers = {
  admin: { ... },
  employee: { ... },
  // Add your custom user
  manager: {
    id: '3',
    email: 'manager@company.com',
    firstName: 'Manager',
    lastName: 'User',
    role: 'MANAGER',
    employeeId: 'EMP003',
  },
};

// Add more claims
export const mockClaims = [
  // ... existing claims
  {
    id: '16',
    claimNumber: 'CLM-2024-016',
    title: 'Your Custom Claim',
    // ... other fields
  },
];
```

## Limitations

1. **No Real Persistence**: Data resets on page refresh
2. **Limited Validation**: Some backend validations may not be replicated
3. **No File Uploads**: Receipt images use placeholder URLs
4. **Simplified Auth**: No real token validation or expiration
5. **Single User Session**: Can't simulate multiple concurrent users

## Production Deployment

**Warning**: Never deploy to production with `VITE_DEMO_MODE=true`. Demo mode is for development and demonstration purposes only.

For production deployment:
1. Set `VITE_DEMO_MODE=false` or remove it
2. Configure `VITE_API_URL` to point to your production API
3. Ensure proper authentication and security measures

## Troubleshooting

**Q: Demo mode isn't activating**
- Check that `.env` file is in `/apps/web/` directory
- Verify `VITE_DEMO_MODE=true` (exactly, case-sensitive)
- Restart the dev server after changing `.env`

**Q: Changes aren't persisting**
- Demo mode stores data in memory only
- Refresh the page to reset to initial state
- For persistent data, use the real backend

**Q: Some features don't work in demo mode**
- Check console for errors
- Some advanced features may require backend integration
- Refer to mock API implementation for supported endpoints

## Support

For issues or questions about demo mode:
1. Check the mock API implementation in `src/services/mockApi.ts`
2. Review mock data structure in `src/services/mockData.ts`
3. Ensure environment variables are configured correctly

---

**Version**: 1.0.0  
**Last Updated**: January 2024
