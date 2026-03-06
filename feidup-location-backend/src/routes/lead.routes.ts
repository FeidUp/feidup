import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize, createAuditLog, AuthRequest } from '../middleware/auth.js';
import { AppError, NotFoundError } from '../middleware/errorHandler.js';

const router = Router();

// All CRM routes require auth
router.use(authenticate);

const createLeadSchema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  type: z.enum(['advertiser', 'restaurant']),
  source: z.enum(['manual', 'website', 'referral', 'cold_outreach']).default('manual'),
  stage: z.enum(['lead', 'contacted', 'negotiation', 'signed', 'active_client', 'lost']).default('lead'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  estimatedValue: z.number().optional(),
  assignedToId: z.string().uuid().optional(),
  suburb: z.string().optional(),
  city: z.string().default('Brisbane'),
  notes: z.string().optional(),
});

const updateLeadSchema = createLeadSchema.partial();

// GET /leads - List leads with filters
router.get('/', authorize('admin', 'sales', 'operations'), async (req: AuthRequest, res) => {
  const { stage, type, assignedTo, priority, search, page = '1', limit = '20' } = req.query;
  
  const where: Record<string, unknown> = {};
  if (stage) where.stage = stage;
  if (type) where.type = type;
  if (priority) where.priority = priority;
  if (assignedTo) where.assignedToId = assignedTo;
  
  if (search && typeof search === 'string') {
    where.OR = [
      { companyName: { contains: search } },
      { contactName: { contains: search } },
      { contactEmail: { contains: search } },
    ];
  }
  
  const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
  
  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { activities: true } },
      },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: parseInt(limit as string, 10),
    }),
    prisma.lead.count({ where }),
  ]);
  
  res.json({
    success: true,
    data: leads,
    pagination: { page: parseInt(page as string, 10), limit: parseInt(limit as string, 10), total },
  });
});

// GET /leads/pipeline - Pipeline summary (counts by stage)
router.get('/pipeline', authorize('admin', 'sales', 'operations'), async (_req, res) => {
  const stages = ['lead', 'contacted', 'negotiation', 'signed', 'active_client', 'lost'];
  
  const counts = await Promise.all(
    stages.map(async (stage) => {
      const count = await prisma.lead.count({ where: { stage } });
      const totalValue = await prisma.lead.aggregate({
        where: { stage },
        _sum: { estimatedValue: true },
      });
      return { stage, count, totalValue: totalValue._sum.estimatedValue || 0 };
    })
  );
  
  res.json({ success: true, data: counts });
});

// GET /leads/:id
router.get('/:id', authorize('admin', 'sales', 'operations'), async (req, res) => {
  const lead = await prisma.lead.findUnique({
    where: { id: req.params.id },
    include: {
      assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true } },
      activities: {
        include: { user: { select: { id: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  });
  if (!lead) throw new NotFoundError('Lead');
  res.json({ success: true, data: lead });
});

// POST /leads
router.post('/', authorize('admin', 'sales'), async (req: AuthRequest, res) => {
  const data = createLeadSchema.parse(req.body);
  
  const lead = await prisma.lead.create({
    data: {
      ...data,
      createdById: req.user!.userId,
    },
    include: {
      assignedTo: { select: { id: true, firstName: true, lastName: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true } },
    },
  });
  
  await createAuditLog(req.user!.userId, 'create', 'lead', lead.id, undefined, req.ip);
  
  res.status(201).json({ success: true, data: lead });
});

// PATCH /leads/:id
router.patch('/:id', authorize('admin', 'sales'), async (req: AuthRequest, res) => {
  const data = updateLeadSchema.parse(req.body);
  
  const existing = await prisma.lead.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new NotFoundError('Lead');
  
  // Track stage changes as activity
  if (data.stage && data.stage !== existing.stage) {
    await prisma.activity.create({
      data: {
        type: 'status_change',
        title: `Stage changed: ${existing.stage} → ${data.stage}`,
        leadId: existing.id,
        userId: req.user!.userId,
      },
    });
  }
  
  const closedAt = data.stage && ['signed', 'active_client', 'lost'].includes(data.stage) && !existing.closedAt
    ? new Date()
    : undefined;
  
  const lead = await prisma.lead.update({
    where: { id: req.params.id },
    data: { ...data, ...(closedAt ? { closedAt } : {}) },
    include: {
      assignedTo: { select: { id: true, firstName: true, lastName: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true } },
    },
  });
  
  await createAuditLog(req.user!.userId, 'update', 'lead', lead.id, undefined, req.ip);
  
  res.json({ success: true, data: lead });
});

// DELETE /leads/:id
router.delete('/:id', authorize('admin'), async (req: AuthRequest, res) => {
  await prisma.lead.delete({ where: { id: req.params.id } });
  await createAuditLog(req.user!.userId, 'delete', 'lead', req.params.id, undefined, req.ip);
  res.json({ success: true, message: 'Lead deleted' });
});

// POST /leads/:id/activities - Add activity/note to a lead
router.post('/:id/activities', authorize('admin', 'sales', 'operations'), async (req: AuthRequest, res) => {
  const { type, title, content } = z.object({
    type: z.enum(['note', 'call', 'email', 'meeting']),
    title: z.string().min(1),
    content: z.string().optional(),
  }).parse(req.body);
  
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
  if (!lead) throw new NotFoundError('Lead');
  
  const activity = await prisma.activity.create({
    data: {
      type,
      title,
      content,
      leadId: lead.id,
      userId: req.user!.userId,
    },
    include: { user: { select: { id: true, firstName: true, lastName: true } } },
  });
  
  res.status(201).json({ success: true, data: activity });
});

export { router as leadRoutes };
