// Data Enrichment API Routes
// Admin-only endpoints to trigger external data enrichment
// ABS Census, Google Places, OpenStreetMap Overpass

import { Router, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { absCensusService } from '../services/enrichment/abs-census.service.js';
import { googlePlacesService } from '../services/enrichment/google-places.service.js';
import { overpassService } from '../services/enrichment/overpass.service.js';
import { advertiserDiscoveryService } from '../services/enrichment/advertiser-discovery.service.js';

const router = Router();
router.use(authenticate);
router.use(authorize('admin', 'operations'));

// ============================================================
// HEALTH CHECKS
// ============================================================

// GET /api/enrichment/health — Check all external API availability
router.get('/health', async (_req: AuthRequest, res: Response) => {
  const [google, overpass] = await Promise.all([
    googlePlacesService.healthCheck(),
    overpassService.healthCheck(),
  ]);

  res.json({
    success: true,
    data: {
      abs: { configured: true, working: true, note: 'Free API, no key required' },
      google,
      overpass,
    },
  });
});

// ============================================================
// ABS CENSUS
// ============================================================

// POST /api/enrichment/abs/suburbs — Enrich all suburbs with ABS Census data
router.post('/abs/suburbs', async (req: AuthRequest, res: Response) => {
  const useFallback = req.query.fallback === 'true';
  console.log(`[Enrichment] ABS suburb enrichment started (fallback=${useFallback})`);

  const result = await absCensusService.enrichAllSuburbs({ useFallback });

  res.json({
    success: true,
    data: {
      total: result.total,
      updated: result.updated,
      failed: result.failed,
      suburbs: result.results.map(r => ({
        suburb: r.suburb,
        population: r.population,
        medianAge: r.medianAge,
        medianIncome: r.medianIncome,
        primaryDemographic: r.primaryDemographic,
      })),
    },
  });
});

// GET /api/enrichment/abs/profiles — Get enriched suburb profiles
router.get('/abs/profiles', async (req: AuthRequest, res: Response) => {
  const city = (req.query.city as string) || 'Brisbane';
  const profiles = await absCensusService.getSuburbProfiles(city);
  res.json({ success: true, data: profiles });
});

// GET /api/enrichment/abs/sa2-codes — Get SA2 code mapping
router.get('/abs/sa2-codes', async (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: absCensusService.getSA2Codes() });
});

// ============================================================
// GOOGLE PLACES
// ============================================================

// POST /api/enrichment/google/discover/:suburb — Discover cafes in a suburb
router.post('/google/discover/:suburb', async (req: AuthRequest, res: Response) => {
  const { suburb } = req.params;
  console.log(`[Enrichment] Google Places discovery for suburb: ${suburb}`);

  const result = await googlePlacesService.discoverCafesInSuburb(suburb);

  res.json({
    success: true,
    data: {
      suburb,
      discovered: result.discovered.length,
      alreadyKnown: result.alreadyKnown,
      totalFromGoogle: result.total,
      cafes: result.discovered,
    },
  });
});

// POST /api/enrichment/google/discover-all — Discover cafes across all Brisbane suburbs
router.post('/google/discover-all', async (_req: AuthRequest, res: Response) => {
  console.log('[Enrichment] Starting full Brisbane cafe discovery via Google Places...');

  const result = await googlePlacesService.discoverAllBrisbaneCafes();

  res.json({
    success: true,
    data: {
      totalDiscovered: result.totalDiscovered,
      bySuburb: result.bySuburb,
      cafes: result.cafes,
    },
  });
});

// POST /api/enrichment/google/import — Import discovered cafes into database
router.post('/google/import', async (req: AuthRequest, res: Response) => {
  const { cafes } = req.body;
  if (!Array.isArray(cafes) || cafes.length === 0) {
    return res.status(400).json({ success: false, error: 'cafes array required in body' });
  }

  const result = await googlePlacesService.importDiscoveredCafes(cafes);
  res.json({ success: true, data: result });
});

