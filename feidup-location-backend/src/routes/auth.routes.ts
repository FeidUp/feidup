import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { config } from '../config/index.js';
import { authenticate, authorize, generateTokens, createAuditLog, AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['admin', 'sales', 'operations', 'advertiser', 'restaurant']),
  advertiserId: z.string().uuid().optional(),
  restaurantId: z.string().uuid().optional(),
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    throw new AppError(401, 'Invalid email or password');
  }
  
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, 'Invalid email or password');
  }
  
  const tokens = generateTokens(user);
  
  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  
  await createAuditLog(user.id, 'login', 'user', user.id, undefined, req.ip);
  
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      ...tokens,
    },
  });
});

// POST /auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    throw new AppError(400, 'Refresh token required');
  }
  
  try {
    const payload = jwt.verify(refreshToken, config.jwtSecret) as { userId: string; email: string; role: string };
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive) {
      throw new AppError(401, 'User not found or inactive');
    }
    const tokens = generateTokens(user);
    res.json({ success: true, data: tokens });
  } catch {
    throw new AppError(401, 'Invalid refresh token');
  }
});

// GET /auth/me
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      role: true, avatarUrl: true, advertiserId: true, restaurantId: true,
      lastLoginAt: true, createdAt: true,
    },
  });
  if (!user) throw new AppError(404, 'User not found');
  res.json({ success: true, data: user });
});

// POST /auth/users - Create user (admin/sales only)
router.post('/users', authenticate, authorize('admin', 'sales'), async (req: AuthRequest, res) => {
  const data = createUserSchema.parse(req.body);
  
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) throw new AppError(409, 'Email already in use');
  
  const passwordHash = await bcrypt.hash(data.password, 12);
  
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      advertiserId: data.advertiserId,
      restaurantId: data.restaurantId,
    },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      role: true, createdAt: true,
    },
  });
  
  await createAuditLog(req.user!.userId, 'create', 'user', user.id, undefined, req.ip);
  
  res.status(201).json({ success: true, data: user });
});

// GET /auth/users - List users (admin only)
router.get('/users', authenticate, authorize('admin'), async (_req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true, email: true, firstName: true, lastName: true,
      role: true, isActive: true, lastLoginAt: true, createdAt: true,
      advertiserId: true, restaurantId: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: users });
});

// PATCH /auth/users/:id - Update user (admin only)
router.patch('/users/:id', authenticate, authorize('admin'), async (req: AuthRequest, res) => {
  const { id } = req.params;
  const updates: Record<string, unknown> = {};
  
  if (req.body.firstName) updates.firstName = req.body.firstName;
  if (req.body.lastName) updates.lastName = req.body.lastName;
  if (req.body.role) updates.role = req.body.role;
  if (typeof req.body.isActive === 'boolean') updates.isActive = req.body.isActive;
  if (req.body.password) updates.passwordHash = await bcrypt.hash(req.body.password, 12);
  
  const user = await prisma.user.update({
    where: { id },
    data: updates,
    select: {
      id: true, email: true, firstName: true, lastName: true,
      role: true, isActive: true,
    },
  });
  
  await createAuditLog(req.user!.userId, 'update', 'user', id, JSON.stringify(Object.keys(updates)), req.ip);
  
  res.json({ success: true, data: user });
});

export { router as authRoutes };
