// FeidUp Matching Engine
// Core algorithm for matching advertisers to the most suitable cafes

import { getDistance } from 'geolib';
import { config } from '../config/index.js';
import type {
  MatchingContext,
  ScoredCafe,
  ScoreBreakdown,
  Coordinates,
  CafeDemographics,
  TargetAudience,
} from '../types/index.js';

// Industry to cafe tag relevance mapping
const INDUSTRY_TAG_RELEVANCE: Record<string, string[]> = {
  fitness: ['fitness', 'health', 'wellness', 'organic', 'active'],
  education: ['student', 'university', 'study-friendly', 'academic', 'coworking-friendly'],
  fintech: ['business', 'professional', 'cbd', 'premium', 'executive'],
  food: ['organic', 'vegan-friendly', 'brunch', 'specialty', 'premium'],
  arts_culture: ['cultural', 'museum', 'arts', 'creative', 'gallery'],
  technology: ['coworking-friendly', 'trendy', 'startup', 'modern'],
  retail: ['shopping', 'boutique', 'high-traffic', 'weekend'],
  health: ['wellness', 'organic', 'health', 'fitness'],
  beauty: ['boutique', 'premium', 'fashion', 'trendy'],
};

// Demographic type to age range mapping
const DEMOGRAPHIC_AGE_RANGES: Record<string, { min: number; max: number }> = {
  students: { min: 18, max: 25 },
  young_adults: { min: 18, max: 30 },
  young_professionals: { min: 25, max: 38 },
  professionals: { min: 28, max: 50 },
  executives: { min: 35, max: 55 },
  families: { min: 30, max: 50 },
  affluent_families: { min: 32, max: 55 },
  creative_professionals: { min: 25, max: 45 },
  tourists_locals: { min: 20, max: 60 },
  arts_culture: { min: 22, max: 55 },
  alternative_creative: { min: 22, max: 42 },
  fashion_conscious: { min: 22, max: 40 },
  business_professionals: { min: 25, max: 50 },
  students_staff: { min: 20, max: 45 },
  families_professionals: { min: 28, max: 48 },
};

// Income level mapping for comparison
const INCOME_LEVELS: Record<string, number> = {
  low: 1,
  'low-medium': 2,
  medium: 3,
  'medium-high': 4,
  high: 5,
};

interface CafeForScoring {
  id: string;
  name: string;
  address: string;
  suburb: string;
  postcode: string;
  lat: number;
  lng: number;
  avgDailyFootTraffic: number;
  packagingVolume: number;
  demographics: CafeDemographics | null;
  tags: string[];
}

/**
 * Calculate the distance between two geographic points in kilometers
 */
function calculateDistanceKm(point1: Coordinates, point2: Coordinates): number {
  const distanceMeters = getDistance(
    { latitude: point1.lat, longitude: point1.lng },
    { latitude: point2.lat, longitude: point2.lng }
  );
  return distanceMeters / 1000;
}

/**
 * Calculate location score based on distance, suburb match, and postcode match
 */
function calculateLocationScore(
  cafe: CafeForScoring,
  context: MatchingContext
): { score: number; distanceKm: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  let distanceKm = 0;

  // Check suburb match (highest priority for location)
  const suburbMatch = context.advertiser.targetSuburbs.some(
    (s) => s.toLowerCase() === cafe.suburb.toLowerCase()
  );

  // Check postcode match
  const postcodeMatch = context.advertiser.targetPostcodes.includes(cafe.postcode);

  // Calculate distance if center point is provided
  if (context.advertiser.targetCenter) {
    const cafeLocation: Coordinates = { lat: cafe.lat, lng: cafe.lng };
    distanceKm = calculateDistanceKm(context.advertiser.targetCenter, cafeLocation);

    // Distance-based scoring with decay
    const { targetRadiusKm } = context.advertiser;
    const { distanceDecayFactor } = config.matching;

    if (distanceKm <= targetRadiusKm) {
      // Inside target radius - score based on proximity
      const proximityRatio = 1 - distanceKm / targetRadiusKm;
      const distanceScore = Math.pow(proximityRatio, distanceDecayFactor) * 60;
      score += distanceScore;

      if (distanceKm < 1) {
        reasons.push(`Very close to target area (${(distanceKm * 1000).toFixed(0)}m)`);
      } else {
        reasons.push(`Within ${distanceKm.toFixed(1)}km of target center`);
      }
    } else {
      // Outside radius but still consider if suburb/postcode matches
      const overageRatio = distanceKm / targetRadiusKm;
      if (overageRatio < 2) {
        score += 20 / overageRatio;
        reasons.push(`${distanceKm.toFixed(1)}km from target (outside preferred radius)`);
      }
    }
  }

  // Suburb match bonus
  if (suburbMatch) {
    score += 30;
    reasons.push(`Located in target suburb: ${cafe.suburb}`);
  }

  // Postcode match bonus
  if (postcodeMatch && !suburbMatch) {
    score += 15;
    reasons.push(`Located in target postcode: ${cafe.postcode}`);
  }

  // Normalize to 0-100
  score = Math.min(100, score);

  return { score, distanceKm, reasons };
}

