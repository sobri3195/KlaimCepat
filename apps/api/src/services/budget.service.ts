import { prisma } from '@expense-claims/database';
import { Decimal } from 'decimal.js';
import { notificationService } from './notification.service';

export class BudgetService {
  async createBudget(data: any): Promise<any> {
    return await prisma.budget.create({
      data: {
        name: data.name,
        description: data.description,
        departmentId: data.departmentId,
        projectId: data.projectId,
        fiscalYear: data.fiscalYear,
        fiscalPeriod: data.fiscalPeriod,
        totalAmount: new Decimal(data.totalAmount),
        remainingAmount: new Decimal(data.totalAmount),
        alertThreshold: new Decimal(data.alertThreshold || 80),
        isActive: true,
      },
    });
  }

  async getBudgetStatus(budgetId: string): Promise<any> {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: {
        department: true,
        project: true,
        allocations: true,
      },
    });

    if (!budget) {
      throw new Error('Budget not found');
    }

    const utilizationPercentage = budget.totalAmount.greaterThan(0)
      ? budget.spentAmount.dividedBy(budget.totalAmount).times(100).toNumber()
      : 0;

    const isOverBudget = budget.spentAmount.greaterThan(budget.totalAmount);

    const alerts: string[] = [];
    if (utilizationPercentage >= parseFloat(budget.alertThreshold.toString())) {
      alerts.push(
        `Budget utilization has reached ${utilizationPercentage.toFixed(1)}% of total allocation`
      );
    }
    if (isOverBudget) {
      alerts.push('Budget has been exceeded');
    }

    return {
      id: budget.id,
      name: budget.name,
      totalAmount: parseFloat(budget.totalAmount.toString()),
      spentAmount: parseFloat(budget.spentAmount.toString()),
      remainingAmount: parseFloat(budget.remainingAmount.toString()),
      utilizationPercentage,
      isOverBudget,
      alerts,
      department: budget.department,
      project: budget.project,
      allocations: budget.allocations,
    };
  }

  async updateBudgetSpending(
    budgetId: string,
    amount: Decimal,
    operation: 'add' | 'subtract' = 'add'
  ): Promise<void> {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
    });

    if (!budget) {
      throw new Error('Budget not found');
    }

    const newSpentAmount =
      operation === 'add' ? budget.spentAmount.plus(amount) : budget.spentAmount.minus(amount);
    const newRemainingAmount = budget.totalAmount.minus(newSpentAmount);

    await prisma.budget.update({
      where: { id: budgetId },
      data: {
        spentAmount: newSpentAmount,
        remainingAmount: newRemainingAmount,
      },
    });

    const utilizationPercentage = newSpentAmount.dividedBy(budget.totalAmount).times(100).toNumber();

    if (
      utilizationPercentage >= parseFloat(budget.alertThreshold.toString()) &&
      budget.departmentId
    ) {
      const managers = await prisma.user.findMany({
        where: {
          departmentId: budget.departmentId,
          role: 'MANAGER',
          status: 'ACTIVE',
        },
      });

      for (const manager of managers) {
        await notificationService.sendBudgetAlert(
          manager.id,
          budget,
          Math.round(utilizationPercentage)
        );
      }
    }
  }

  async getBudgetsByDepartment(departmentId: string): Promise<any[]> {
    const budgets = await prisma.budget.findMany({
      where: {
        departmentId,
        isActive: true,
      },
      include: {
        allocations: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return budgets.map((budget) => ({
      id: budget.id,
      name: budget.name,
      fiscalYear: budget.fiscalYear,
      fiscalPeriod: budget.fiscalPeriod,
      totalAmount: parseFloat(budget.totalAmount.toString()),
      spentAmount: parseFloat(budget.spentAmount.toString()),
      remainingAmount: parseFloat(budget.remainingAmount.toString()),
      utilizationPercentage: budget.totalAmount.greaterThan(0)
        ? budget.spentAmount.dividedBy(budget.totalAmount).times(100).toNumber()
        : 0,
    }));
  }

  async getBudgetForecast(budgetId: string): Promise<any> {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
    });

    if (!budget) {
      throw new Error('Budget not found');
    }

    const claims = await prisma.claim.findMany({
      where: {
        OR: [{ departmentId: budget.departmentId }, { projectId: budget.projectId }],
        status: {
          in: ['APPROVED', 'PAID'],
        },
      },
      orderBy: { submittedAt: 'asc' },
    });

    const monthlySpending = claims.reduce((acc: any, claim) => {
      if (!claim.submittedAt) return acc;
      const month = claim.submittedAt.toISOString().slice(0, 7);
      acc[month] = (acc[month] || new Decimal(0)).plus(claim.totalAmount);
      return acc;
    }, {});

    const avgMonthlySpending =
      Object.values(monthlySpending).reduce((sum: any, val: any) => sum.plus(val), new Decimal(0)).dividedBy(
        Math.max(Object.keys(monthlySpending).length, 1)
      );

    const remainingMonths = 12;
    const projectedSpending = avgMonthlySpending.times(remainingMonths);
    const projectedTotal = budget.spentAmount.plus(projectedSpending);

    return {
      currentSpent: parseFloat(budget.spentAmount.toString()),
      avgMonthlySpending: parseFloat(avgMonthlySpending.toString()),
      projectedSpending: parseFloat(projectedSpending.toString()),
      projectedTotal: parseFloat(projectedTotal.toString()),
      willExceedBudget: projectedTotal.greaterThan(budget.totalAmount),
    };
  }
}

export const budgetService = new BudgetService();
