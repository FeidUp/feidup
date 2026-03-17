import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { Resend } from 'resend';
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
        advertiserId: user.advertiserId,
        restaurantId: user.restaurantId,
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

// POST /auth/forgot-password
const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

router.post('/forgot-password', async (req, res) => {
  const { email } = forgotPasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (!user || !user.isActive) {
    res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
    return;
  }

  // Invalidate any existing tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null },
    data: { usedAt: new Date() },
  });

  // Generate a secure token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  // Send email via Resend
  const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;

  if (config.resendApiKey) {
    const resend = new Resend(config.resendApiKey);
    await resend.emails.send({
      from: config.fromEmail,
      to: [email],
      subject: 'Reset your FeidUp password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 24px 0;">
            <div style="display: inline-block; width: 48px; height: 48px; background: #dc2626; border-radius: 12px; color: white; font-weight: bold; font-size: 24px; line-height: 48px;">F</div>
          </div>
          <h2 style="color: #111827; text-align: center;">Reset your password</h2>
          <p style="color: #6b7280; text-align: center;">
            Hi ${user.firstName}, we received a request to reset your FeidUp CRM password.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Reset Password
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 14px; text-align: center;">
            This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } else {
    // Dev mode: log the reset URL
    console.log(`[DEV] Password reset link for ${email}: ${resetUrl}`);
  }

  res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
});

// POST /auth/reset-password
const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

router.post('/reset-password', async (req, res) => {
  const { token, password } = resetPasswordSchema.parse(req.body);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    throw new AppError(400, 'Invalid or expired reset token');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  await createAuditLog(resetToken.userId, 'password_reset', 'user', resetToken.userId);

  res.json({ success: true, message: 'Password has been reset successfully.' });
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
