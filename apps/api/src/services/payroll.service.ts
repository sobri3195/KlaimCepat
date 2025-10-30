import { prisma, ClaimStatus } from '@expense-claims/database';
import { format } from 'date-fns';
import { Decimal } from 'decimal.js';

export class PayrollService {
  async createPayrollBatch(
    periodStart: Date,
    periodEnd: Date,
    erpSystem?: string
  ): Promise<any> {
    const approvedClaims = await prisma.claim.findMany({
      where: {
        status: ClaimStatus.APPROVED,
        payrollBatchId: null,
        approvals: {
          every: {
            status: 'APPROVED',
          },
        },
        submittedAt: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
      include: {
        user: true,
        items: true,
      },
    });

    if (approvedClaims.length === 0) {
      throw new Error('No approved claims found for this period');
    }

    const totalAmount = approvedClaims.reduce(
      (sum, claim) => sum.plus(claim.totalAmount),
      new Decimal(0)
    );

    const batchNumber = await this.generateBatchNumber();

    const batch = await prisma.payrollBatch.create({
      data: {
        batchNumber,
        periodStart,
        periodEnd,
        totalAmount,
        claimCount: approvedClaims.length,
        status: 'DRAFT',
        erpSystem,
      },
    });

    await prisma.claim.updateMany({
      where: {
        id: {
          in: approvedClaims.map((c) => c.id),
        },
      },
      data: {
        payrollBatchId: batch.id,
      },
    });

    return batch;
  }

  async exportPayrollBatch(
    batchId: string,
    format: 'CSV' | 'XLSX' | 'JSON',
    userId: string
  ): Promise<any> {
    const batch = await prisma.payrollBatch.findUnique({
      where: { id: batchId },
      include: {
        claims: {
          include: {
            user: {
              include: {
                department: true,
              },
            },
            items: true,
          },
        },
      },
    });

    if (!batch) {
      throw new Error('Payroll batch not found');
    }

    let exportData: any;

    if (format === 'JSON') {
      exportData = this.exportToJSON(batch);
    } else if (format === 'CSV') {
      exportData = this.exportToCSV(batch);
    } else {
      exportData = this.exportToJSON(batch);
    }

    await prisma.payrollBatch.update({
      where: { id: batchId },
      data: {
        status: 'EXPORTED',
        exportedAt: new Date(),
        exportedBy: userId,
        exportFormat: format,
        exportData,
      },
    });

    await prisma.claim.updateMany({
      where: { payrollBatchId: batchId },
      data: { status: ClaimStatus.PAID, paymentDate: new Date() },
    });

    return exportData;
  }

  async syncWithERP(batchId: string, erpSystem: string): Promise<void> {
    const batch = await prisma.payrollBatch.findUnique({
      where: { id: batchId },
      include: {
        claims: {
          include: {
            user: true,
            items: true,
          },
        },
      },
    });

    if (!batch) {
      throw new Error('Payroll batch not found');
    }

    await prisma.payrollBatch.update({
      where: { id: batchId },
      data: {
        erpSystem,
        erpSyncedAt: new Date(),
        erpBatchId: `ERP-${batch.batchNumber}`,
      },
    });
  }

  private async generateBatchNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    const lastBatch = await prisma.payrollBatch.findFirst({
      where: {
        batchNumber: {
          startsWith: `PAY-${year}${month}`,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let sequence = 1;
    if (lastBatch) {
      const lastSequence = parseInt(lastBatch.batchNumber.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }

    return `PAY-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }

  private exportToJSON(batch: any): any {
    return {
      batchNumber: batch.batchNumber,
      periodStart: batch.periodStart,
      periodEnd: batch.periodEnd,
      totalAmount: parseFloat(batch.totalAmount.toString()),
      claimCount: batch.claimCount,
      claims: batch.claims.map((claim: any) => ({
        claimNumber: claim.claimNumber,
        employeeId: claim.user.employeeId,
        employeeName: `${claim.user.firstName} ${claim.user.lastName}`,
        department: claim.user.department?.name,
        amount: parseFloat(claim.totalAmount.toString()),
        currency: claim.currency,
        description: claim.title,
        items: claim.items.map((item: any) => ({
          date: item.date,
          category: item.category,
          description: item.description,
          amount: parseFloat(item.amount.toString()),
          vendor: item.vendor,
        })),
      })),
    };
  }

  private exportToCSV(batch: any): string {
    const headers = [
      'Claim Number',
      'Employee ID',
      'Employee Name',
      'Department',
      'Amount',
      'Currency',
      'Description',
      'Date',
    ];

    const rows = batch.claims.map((claim: any) =>
      [
        claim.claimNumber,
        claim.user.employeeId,
        `${claim.user.firstName} ${claim.user.lastName}`,
        claim.user.department?.name || '',
        parseFloat(claim.totalAmount.toString()),
        claim.currency,
        claim.title,
        format(claim.submittedAt, 'yyyy-MM-dd'),
      ].join(',')
    );

    return [headers.join(','), ...rows].join('\n');
  }
}

export const payrollService = new PayrollService();
