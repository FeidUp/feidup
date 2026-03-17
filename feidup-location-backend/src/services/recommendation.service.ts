// Recommendation Service
// Orchestrates the matching engine to generate cafe recommendations

import { config } from '../config/index.js';
import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../middleware/errorHandler.js';
import { scoreAllCafes, generateMatchReason, getTopRecommendations } from './matching.service.js';
import type { SuburbDemographics } from './matching.service.js';
import type {
  RecommendationResponse,
  CafeRecommendation,
  MatchingContext,
  TargetAudience,
  CafeDemographics,
} from '../types/index.js';

export class RecommendationService {
  /**
   * Get cafe recommendations for an advertiser
   */
  async getRecommendations(
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

    // Get all active cafes in the same city
    const cafes = await prisma.cafe.findMany({
      where: {
        city: advertiser.city,
        isActive: true,
      },
    });

    // Parse JSON strings from SQLite
    const targetSuburbs = JSON.parse(advertiser.targetSuburbs || '[]') as string[];
    const targetPostcodes = JSON.parse(advertiser.targetPostcodes || '[]') as string[];
    const targetAudience = advertiser.targetAudience ? JSON.parse(advertiser.targetAudience as string) : null;

    // Build matching context
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
        targetAudience: targetAudience as TargetAudience | null,
      },
      weights: config.matching.weights,
    };

    // Fetch suburb demographic data (ABS Census enriched)
    const suburbNames = [...new Set(cafes.map(c => c.suburb))];
    const suburbDataRecords = await prisma.suburbData.findMany({
      where: { suburb: { in: suburbNames }, city: advertiser.city },
    });
    const suburbDataMap = new Map<string, SuburbDemographics>(
      suburbDataRecords.map(s => [s.suburb, {
        population: s.population ?? undefined,
        medianAge: s.medianAge ?? undefined,
        medianIncome: s.medianIncome ?? undefined,
        primaryDemographic: s.primaryDemographic ?? undefined,
      }])
    );

    // Format cafes for scoring (parse JSON strings from SQLite + attach suburb data)
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
      demographics: cafe.demographics ? JSON.parse(cafe.demographics as string) as CafeDemographics : null,
      tags: JSON.parse((cafe.tags as string) || '[]') as string[],
      suburbData: suburbDataMap.get(cafe.suburb) || null,
    }));

    // Score all cafes
    const scoredCafes = scoreAllCafes(cafesForScoring, context);

    // Get top recommendations
    const limit = options.limit || config.matching.maxRecommendations;
    const minScore = options.minScore || 0;
    const topCafes = getTopRecommendations(scoredCafes, limit, minScore);

    // Format recommendations
    const recommendations: CafeRecommendation[] = topCafes.map((scored) => ({
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
    }));

    // Build target summary
    const targetParts: string[] = [];
    if (targetSuburbs.length > 0) {
      targetParts.push(`Suburbs: ${targetSuburbs.slice(0, 3).join(', ')}`);
    }
    if (advertiser.targetRadiusKm) {
      targetParts.push(`${advertiser.targetRadiusKm}km radius`);
    }
    const targetSummary =
      targetParts.length > 0 ? targetParts.join(' • ') : 'No specific targeting';

    return {
      advertiserId: advertiser.id,
      advertiserName: advertiser.businessName,
      targetSummary,
      generatedAt: new Date(),
      recommendations,
      totalCafesEvaluated: cafes.length,
    };
  }

  /**
   * Get recommendations for a specific suburb or postcode
   */
  async getRecommendationsForArea(
    advertiserId: string,
    area: { suburb?: string; postcode?: string }
  ): Promise<RecommendationResponse> {
    const advertiser = await prisma.advertiser.findUnique({
      where: { id: advertiserId },
    });

    if (!advertiser) {
      throw new NotFoundError('Advertiser');
    }

    const where: Record<string, unknown> = {
      city: advertiser.city,
      isActive: true,
    };

    if (area.suburb) where.suburb = area.suburb;
    if (area.postcode) where.postcode = area.postcode;

    const cafes = await prisma.cafe.findMany({ where });

    // Parse JSON strings from SQLite
    const targetSuburbs = JSON.parse(advertiser.targetSuburbs || '[]') as string[];
    const targetPostcodes = JSON.parse(advertiser.targetPostcodes || '[]') as string[];
    const targetAudience = advertiser.targetAudience ? JSON.parse(advertiser.targetAudience as string) : null;

    // Build context with area override
    const context: MatchingContext = {
      advertiser: {
        id: advertiser.id,
        industry: advertiser.industry,
        targetSuburbs: area.suburb ? [area.suburb] : targetSuburbs,
        targetPostcodes: area.postcode ? [area.postcode] : targetPostcodes,
        targetCenter:
          advertiser.targetLat && advertiser.targetLng
            ? { lat: advertiser.targetLat, lng: advertiser.targetLng }
            : null,
        targetRadiusKm: advertiser.targetRadiusKm || config.matching.defaultRadiusKm,
        targetAudience: targetAudience as TargetAudience | null,
      },
      weights: config.matching.weights,
    };

    // Fetch suburb demographic data (ABS Census enriched)
    const areaSuburbs = [...new Set(cafes.map(c => c.suburb))];
    const areaSuburbData = await prisma.suburbData.findMany({
      where: { suburb: { in: areaSuburbs }, city: advertiser.city },
    });
    const areaSuburbMap = new Map<string, SuburbDemographics>(
      areaSuburbData.map(s => [s.suburb, {
        population: s.population ?? undefined,
        medianAge: s.medianAge ?? undefined,
        medianIncome: s.medianIncome ?? undefined,
        primaryDemographic: s.primaryDemographic ?? undefined,
      }])
    );

    // Format cafes for scoring (parse JSON strings from SQLite + attach suburb data)
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
      demographics: cafe.demographics ? JSON.parse(cafe.demographics as string) as CafeDemographics : null,
      tags: JSON.parse((cafe.tags as string) || '[]') as string[],
      suburbData: areaSuburbMap.get(cafe.suburb) || null,
    }));

    const scoredCafes = scoreAllCafes(cafesForScoring, context);
    const topCafes = getTopRecommendations(scoredCafes);

    const recommendations: CafeRecommendation[] = topCafes.map((scored) => ({
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
    }));

    const areaLabel = area.suburb || area.postcode || 'Selected Area';

    return {
      advertiserId: advertiser.id,
      advertiserName: advertiser.businessName,
      targetSummary: `Filtered by: ${areaLabel}`,
      generatedAt: new Date(),
      recommendations,
      totalCafesEvaluated: cafes.length,
    };
  }

  /**
   * Explain why a specific cafe was recommended
   */
  async explainRecommendation(advertiserId: string, cafeId: string) {
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

    // Parse JSON strings from SQLite
    const targetSuburbs = JSON.parse(advertiser.targetSuburbs || '[]') as string[];
    const targetPostcodes = JSON.parse(advertiser.targetPostcodes || '[]') as string[];
    const targetAudience = advertiser.targetAudience ? JSON.parse(advertiser.targetAudience as string) : null;

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
        targetAudience: targetAudience as TargetAudience | null,
      },
      weights: config.matching.weights,
    };

    // Fetch suburb demographic data
    const cafeSuburbData = await prisma.suburbData.findFirst({
      where: { suburb: cafe.suburb, city: cafe.city },
    });

    // Parse cafe JSON strings from SQLite
    const cafeForScoring = {
      id: cafe.id,
      name: cafe.name,
      address: cafe.address,
      suburb: cafe.suburb,
      postcode: cafe.postcode,
      lat: cafe.lat,
      lng: cafe.lng,
      avgDailyFootTraffic: cafe.avgDailyFootTraffic,
      packagingVolume: cafe.packagingVolume,
      demographics: cafe.demographics ? JSON.parse(cafe.demographics as string) as CafeDemographics : null,
      tags: JSON.parse((cafe.tags as string) || '[]') as string[],
      suburbData: cafeSuburbData ? {
        population: cafeSuburbData.population ?? undefined,
        medianAge: cafeSuburbData.medianAge ?? undefined,
        medianIncome: cafeSuburbData.medianIncome ?? undefined,
        primaryDemographic: cafeSuburbData.primaryDemographic ?? undefined,
      } : null,
    };

    const [scored] = scoreAllCafes([cafeForScoring], context);

    return {
      advertiserId: advertiser.id,
      advertiserName: advertiser.businessName,
      cafe: {
        id: cafe.id,
        name: cafe.name,
        address: cafe.address,
        suburb: cafe.suburb,
      },
      analysis: {
        finalScore: scored.finalScore,
        scoreBreakdown: scored.scores,
        reasons: scored.reasons,
        distanceKm: Math.round(scored.distanceKm * 10) / 10,
        estimatedDailyImpressions: cafe.packagingVolume,
      },
      weights: config.matching.weights,
    };
  }
}

export const recommendationService = new RecommendationService();
