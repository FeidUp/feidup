import { Router, Request, Response } from 'express';
import { qrService } from '../services/qr.service.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';
import { ScopedRequest, scopeToAdvertiser, scopeToCafe } from '../middleware/scopeAuth.js';

const router = Router();

// GET /qr/:code - Public redirect endpoint (no auth)
// Logs scan and 302 redirects to target URL with UTM params
router.get('/:code', async (req: Request, res: Response) => {
  const { code } = req.params;
  const result = await qrService.recordScan(code, {
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    referrer: req.headers.referer,
  });

  if (!result) {
    return res.status(404).json({ success: false, error: 'QR code not found or inactive' });
  }

  res.redirect(302, result.redirectUrl);
});

export { router as qrRedirectRoutes };

// Analytics routes (all require auth)
const analyticsRouter = Router();
analyticsRouter.use(authenticate);

// GET /api/analytics/qr/campaign/:id - Campaign QR stats
analyticsRouter.get('/qr/campaign/:id', authorize('admin', 'sales', 'operations', 'advertiser'), scopeToAdvertiser, async (req: ScopedRequest, res: Response) => {
  const { id } = req.params;

  // If advertiser, verify campaign belongs to them
  if (req.scopedAdvertiserId) {
    const { prisma } = await import('../lib/prisma.js');
    const campaign = await prisma.campaign.findUnique({ where: { id }, select: { advertiserId: true } });
    if (!campaign || campaign.advertiserId !== req.scopedAdvertiserId) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }
  }

  const data = await qrService.getCampaignAnalytics(id);
  res.json({ success: true, data });
});

// GET /api/analytics/qr/cafe/:id - Cafe QR stats
analyticsRouter.get('/qr/cafe/:id', authorize('admin', 'sales', 'operations', 'restaurant'), scopeToCafe, async (req: ScopedRequest, res: Response) => {
  const { id } = req.params;

  // If restaurant, verify cafe belongs to them
  if (req.scopedCafeId && req.scopedCafeId !== id) {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }

  const data = await qrService.getCafeAnalytics(id);
  res.json({ success: true, data });
});

// GET /api/analytics/qr/overview - System-wide QR stats (internal only)
analyticsRouter.get('/qr/overview', authorize('admin', 'sales', 'operations'), async (_req: AuthRequest, res: Response) => {
  const data = await qrService.getOverviewAnalytics();
  res.json({ success: true, data });
});

// GET /api/analytics/qr/live - Last 50 scans (internal only)
analyticsRouter.get('/qr/live', authorize('admin', 'sales', 'operations'), async (_req: AuthRequest, res: Response) => {
  const data = await qrService.getLiveScans();
  res.json({ success: true, data });
});

// GET /api/analytics/qr/geography - Scan counts by suburb (internal only)
analyticsRouter.get('/qr/geography', authorize('admin', 'sales', 'operations'), async (_req: AuthRequest, res: Response) => {
  const data = await qrService.getGeographyAnalytics();
  res.json({ success: true, data });
});

// GET /api/analytics/qr/trends - 90-day scan volume (internal only)
analyticsRouter.get('/qr/trends', authorize('admin', 'sales', 'operations'), async (_req: AuthRequest, res: Response) => {
  const { prisma } = await import('../lib/prisma.js');
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const scans = await prisma.qRScan.findMany({
    where: { scannedAt: { gte: ninetyDaysAgo } },
    select: { scannedAt: true },
  });

  // Aggregate by week
  const weekMap = new Map<string, number>();
  for (const scan of scans) {
    const weekStart = new Date(scan.scannedAt);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const key = weekStart.toISOString().split('T')[0];
    weekMap.set(key, (weekMap.get(key) || 0) + 1);
  }

  const weeks = Array.from(weekMap.entries())
    .map(([week, count]) => ({ week, count }))
    .sort((a, b) => a.week.localeCompare(b.week));

  res.json({ success: true, data: { weeks, totalScans: scans.length } });
});

// GET /api/analytics/conversions - Funnel metrics (internal only)
analyticsRouter.get('/conversions', authorize('admin', 'sales', 'operations'), async (_req: AuthRequest, res: Response) => {
  const { prisma } = await import('../lib/prisma.js');
  const [totalCodes, totalScans, redirectedScans] = await Promise.all([
    prisma.qRCode.count(),
    prisma.qRScan.count(),
    prisma.qRScan.count({ where: { redirected: true } }),
  ]);

  res.json({
    success: true,
    data: {
      codesGenerated: totalCodes,
      scanned: totalScans,
      redirected: redirectedScans,
      scanRate: totalCodes > 0 ? ((totalScans / totalCodes) * 100).toFixed(1) : '0',
      redirectRate: totalScans > 0 ? ((redirectedScans / totalScans) * 100).toFixed(1) : '0',
    },
  });
});

export { analyticsRouter as qrAnalyticsRoutes };
