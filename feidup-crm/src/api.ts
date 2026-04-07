const API_BASE = (import.meta.env.VITE_API_URL || '') + '/api';

type RawRecommendation = Recommendation & {
  cafeId?: string;
  name?: string;
  address?: string;
  suburb?: string;
  postcode?: string;
  city?: string;
  location?: { lat: number; lng: number };
  lat?: number;
  lng?: number;
  avgDailyFootTraffic?: number;
  avgDailyOrders?: number;
  packagingVolume?: number;
  tags?: string | string[];
  isActive?: boolean;
  createdAt?: string;
};

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeRecommendation(rec: RawRecommendation): Recommendation {
  if (rec.cafe) {
    return {
      ...rec,
      matchScore: toNumber(rec.matchScore),
      scoreBreakdown: rec.scoreBreakdown || {},
      mlScore: rec.mlScore == null ? null : toNumber(rec.mlScore),
      mlScanRate: rec.mlScanRate == null ? null : toNumber(rec.mlScanRate),
      ruleBasedScore: rec.ruleBasedScore == null ? null : toNumber(rec.ruleBasedScore),
    };
  }

  const fallbackId = rec.cafeId || `${rec.name || 'cafe'}-${rec.suburb || 'unknown'}`;
  return {
    cafe: {
      id: fallbackId,
      name: rec.name || 'Unknown Cafe',
      address: rec.address || '',
      suburb: rec.suburb || '',
      postcode: rec.postcode || '',
      city: rec.city || 'Brisbane',
      location: rec.location || (rec.lat != null && rec.lng != null ? { lat: rec.lat, lng: rec.lng } : undefined),
      lat: rec.lat,
      lng: rec.lng,
      avgDailyFootTraffic: toNumber(rec.avgDailyFootTraffic, 0),
      avgDailyOrders: toNumber(rec.avgDailyOrders, 0),
      packagingVolume: toNumber(rec.packagingVolume, 0),
      tags: rec.tags || [],
      isActive: rec.isActive ?? true,
      createdAt: rec.createdAt || new Date().toISOString(),
    },
    matchScore: toNumber(rec.matchScore),
    scoreBreakdown: rec.scoreBreakdown || {},
    matchReason: rec.matchReason || '',
    mlScore: rec.mlScore == null ? null : toNumber(rec.mlScore),
    mlScanRate: rec.mlScanRate == null ? null : toNumber(rec.mlScanRate),
    ruleBasedScore: rec.ruleBasedScore == null ? null : toNumber(rec.ruleBasedScore),
    isMLEnhanced: Boolean(rec.isMLEnhanced),
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Only set Content-Type for JSON bodies (not FormData)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  
  if (res.status === 401) {
    // Try to refresh token
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        headers['Authorization'] = `Bearer ${data.data.accessToken}`;
        const retryRes = await fetch(`${API_BASE}${path}`, { ...options, headers });
        if (!retryRes.ok) throw new Error((await retryRes.json()).error || 'Request failed');
        return retryRes.json();
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  
  return res.json();
}

// Auth
export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ success: boolean; data: { user: User; accessToken: string; refreshToken: string } }>('/auth/login', {
        method: 'POST', body: JSON.stringify({ email, password }),
      }),
    me: () => request<{ success: boolean; data: User }>('/auth/me'),
    forgotPassword: (email: string) =>
      request<{ success: boolean; message: string }>('/auth/forgot-password', {
        method: 'POST', body: JSON.stringify({ email }),
      }),
    resetPassword: (token: string, password: string) =>
      request<{ success: boolean; message: string }>('/auth/reset-password', {
        method: 'POST', body: JSON.stringify({ token, password }),
      }),
    listUsers: () => request<{ success: boolean; data: User[] }>('/auth/users'),
    createUser: (data: CreateUserPayload) =>
      request<{ success: boolean; data: User }>('/auth/users', {
        method: 'POST', body: JSON.stringify(data),
      }),
    updateUser: (id: string, data: Partial<User & { password?: string; isActive?: boolean }>) =>
      request<{ success: boolean; data: User }>(`/auth/users/${id}`, {
        method: 'PATCH', body: JSON.stringify(data),
      }),
  },

  leads: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ success: boolean; data: Lead[]; pagination: Pagination }>(`/leads${qs}`);
    },
    get: (id: string) => request<{ success: boolean; data: Lead & { activities: Activity[] } }>(`/leads/${id}`),
    create: (data: CreateLeadPayload) =>
      request<{ success: boolean; data: Lead }>('/leads', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<CreateLeadPayload>) =>
      request<{ success: boolean; data: Lead }>(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<{ success: boolean }>(`/leads/${id}`, { method: 'DELETE' }),
    pipeline: () => request<{ success: boolean; data: PipelineStage[] }>('/leads/pipeline'),
    addActivity: (id: string, data: { type: string; title: string; content?: string }) =>
      request<{ success: boolean; data: Activity }>(`/leads/${id}/activities`, {
        method: 'POST', body: JSON.stringify(data),
      }),
  },

  advertisers: {
    list: () => request<{ success: boolean; data: Advertiser[] }>('/advertisers'),
    get: (id: string) => request<{ success: boolean; data: Advertiser }>(`/advertisers/${id}`),
    create: (data: Record<string, unknown>) =>
      request<{ success: boolean; data: Advertiser }>('/advertisers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      request<{ success: boolean; data: Advertiser }>(`/advertisers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<{ success: boolean }>(`/advertisers/${id}`, { method: 'DELETE' }),
  },

  restaurants: {
    list: () => request<{ success: boolean; data: Restaurant[]; meta: { total: number } }>('/cafes?limit=2000'),
    get: (id: string) => request<{ success: boolean; data: Restaurant }>(`/cafes/${id}`),
    create: (data: Record<string, unknown>) =>
      request<{ success: boolean; data: Restaurant }>('/cafes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      request<{ success: boolean; data: Restaurant }>(`/cafes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request<{ success: boolean }>(`/cafes/${id}`, { method: 'DELETE' }),
  },

  campaigns: {
    list: () => request<{ success: boolean; data: Campaign[] }>('/campaigns'),
    get: (id: string) => request<{ success: boolean; data: Campaign }>(`/campaigns/${id}`),
    create: (data: Record<string, unknown>) =>
      request<{ success: boolean; data: Campaign }>('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      request<{ success: boolean; data: Campaign }>(`/campaigns/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request<{ success: boolean; data: Campaign }>(`/campaigns/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    addPlacement: (id: string, cafeId: string) =>
      request<{ success: boolean; data: Placement }>(`/campaigns/${id}/placements`, { method: 'POST', body: JSON.stringify({ cafeId }) }),
    updatePlacementStatus: (placementId: string, status: string) =>
      request<{ success: boolean; data: Placement }>(`/campaigns/placements/${placementId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    removePlacement: (placementId: string) =>
      request<{ success: boolean; message: string }>(`/campaigns/placements/${placementId}`, { method: 'DELETE' }),
    delete: (id: string) => request<{ success: boolean }>(`/campaigns/${id}`, { method: 'DELETE' }),
  },

  recommendations: {
    get: (advertiserId: string) =>
      request<{ success: boolean; data: RawRecommendation[] }>(`/ml/recommendations/${advertiserId}`).then((res) => ({
        ...res,
        data: Array.isArray(res.data) ? res.data.map(normalizeRecommendation) : [],
      })),
    explain: (advertiserId: string, cafeId: string) =>
      request<{ success: boolean; data: any }>(`/ml/explain/${advertiserId}/${cafeId}`),
    mlStatus: () =>
      request<{ success: boolean; data: { mlAvailable: boolean; message: string } }>('/ml/status'),
  },

  inventory: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ success: boolean; data: InventoryItem[] }>(`/inventory${qs}`);
    },
    batches: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<{ success: boolean; data: PackagingBatch[] }>(`/inventory/batches${qs}`);
    },
    createBatch: (data: { campaignId: string; packagingType: string; quantityProduced: number }) =>
      request<{ success: boolean; data: PackagingBatch }>('/inventory/batches', {
        method: 'POST', body: JSON.stringify(data),
      }),
    updateBatch: (id: string, data: { status?: string; quantityShipped?: number }) =>
      request<{ success: boolean; data: PackagingBatch }>(`/inventory/batches/${id}`, {
        method: 'PATCH', body: JSON.stringify(data),
      }),
    allocate: (data: { batchId: string; cafeId: string; quantity: number }) =>
      request<{ success: boolean; data: InventoryItem }>('/inventory/allocate', {
        method: 'POST', body: JSON.stringify(data),
      }),
    reportUsage: (data: { cafeId: string; packagingUsed: number; notes?: string }) =>
      request<{ success: boolean }>('/inventory/usage', {
        method: 'POST', body: JSON.stringify(data),
      }),
  },

  analytics: {
    overview: () => request<{ success: boolean; data: AnalyticsOverview }>('/analytics/overview'),
    campaign: (id: string) => request<{ success: boolean; data: CampaignAnalytics }>(`/analytics/campaign/${id}`),
    region: () => request<{ success: boolean; data: RegionData[] }>('/analytics/region'),
    performance: () => request<{ success: boolean; data: CampaignPerformance[] }>('/analytics/performance'),
    revenue: () => request<{ success: boolean; data: RevenueData }>('/analytics/revenue'),
    qrOverview: () => request<{ success: boolean; data: QROverviewAnalytics }>('/analytics/qr/overview'),
    qrLive: () => request<{ success: boolean; data: QRLiveScan[] }>('/analytics/qr/live'),
    qrGeography: () => request<{ success: boolean; data: QRGeographyEntry[] }>('/analytics/qr/geography'),
    qrTrends: () => request<{ success: boolean; data: { weeks: { week: string; count: number }[]; totalScans: number } }>('/analytics/qr/trends'),
    conversions: () => request<{ success: boolean; data: QRConversionFunnel }>('/analytics/conversions'),
  },

  enrichment: {
    discoverAdvertisersNear: (lat: number, lng: number, industries?: string[]) =>
      request<{ success: boolean; data: { count: number; businesses: DiscoveredBusiness[] } }>('/enrichment/discover-advertisers/near', {
        method: 'POST', body: JSON.stringify({ lat, lng, industries, radiusM: 5000 }),
      }),
    searchAdvertisers: (keyword: string) =>
      request<{ success: boolean; data: { count: number; keyword: string; businesses: DiscoveredBusiness[] } }>('/enrichment/discover-advertisers/search', {
        method: 'POST', body: JSON.stringify({ keyword }),
      }),
    getIndustries: () =>
      request<{ success: boolean; data: Array<{ industry: string; label: string }> }>('/enrichment/discover-advertisers/industries'),
  },

  cafePortal: {
    me: () => request<{ success: boolean; data: CafePortalData }>('/cafes/me'),
    qrAnalytics: (cafeId: string) => request<{ success: boolean; data: QRCafeAnalytics }>(`/analytics/qr/cafe/${cafeId}`),
  },

  advertiserPortal: {
    me: () => request<{ success: boolean; data: AdvertiserPortalData }>('/advertisers/me'),
    updateTargetAudience: (targetAudience: TargetAudience) =>
      request<{ success: boolean; data: Advertiser }>(`/advertisers/me/target-audience`, {
        method: 'PATCH',
        body: JSON.stringify({ targetAudience }),
      }),
    campaignQRAnalytics: (campaignId: string) => request<{ success: boolean; data: QRCampaignAnalytics }>(`/analytics/qr/campaign/${campaignId}`),
  },
};

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
  advertiserId?: string;
  restaurantId?: string;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  advertiserId?: string;
  restaurantId?: string;
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  type: string;
  source: string;
  stage: string;
  priority: string;
  estimatedValue?: number;
  assignedToId?: string;
  assignedTo?: { id: string; firstName: string; lastName: string };
  createdBy?: { id: string; firstName: string; lastName: string };
  suburb?: string;
  city: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  _count?: { activities: number };
}

export interface CreateLeadPayload {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  type: string;
  source?: string;
  stage?: string;
  priority?: string;
  estimatedValue?: number;
  assignedToId?: string;
  suburb?: string;
  city?: string;
  notes?: string;
}

export interface Activity {
  id: string;
  type: string;
  title: string;
  content?: string;
  userId: string;
  user?: { id: string; firstName: string; lastName: string };
  createdAt: string;
}

export interface PipelineStage {
  stage: string;
  count: number;
  totalValue: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface TargetAudience {
  ageRange?: {
    min: number;
    max: number;
  };
  interests?: string[];
  incomeLevel?: 'low' | 'medium' | 'low-medium' | 'medium-high' | 'high';
}

export interface Advertiser {
  id: string;
  businessName: string;
  industry: string;
  targetSuburbs: string | string[];
  targetPostcodes: string | string[];
  targetRadiusKm?: number;
  targetAudience?: TargetAudience | null;
  campaignGoal: string;
  contactEmail?: string;
  contactPhone?: string;
  city: string;
  isActive: boolean;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  suburb: string;
  postcode: string;
  city: string;
  location?: { lat: number; lng: number };
  lat?: number;
  lng?: number;
  cuisineType?: string;
  avgDailyFootTraffic: number;
  avgDailyOrders: number;
  packagingVolume: number;
  demographics?: string;
  tags: string | string[];
  isActive: boolean;
  partnerSince?: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  advertiserId: string;
  name: string;
  startDate?: string;
  endDate?: string;
  status: string;
  packagingQuantity: number;
  packagingType?: string;
  adFormat?: string;
  budget?: number;
  totalImpressions: number;
  estimatedImpressions: number;
  createdAt: string;
  advertiser?: Advertiser;
  placements?: Placement[];
}

export interface Placement {
  id: string;
  campaignId: string;
  cafeId: string;
  matchScore: number;
  matchReason: string;
  status: string;
  estimatedDailyImpressions: number;
  actualImpressions: number;
  cafe?: Restaurant;
}

export interface Recommendation {
  cafe: Restaurant;
  matchScore: number;
  scoreBreakdown: Record<string, number>;
  matchReason: string;
  // ML-enhanced fields
  mlScore?: number | null;
  mlScanRate?: number | null;
  ruleBasedScore?: number | null;
  isMLEnhanced?: boolean;
}

export interface PackagingBatch {
  id: string;
  campaignId: string;
  packagingType: string;
  quantityProduced: number;
  quantityShipped: number;
  productionDate?: string;
  estimatedReady?: string;
  status: string;
  campaign?: { id: string; name: string; advertiser?: { businessName: string } };
  _count?: { inventory: number };
}

export interface InventoryItem {
  id: string;
  batchId: string;
  cafeId: string;
  quantityAllocated: number;
  quantityUsed: number;
  quantityRemaining: number;
  lastRestockDate?: string;
  estimatedRunout?: string;
  cafe?: { id: string; name: string; suburb: string };
  batch?: PackagingBatch;
}

export interface AnalyticsOverview {
  advertisers: { total: number; active: number };
  restaurants: { total: number; active: number };
  campaigns: { total: number; active: number };
  leads: { total: number; open: number };
  totalImpressions: number;
}

export interface CampaignAnalytics {
  campaign: { id: string; name: string; status: string; advertiser: string; startDate?: string; endDate?: string };
  metrics: { estimatedImpressions: number; actualImpressions: number; restaurantCount: number; suburbsReached: string[]; packagesDistributed: number };
  events: Record<string, number>;
  placements: { cafe: string; suburb: string; status: string; matchScore: number; estimatedDaily: number; actual: number }[];
}

export interface CampaignPerformance {
  id: string;
  name: string;
  advertiser: string;
  industry: string;
  status: string;
  impressions: number;
  estimated: number;
  restaurants: number;
  suburbs: string[];
}

export interface RegionData {
  suburb: string;
  postcode: string;
  cafeCount: number;
  totalFootTraffic: number;
  totalOrders: number;
  totalPlacements: number;
}

export interface RevenueData {
  totalRevenue: number;
  activeRevenue: number;
  campaignCount: number;
}

// Discovered business (potential advertiser from Google Places)
export interface DiscoveredBusiness {
  googlePlaceId: string;
  name: string;
  address: string;
  suburb: string;
  postcode: string;
  lat: number;
  lng: number;
  industry: string;
  businessType: string;
  rating?: number;
  reviewCount?: number;
  websiteUrl?: string;
  googleMapsUrl?: string;
  phone?: string;
  isOpen?: boolean;
}

// QR Analytics types
export interface QROverviewAnalytics {
  totalCodes: number;
  totalScans: number;
  activeCodes: number;
  scanRate: string;
}

export interface QRLiveScan {
  id: string;
  scannedAt: string;
  deviceType?: string;
  os?: string;
  browser?: string;
  scanSuburb?: string;
  qrCode: { code: string; type: string; campaignId?: string; cafeId?: string };
}

export interface QRGeographyEntry {
  suburb: string;
  count: number;
}

export interface QRConversionFunnel {
  codesGenerated: number;
  scanned: number;
  redirected: number;
  scanRate: string;
  redirectRate: string;
}

export interface QRCampaignAnalytics {
  totalCodes: number;
  totalScans: number;
  cafeScans: number;
  advertiserScans: number;
  scanRate: string;
  deviceBreakdown: { device: string; count: number }[];
  suburbDistribution: { suburb: string; count: number }[];
}

export interface QRCafeAnalytics {
  totalCodes: number;
  totalScans: number;
  dailyScans: { date: string; count: number }[];
  peakHours: { hour: number; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
  suburbDistribution: { suburb: string; count: number }[];
}

// Portal data types
export interface CafePortalData {
  id: string;
  name: string;
  address: string;
  suburb: string;
  postcode: string;
  city: string;
  lat: number;
  lng: number;
  cuisineType?: string;
  avgDailyFootTraffic: number;
  avgDailyOrders: number;
  packagingVolume: number;
  demographics?: string;
  operatingHours?: string;
  tags: string;
  isActive: boolean;
  partnerSince: string;
  inventory?: {
    id: string;
    quantityAllocated: number;
    quantityUsed: number;
    quantityRemaining: number;
    batch?: {
      packagingType: string;
      campaign?: { id: string; name: string; status: string };
    };
  }[];
  placements?: {
    id: string;
    status: string;
    cafeId: string;
    campaign?: {
      id: string;
      name: string;
      status: string;
      advertiser?: { businessName: string };
    };
  }[];
}

export interface AdvertiserPortalData {
  id: string;
  businessName: string;
  industry: string;
  city: string;
  isActive: boolean;
  targetAudience?: TargetAudience | null;
  contactEmail?: string;
  totalImpressions: number;
  totalScans: number;
  campaigns: (Campaign & {
    placements?: (Placement & {
      cafe?: { id: string; name: string; suburb: string };
    })[];
  })[];
}
