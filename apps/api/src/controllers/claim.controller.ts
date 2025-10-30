import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { claimService } from '../services/claim.service';
import { ocrService } from '../services/ocr.service';
import fs from 'fs';

export class ClaimController {
  async createClaim(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const claimData = req.body;

      const claim = await claimService.createClaim(userId, claimData);
      res.status(201).json(claim);
    } catch (error: any) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  }

  async getClaim(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const claim = await claimService.getClaim(id);
      res.json(claim);
    } catch (error: any) {
      res.status(404).json({ error: 'Not Found', message: error.message });
    }
  }

  async getMyClaims(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const { status, fromDate, toDate, page, limit } = req.query;

      const filters: any = {};
      if (status) filters.status = status as string;
      if (fromDate) filters.fromDate = new Date(fromDate as string);
      if (toDate) filters.toDate = new Date(toDate as string);
      if (page) filters.page = parseInt(page as string);
      if (limit) filters.limit = parseInt(limit as string);

      const result = await claimService.getUserClaims(userId, filters);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  }

  async submitClaim(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const claim = await claimService.submitClaim(id, userId);
      res.json(claim);
    } catch (error: any) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  }

  async getPendingApprovals(req: AuthRequest, res: Response): Promise<void> {
    try {
      const approverId = req.user.id;
      const claims = await claimService.getPendingApprovals(approverId);
      res.json(claims);
    } catch (error: any) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  }

  async approveClaim(req: AuthRequest, res: Response): Promise<void> {
    try {
      const approverId = req.user.id;
      const { id } = req.params;
      const { comments } = req.body;

      const claim = await claimService.approveClaim(id, approverId, comments);
      res.json(claim);
    } catch (error: any) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  }

  async rejectClaim(req: AuthRequest, res: Response): Promise<void> {
    try {
      const approverId = req.user.id;
      const { id } = req.params;
      const { comments } = req.body;

      if (!comments) {
        res.status(400).json({ error: 'Bad Request', message: 'Comments are required for rejection' });
        return;
      }

      const claim = await claimService.rejectClaim(id, approverId, comments);
      res.json(claim);
    } catch (error: any) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  }

  async uploadReceipt(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Bad Request', message: 'No file uploaded' });
        return;
      }

      const fileBuffer = fs.readFileSync(req.file.path);
      const ocrResult = await ocrService.processReceipt(fileBuffer, req.file.mimetype);

      res.json({
        filename: req.file.filename,
        path: req.file.path,
        ocrResult,
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  }
}

export const claimController = new ClaimController();
