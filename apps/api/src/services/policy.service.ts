import { prisma } from '@expense-claims/database';
import { PolicyComplianceResult } from '@expense-claims/types';
import { Decimal } from 'decimal.js';

export class PolicyService {
  async validateClaim(claimData: any): Promise<PolicyComplianceResult> {
    const violations: any[] = [];

    const policies = await prisma.companyPolicy.findMany({
      where: { isActive: true },
    });

    for (const policy of policies) {
      const policyViolations = await this.checkPolicy(claimData, policy);
      violations.push(...policyViolations);
    }

    for (const item of claimData.items || []) {
      const itemViolations = await this.validateClaimItem(item);
      violations.push(...itemViolations);
    }

    return {
      isCompliant: violations.length === 0,
      violations,
    };
  }

  private async checkPolicy(claimData: any, policy: any): Promise<any[]> {
    const violations: any[] = [];
    const rules = policy.rules as any;

    if (policy.category === 'MEAL' && claimData.claimType === 'MEAL') {
      const totalMealAmount = claimData.items
        .filter((item: any) => item.category === 'MEAL')
        .reduce((sum: number, item: any) => sum + parseFloat(item.amount), 0);

      if (rules.maxAmount && totalMealAmount > rules.maxAmount) {
        violations.push({
          type: 'AMOUNT_EXCEEDED',
          severity: 'HIGH',
          message: `Melebihi limit makan harian Rp${rules.maxAmount.toLocaleString('id-ID')}. Total klaim: Rp${totalMealAmount.toLocaleString('id-ID')}`,
          policyRule: policy.name,
        });
      }
    }

    if (policy.category === 'ACCOMMODATION' && claimData.claimType === 'ACCOMMODATION') {
      for (const item of claimData.items || []) {
        if (item.category === 'ACCOMMODATION') {
          const maxAmount = rules.domestic?.maxAmount || rules.international?.maxAmount;
          if (maxAmount && parseFloat(item.amount) > maxAmount) {
            violations.push({
              type: 'AMOUNT_EXCEEDED',
              severity: 'HIGH',
              message: `Biaya akomodasi melebihi limit Rp${maxAmount.toLocaleString('id-ID')}`,
              policyRule: policy.name,
            });
          }
        }
      }
    }

    if (policy.category === 'TRANSPORTATION' && claimData.claimType === 'TRANSPORTATION') {
      for (const item of claimData.items || []) {
        if (rules.taxi?.maxAmount && parseFloat(item.amount) > rules.taxi.maxAmount) {
          violations.push({
            type: 'AMOUNT_EXCEEDED',
            severity: 'MEDIUM',
            message: `Biaya taksi melebihi limit Rp${rules.taxi.maxAmount.toLocaleString('id-ID')}`,
            policyRule: policy.name,
          });
        }
      }
    }

    return violations;
  }

  private async validateClaimItem(item: any): Promise<any[]> {
    const violations: any[] = [];

    if (!item.receiptFile && parseFloat(item.amount) > 50000) {
      violations.push({
        type: 'MISSING_RECEIPT',
        severity: 'HIGH',
        message: 'Struk/kwitansi wajib dilampirkan untuk transaksi di atas Rp50.000',
        policyRule: 'Receipt Requirement Policy',
      });
    }

    const authorizedCategories = [
      'MEAL',
      'TRANSPORTATION',
      'ACCOMMODATION',
      'ENTERTAINMENT',
      'EQUIPMENT',
      'OTHER',
    ];
    if (!authorizedCategories.includes(item.category)) {
      violations.push({
        type: 'UNAUTHORIZED_CATEGORY',
        severity: 'HIGH',
        message: `Kategori '${item.category}' tidak diizinkan`,
        policyRule: 'Authorized Categories Policy',
      });
    }

    return violations;
  }

  async checkDuplicateClaim(userId: string, amount: number, date: Date): Promise<boolean> {
    const existingClaim = await prisma.claim.findFirst({
      where: {
        userId,
        totalAmount: new Decimal(amount),
        items: {
          some: {
            date: {
              gte: new Date(date.getTime() - 24 * 60 * 60 * 1000),
              lte: new Date(date.getTime() + 24 * 60 * 60 * 1000),
            },
          },
        },
        status: {
          notIn: ['CANCELLED', 'REJECTED'],
        },
      },
    });

    return !!existingClaim;
  }

  async getApprovalPolicy(
    departmentId?: string,
    claimType?: string,
    amount?: number
  ): Promise<any> {
    const policies = await prisma.approvalPolicy.findMany({
      where: {
        isActive: true,
        OR: [{ departmentId }, { departmentId: null }],
      },
      orderBy: { priority: 'desc' },
    });

    for (const policy of policies) {
      if (policy.claimTypes.length > 0 && claimType && !policy.claimTypes.includes(claimType as any)) {
        continue;
      }

      if (policy.minAmount && amount && new Decimal(amount).lessThan(policy.minAmount)) {
        continue;
      }

      if (policy.maxAmount && amount && new Decimal(amount).greaterThan(policy.maxAmount)) {
        continue;
      }

      return policy;
    }

    return await prisma.approvalPolicy.findFirst({
      where: {
        isActive: true,
        departmentId: null,
        claimTypes: { isEmpty: true },
      },
      orderBy: { priority: 'asc' },
    });
  }

  async createApprovals(claimId: string, policy: any, userId: string): Promise<void> {
    const approvalLevels = policy.approvalLevels as any[];
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { department: true },
    });

    for (const levelConfig of approvalLevels) {
      let approverId: string | undefined;

      if (levelConfig.approverRole === 'MANAGER') {
        approverId = user?.managerId || undefined;
      } else if (levelConfig.approverRole === 'FINANCE') {
        const financeUser = await prisma.user.findFirst({
          where: { role: 'FINANCE', status: 'ACTIVE' },
        });
        approverId = financeUser?.id;
      } else if (levelConfig.approverRole === 'CFO') {
        const cfoUser = await prisma.user.findFirst({
          where: { role: 'CFO', status: 'ACTIVE' },
        });
        approverId = cfoUser?.id;
      }

      if (!approverId) {
        const admin = await prisma.user.findFirst({
          where: { role: 'ADMIN', status: 'ACTIVE' },
        });
        approverId = admin?.id;
      }

      if (approverId) {
        await prisma.approval.create({
          data: {
            claimId,
            approverId,
            level: levelConfig.level,
            status: 'PENDING',
          },
        });
      }
    }
  }
}

export const policyService = new PolicyService();
