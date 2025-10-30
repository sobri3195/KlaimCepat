import { prisma, NotificationType, NotificationChannel } from '@expense-claims/database';
import nodemailer from 'nodemailer';
import { Twilio } from 'twilio';

const emailTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const twilioClient = process.env.TWILIO_ACCOUNT_SID
  ? new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

export class NotificationService {
  async sendApprovalNotification(approverId: string, claim: any, approval: any): Promise<void> {
    const approver = await prisma.user.findUnique({ where: { id: approverId } });
    if (!approver) return;

    const notification = await prisma.notification.create({
      data: {
        userId: approverId,
        type: NotificationType.APPROVAL_REQUIRED,
        channel: NotificationChannel.IN_APP,
        title: 'Persetujuan Klaim Diperlukan',
        message: `Klaim ${claim.claimNumber} dari ${claim.user.firstName} ${claim.user.lastName} memerlukan persetujuan Anda.`,
        data: {
          claimId: claim.id,
          claimNumber: claim.claimNumber,
          amount: claim.totalAmount.toString(),
          level: approval.level,
        },
      },
    });

    await this.sendEmail(
      approver.email,
      'Persetujuan Klaim Diperlukan',
      `
      <h2>Permintaan Persetujuan Klaim</h2>
      <p>Hai ${approver.firstName},</p>
      <p>Klaim berikut memerlukan persetujuan Anda:</p>
      <ul>
        <li><strong>Nomor Klaim:</strong> ${claim.claimNumber}</li>
        <li><strong>Pengaju:</strong> ${claim.user.firstName} ${claim.user.lastName}</li>
        <li><strong>Judul:</strong> ${claim.title}</li>
        <li><strong>Total:</strong> ${claim.currency} ${parseFloat(claim.totalAmount).toLocaleString('id-ID')}</li>
        <li><strong>Level Persetujuan:</strong> ${approval.level}</li>
      </ul>
      <p>Silakan login ke sistem untuk meninjau dan menyetujui klaim ini.</p>
      `
    );

    if (approver.phoneNumber && twilioClient) {
      await this.sendWhatsApp(
        approver.phoneNumber,
        `Klaim ${claim.claimNumber} memerlukan persetujuan Anda. Total: ${claim.currency} ${parseFloat(claim.totalAmount).toLocaleString('id-ID')}`
      );
    }
  }

  async sendClaimStatusNotification(
    userId: string,
    claim: any,
    status: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const statusMessages = {
      APPROVED: {
        title: 'Klaim Disetujui',
        message: `Klaim ${claim.claimNumber} telah disetujui.`,
        type: NotificationType.CLAIM_APPROVED,
      },
      REJECTED: {
        title: 'Klaim Ditolak',
        message: `Klaim ${claim.claimNumber} telah ditolak.`,
        type: NotificationType.CLAIM_REJECTED,
      },
      PAID: {
        title: 'Klaim Dibayarkan',
        message: `Pembayaran untuk klaim ${claim.claimNumber} telah diproses.`,
        type: NotificationType.CLAIM_PAID,
      },
    };

    const statusInfo = statusMessages[status as keyof typeof statusMessages];
    if (!statusInfo) return;

    await prisma.notification.create({
      data: {
        userId,
        type: statusInfo.type,
        channel: NotificationChannel.IN_APP,
        title: statusInfo.title,
        message: statusInfo.message,
        data: {
          claimId: claim.id,
          claimNumber: claim.claimNumber,
          status,
        },
      },
    });

    await this.sendEmail(
      user.email,
      statusInfo.title,
      `
      <h2>${statusInfo.title}</h2>
      <p>Hai ${user.firstName},</p>
      <p>${statusInfo.message}</p>
      <ul>
        <li><strong>Nomor Klaim:</strong> ${claim.claimNumber}</li>
        <li><strong>Total:</strong> ${claim.currency} ${parseFloat(claim.totalAmount).toLocaleString('id-ID')}</li>
        <li><strong>Status:</strong> ${status}</li>
      </ul>
      `
    );

    if (user.phoneNumber && twilioClient) {
      await this.sendWhatsApp(user.phoneNumber, statusInfo.message);
    }
  }

  async sendBudgetAlert(userId: string, budget: any, percentage: number): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await prisma.notification.create({
      data: {
        userId,
        type: NotificationType.BUDGET_ALERT,
        channel: NotificationChannel.IN_APP,
        title: 'Peringatan Anggaran',
        message: `Anggaran ${budget.name} telah mencapai ${percentage}% dari total alokasi.`,
        data: {
          budgetId: budget.id,
          percentage,
        },
      },
    });

    await this.sendEmail(
      user.email,
      'Peringatan Anggaran',
      `
      <h2>Peringatan Anggaran</h2>
      <p>Hai ${user.firstName},</p>
      <p>Anggaran berikut telah mencapai ${percentage}% dari total alokasi:</p>
      <ul>
        <li><strong>Nama Anggaran:</strong> ${budget.name}</li>
        <li><strong>Total Anggaran:</strong> IDR ${parseFloat(budget.totalAmount).toLocaleString('id-ID')}</li>
        <li><strong>Terpakai:</strong> IDR ${parseFloat(budget.spentAmount).toLocaleString('id-ID')}</li>
        <li><strong>Sisa:</strong> IDR ${parseFloat(budget.remainingAmount).toLocaleString('id-ID')}</li>
      </ul>
      `
    );
  }

  async getUserNotifications(
    userId: string,
    unreadOnly: boolean = false
  ): Promise<any[]> {
    return await prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly ? { isRead: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@company.com',
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Email send error:', error);
    }
  }

  private async sendWhatsApp(to: string, message: string): Promise<void> {
    if (!twilioClient) return;

    try {
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
        to: `whatsapp:${to}`,
        body: message,
      });
    } catch (error) {
      console.error('WhatsApp send error:', error);
    }
  }
}

export const notificationService = new NotificationService();
