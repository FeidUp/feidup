// Shared types for FeidUp Location Backend

// =============================================================================
// API Request/Response Types
// =============================================================================

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TargetAudience {
  ageRange?: {
    min: number;
    max: number;
  };
  interests?: string[];
  incomeLevel?: 'low' | 'medium' | 'low-medium' | 'medium-high' | 'high';
}

export interface CafeDemographics {
  primaryAge?: string;
  income?: string;
  type?: string;
}

// =============================================================================
// Advertiser Types
// =============================================================================

export interface CreateAdvertiserInput {
  businessName: string;
  industry: string;
  targetSuburbs?: string[];
  targetPostcodes?: string[];
  targetRadiusKm?: number;
  targetLocation?: Coordinates;
  targetAudience?: TargetAudience;
  campaignGoal?: 'brand_awareness' | 'local_reach' | 'event_promotion';
  contactEmail?: string;
  contactPhone?: string;
  city?: string;
}

export interface AdvertiserResponse {
  id: string;
  businessName: string;
  industry: string;
  targetSuburbs: string[];
  targetPostcodes: string[];
  targetRadiusKm: number | null;
  targetLocation: Coordinates | null;
  targetAudience: TargetAudience | null;
  campaignGoal: string;
  city: string;
  isActive: boolean;
  createdAt: Date;
}

// =============================================================================
// Cafe Types
// =============================================================================

export interface CreateCafeInput {
  name: string;
  address: string;
  suburb: string;
  postcode: string;
  location: Coordinates;
  avgDailyFootTraffic?: number;
  packagingVolume?: number;
  demographics?: CafeDemographics;
  operatingHours?: Record<string, { open: string; close: string }>;
  tags?: string[];
  city?: string;
}

export interface CafeResponse {
  id: string;
  name: string;
  address: string;
  suburb: string;
  postcode: string;
  city: string;
  location: Coordinates;
  avgDailyFootTraffic: number;
  packagingVolume: number;
  demographics: CafeDemographics | null;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
}

// =============================================================================
// Recommendation Types
// =============================================================================

export interface RecommendationRequest {
  advertiserId: string;
  limit?: number;
  minScore?: number;
}

export interface ScoreBreakdown {
  locationScore: number;
  volumeScore: number;
  demographicScore: number;
  relevanceScore: number;
}

export interface CafeRecommendation {
  cafeId: string;
  name: string;
  address: string;
  suburb: string;
  postcode: string;
  location: Coordinates;
  
  // Matching data
  matchScore: number;
  matchReason: string;
  scoreBreakdown: ScoreBreakdown;
  
  // Metrics
  distanceKm: number;
  estimatedDailyImpressions: number;
  packagingVolume: number;
  
  // Tags for context
  tags: string[];

  // Optional ML-enhanced fields
  mlScore?: number | null;
  mlScanRate?: number | null;
  ruleBasedScore?: number | null;
  isMLEnhanced?: boolean;
}

export interface RecommendationResponse {
  advertiserId: string;
  advertiserName: string;
  targetSummary: string;
  generatedAt: Date;
  recommendations: CafeRecommendation[];
  totalCafesEvaluated: number;
  mlEnabled?: boolean;
}

// =============================================================================
// Campaign Types
// =============================================================================

export interface CreateCampaignInput {
  advertiserId: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
  targetSuburbs?: string[];
  targetPostcodes?: string[];
  targetRadiusKm?: number;
  autoSelectCafes?: boolean;
  cafeIds?: string[];
}

export interface CampaignResponse {
  id: string;
  advertiserId: string;
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  targetSuburbs: string[];
  targetPostcodes: string[];
  estimatedImpressions: number;
  placements: PlacementSummary[];
  createdAt: Date;
}

export interface PlacementSummary {
  id: string;
  cafeId: string;
  cafeName: string;
  matchScore: number;
  matchReason: string;
  status: string;
  estimatedDailyImpressions: number;
}

// =============================================================================
// Matching Engine Types
// =============================================================================

export interface MatchingContext {
  advertiser: {
    id: string;
    industry: string;
    targetSuburbs: string[];
    targetPostcodes: string[];
    targetCenter: Coordinates | null;
    targetRadiusKm: number;
    targetAudience: TargetAudience | null;
  };
  weights: {
    location: number;
    volume: number;
    demographic: number;
    relevance: number;
  };
}

export interface ScoredCafe {
  cafe: {
    id: string;
    name: string;
    address: string;
    suburb: string;
    postcode: string;
    location: Coordinates;
    avgDailyFootTraffic: number;
    packagingVolume: number;
    demographics: CafeDemographics | null;
    tags: string[];
  };
  scores: ScoreBreakdown;
  finalScore: number;
  distanceKm: number;
  reasons: string[];
}