// POST /api/enrichment/google/enrich/:cafeId — Enrich a specific cafe with Google data
router.post('/google/enrich/:cafeId', async (req: AuthRequest, res: Response) => {
  const { cafeId } = req.params;
  const result = await googlePlacesService.enrichCafe(cafeId);
  res.json({ success: true, data: result });
});

// ============================================================
// OPENSTREETMAP OVERPASS
// ============================================================

// GET /api/enrichment/osm/cafes — Get all Brisbane cafes from OSM
router.get('/osm/cafes', async (_req: AuthRequest, res: Response) => {
  console.log('[Enrichment] Fetching all Brisbane cafes from OpenStreetMap...');
  const cafes = await overpassService.getAllBrisbaneCafes();

  res.json({
    success: true,
    data: {
      count: cafes.length,
      cafes: cafes.slice(0, 100).map(c => ({
        name: c.tags?.name || 'Unnamed',
        lat: c.lat || c.center?.lat,
        lng: c.lon || c.center?.lon,
        cuisine: c.tags?.cuisine,
        openingHours: c.tags?.opening_hours,
      })),
    },
  });
});

// GET /api/enrichment/osm/context/:cafeId — Get POI context for a cafe
router.get('/osm/context/:cafeId', async (req: AuthRequest, res: Response) => {
  const { cafeId } = req.params;
  const context = await overpassService.getCafeContext(cafeId);
  if (!context) {
    return res.status(404).json({ success: false, error: 'Cafe not found' });
  }
  res.json({ success: true, data: context });
});

// POST /api/enrichment/osm/analyze-suburbs — Analyze all suburbs for POI context
router.post('/osm/analyze-suburbs', async (_req: AuthRequest, res: Response) => {
  console.log('[Enrichment] Starting OSM suburb analysis...');
  const results = await overpassService.analyzeSuburbs();
  res.json({
    success: true,
    data: {
      suburbs: results,
      summary: {
        total: results.length,
        avgCafeCount: Math.round(results.reduce((s, r) => s + r.cafeCount, 0) / results.length),
        avgFootTrafficScore: Math.round(results.reduce((s, r) => s + r.footTrafficScore, 0) / results.length),
      },
    },
  });
});

// POST /api/enrichment/osm/enrich-cafes — Enrich all cafes with OSM context tags
router.post('/osm/enrich-cafes', async (_req: AuthRequest, res: Response) => {
  console.log('[Enrichment] Starting OSM cafe enrichment...');
  const result = await overpassService.enrichAllCafes();
  res.json({ success: true, data: result });
});

// GET /api/enrichment/osm/competition-map — Get competition density map
router.get('/osm/competition-map', async (_req: AuthRequest, res: Response) => {
  const map = await overpassService.getCompetitionMap();
  res.json({ success: true, data: map });
});

// ============================================================
// ADVERTISER DISCOVERY
// ============================================================

// GET /api/enrichment/discover-advertisers/industries — List discoverable industries
router.get('/discover-advertisers/industries', async (_req: AuthRequest, res: Response) => {
  res.json({ success: true, data: advertiserDiscoveryService.getAvailableIndustries() });
});

// POST /api/enrichment/discover-advertisers/near — Discover advertisers near a location
router.post('/discover-advertisers/near', async (req: AuthRequest, res: Response) => {
  const { lat, lng, industries, radiusM } = req.body;
  if (!lat || !lng) return res.status(400).json({ success: false, error: 'lat and lng required' });

  const results = await advertiserDiscoveryService.discoverNear(lat, lng, { industries, radiusM });
  res.json({ success: true, data: { count: results.length, businesses: results } });
});

// POST /api/enrichment/discover-advertisers/search — Search by keyword (e.g. "padel brisbane")
router.post('/discover-advertisers/search', async (req: AuthRequest, res: Response) => {
  const { keyword, lat, lng, radiusM } = req.body;
  if (!keyword) return res.status(400).json({ success: false, error: 'keyword required' });

  const results = await advertiserDiscoveryService.searchByKeyword(
    keyword,
    lat || -27.4698,
    lng || 153.0251,
    radiusM || 10000
  );
  res.json({ success: true, data: { count: results.length, keyword, businesses: results } });
});

export { router as enrichmentRoutes };
