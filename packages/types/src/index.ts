export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  role: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  position?: string;
}

export interface ClaimCreateRequest {
  title: string;
  description?: string;
  claimType: string;
  currency?: string;
  departmentId?: string;
  projectId?: string;
  tripRequestId?: string;
  items: ClaimItemInput[];
}

export interface ClaimItemInput {
  date: string;
  category: string;
  description: string;
  amount: number;
  currency?: string;
  vendor?: string;
  receiptFile?: any;
}

export interface ClaimResponse {
  id: string;
  claimNumber: string;
  title: string;
  description?: string;
  claimType: string;
  totalAmount: number;
  currency: string;
  status: string;
  submittedAt?: string;
  hasViolations: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  department?: {
    id: string;
    name: string;
  };
  items: ClaimItemResponse[];
  approvals: ApprovalResponse[];
  policyViolations: PolicyViolationResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface ClaimItemResponse {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  vendor?: string;
  receiptUrl?: string;
  ocrData?: any;
  ocrConfidence?: number;
  isOcrVerified: boolean;
}

export interface ApprovalResponse {
  id: string;
  level: number;
  status: string;
  approver: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  comments?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface PolicyViolationResponse {
  id: string;
  type: string;
  severity: string;
  message: string;
  policyRule?: string;
  isWaived: boolean;
}

export interface OCRResult {
  success: boolean;
  data?: {
    date?: string;
    amount?: number;
    vendor?: string;
    category?: string;
    items?: Array<{
      description: string;
      quantity?: number;
      unitPrice?: number;
      amount: number;
    }>;
    taxAmount?: number;
    taxRate?: number;
    total?: number;
    currency?: string;
  };
  confidence?: number;
  rawText?: string;
  error?: string;
}

export interface DashboardStats {
  totalClaims: number;
  totalAmount: number;
  pendingApprovals: number;
  avgApprovalTime: number;
  claimsByStatus: Record<string, number>;
  claimsByDepartment: Record<string, number>;
  claimsByMonth: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
}

export interface BudgetStatus {
  id: string;
  name: string;
  totalAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
  isOverBudget: boolean;
  alerts: string[];
}

export interface NotificationPreferences {
  email: boolean;
  whatsapp: boolean;
  inApp: boolean;
  push: boolean;
  claimSubmitted: boolean;
  claimApproved: boolean;
  claimRejected: boolean;
  approvalRequired: boolean;
  budgetAlert: boolean;
}

export interface TripRequestInput {
  title: string;
  purpose: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  estimatedCost: number;
  currency?: string;
  transportMode?: string;
  accommodation?: string;
}

export interface PayrollExportRequest {
  periodStart: string;
  periodEnd: string;
  format: 'CSV' | 'XLSX' | 'JSON';
  erpSystem?: string;
  includeDetails?: boolean;
}

export interface PolicyComplianceResult {
  isCompliant: boolean;
  violations: Array<{
    type: string;
    severity: string;
    message: string;
    policyRule: string;
  }>;
}

export interface ApprovalActionRequest {
  status: 'APPROVED' | 'REJECTED';
  comments?: string;
}

export interface ExchangeRateResponse {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: string;
  source: string;
}

export interface VendorReceiptSync {
  vendorName: string;
  receipts: Array<{
    transactionId: string;
    transactionDate: string;
    amount: number;
    currency: string;
    category: string;
    description?: string;
    receiptData: any;
  }>;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
