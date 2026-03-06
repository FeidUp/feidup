import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { prisma } from '../lib/prisma.js';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

// Verify JWT token middleware
export function authenticate(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return _res.status(401).json({ success: false, error: 'Authentication required' });
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    return _res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

// Role-based access control middleware
export function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
  };
}

// Helper to generate tokens
export function generateTokens(user: { id: string; email: string; role: string }) {
  const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role };
  
  const accessToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as string,
  });
  
  const refreshToken = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtRefreshExpiresIn as string,
  });
  
  return { accessToken, refreshToken };
}

// Audit log helper
export async function createAuditLog(
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
  details?: string,
  ipAddress?: string
) {
  await prisma.auditLog.create({
    data: { userId, action, entity, entityId, details, ipAddress },
  });
}
