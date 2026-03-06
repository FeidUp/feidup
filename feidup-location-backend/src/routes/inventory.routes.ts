import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize, createAuditLog, AuthRequest } from '../middleware/auth.js';
import { NotFoundError } from '../middleware/errorHandler.js';

const router = Router();
router.use(authenticate);

// GET /inventory - List inventory across all cafes
router.get('/', authorize('admin', 'operations'), async (req, res) => {
  const { cafeId, lowStock } = req.query;
  
  const where: Record<string, unknown> = {};
  if (cafeId) where.cafeId = cafeId;
  if (lowStock === 'true') where.quantityRemaining = { lte: 50 };
  
  const inventory = await prisma.packagingInventory.findMany({
    where,
    include: {
      cafe: { select: { id: true, name: true, suburb: true } },
      batch: {
        select: { id: true, packagingType: true, status: true, campaign: { select: { id: true, name: true } } },
      },
    },
    orderBy: { quantityRemaining: 'asc' },
  });
  
  res.json({ success: true, data: inventory });
});

// GET /inventory/restaurant/:cafeId
router.get('/restaurant/:cafeId', authorize('admin', 'operations', 'restaurant'), async (req, res) => {
  const inventory = await prisma.packagingInventory.findMany({
    where: { cafeId: req.params.cafeId },
    include: {
      batch: {
        select: {
          id: true, packagingType: true, status: true,
          campaign: { select: { id: true, name: true, advertiser: { select: { businessName: true } } } },
        },
      },
    },
  });
  res.json({ success: true, data: inventory });
});

// POST /inventory/batches - Create packaging batch
router.post('/batches', authorize('admin', 'operations'), async (req: AuthRequest, res) => {
  const data = z.object({
    campaignId: z.string().uuid(),
    packagingType: z.string().min(1),
    quantityProduced: z.number().int().positive(),
    productionDate: z.string().datetime().optional(),
  }).parse(req.body);
  
  const batch = await prisma.packagingBatch.create({
    data: {
      campaignId: data.campaignId,
      packagingType: data.packagingType,
      quantityProduced: data.quantityProduced,
      productionDate: data.productionDate ? new Date(data.productionDate) : new Date(),
      estimatedReady: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // +60 days
    },
  });
  
  await createAuditLog(req.user!.userId, 'create', 'packaging_batch', batch.id, undefined, req.ip);
  res.status(201).json({ success: true, data: batch });
});

// GET /inventory/batches
router.get('/batches', authorize('admin', 'operations'), async (req, res) => {
  const { status, campaignId } = req.query;
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (campaignId) where.campaignId = campaignId;
  
  const batches = await prisma.packagingBatch.findMany({
    where,
    include: {
      campaign: { select: { id: true, name: true, advertiser: { select: { businessName: true } } } },
      _count: { select: { inventory: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, data: batches });
});

// PATCH /inventory/batches/:id - Update batch status
router.patch('/batches/:id', authorize('admin', 'operations'), async (req: AuthRequest, res) => {
  const { status, quantityShipped } = z.object({
    status: z.enum(['ordered', 'in_production', 'ready', 'shipped', 'delivered']).optional(),
    quantityShipped: z.number().int().optional(),
  }).parse(req.body);
  
  const batch = await prisma.packagingBatch.update({
    where: { id: req.params.id },
    data: {
      ...(status ? { status } : {}),
      ...(quantityShipped !== undefined ? { quantityShipped } : {}),
    },
  });
  
  await createAuditLog(req.user!.userId, 'update', 'packaging_batch', batch.id, undefined, req.ip);
  res.json({ success: true, data: batch });
});

// POST /inventory/allocate - Allocate batch inventory to a cafe
router.post('/allocate', authorize('admin', 'operations'), async (req: AuthRequest, res) => {
  const data = z.object({
    batchId: z.string().uuid(),
    cafeId: z.string().uuid(),
    quantity: z.number().int().positive(),
  }).parse(req.body);
  
  const inv = await prisma.packagingInventory.create({
    data: {
      batchId: data.batchId,
      cafeId: data.cafeId,
      quantityAllocated: data.quantity,
      quantityRemaining: data.quantity,
      lastRestockDate: new Date(),
    },
  });
  
  await createAuditLog(req.user!.userId, 'create', 'inventory_allocation', inv.id, undefined, req.ip);
  res.status(201).json({ success: true, data: inv });
});

// POST /inventory/usage - Restaurant reports usage
router.post('/usage', authorize('admin', 'operations', 'restaurant'), async (req: AuthRequest, res) => {
  const data = z.object({
    cafeId: z.string().uuid(),
    packagingUsed: z.number().int().positive(),
    notes: z.string().optional(),
  }).parse(req.body);
  
  const report = await prisma.usageReport.create({
    data: {
      cafeId: data.cafeId,
      reportDate: new Date(),
      packagingUsed: data.packagingUsed,
      notes: data.notes,
    },
  });
  
  // Update inventory remaining for this cafe
  const inventoryItems = await prisma.packagingInventory.findMany({
    where: { cafeId: data.cafeId, quantityRemaining: { gt: 0 } },
    orderBy: { createdAt: 'asc' },
  });
  
  let remaining = data.packagingUsed;
  for (const item of inventoryItems) {
    if (remaining <= 0) break;
    const deduction = Math.min(remaining, item.quantityRemaining);
    await prisma.packagingInventory.update({
      where: { id: item.id },
      data: {
        quantityUsed: item.quantityUsed + deduction,
        quantityRemaining: item.quantityRemaining - deduction,
      },
    });
    remaining -= deduction;
  }
  
  res.status(201).json({ success: true, data: report });
});

export { router as inventoryRoutes };
