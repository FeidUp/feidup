// API client for FeidUp backend

const API_BASE = '/api';

export interface Advertiser {
  id: string;
  businessName: string;
  industry: string;
  targetSuburbs: string[];
  targetPostcodes: string[];
  targetRadiusKm: number | null;
  targetLocation: { lat: number; lng: number } | null;
  targetAudience: {
    ageRange?: { min: number; max: number };
    interests?: string[];
    incomeLevel?: string;
  } | null;
  campaignGoal: string;
  city: string;
  isActive: boolean;
  createdAt: string;
}

export interface Cafe {
  id: string;
  name: string;
  address: string;
  suburb: string;
  postcode: string;
  city: string;
  location: { lat: number; lng: number };
  avgDailyFootTraffic: number;
  packagingVolume: number;
  demographics: {
    primaryAge?: string;
    income?: string;
    type?: string;
  } | null;
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Recommendation {
  cafeId: string;
  name: string;
  address: string;
  suburb: string;
  postcode: string;
  location: { lat: number; lng: number };
  matchScore: number;
  matchReason: string;
  scoreBreakdown: {
    locationScore: number;
    volumeScore: number;
    demographicScore: number;
    relevanceScore: number;
  };
  distanceKm: number;
  estimatedDailyImpressions: number;
  tags: string[];
}

export interface RecommendationResponse {
  advertiserId: string;
  advertiserName: string;
  targetSummary: string;
  generatedAt: string;
  recommendations: Recommendation[];
  totalCafesEvaluated: number;
}

export interface SuburbStats {
  suburb: string;
  postcode: string;
  cafeCount: number;
  avgDailyTraffic: number;
  totalDailyImpressions: number;
}

// Generic API response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    total: number;
    limit: number;
    offset: number;
  };
}

// Error handling
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'Something went wrong');
  }

  return data;
}

// =============================================================================
// Advertiser API
// =============================================================================

export async function getAdvertisers(): Promise<Advertiser[]> {
  const response = await fetchApi<ApiResponse<Advertiser[]>>('/advertisers');
  return response.data;
}

export async function getAdvertiser(id: string): Promise<Advertiser> {
  const response = await fetchApi<ApiResponse<Advertiser>>(`/advertisers/${id}`);
  return response.data;
}

export async function createAdvertiser(data: Partial<Advertiser>): Promise<Advertiser> {
  const response = await fetchApi<ApiResponse<Advertiser>>('/advertisers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function updateAdvertiser(id: string, data: Partial<Advertiser>): Promise<Advertiser> {
  const response = await fetchApi<ApiResponse<Advertiser>>(`/advertisers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function deleteAdvertiser(id: string): Promise<void> {
  await fetchApi(`/advertisers/${id}`, { method: 'DELETE' });
}

// =============================================================================
// Cafe API
// =============================================================================

export async function getCafes(): Promise<Cafe[]> {
  const response = await fetchApi<ApiResponse<Cafe[]>>('/cafes');
  return response.data;
}

export async function getCafe(id: string): Promise<Cafe> {
  const response = await fetchApi<ApiResponse<Cafe>>(`/cafes/${id}`);
  return response.data;
}

export async function createCafe(data: Partial<Cafe>): Promise<Cafe> {
  const response = await fetchApi<ApiResponse<Cafe>>('/cafes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function updateCafe(id: string, data: Partial<Cafe>): Promise<Cafe> {
  const response = await fetchApi<ApiResponse<Cafe>>(`/cafes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function deleteCafe(id: string): Promise<void> {
  await fetchApi(`/cafes/${id}`, { method: 'DELETE' });
}

export async function getSuburbStats(): Promise<SuburbStats[]> {
  const response = await fetchApi<ApiResponse<SuburbStats[]>>('/cafes/stats/suburbs');
  return response.data;
}

// =============================================================================
// Recommendations API
// =============================================================================

export async function getRecommendations(
  advertiserId: string,
  options?: { limit?: number; minScore?: number }
): Promise<RecommendationResponse> {
  const params = new URLSearchParams({ advertiser_id: advertiserId });
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.minScore) params.append('min_score', options.minScore.toString());

  const response = await fetchApi<ApiResponse<RecommendationResponse>>(
    `/recommendations?${params.toString()}`
  );
  return response.data;
}

// =============================================================================
// Health API
// =============================================================================

export async function checkHealth(): Promise<{ status: string; database: string }> {
  const response = await fetch('/health');
  return response.json();
}