/**
 * Calculate volume score based on foot traffic and packaging volume
 */
function calculateVolumeScore(cafe: CafeForScoring): { score: number; reasons: string[] } {
  const reasons: string[] = [];

  // Baseline expectations
  const avgTraffic = 400; // Average daily foot traffic
  const avgPackaging = 250; // Average daily packaging

  // Traffic score (0-50 points)
  const trafficRatio = cafe.avgDailyFootTraffic / avgTraffic;
  const trafficScore = Math.min(50, trafficRatio * 30);

  // Packaging score (0-50 points)
  const packagingRatio = cafe.packagingVolume / avgPackaging;
  const packagingScore = Math.min(50, packagingRatio * 30);

  const score = trafficScore + packagingScore;

  // Generate reasons
  if (cafe.avgDailyFootTraffic >= 600) {
    reasons.push(`High foot traffic: ${cafe.avgDailyFootTraffic} visitors/day`);
  } else if (cafe.avgDailyFootTraffic >= 400) {
    reasons.push(`Good foot traffic: ${cafe.avgDailyFootTraffic} visitors/day`);
  }

  if (cafe.packagingVolume >= 350) {
    reasons.push(`High impression potential: ${cafe.packagingVolume} cups/day`);
  } else if (cafe.packagingVolume >= 250) {
    reasons.push(`Strong impression volume: ${cafe.packagingVolume} cups/day`);
  }

  return { score: Math.min(100, score), reasons };
}

/**
 * Calculate demographic match score
 */
function calculateDemographicScore(
  cafe: CafeForScoring,
  targetAudience: TargetAudience | null
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 50; // Default score when no targeting specified

  if (!targetAudience || !cafe.demographics) {
    return { score, reasons };
  }

  const cafeDemographics = cafe.demographics;
  let matchCount = 0;
  let totalChecks = 0;

  // Age range matching
  if (targetAudience.ageRange && cafeDemographics.type) {
    totalChecks++;
    const cafeAgeRange = DEMOGRAPHIC_AGE_RANGES[cafeDemographics.type];

    if (cafeAgeRange) {
      const targetMin = targetAudience.ageRange.min;
      const targetMax = targetAudience.ageRange.max;

      // Check overlap
      const overlapMin = Math.max(targetMin, cafeAgeRange.min);
      const overlapMax = Math.min(targetMax, cafeAgeRange.max);

      if (overlapMin <= overlapMax) {
        const overlapRange = overlapMax - overlapMin;
        const targetRange = targetMax - targetMin;
        const overlapRatio = overlapRange / targetRange;

        if (overlapRatio >= 0.5) {
          matchCount++;
          reasons.push(`Age demographic match: ${cafeDemographics.type}`);
        } else if (overlapRatio >= 0.25) {
          matchCount += 0.5;
          reasons.push(`Partial age overlap with ${cafeDemographics.type}`);
        }
      }
    }
  }

  // Income level matching
  if (targetAudience.incomeLevel && cafeDemographics.income) {
    totalChecks++;
    const targetLevel = INCOME_LEVELS[targetAudience.incomeLevel] || 3;
    const cafeLevel = INCOME_LEVELS[cafeDemographics.income] || 3;
    const levelDiff = Math.abs(targetLevel - cafeLevel);

    if (levelDiff === 0) {
      matchCount++;
      reasons.push(`Income level match: ${cafeDemographics.income}`);
    } else if (levelDiff === 1) {
      matchCount += 0.5;
    }
  }

  // Calculate final score
  if (totalChecks > 0) {
    score = (matchCount / totalChecks) * 100;
  }

  return { score: Math.min(100, score), reasons };
}

/**
 * Calculate industry/interest relevance score
 */
