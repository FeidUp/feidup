const API_BASE = '/api';

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
    delete: (id: string) => request<{ success: boolean }>(`/advertisers/${id}`, { method: 'DELETE' }),
  },

  restaurants: {
    list: () => request<{ success: boolean; data: Restaurant[] }>('/cafes'),
    get: (id: string) => request<{ success: boolean; data: Restaurant }>(`/cafes/${id}`),
    create: (data: Record<string, unknown>) =>
      request<{ success: boolean; data: Restaurant }>('/cafes', { method: 'POST', body: JSON.stringify(data) }),
  },

  campaigns: {
    list: () => request<{ success: boolean; data: Campaign[] }>('/campaigns'),
    get: (id: string) => request<{ success: boolean; data: Campaign }>(`/campaigns/${id}`),
    create: (data: Record<string, unknown>) =>
      request<{ success: boolean; data: Campaign }>('/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  },

  recommendations: {
    get: (advertiserId: string) =>
      request<{ success: boolean; data: Recommendation[] }>(`/recommendations?advertiser_id=${advertiserId}`),
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

export interface Advertiser {
  id: string;
  businessName: string;
  industry: string;
  targetSuburbs: string;
  targetPostcodes: string;
  targetRadiusKm?: number;
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
  lat: number;
  lng: number;
  cuisineType?: string;
  avgDailyFootTraffic: number;
  avgDailyOrders: number;
  packagingVolume: number;
  demographics?: string;
  tags: string;
  isActive: boolean;
  partnerSince: string;
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
