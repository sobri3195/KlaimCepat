import { mockUsers, mockClaims, mockStats } from './mockData';

export class MockApiService {
  private currentUser: any = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  async login(email: string, _password: string) {
    await this.delay(500);

    const user = Object.values(mockUsers).find((u) => u.email === email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    this.currentUser = user;
    this.accessToken = 'mock-access-token-' + Date.now();
    this.refreshToken = 'mock-refresh-token-' + Date.now();

    return {
      data: {
        user,
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
      },
    };
  }

  async refreshAuth(refreshToken: string) {
    await this.delay(200);

    if (!refreshToken || !this.currentUser) {
      throw new Error('Invalid refresh token');
    }

    this.accessToken = 'mock-access-token-' + Date.now();
    this.refreshToken = 'mock-refresh-token-' + Date.now();

    return {
      data: {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
      },
    };
  }

  async getDashboardStats() {
    await this.delay(300);
    return { data: mockStats };
  }

  async getMyClaims(params?: any) {
    await this.delay(400);
    
    let filteredClaims = [...mockClaims];
    
    if (params?.status) {
      filteredClaims = filteredClaims.filter((c) => c.status === params.status);
    }
    
    if (params?.limit) {
      filteredClaims = filteredClaims.slice(0, parseInt(params.limit));
    }

    return {
      data: {
        claims: filteredClaims,
        total: filteredClaims.length,
      },
    };
  }

  async getClaimById(id: string) {
    await this.delay(300);
    
    const claim = mockClaims.find((c) => c.id === id);
    
    if (!claim) {
      throw new Error('Claim not found');
    }

    return { data: claim };
  }

  async createClaim(data: any) {
    await this.delay(500);
    
    const newClaim = {
      id: String(mockClaims.length + 1),
      claimNumber: `CLM-2024-${String(mockClaims.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      userId: this.currentUser?.id || '2',
      hasViolations: false,
    };

    mockClaims.unshift(newClaim);
    return { data: newClaim };
  }

  async updateClaim(id: string, data: any) {
    await this.delay(500);
    
    const index = mockClaims.findIndex((c) => c.id === id);
    
    if (index === -1) {
      throw new Error('Claim not found');
    }

    mockClaims[index] = { ...mockClaims[index], ...data };
    return { data: mockClaims[index] };
  }

  async submitClaim(id: string) {
    await this.delay(500);
    
    const index = mockClaims.findIndex((c) => c.id === id);
    
    if (index === -1) {
      throw new Error('Claim not found');
    }

    mockClaims[index].status = 'PENDING_APPROVAL';
    mockClaims[index].submittedAt = new Date().toISOString();
    
    return { data: mockClaims[index] };
  }

  async deleteClaim(id: string) {
    await this.delay(300);
    
    const index = mockClaims.findIndex((c) => c.id === id);
    
    if (index === -1) {
      throw new Error('Claim not found');
    }

    mockClaims.splice(index, 1);
    return { data: { success: true } };
  }

  async getPendingApprovals() {
    await this.delay(400);
    
    const pendingClaims = mockClaims
      .filter((c) => c.status === 'PENDING_APPROVAL')
      .map((claim) => ({
        ...claim,
        user: mockUsers.employee,
        policyViolations: [],
      }));
    
    return {
      data: pendingClaims,
    };
  }

  async approveClaim(id: string, _data: any) {
    await this.delay(500);
    
    const index = mockClaims.findIndex((c) => c.id === id);
    
    if (index === -1) {
      throw new Error('Claim not found');
    }

    mockClaims[index].status = 'APPROVED';
    return { data: mockClaims[index] };
  }

  async rejectClaim(id: string, _data: any) {
    await this.delay(500);
    
    const index = mockClaims.findIndex((c) => c.id === id);
    
    if (index === -1) {
      throw new Error('Claim not found');
    }

    mockClaims[index].status = 'REJECTED';
    return { data: mockClaims[index] };
  }

  async getAnalytics() {
    await this.delay(400);
    return { data: mockStats };
  }

  async getTopSpenders() {
    await this.delay(400);
    return {
      data: [
        {
          user: { name: 'John Doe' },
          claimCount: 15,
          totalAmount: 18400000,
          avgClaimAmount: 1226666,
        },
      ],
    };
  }

  async getCategoryBreakdown() {
    await this.delay(400);
    
    const breakdown = mockClaims.reduce((acc: any, claim) => {
      claim.items.forEach((item: any) => {
        const category = item.category;
        if (!acc[category]) {
          acc[category] = { category, count: 0, totalAmount: 0 };
        }
        acc[category].count++;
        acc[category].totalAmount += item.amount;
      });
      return acc;
    }, {});

    const result = Object.values(breakdown).map((cat: any) => ({
      ...cat,
      avgAmount: Math.round(cat.totalAmount / cat.count),
    }));

    return { data: result };
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockApiService = new MockApiService();
