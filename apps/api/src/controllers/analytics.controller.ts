import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { analyticsService } from '../services/analytics.service';

export class AnalyticsController {
  async getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { departmentId, fromDate, toDate } = req.query;

      const filters: any = {};
      if (departmentId) filters.departmentId = departmentId as string;
      if (fromDate) filters.fromDate = new Date(fromDate as string);
      if (toDate) filters.toDate = new Date(toDate as string);

      const stats = await analyticsService.getDashboardStats(filters);
      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  }

  async getTopSpenders(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { limit, startDate, endDate } = req.query;

      const period =
        startDate && endDate
          ? {
              start: new Date(startDate as string),
              end: new Date(endDate as string),
            }
          : undefined;

      const topSpenders = await analyticsService.getTopSpenders(
        limit ? parseInt(limit as string) : 10,
        period
      );
      res.json(topSpenders);
    } catch (error: any) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  }

  async getCategoryBreakdown(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { departmentId, startDate, endDate } = req.query;

      const filters: any = {};
      if (departmentId) filters.departmentId = departmentId as string;
      if (startDate && endDate) {
        filters.period = {
          start: new Date(startDate as string),
          end: new Date(endDate as string),
        };
      }

      const breakdown = await analyticsService.getCategoryBreakdown(filters);
      res.json(breakdown);
    } catch (error: any) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  }

  async getApprovalMetrics(req: AuthRequest, res: Response): Promise<void> {
    try {
      const metrics = await analyticsService.getApprovalMetrics();
      res.json(metrics);
    } catch (error: any) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  }

  async getPolicyViolationStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await analyticsService.getPolicyViolationStats();
      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  }
}

export const analyticsController = new AnalyticsController();
