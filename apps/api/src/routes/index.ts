import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { claimController } from '../controllers/claim.controller';
import { analyticsController } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/auth/login', authController.login.bind(authController));
router.post('/auth/register', authController.register.bind(authController));
router.post('/auth/refresh', authController.refreshToken.bind(authController));

router.use(authenticate);

router.post('/claims', claimController.createClaim.bind(claimController));
router.get('/claims/my', claimController.getMyClaims.bind(claimController));
router.get('/claims/:id', claimController.getClaim.bind(claimController));
router.post('/claims/:id/submit', claimController.submitClaim.bind(claimController));
router.post('/claims/upload-receipt', upload.single('receipt'), claimController.uploadReceipt.bind(claimController));

router.get('/approvals/pending', claimController.getPendingApprovals.bind(claimController));
router.post('/approvals/:id/approve', claimController.approveClaim.bind(claimController));
router.post('/approvals/:id/reject', claimController.rejectClaim.bind(claimController));

router.get('/analytics/dashboard', authorize('MANAGER', 'FINANCE', 'CFO', 'ADMIN'), analyticsController.getDashboardStats.bind(analyticsController));
router.get('/analytics/top-spenders', authorize('MANAGER', 'FINANCE', 'CFO', 'ADMIN'), analyticsController.getTopSpenders.bind(analyticsController));
router.get('/analytics/category-breakdown', authorize('MANAGER', 'FINANCE', 'CFO', 'ADMIN'), analyticsController.getCategoryBreakdown.bind(analyticsController));
router.get('/analytics/approval-metrics', authorize('MANAGER', 'FINANCE', 'CFO', 'ADMIN'), analyticsController.getApprovalMetrics.bind(analyticsController));
router.get('/analytics/policy-violations', authorize('FINANCE', 'CFO', 'ADMIN'), analyticsController.getPolicyViolationStats.bind(analyticsController));

export default router;
