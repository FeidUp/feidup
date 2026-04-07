// ML-Enhanced Matching Service
// Combines ML predictions with rule-based scores for hybrid recommendations

import axios from 'axios';
import { config } from '../config/index.js';
import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { scoreAllCafes, generateMatchReason } from './matching.service.js';
import type { SuburbDemographics } from './matching.service.js';
import type {
  RecommendationResponse,
  CafeRecommendation,
  MatchingContext,
  TargetAudience,
  CafeDemographics,
} from '../types/index.js';

// ML API configuration
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001';
const ML_ENABLED = process.env.ML_ENABLED !== 'false'; // Enable by default
const HYBRID_WEIGHTS = {
  ml: 0.7,
  ruleBased: 0.3,
};

interface MLPrediction {
  predicted_scan_rate: number;
  ml_score: number;
}

interface MLHealthResponse {
  model_loaded: boolean;
}

interface MLBatchPrediction extends MLPrediction {
  cafe_id: string;
}

interface MLBatchPredictionResponse {
  predictions: MLBatchPrediction[];
}

interface MLExplanation {
  predicted_scan_rate: number;
  top_features: Array<{
    name: string;
    value: number;
    importance: number;
    contribution: number;
  }>;
}

export class MLMatchingService {
  /**
   * Check if ML service is available
   */
  async isMLAvailable(): Promise<boolean> {
    if (!ML_ENABLED) return false;
    
    try {
      const response = await axios.get<MLHealthResponse>(`${ML_API_URL}/health`, { timeout: 2000 });
      return response.data.model_loaded === true;
    } catch (error) {
      console.warn('ML service not available:', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  /**
   * Get ML prediction for a cafe-advertiser pair
   */
  async getMLPrediction(
    cafe: any,
    advertiser: any,
    suburbData?: SuburbDemographics | null
  ): Promise<MLPrediction | null> {
    try {
      const response = await axios.post<MLPrediction>(
        `${ML_API_URL}/predict`,
        {
          cafe: {
            lat: cafe.lat,
            lng: cafe.lng,
            suburb: cafe.suburb,
            postcode: cafe.postcode,
            avgDailyFootTraffic: cafe.avgDailyFootTraffic,
            packagingVolume: cafe.packagingVolume,
            tags: cafe.tags,
          },
          advertiser: {
            targetLat: advertiser.targetLat,
            targetLng: advertiser.targetLng,
            targetSuburbs: advertiser.targetSuburbs,
            targetPostcodes: advertiser.targetPostcodes,
            targetRadiusKm: advertiser.targetRadiusKm,
            industry: advertiser.industry,
            targetAudience: advertiser.targetAudience,
          },
          suburb: suburbData,
        },
        { timeout: 5000 }
      );

      return response.data;
    } catch (error) {
      console.error('ML prediction error:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  /**
   * Get batch ML predictions
   */
  async getBatchMLPredictions(
    pairs: Array<{ cafe: any; advertiser: any; suburbData?: SuburbDemographics | null }>
  ): Promise<Map<string, MLPrediction>> {
    try {
      const response = await axios.post<MLBatchPredictionResponse>(
        `${ML_API_URL}/predict`,
        {
          pairs: pairs.map((p) => ({
            cafe: {
              id: p.cafe.id,
              lat: p.cafe.lat,
              lng: p.cafe.lng,
              suburb: p.cafe.suburb,
              postcode: p.cafe.postcode,
              avgDailyFootTraffic: p.cafe.avgDailyFootTraffic,
              packagingVolume: p.cafe.packagingVolume,
              tags: p.cafe.tags,
            },
            advertiser: p.advertiser,
            suburb: p.suburbData,
          })),
        },
        { timeout: 10000 }
      );

      const predictions = new Map<string, MLPrediction>();
      for (const pred of response.data.predictions) {
        predictions.set(pred.cafe_id, pred);
      }
      return predictions;
    } catch (error) {
      console.error('Batch ML prediction error:', error instanceof Error ? error.message : 'Unknown error');
      return new Map();
    }
  }

  /**
   * Get hybrid recommendations combining ML and rule-based scores
   */
  async getHybridRecommendations(
    advertiserId: string,
    options: { limit?: number; minScore?: number } = {}
  ): Promise<RecommendationResponse> {
    // Get advertiser
    const advertiser = await prisma.advertiser.findUnique({
      where: { id: advertiserId },
    });

    if (!advertiser) {
      throw new NotFoundError('Advertiser');
    }

    // Get all active cafes
    const cafes = await prisma.cafe.findMany({
      where: {
        city: advertiser.city,
        isActive: true,
      },
    });

    // Parse JSON fields
    const targetSuburbs = JSON.parse(advertiser.targetSuburbs || '[]') as string[];
    const targetPostcodes = JSON.parse(advertiser.targetPostcodes || '[]') as string[];
    const targetAudience = advertiser.targetAudience
      ? (JSON.parse(advertiser.targetAudience as string) as TargetAudience)
      : null;

    // Build matching context for rule-based scoring
    const context: MatchingContext = {
      advertiser: {
        id: advertiser.id,
        industry: advertiser.industry,
        targetSuburbs,
        targetPostcodes,
        targetCenter:
          advertiser.targetLat && advertiser.targetLng
            ? { lat: advertiser.targetLat, lng: advertiser.targetLng }
            : null,
        targetRadiusKm: advertiser.targetRadiusKm || config.matching.defaultRadiusKm,
        targetAudience,
      },
      weights: config.matching.weights,
    };

    // Fetch suburb data
    const suburbNames = [...new Set(cafes.map((c) => c.suburb))];
    const suburbDataRecords = await prisma.suburbData.findMany({
      where: { suburb: { in: suburbNames }, city: advertiser.city },
    });
    const suburbDataMap = new Map<string, SuburbDemographics>(
      suburbDataRecords.map((s) => [
        s.suburb,
        {
          population: s.population ?? undefined,
          medianAge: s.medianAge ?? undefined,
          medianIncome: s.medianIncome ?? undefined,
          primaryDemographic: s.primaryDemographic ?? undefined,
        },
      ])
    );

    // Format cafes for scoring
    const cafesForScoring = cafes.map((cafe) => ({
      id: cafe.id,
      name: cafe.name,
      address: cafe.address,
      suburb: cafe.suburb,
      postcode: cafe.postcode,
      lat: cafe.lat,
      lng: cafe.lng,
      avgDailyFootTraffic: cafe.avgDailyFootTraffic,
      packagingVolume: cafe.packagingVolume,
      demographics: cafe.demographics
        ? (JSON.parse(cafe.demographics as string) as CafeDemographics)
        : null,
      tags: JSON.parse((cafe.tags as string) || '[]') as string[],
      suburbData: suburbDataMap.get(cafe.suburb) || null,
    }));

    // Get rule-based scores
    const ruleBasedScores = scoreAllCafes(cafesForScoring, context);

    // Check if ML is available
    const mlAvailable = await this.isMLAvailable();

    let finalRecommendations: CafeRecommendation[];

    if (mlAvailable) {
      console.log('Using hybrid ML + rule-based scoring');

      // Get ML predictions
      const mlPairs = cafesForScoring.map((cafe) => ({
        cafe,
        advertiser: context.advertiser,
        suburbData: cafe.suburbData,
      }));

      const mlPredictions = await this.getBatchMLPredictions(mlPairs);

      // Combine scores
      const hybridScores = ruleBasedScores.map((scored) => {
        const mlPred = mlPredictions.get(scored.cafe.id);

        if (mlPred) {
          // Hybrid score: 70% ML + 30% rule-based
          const hybridScore =
            mlPred.ml_score * HYBRID_WEIGHTS.ml + scored.finalScore * HYBRID_WEIGHTS.ruleBased;

          return {
            ...scored,
            mlScore: mlPred.ml_score,
            mlScanRate: mlPred.predicted_scan_rate,
            ruleBasedScore: scored.finalScore,
            finalScore: Math.round(hybridScore),
            isMLEnhanced: true,
          };
        } else {
          // Fallback to rule-based only
          return {
            ...scored,
            mlScore: null,
            mlScanRate: null,
            ruleBasedScore: scored.finalScore,
            isMLEnhanced: false,
          };
        }
      });

      // Sort by hybrid score
      hybridScores.sort((a, b) => b.finalScore - a.finalScore);

      // Format recommendations
      const limit = options.limit || config.matching.maxRecommendations;
      const minScore = options.minScore || 0;

      finalRecommendations = hybridScores
        .filter((sc) => sc.finalScore >= minScore)
        .slice(0, limit)
        .map((scored) => ({
          cafeId: scored.cafe.id,
          name: scored.cafe.name,
          address: scored.cafe.address,
          suburb: scored.cafe.suburb,
          postcode: scored.cafe.postcode,
          location: scored.cafe.location,
          matchScore: scored.finalScore,
          matchReason: generateMatchReason(scored),
          scoreBreakdown: scored.scores,
          distanceKm: Math.round(scored.distanceKm * 10) / 10,
          estimatedDailyImpressions: scored.cafe.packagingVolume,
          packagingVolume: scored.cafe.packagingVolume,
          tags: scored.cafe.tags,
          // ML-specific fields
          mlScore: scored.mlScore,
          mlScanRate: scored.mlScanRate,
          ruleBasedScore: scored.ruleBasedScore,
          isMLEnhanced: scored.isMLEnhanced,
        }));
    } else {
      console.log('ML not available, using rule-based scoring only');

      // Use rule-based scores only
      const limit = options.limit || config.matching.maxRecommendations;
      const minScore = options.minScore || 0;

      finalRecommendations = ruleBasedScores
        .filter((sc) => sc.finalScore >= minScore)
        .sort((a, b) => b.finalScore - a.finalScore)
        .slice(0, limit)
        .map((scored) => ({
          cafeId: scored.cafe.id,
          name: scored.cafe.name,
          address: scored.cafe.address,
          suburb: scored.cafe.suburb,
          postcode: scored.cafe.postcode,
          location: scored.cafe.location,
          matchScore: scored.finalScore,
          matchReason: generateMatchReason(scored),
          scoreBreakdown: scored.scores,
          distanceKm: Math.round(scored.distanceKm * 10) / 10,
          estimatedDailyImpressions: scored.cafe.packagingVolume,
          packagingVolume: scored.cafe.packagingVolume,
          tags: scored.cafe.tags,
          mlScore: null,
          mlScanRate: null,
          ruleBasedScore: scored.finalScore,
          isMLEnhanced: false,
        }));
    }

    // Build target summary
    const targetParts: string[] = [];
    if (targetSuburbs.length > 0) {
      targetParts.push(`Suburbs: ${targetSuburbs.slice(0, 3).join(', ')}`);
    }
    if (advertiser.targetRadiusKm) {
      targetParts.push(`${advertiser.targetRadiusKm}km radius`);
    }
    const targetSummary = targetParts.length > 0 ? targetParts.join(' • ') : 'No specific targeting';

    return {
      advertiserId: advertiser.id,
      advertiserName: advertiser.businessName,
      targetSummary,
      generatedAt: new Date(),
      recommendations: finalRecommendations,
      totalCafesEvaluated: cafes.length,
      mlEnabled: mlAvailable,
    };
  }

  /**
   * Explain a specific recommendation with ML insights
   */
  async explainMLRecommendation(advertiserId: string, cafeId: string) {
    const advertiser = await prisma.advertiser.findUnique({
      where: { id: advertiserId },
    });

    if (!advertiser) {
      throw new NotFoundError('Advertiser');
    }

    const cafe = await prisma.cafe.findUnique({
      where: { id: cafeId },
    });

    if (!cafe) {
      throw new NotFoundError('Cafe');
    }

    // Get suburb data
    const suburbData = await prisma.suburbData.findFirst({
      where: { suburb: cafe.suburb, city: cafe.city },
    });

    const targetSuburbs = JSON.parse(advertiser.targetSuburbs || '[]') as string[];
    const targetPostcodes = JSON.parse(advertiser.targetPostcodes || '[]') as string[];
    const targetAudience = advertiser.targetAudience
      ? (JSON.parse(advertiser.targetAudience as string) as TargetAudience)
      : null;

    // Get ML explanation if available
    const mlAvailable = await this.isMLAvailable();
    let mlExplanation: MLExplanation | null = null;

    if (mlAvailable) {
      try {
        const response = await axios.post<MLExplanation>(
          `${ML_API_URL}/explain`,
          {
            cafe: {
              lat: cafe.lat,
              lng: cafe.lng,
              suburb: cafe.suburb,
              postcode: cafe.postcode,
              avgDailyFootTraffic: cafe.avgDailyFootTraffic,
              packagingVolume: cafe.packagingVolume,
              tags: JSON.parse((cafe.tags as string) || '[]'),
            },
            advertiser: {
              targetLat: advertiser.targetLat,
              targetLng: advertiser.targetLng,
              targetSuburbs,
              targetPostcodes,
              targetRadiusKm: advertiser.targetRadiusKm,
              industry: advertiser.industry,
              targetAudience,
            },
            suburb: suburbData
              ? {
                  medianAge: suburbData.medianAge ?? undefined,
                  medianIncome: suburbData.medianIncome ?? undefined,
                  population: suburbData.population ?? undefined,
                }
              : null,
          },
          { timeout: 5000 }
        );

        mlExplanation = response.data;
      } catch (error) {
        console.error('ML explanation error:', error instanceof Error ? error.message : 'Unknown error');
      }
    }

    return {
      cafe: {
        id: cafe.id,
        name: cafe.name,
        suburb: cafe.suburb,
      },
      advertiser: {
        id: advertiser.id,
        businessName: advertiser.businessName,
        industry: advertiser.industry,
      },
      mlExplanation,
      mlAvailable,
    };
  }
}

export const mlMatchingService = new MLMatchingService();
