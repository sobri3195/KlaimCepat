import { prisma, ClaimStatus, ClaimType } from '@expense-claims/database';
import { ClaimCreateRequest, ClaimResponse } from '@expense-claims/types';
import { policyService } from './policy.service';
import { notificationService } from './notification.service';
import { Decimal } from 'decimal.js';

export class ClaimService {
  async createClaim(userId: string, data: ClaimCreateRequest): Promise<ClaimResponse> {
    const claimNumber = await this.generateClaimNumber();

    const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);

    const complianceResult = await policyService.validateClaim({
      ...data,
      userId,
      totalAmount,
    });

    const claim = await prisma.claim.create({
      data: {
        claimNumber,
        userId,
        title: data.title,
        description: data.description,
        claimType: data.claimType as ClaimType,
        totalAmount: new Decimal(totalAmount),
        currency: data.currency || 'IDR',
        status: ClaimStatus.DRAFT,
        departmentId: data.departmentId,
        projectId: data.projectId,
        tripRequestId: data.tripRequestId,
        hasViolations: !complianceResult.isCompliant,
        items: {
          create: data.items.map((item) => ({
            date: new Date(item.date),
            category: item.category,
            description: item.description,
            amount: new Decimal(item.amount),
            currency: item.currency || 'IDR',
            vendor: item.vendor,
          })),
        },
      },
      include: {
        user: true,
        department: true,
        items: true,
      },
    });

    if (!complianceResult.isCompliant) {
      await prisma.policyViolation.createMany({
        data: complianceResult.violations.map((v) => ({
          claimId: claim.id,
          type: v.type,
          severity: v.severity,
          message: v.message,
          policyRule: v.policyRule,
        })),
      });
    }

