// Recommendation API Routes
// The core matching engine endpoints

import { Router, Request, Response } from 'express';
import { recommendationService } from '../services/recommendation.service.js';
import { ValidationError } from '../middleware/errorHandler.js';

const router = Router();

/**
 * GET /api/recommendations
 * Get cafe recommendations for an advertiser
 * 
 * Query params:
 * - advertiser_id (required): UUID of the advertiser
 * - limit (optional): Max number of recommendations (default: 20)
 * - min_score (optional): Minimum match score threshold (0-100)
 * 
 * Example: GET /api/recommendations?advertiser_id=123&limit=10
 */
router.get('/', async (req: Request, res: Response) => {
  const { advertiser_id, limit, min_score } = req.query;

  if (!advertiser_id) {
    throw new ValidationError('advertiser_id query parameter is required');
  }

  const recommendations = await recommendationService.getRecommendations(
    advertiser_id as string,
    {
      limit: limit ? parseInt(limit as string, 10) : undefined,
      minScore: min_score ? parseInt(min_score as string, 10) : undefined,
    }
  );

  res.json({
    success: true,
    data: recommendations,
  });
});

/**
 * GET /api/recommendations/area
 * Get recommendations filtered by suburb or postcode
 * 
 * Query params:
 * - advertiser_id (required): UUID of the advertiser
 * - suburb (optional): Suburb name to filter by
 * - postcode (optional): Postcode to filter by
 */
router.get('/area', async (req: Request, res: Response) => {
  const { advertiser_id, suburb, postcode } = req.query;

  if (!advertiser_id) {
    throw new ValidationError('advertiser_id query parameter is required');
  }

  if (!suburb && !postcode) {
    throw new ValidationError('Either suburb or postcode query parameter is required');
  }

  const recommendations = await recommendationService.getRecommendationsForArea(
    advertiser_id as string,
    {
      suburb: suburb as string,
      postcode: postcode as string,
    }
  );

  res.json({
    success: true,
    data: recommendations,
  });
});

/**
 * GET /api/recommendations/explain
 * Get detailed explanation for why a cafe was recommended
 * 
 * Query params:
 * - advertiser_id (required): UUID of the advertiser
 * - cafe_id (required): UUID of the cafe
 */
router.get('/explain', async (req: Request, res: Response) => {
  const { advertiser_id, cafe_id } = req.query;

  if (!advertiser_id) {
    throw new ValidationError('advertiser_id query parameter is required');
  }

  if (!cafe_id) {
    throw new ValidationError('cafe_id query parameter is required');
  }

  const explanation = await recommendationService.explainRecommendation(
    advertiser_id as string,
    cafe_id as string
  );

  res.json({
    success: true,
    data: explanation,
  });
});

export { router as recommendationRoutes };
