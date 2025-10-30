import { prisma } from '@expense-claims/database';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { Decimal } from 'decimal.js';

export class AnalyticsService {
  async getDashboardStats(filters?: { departmentId?: string; fromDate?: Date; toDate?: Date }): Promise<any> {
    const where: any = {};

    if (filters?.departmentId) {
      where.departmentId = filters.departmentId;
    }

    if (filters?.fromDate || filters?.toDate) {
      where.createdAt = {};
      if (filters.fromDate) where.createdAt.gte = filters.fromDate;
      if (filters.toDate) where.createdAt.lte = filters.toDate;
    }

    const [totalClaims, claims, pendingApprovals] = await Promise.all([
      prisma.claim.count({ where }),
      prisma.claim.findMany({
        where,
        select: {
          totalAmount: true,
          status: true,
          departmentId: true,
          submittedAt: true,
          approvals: {
            select: {
              createdAt: true,
              approvedAt: true,
            },
          },
          department: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.approval.count({
        where: {
          status: 'PENDING',
        },
      }),
    ]);

    const totalAmount = claims.reduce(
      (sum, claim) => sum.plus(claim.totalAmount),
      new Decimal(0)
    );

    const claimsByStatus = claims.reduce((acc: any, claim) => {
      acc[claim.status] = (acc[claim.status] || 0) + 1;
      return acc;
    }, {});

    const claimsByDepartment = claims.reduce((acc: any, claim) => {
      const deptName = claim.department?.name || 'No Department';
      acc[deptName] = (acc[deptName] || 0) + 1;
      return acc;
    }, {});

    const approvalTimes = claims
      .filter((c) => c.approvals.length > 0)
      .map((c) => {
        const firstApproval = c.approvals[0];
        if (!firstApproval.approvedAt || !c.submittedAt) return null;
        return firstApproval.approvedAt.getTime() - c.submittedAt.getTime();
      })
      .filter((t) => t !== null) as number[];

    const avgApprovalTime =
      approvalTimes.length > 0
        ? approvalTimes.reduce((sum, t) => sum + t, 0) / approvalTimes.length / (1000 * 60 * 60)
        : 0;

    const claimsByMonth = this.groupClaimsByMonth(claims);

    return {
      totalClaims,
      totalAmount: parseFloat(totalAmount.toString()),
      pendingApprovals,
      avgApprovalTime: Math.round(avgApprovalTime * 10) / 10,
      claimsByStatus,
      claimsByDepartment,
      claimsByMonth,
    };
  }

  async getTopSpenders(limit: number = 10, period?: { start: Date; end: Date }): Promise<any[]> {
    const where: any = {
      status: {
        in: ['APPROVED', 'PAID'],
      },
    };

    if (period) {
      where.submittedAt = {
        gte: period.start,
        lte: period.end,
      };
    }

    const claims = await prisma.claim.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeId: true,
            department: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const spenderMap = claims.reduce((acc: any, claim) => {
      const userId = claim.user.id;
      if (!acc[userId]) {
        acc[userId] = {
          user: claim.user,
          totalAmount: new Decimal(0),
          claimCount: 0,
        };
      }
      acc[userId].totalAmount = acc[userId].totalAmount.plus(claim.totalAmount);
      acc[userId].claimCount += 1;
      return acc;
    }, {});

    return Object.values(spenderMap)
      .map((spender: any) => ({
        user: {
          id: spender.user.id,
          name: `${spender.user.firstName} ${spender.user.lastName}`,
          employeeId: spender.user.employeeId,
          department: spender.user.department?.name,
        },
        totalAmount: parseFloat(spender.totalAmount.toString()),
        claimCount: spender.claimCount,
        avgClaimAmount: parseFloat(spender.totalAmount.dividedBy(spender.claimCount).toString()),
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, limit);
  }

  async getCategoryBreakdown(filters?: { departmentId?: string; period?: { start: Date; end: Date } }): Promise<any[]> {
    const where: any = {
      status: {
        in: ['APPROVED', 'PAID'],
      },
    };

    if (filters?.departmentId) {
      where.departmentId = filters.departmentId;
    }

    if (filters?.period) {
      where.submittedAt = {
        gte: filters.period.start,
        lte: filters.period.end,
      };
    }

    const items = await prisma.claimItem.findMany({
      where: {
        claim: where,
      },
      select: {
        category: true,
        amount: true,
      },
    });

    const categoryMap = items.reduce((acc: any, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          category: item.category,
          totalAmount: new Decimal(0),
          count: 0,
        };
      }
      acc[item.category].totalAmount = acc[item.category].totalAmount.plus(item.amount);
      acc[item.category].count += 1;
      return acc;
    }, {});

    return Object.values(categoryMap)
      .map((cat: any) => ({
        category: cat.category,
        totalAmount: parseFloat(cat.totalAmount.toString()),
        count: cat.count,
        avgAmount: parseFloat(cat.totalAmount.dividedBy(cat.count).toString()),
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  }

  async getApprovalMetrics(): Promise<any> {
    const approvals = await prisma.approval.findMany({
      where: {
        approvedAt: {
          not: null,
        },
      },
      include: {
        claim: {
          select: {
            submittedAt: true,
          },
        },
      },
    });

    const approvalTimes = approvals
      .filter((a) => a.approvedAt && a.claim.submittedAt)
      .map((a) => ({
        level: a.level,
        timeHours: (a.approvedAt!.getTime() - a.claim.submittedAt!.getTime()) / (1000 * 60 * 60),
      }));

    const byLevel = approvalTimes.reduce((acc: any, { level, timeHours }) => {
      if (!acc[level]) {
        acc[level] = { level, times: [] };
      }
      acc[level].times.push(timeHours);
      return acc;
    }, {});

    const metrics = Object.values(byLevel).map((levelData: any) => {
      const times = levelData.times;
      const avg = times.reduce((sum: number, t: number) => sum + t, 0) / times.length;
      const sorted = times.sort((a: number, b: number) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];

      return {
        level: levelData.level,
        avgTimeHours: Math.round(avg * 10) / 10,
        medianTimeHours: Math.round(median * 10) / 10,
        count: times.length,
      };
    });

    return metrics;
  }

  async getPolicyViolationStats(): Promise<any> {
    const violations = await prisma.policyViolation.findMany({
      include: {
        claim: {
          select: {
            status: true,
          },
        },
      },
    });

    const byType = violations.reduce((acc: any, v) => {
      if (!acc[v.type]) {
        acc[v.type] = {
          type: v.type,
          count: 0,
          waived: 0,
        };
      }
      acc[v.type].count += 1;
      if (v.isWaived) {
        acc[v.type].waived += 1;
      }
      return acc;
    }, {});

    const bySeverity = violations.reduce((acc: any, v) => {
      acc[v.severity] = (acc[v.severity] || 0) + 1;
      return acc;
    }, {});

    return {
      total: violations.length,
      byType: Object.values(byType),
      bySeverity,
    };
  }

  private groupClaimsByMonth(claims: any[]): any[] {
    const monthlyData: any = {};

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, 'yyyy-MM');
      monthlyData[monthKey] = {
        month: format(date, 'MMM yyyy'),
        amount: new Decimal(0),
        count: 0,
      };
    }

    claims.forEach((claim) => {
      if (!claim.submittedAt) return;
      const monthKey = format(claim.submittedAt, 'yyyy-MM');
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].amount = monthlyData[monthKey].amount.plus(claim.totalAmount);
        monthlyData[monthKey].count += 1;
      }
    });

    return Object.values(monthlyData).map((m: any) => ({
      month: m.month,
      amount: parseFloat(m.amount.toString()),
      count: m.count,
    }));
  }
}

export const analyticsService = new AnalyticsService();
