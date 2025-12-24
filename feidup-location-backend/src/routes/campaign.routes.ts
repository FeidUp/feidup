// Campaign API Routes
import { Router, Request, Response } from 'express';
import { campaignService } from '../services/campaign.service.js';
import { ValidationError } from '../middleware/errorHandler.js';
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

  if (!advertiser_id) {
    throw new ValidationError('advertiser_id query parameter is required');
  }

  const result = await campaignService.getByAdvertiser(advertiser_id as string, {
    status: status as string,
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
  });

  res.json({
    success: true,
    data: result.campaigns,
    meta: {
      total: result.total,
    },
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
