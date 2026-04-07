// Advertiser API Routes
import { Router, Request, Response } from 'express';
import { advertiserService } from '../services/advertiser.service.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { ScopedRequest, scopeToAdvertiser } from '../middleware/scopeAuth.js';
import { prisma } from '../lib/prisma.js';
import type { CreateAdvertiserInput } from '../types/index.js';

const router = Router();

/**
 * GET /api/advertisers/me
 * Returns advertiser + campaigns + total impressions for the logged-in advertiser user
 */
router.get('/me', authenticate, authorize('advertiser'), scopeToAdvertiser, async (req: ScopedRequest, res: Response) => {
  const advertiserId = req.scopedAdvertiserId!;
  const advertiser = await prisma.advertiser.findUnique({
    where: { id: advertiserId },
    include: {
      campaigns: {
        include: {
          placements: {
            include: { cafe: { select: { id: true, name: true, suburb: true } } },
          },
        },
      },
    },
  });

  if (!advertiser) {
    return res.status(404).json({ success: false, error: 'Advertiser not found' });
  }

  const totalImpressions = advertiser.campaigns.reduce((sum, c) => sum + c.totalImpressions, 0);
  const totalScans = await prisma.qRScan.count({
    where: { qrCode: { advertiserId } },
  });

  let targetAudience: Record<string, unknown> | null = null;
  if (advertiser.targetAudience) {
    try {
      targetAudience = JSON.parse(advertiser.targetAudience) as Record<string, unknown>;
    } catch {
      targetAudience = null;
    }
  }

  res.json({
    success: true,
    data: {
      ...advertiser,
      targetAudience,
      totalImpressions,
      totalScans,
    },
  });
});

/**
 * PATCH /api/advertisers/me/target-audience
 * Allows advertiser users to update their own target audience demographics
 */
router.patch('/me/target-audience', authenticate, authorize('advertiser'), scopeToAdvertiser, async (req: ScopedRequest, res: Response) => {
  const advertiserId = req.scopedAdvertiserId!;
  const targetAudience = req.body?.targetAudience;

  if (!targetAudience || typeof targetAudience !== 'object') {
    return res.status(400).json({
      success: false,
      error: 'targetAudience object is required',
    });
  }

  const updated = await advertiserService.update(advertiserId, {
    targetAudience,
  });

  res.json({
    success: true,
    data: updated,
  });
});

/**
 * POST /api/advertisers
 * Create a new advertiser
 */
router.post('/', async (req: Request, res: Response) => {
  const input: CreateAdvertiserInput = req.body;
  const advertiser = await advertiserService.create(input);

  res.status(201).json({
    success: true,
    data: advertiser,
  });
});

/**
 * GET /api/advertisers
 * List all advertisers
 */
router.get('/', async (req: Request, res: Response) => {
  const { city, industry, isActive, limit, offset } = req.query;

  const result = await advertiserService.getAll({
    city: city as string,
    industry: industry as string,
    isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
  });

  res.json({
    success: true,
    data: result.advertisers,
    meta: {
      total: result.total,
      limit: limit ? parseInt(limit as string, 10) : 50,
      offset: offset ? parseInt(offset as string, 10) : 0,
    },
  });
});

/**
 * GET /api/advertisers/:id
 * Get advertiser by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const advertiser = await advertiserService.getById(id);

  res.json({
    success: true,
    data: advertiser,
  });
});

/**
 * PUT /api/advertisers/:id
 * Update an advertiser
 */
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const input: Partial<CreateAdvertiserInput> = req.body;
  const advertiser = await advertiserService.update(id, input);

  res.json({
    success: true,
    data: advertiser,
  });
});

/**
 * PATCH /api/advertisers/:id/deactivate
 * Deactivate an advertiser (soft delete)
 */
router.patch('/:id/deactivate', async (req: Request, res: Response) => {
  const { id } = req.params;
  const advertiser = await advertiserService.deactivate(id);

  res.json({
    success: true,
    data: advertiser,
  });
});

/**
 * DELETE /api/advertisers/:id
 * Delete an advertiser
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await advertiserService.delete(id);

  res.json({
    success: true,
    message: 'Advertiser deleted successfully',
  });
});

export { router as advertiserRoutes };
