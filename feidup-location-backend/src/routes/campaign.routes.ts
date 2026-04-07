// Campaign API Routes
import { Router, Request, Response } from 'express';
import { campaignService } from '../services/campaign.service.js';
import { prisma } from '../lib/prisma.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import type { CreateCampaignInput } from '../types/index.js';

const router = Router();

/**
 * POST /api/campaigns
 * Create a new campaign
 * 
 * Body can include:
 * - autoSelectCafes: true to auto-select top matching cafes
 * - cafeIds: array of specific cafe IDs to include
 */
router.post('/', async (req: Request, res: Response) => {
  const input: CreateCampaignInput = req.body;
  const campaign = await campaignService.create(input);

  res.status(201).json({
    success: true,
    data: campaign,
  });
});

/**
 * GET /api/campaigns/:id
 * Get campaign by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const campaign = await campaignService.getById(id);

  res.json({
    success: true,
    data: campaign,
  });
});

/**
 * GET /api/campaigns
 * Get campaigns for an advertiser
 */
router.get('/', async (req: Request, res: Response) => {
  const { advertiser_id, status, limit, offset } = req.query;

  // If advertiser_id provided, filter by it
  if (advertiser_id) {
    const result = await campaignService.getByAdvertiser(advertiser_id as string, {
      status: status as string,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      offset: offset ? parseInt(offset as string, 10) : undefined,
    });

    return res.json({
      success: true,
      data: result.campaigns,
      meta: { total: result.total },
    });
  }

  // No advertiser_id: return all campaigns (for internal CRM)
  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  const [campaigns, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      include: {
        advertiser: { select: { id: true, businessName: true, industry: true } },
        placements: { include: { cafe: { select: { id: true, name: true, suburb: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit as string, 10) : 50,
      skip: offset ? parseInt(offset as string, 10) : 0,
    }),
    prisma.campaign.count({ where }),
  ]);

  res.json({
    success: true,
    data: campaigns,
    meta: { total },
  });
});

/**
 * PATCH /api/campaigns/:id
 * Update campaign core fields
 */
router.patch('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await prisma.campaign.findUnique({ where: { id } });

  if (!existing) {
    throw new NotFoundError('Campaign');
  }

  const validStatuses = ['draft', 'proposed', 'active', 'paused', 'completed'];
  const updateData: Record<string, unknown> = {};

  if (req.body.name !== undefined) {
    if (!String(req.body.name).trim()) {
      throw new ValidationError('name cannot be empty');
    }
    updateData.name = String(req.body.name).trim();
  }

  if (req.body.status !== undefined) {
    if (!validStatuses.includes(req.body.status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    updateData.status = req.body.status;
  }

  if (req.body.startDate !== undefined) {
    if (req.body.startDate === null || req.body.startDate === '') {
      updateData.startDate = null;
    } else {
      const start = new Date(String(req.body.startDate));
      if (Number.isNaN(start.getTime())) {
        throw new ValidationError('startDate must be a valid date');
      }
      updateData.startDate = start;
    }
  }

  if (req.body.endDate !== undefined) {
    if (req.body.endDate === null || req.body.endDate === '') {
      updateData.endDate = null;
    } else {
      const end = new Date(String(req.body.endDate));
      if (Number.isNaN(end.getTime())) {
        throw new ValidationError('endDate must be a valid date');
      }
      updateData.endDate = end;
    }
  }

  if (req.body.budget !== undefined) {
    if (req.body.budget === null || req.body.budget === '') {
      updateData.budget = null;
    } else {
      const budget = Number(req.body.budget);
      if (!Number.isFinite(budget) || budget < 0) {
        throw new ValidationError('budget must be a non-negative number');
      }
      updateData.budget = budget;
    }
  }

  if (req.body.packagingQuantity !== undefined) {
    const qty = Number(req.body.packagingQuantity);
    if (!Number.isInteger(qty) || qty < 0) {
      throw new ValidationError('packagingQuantity must be a non-negative integer');
    }
    updateData.packagingQuantity = qty;
  }

  if (req.body.packagingType !== undefined) {
    updateData.packagingType = req.body.packagingType || null;
  }

  if (req.body.adFormat !== undefined) {
    updateData.adFormat = req.body.adFormat || null;
  }

  const nextStart = (updateData.startDate as Date | null | undefined) === undefined
    ? existing.startDate
    : (updateData.startDate as Date | null);
  const nextEnd = (updateData.endDate as Date | null | undefined) === undefined
    ? existing.endDate
    : (updateData.endDate as Date | null);

  if (nextStart && nextEnd && nextEnd < nextStart) {
    throw new ValidationError('endDate must be after startDate');
  }

  const campaign = await prisma.campaign.update({
    where: { id },
    data: updateData,
    include: {
      advertiser: { select: { id: true, businessName: true, industry: true } },
      placements: { include: { cafe: { select: { id: true, name: true, suburb: true } } } },
    },
  });

  res.json({
    success: true,
    data: campaign,
  });
});

/**
 * PATCH /api/campaigns/:id/status
 * Update campaign status
 */
router.patch('/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new ValidationError('status is required in request body');
  }

  const campaign = await campaignService.updateStatus(id, status);

  res.json({
    success: true,
    data: campaign,
  });
});

/**
 * POST /api/campaigns/:id/placements
 * Add a placement to a campaign
 */
router.post('/:id/placements', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cafeId } = req.body;

  if (!cafeId) {
    throw new ValidationError('cafeId is required in request body');
  }

  const placement = await campaignService.addPlacement(id, cafeId);

  res.status(201).json({
    success: true,
    data: placement,
  });
});

/**
 * PATCH /api/campaigns/placements/:placementId/status
 * Update placement status
 */
router.patch('/placements/:placementId/status', async (req: Request, res: Response) => {
  const { placementId } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new ValidationError('status is required in request body');
  }

  const placement = await campaignService.updatePlacementStatus(placementId, status);

  res.json({
    success: true,
    data: placement,
  });
});

/**
 * DELETE /api/campaigns/placements/:placementId
 * Remove a placement from campaign
 */
router.delete('/placements/:placementId', async (req: Request, res: Response) => {
  const { placementId } = req.params;

  await campaignService.removePlacement(placementId);

  res.json({
    success: true,
    message: 'Placement removed successfully',
  });
});

/**
 * DELETE /api/campaigns/:id
 * Delete a campaign
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await campaignService.delete(id);

  res.json({
    success: true,
    message: 'Campaign deleted successfully',
  });
});

export { router as campaignRoutes };
