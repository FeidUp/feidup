// ML-Enhanced Recommendation Routes

import { Router } from 'express';
import { mlMatchingService } from '../services/ml-matching.service.js';
import { authenticate } from '../middleware/auth.js';
import { NotFoundError } from '../middleware/errorHandler.js';

const router = Router();

/**
 * GET /api/ml/recommendations/:advertiserId
 * Get ML-enhanced cafe recommendations for an advertiser
 */
router.get('/recommendations/:advertiserId', authenticate, async (req, res) => {
  const { advertiserId } = req.params;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const minScore = req.query.minScore ? parseInt(req.query.minScore as string) : undefined;

  const recommendations = await mlMatchingService.getHybridRecommendations(advertiserId, {
    limit,
    minScore,
  });

  res.json({
    success: true,
    data: recommendations.recommendations || []
  });
});

/**
 * GET /api/ml/explain/:advertiserId/:cafeId
 * Get detailed ML explanation for a specific recommendation
 */
router.get('/explain/:advertiserId/:cafeId', authenticate, async (req, res) => {
  const { advertiserId, cafeId } = req.params;

  const explanation = await mlMatchingService.explainMLRecommendation(advertiserId, cafeId);

  res.json({
    success: true,
    data: explanation
  });
});

/**
 * GET /api/ml/status
 * Check if ML service is available
 */
router.get('/status', authenticate, async (req, res) => {
  const isAvailable = await mlMatchingService.isMLAvailable();

  res.json({
    success: true,
    data: {
      mlAvailable: isAvailable,
      message: isAvailable
        ? 'ML service is available and responding'
        : 'ML service is not available. Using rule-based matching only.',
    }
  });
});

export default router;
