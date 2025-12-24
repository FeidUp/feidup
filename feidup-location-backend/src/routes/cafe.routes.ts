// Cafe API Routes
import { Router, Request, Response } from 'express';
import { cafeService } from '../services/cafe.service.js';
import type { CreateCafeInput } from '../types/index.js';

const router = Router();

/**
 * POST /api/cafes
 * Create a new cafe partner
 */
router.post('/', async (req: Request, res: Response) => {
  const input: CreateCafeInput = req.body;
  const cafe = await cafeService.create(input);

  res.status(201).json({
    success: true,
    data: cafe,
  });
});

/**
 * GET /api/cafes
 * List all cafes with optional filters
 */
router.get('/', async (req: Request, res: Response) => {
  const { city, suburb, postcode, isActive, minTraffic, tags, limit, offset } = req.query;

  const result = await cafeService.getAll({
    city: city as string,
    suburb: suburb as string,
    postcode: postcode as string,
    isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    minTraffic: minTraffic ? parseInt(minTraffic as string, 10) : undefined,
    tags: tags ? (tags as string).split(',') : undefined,
    limit: limit ? parseInt(limit as string, 10) : undefined,
    offset: offset ? parseInt(offset as string, 10) : undefined,
  });

  res.json({
    success: true,
    data: result.cafes,
    meta: {
      total: result.total,
      limit: limit ? parseInt(limit as string, 10) : 50,
      offset: offset ? parseInt(offset as string, 10) : 0,
    },
  });
});

/**
 * GET /api/cafes/stats/suburbs
 * Get cafe statistics by suburb
 */
router.get('/stats/suburbs', async (req: Request, res: Response) => {
  const { city } = req.query;
  const stats = await cafeService.getSuburbStats(city as string);

  res.json({
    success: true,
    data: stats,
  });
});

/**
 * GET /api/cafes/:id
 * Get cafe by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const cafe = await cafeService.getById(id);

  res.json({
    success: true,
    data: cafe,
  });
});

/**
 * PUT /api/cafes/:id
 * Update a cafe
 */
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const input: Partial<CreateCafeInput> = req.body;
  const cafe = await cafeService.update(id, input);

  res.json({
    success: true,
    data: cafe,
  });
});

/**
 * PATCH /api/cafes/:id/metrics
 * Update cafe traffic/volume metrics
 */
router.patch('/:id/metrics', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { avgDailyFootTraffic, packagingVolume } = req.body;

  const cafe = await cafeService.updateMetrics(id, {
    avgDailyFootTraffic,
    packagingVolume,
  });

  res.json({
    success: true,
    data: cafe,
  });
});

/**
 * PATCH /api/cafes/:id/deactivate
 * Deactivate a cafe (soft delete)
 */
router.patch('/:id/deactivate', async (req: Request, res: Response) => {
  const { id } = req.params;
  const cafe = await cafeService.deactivate(id);

  res.json({
    success: true,
    data: cafe,
  });
});

/**
 * DELETE /api/cafes/:id
 * Delete a cafe
 */
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await cafeService.delete(id);

  res.json({
    success: true,
    message: 'Cafe deleted successfully',
  });
});

export { router as cafeRoutes };
