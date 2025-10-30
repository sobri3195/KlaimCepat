import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { prisma } from '@expense-claims/database';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const payload = authService.verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { department: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized', message: 'No user found' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
