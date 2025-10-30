import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: 'Bad Request', message: 'Email and password are required' });
        return;
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: 'Unauthorized', message: error.message });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, firstName, lastName, employeeId, departmentId } = req.body;

      if (!email || !password || !firstName || !lastName || !employeeId) {
        res.status(400).json({ error: 'Bad Request', message: 'Missing required fields' });
        return;
      }

      const result = await authService.register({
        email,
        password,
        firstName,
        lastName,
        employeeId,
        departmentId,
      });

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: 'Bad Request', message: error.message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({ error: 'Bad Request', message: 'Refresh token is required' });
        return;
      }

      const result = await authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ error: 'Unauthorized', message: error.message });
    }
  }
}

export const authController = new AuthController();