function calculateRelevanceScore(
  cafe: CafeForScoring,
  industry: string,
  targetAudience: TargetAudience | null
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 30; // Baseline score

  const relevantTags = INDUSTRY_TAG_RELEVANCE[industry.toLowerCase()] || [];

  // Check cafe tags against industry-relevant tags
  const matchingTags = cafe.tags.filter((tag) =>
    relevantTags.some((rt) => tag.toLowerCase().includes(rt) || rt.includes(tag.toLowerCase()))
  );

  if (matchingTags.length > 0) {
    const tagBonus = Math.min(50, matchingTags.length * 20);
    score += tagBonus;
    reasons.push(`Industry-relevant characteristics: ${matchingTags.join(', ')}`);
  }

  // Check interest alignment
  if (targetAudience?.interests) {
    const interestMatches = targetAudience.interests.filter((interest) =>
      cafe.tags.some(
        (tag) =>
          tag.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(tag.toLowerCase())
      )
    );

    if (interestMatches.length > 0) {
      score += Math.min(30, interestMatches.length * 15);
      reasons.push(`Interest alignment: ${interestMatches.join(', ')}`);
    }
  }

  return { score: Math.min(100, score), reasons };
}

/**
 * Main matching function - scores all candidate cafes for an advertiser
 */
export function scoreAllCafes(
  cafes: CafeForScoring[],
  context: MatchingContext
): ScoredCafe[] {
  const weights = context.weights;

  return cafes.map((cafe) => {
    const allReasons: string[] = [];

    // Calculate individual scores
    const location = calculateLocationScore(cafe, context);
    const volume = calculateVolumeScore(cafe);
    const demographic = calculateDemographicScore(cafe, context.advertiser.targetAudience);
    const relevance = calculateRelevanceScore(
      cafe,
      context.advertiser.industry,
      context.advertiser.targetAudience
    );

    // Collect all reasons
    allReasons.push(...location.reasons);
    allReasons.push(...volume.reasons);
    allReasons.push(...demographic.reasons);
    allReasons.push(...relevance.reasons);

    // Calculate weighted final score
    const scores: ScoreBreakdown = {
      locationScore: Math.round(location.score * weights.location),
      volumeScore: Math.round(volume.score * weights.volume),
      demographicScore: Math.round(demographic.score * weights.demographic),
      relevanceScore: Math.round(relevance.score * weights.relevance),
    };

    const finalScore =
      scores.locationScore + scores.volumeScore + scores.demographicScore + scores.relevanceScore;

    return {
      cafe: {
        id: cafe.id,
        name: cafe.name,
        address: cafe.address,
        suburb: cafe.suburb,
        postcode: cafe.postcode,
        location: { lat: cafe.lat, lng: cafe.lng },
        avgDailyFootTraffic: cafe.avgDailyFootTraffic,
        packagingVolume: cafe.packagingVolume,
        demographics: cafe.demographics,
        tags: cafe.tags,
      },
      scores,
      finalScore: Math.round(finalScore),
      distanceKm: location.distanceKm,
      reasons: allReasons,
    };
  });
}

/**
 * Generate a human-readable match reason from scored results
 */
export function generateMatchReason(scored: ScoredCafe): string {
  const { scores, reasons } = scored;

  // Find the dominant factor
  const factors = [
    { name: 'location', score: scores.locationScore },
    { name: 'volume', score: scores.volumeScore },
    { name: 'demographic', score: scores.demographicScore },
    { name: 'relevance', score: scores.relevanceScore },
  ].sort((a, b) => b.score - a.score);

  const topFactor = factors[0];
  const topReason = reasons[0] || 'Good overall match';

  // Build explanation
  let explanation = topReason;

  if (factors[1].score >= factors[0].score * 0.8) {
    // Second factor is also strong
    const secondReason = reasons.find(
      (r, i) =>
        i > 0 &&
        !r.toLowerCase().includes(topFactor.name) &&
        !reasons[0].toLowerCase().includes(r.toLowerCase())
    );
    if (secondReason) {
      explanation += `. ${secondReason}`;
    }
  }

  return explanation;
}

/**
 * Filter and rank cafes for an advertiser
 */
export function getTopRecommendations(
  scoredCafes: ScoredCafe[],
  limit: number = config.matching.maxRecommendations,
  minScore: number = 0
): ScoredCafe[] {
  return scoredCafes
    .filter((sc) => sc.finalScore >= minScore)
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, limit);
}
