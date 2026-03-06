import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

// GET /analytics/overview - System-wide stats
router.get('/overview', authorize('admin', 'sales', 'operations'), async (_req, res) => {
  const [
    totalAdvertisers,
    activeAdvertisers,
    totalRestaurants,
    activeRestaurants,
    totalCampaigns,
    activeCampaigns,
    totalLeads,
    openLeads,
    totalImpressions,
  ] = await Promise.all([
    prisma.advertiser.count(),
    prisma.advertiser.count({ where: { isActive: true } }),
    prisma.cafe.count(),
    prisma.cafe.count({ where: { isActive: true } }),
    prisma.campaign.count(),
    prisma.campaign.count({ where: { status: 'active' } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { stage: { notIn: ['signed', 'active_client', 'lost'] } } }),
    prisma.campaign.aggregate({ _sum: { totalImpressions: true } }),
  ]);
  
  res.json({
    success: true,
    data: {
      advertisers: { total: totalAdvertisers, active: activeAdvertisers },
      restaurants: { total: totalRestaurants, active: activeRestaurants },
      campaigns: { total: totalCampaigns, active: activeCampaigns },
      leads: { total: totalLeads, open: openLeads },
      totalImpressions: totalImpressions._sum.totalImpressions || 0,
    },
  });
});

// GET /analytics/campaign/:id - Campaign-specific analytics
router.get('/campaign/:id', authorize('admin', 'sales', 'operations', 'advertiser'), async (req, res) => {
  const campaign = await prisma.campaign.findUnique({
    where: { id: req.params.id },
    include: {
      advertiser: { select: { businessName: true } },
      placements: {
        include: { cafe: { select: { id: true, name: true, suburb: true } } },
      },
    },
  });
  
  if (!campaign) {
    return res.status(404).json({ success: false, error: 'Campaign not found' });
  }
  
  const totalActualImpressions = campaign.placements.reduce((sum, p) => sum + p.actualImpressions, 0);
  const restaurantCount = campaign.placements.length;
  const suburbsReached = [...new Set(campaign.placements.map(p => p.cafe.suburb))];
  
  // Event counts from analytics_events
  const events = await prisma.analyticsEvent.groupBy({
    by: ['eventType'],
    where: { campaignId: req.params.id },
    _count: true,
  });
  
  res.json({
    success: true,
    data: {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        advertiser: campaign.advertiser.businessName,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
      },
      metrics: {
        estimatedImpressions: campaign.estimatedImpressions,
        actualImpressions: totalActualImpressions,
        restaurantCount,
        suburbsReached,
        packagesDistributed: campaign.totalImpressions,
      },
      events: events.reduce((acc, e) => ({ ...acc, [e.eventType]: e._count }), {}),
      placements: campaign.placements.map(p => ({
        cafe: p.cafe.name,
        suburb: p.cafe.suburb,
        status: p.status,
        matchScore: p.matchScore,
        estimatedDaily: p.estimatedDailyImpressions,
        actual: p.actualImpressions,
      })),
    },
  });
});

// GET /analytics/region - Suburb-level analytics
router.get('/region', authorize('admin', 'sales', 'operations'), async (_req, res) => {
  const cafes = await prisma.cafe.findMany({
    where: { isActive: true },
    select: {
      suburb: true,
      postcode: true,
      avgDailyFootTraffic: true,
      avgDailyOrders: true,
      packagingVolume: true,
      _count: { select: { placements: true } },
    },
  });
  
  // Aggregate by suburb
  const suburbMap = new Map<string, {
    suburb: string; postcode: string; cafeCount: number;
    totalFootTraffic: number; totalOrders: number; totalPlacements: number;
  }>();
  
  for (const cafe of cafes) {
    const existing = suburbMap.get(cafe.suburb) || {
      suburb: cafe.suburb, postcode: cafe.postcode, cafeCount: 0,
      totalFootTraffic: 0, totalOrders: 0, totalPlacements: 0,
    };
    existing.cafeCount++;
    existing.totalFootTraffic += cafe.avgDailyFootTraffic;
    existing.totalOrders += cafe.avgDailyOrders;
    existing.totalPlacements += cafe._count.placements;
    suburbMap.set(cafe.suburb, existing);
  }
  
  res.json({
    success: true,
    data: Array.from(suburbMap.values()).sort((a, b) => b.cafeCount - a.cafeCount),
  });
});

// GET /analytics/performance - Top performing campaigns
router.get('/performance', authorize('admin', 'sales'), async (_req, res) => {
  const campaigns = await prisma.campaign.findMany({
    where: { status: { in: ['active', 'completed'] } },
    include: {
      advertiser: { select: { businessName: true, industry: true } },
      placements: { select: { actualImpressions: true, cafe: { select: { suburb: true } } } },
    },
    orderBy: { totalImpressions: 'desc' },
    take: 20,
  });
  
  const data = campaigns.map(c => ({
    id: c.id,
    name: c.name,
    advertiser: c.advertiser.businessName,
    industry: c.advertiser.industry,
    status: c.status,
    impressions: c.totalImpressions,
    estimated: c.estimatedImpressions,
    restaurants: c.placements.length,
    suburbs: [...new Set(c.placements.map(p => p.cafe.suburb))],
  }));
  
  res.json({ success: true, data });
});

// GET /analytics/revenue - Revenue by month (placeholder with campaign budget data)
router.get('/revenue', authorize('admin'), async (_req, res) => {
  const campaigns = await prisma.campaign.findMany({
    where: { budget: { not: null } },
    select: { budget: true, status: true, startDate: true, createdAt: true },
  });
  
  const totalRevenue = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const activeRevenue = campaigns.filter(c => c.status === 'active').reduce((sum, c) => sum + (c.budget || 0), 0);
  
  res.json({
    success: true,
    data: {
      totalRevenue,
      activeRevenue,
      campaignCount: campaigns.length,
    },
  });
});

export { router as analyticsRoutes };