    return this.formatClaimResponse(claim);
  }

  async submitClaim(claimId: string, userId: string): Promise<ClaimResponse> {
    const claim = await prisma.claim.findFirst({
      where: { id: claimId, userId },
      include: { items: true },
    });

    if (!claim) {
      throw new Error('Claim not found');
    }

    if (claim.status !== ClaimStatus.DRAFT) {
      throw new Error('Only draft claims can be submitted');
    }

    if (claim.items.length === 0) {
      throw new Error('Cannot submit claim without items');
    }

    const policy = await policyService.getApprovalPolicy(
      claim.departmentId || undefined,
      claim.claimType,
      parseFloat(claim.totalAmount.toString())
    );

    if (!policy) {
      throw new Error('No approval policy found for this claim');
    }

    await policyService.createApprovals(claimId, policy, userId);

    const updatedClaim = await prisma.claim.update({
      where: { id: claimId },
      data: {
        status: ClaimStatus.PENDING_APPROVAL,
        submittedAt: new Date(),
      },
      include: {
        user: true,
        department: true,
        items: true,
        approvals: {
          include: { approver: true },
        },
        policyViolations: true,
      },
    });

    const firstApproval = updatedClaim.approvals.find((a) => a.level === 1);
    if (firstApproval) {
      await notificationService.sendApprovalNotification(
        firstApproval.approverId,
        updatedClaim,
        firstApproval
      );
    }

    return this.formatClaimResponse(updatedClaim);
  }

  async getClaim(claimId: string): Promise<ClaimResponse> {
    const claim = await prisma.claim.findUnique({
      where: { id: claimId },
      include: {
        user: true,
        department: true,
        items: true,
        approvals: {
          include: { approver: true },
          orderBy: { level: 'asc' },
        },
        policyViolations: true,
      },
    });

    if (!claim) {
      throw new Error('Claim not found');
    }

    return this.formatClaimResponse(claim);
  }

  async getUserClaims(
    userId: string,
    filters?: {
      status?: string;
      fromDate?: Date;
      toDate?: Date;
      page?: number;
      limit?: number;
    }
  ): Promise<{ claims: ClaimResponse[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.fromDate || filters?.toDate) {
      where.createdAt = {};
      if (filters.fromDate) where.createdAt.gte = filters.fromDate;
      if (filters.toDate) where.createdAt.lte = filters.toDate;
    }

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        include: {
          user: true,
          department: true,
          items: true,
          approvals: {
            include: { approver: true },
          },
          policyViolations: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.claim.count({ where }),
    ]);

    return {
      claims: claims.map((c) => this.formatClaimResponse(c)),
      total,
    };
  }

  async getPendingApprovals(approverId: string): Promise<ClaimResponse[]> {
    const approvals = await prisma.approval.findMany({
      where: {
        approverId,
        status: 'PENDING',
      },
      include: {
        claim: {
          include: {
            user: true,
            department: true,
            items: true,
            approvals: {
              include: { approver: true },
            },
            policyViolations: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return approvals.map((a) => this.formatClaimResponse(a.claim));
  }

  async approveClaim(
    claimId: string,
    approverId: string,
    comments?: string
  ): Promise<ClaimResponse> {
    const approval = await prisma.approval.findFirst({
      where: {
        claimId,
        approverId,
        status: 'PENDING',
      },
      include: {
        claim: {
          include: { approvals: true },
        },
      },
    });

    if (!approval) {
      throw new Error('Approval not found or already processed');
    }

    await prisma.approval.update({
      where: { id: approval.id },
      data: {
        status: 'APPROVED',
        comments,
        approvedAt: new Date(),
      },
    });

    const nextApproval = await prisma.approval.findFirst({
      where: {
        claimId,
        level: approval.level + 1,
        status: 'PENDING',
      },
    });

    let newStatus = approval.claim.status;

    if (nextApproval) {
      await notificationService.sendApprovalNotification(
        nextApproval.approverId,
        approval.claim,
        nextApproval
      );
    } else {
      newStatus = ClaimStatus.APPROVED;
      await notificationService.sendClaimStatusNotification(
        approval.claim.userId,
        approval.claim,
        'APPROVED'
      );
    }

    const updatedClaim = await prisma.claim.update({
      where: { id: claimId },
      data: {
        status: newStatus,
        currentApprovalLevel: nextApproval ? nextApproval.level : approval.level,
      },
      include: {
        user: true,
        department: true,
        items: true,
        approvals: {
          include: { approver: true },
        },
        policyViolations: true,
      },
    });

    return this.formatClaimResponse(updatedClaim);
  }

  async rejectClaim(
    claimId: string,
    approverId: string,
    comments: string
  ): Promise<ClaimResponse> {
    const approval = await prisma.approval.findFirst({
      where: {
        claimId,
        approverId,
        status: 'PENDING',
      },
      include: { claim: true },
    });

    if (!approval) {
      throw new Error('Approval not found or already processed');
    }

    await prisma.approval.update({
      where: { id: approval.id },
      data: {
        status: 'REJECTED',
        comments,
        approvedAt: new Date(),
      },
    });

    const updatedClaim = await prisma.claim.update({
      where: { id: claimId },
      data: { status: ClaimStatus.REJECTED },
      include: {
        user: true,
        department: true,
        items: true,
        approvals: {
          include: { approver: true },
        },
        policyViolations: true,
      },
    });

    await notificationService.sendClaimStatusNotification(
      approval.claim.userId,
      updatedClaim,
      'REJECTED'
    );

    return this.formatClaimResponse(updatedClaim);
  }

  async updateClaimItemOCR(
    itemId: string,
    ocrData: any,
    confidence: number
  ): Promise<void> {
    await prisma.claimItem.update({
      where: { id: itemId },
      data: {
        ocrData,
        ocrConfidence: new Decimal(confidence),
        ocrProcessedAt: new Date(),
      },
    });
  }

  private async generateClaimNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');

    const lastClaim = await prisma.claim.findFirst({
      where: {
        claimNumber: {
          startsWith: `CLM-${year}${month}`,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let sequence = 1;
    if (lastClaim) {
      const lastSequence = parseInt(lastClaim.claimNumber.split('-').pop() || '0');
      sequence = lastSequence + 1;
    }

    return `CLM-${year}${month}-${String(sequence).padStart(5, '0')}`;
  }

  private formatClaimResponse(claim: any): ClaimResponse {
    return {
      id: claim.id,
      claimNumber: claim.claimNumber,
      title: claim.title,
      description: claim.description,
      claimType: claim.claimType,
      totalAmount: parseFloat(claim.totalAmount.toString()),
      currency: claim.currency,
      status: claim.status,
      submittedAt: claim.submittedAt?.toISOString(),
      hasViolations: claim.hasViolations,
      user: {
        id: claim.user.id,
        firstName: claim.user.firstName,
        lastName: claim.user.lastName,
        employeeId: claim.user.employeeId,
      },
      department: claim.department
        ? {
            id: claim.department.id,
            name: claim.department.name,
          }
        : undefined,
      items: (claim.items || []).map((item: any) => ({
        id: item.id,
        date: item.date.toISOString(),
        category: item.category,
        description: item.description,
        amount: parseFloat(item.amount.toString()),
        currency: item.currency,
        vendor: item.vendor,
        receiptUrl: item.receiptUrl,
        ocrData: item.ocrData,
        ocrConfidence: item.ocrConfidence ? parseFloat(item.ocrConfidence.toString()) : undefined,
        isOcrVerified: item.isOcrVerified,
      })),
      approvals: (claim.approvals || []).map((approval: any) => ({
        id: approval.id,
        level: approval.level,
        status: approval.status,
        approver: {
          id: approval.approver.id,
          firstName: approval.approver.firstName,
          lastName: approval.approver.lastName,
          email: approval.approver.email,
        },
        comments: approval.comments,
        approvedAt: approval.approvedAt?.toISOString(),
        createdAt: approval.createdAt.toISOString(),
      })),
      policyViolations: (claim.policyViolations || []).map((violation: any) => ({
        id: violation.id,
        type: violation.type,
        severity: violation.severity,
        message: violation.message,
        policyRule: violation.policyRule,
        isWaived: violation.isWaived,
      })),
      createdAt: claim.createdAt.toISOString(),
      updatedAt: claim.updatedAt.toISOString(),
    };
  }
}

export const claimService = new ClaimService();
