import { prisma } from '@expense-claims/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthResponse, JWTPayload } from '@expense-claims/types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export class AuthService {
  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        department: true,
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('Account is not active');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        employeeId: user.employeeId,
        role: user.role,
        department: user.department
          ? {
              id: user.department.id,
              name: user.department.name,
              code: user.department.code,
            }
          : undefined,
        position: user.position || undefined,
      },
      accessToken,
      refreshToken,
    };
  }

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    departmentId?: string;
  }): Promise<AuthResponse> {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { employeeId: data.employeeId }],
      },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        employeeId: data.employeeId,
        departmentId: data.departmentId,
        role: 'EMPLOYEE',
        status: 'ACTIVE',
      },
      include: {
        department: true,
      },
    });

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        employeeId: user.employeeId,
        role: user.role,
        department: user.department
          ? {
              id: user.department.id,
              name: user.department.name,
              code: user.department.code,
            }
          : undefined,
        position: user.position || undefined,
      },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as JWTPayload;

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user || user.status !== 'ACTIVE') {
        throw new Error('Invalid refresh token');
      }

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private generateAccessToken(user: any): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  private generateRefreshToken(user: any): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
  }
}

export const authService = new AuthService();
