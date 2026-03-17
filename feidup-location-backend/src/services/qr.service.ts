import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';

function generateCode(): string {
  return crypto.randomBytes(4).toString('hex'); // 8-char hex
}

function parseUserAgent(ua: string | undefined): { deviceType: string; os: string; browser: string } {
  if (!ua) return { deviceType: 'unknown', os: 'unknown', browser: 'unknown' };

  let deviceType = 'desktop';
  if (/mobile|android|iphone|ipod/i.test(ua)) deviceType = 'mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

  let os = 'unknown';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'unknown';
  if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox/i.test(ua)) browser = 'Firefox';
  else if (/edg/i.test(ua)) browser = 'Edge';

  return { deviceType, os, browser };
}

export const qrService = {
  async createBulkQRCodes(params: {
    campaignId: string;
    cafeId: string;
    advertiserId: string;
    placementId?: string;
    cafeTargetUrl: string;
    advertiserTargetUrl: string;
    count: number;
  }) {
    const codes = [];
    for (let i = 0; i < params.count; i++) {
      // Create cafe QR code
      codes.push({
        code: generateCode(),
        type: 'cafe',
        targetUrl: params.cafeTargetUrl,
        campaignId: params.campaignId,
        cafeId: params.cafeId,
        placementId: params.placementId,
        advertiserId: params.advertiserId,
      });
      // Create advertiser QR code
      codes.push({
        code: generateCode(),
        type: 'advertiser',
        targetUrl: params.advertiserTargetUrl,
        campaignId: params.campaignId,
        cafeId: params.cafeId,
        placementId: params.placementId,
        advertiserId: params.advertiserId,
      });
    }

    const created = await prisma.qRCode.createMany({ data: codes });
    return { count: created.count };
  },

  async recordScan(code: string, req: { userAgent?: string; ip?: string; referrer?: string }) {
    const qrCode = await prisma.qRCode.findUnique({ where: { code } });
    if (!qrCode || !qrCode.isActive) return null;

    const { deviceType, os, browser } = parseUserAgent(req.userAgent);
    const sessionId = crypto.randomBytes(8).toString('hex');

    await prisma.qRScan.create({
      data: {
        qrCodeId: qrCode.id,
        deviceType,
        os,
        browser,
        userAgent: req.userAgent?.substring(0, 500),
        ipAddress: req.ip,
        referrer: req.referrer,
        sessionId,
        redirected: true,
      },
    });

    // Build redirect URL with UTM params
    const url = new URL(qrCode.targetUrl);
    url.searchParams.set('utm_source', 'feidup_cup');
    url.searchParams.set('utm_medium', 'print');
    if (qrCode.campaignId) url.searchParams.set('utm_campaign', qrCode.campaignId);
    if (qrCode.cafeId) url.searchParams.set('utm_content', qrCode.cafeId);

    return { redirectUrl: url.toString(), qrCode };
  },

  async getCampaignAnalytics(campaignId: string) {
    const qrCodes = await prisma.qRCode.findMany({
      where: { campaignId },
      include: { _count: { select: { scans: true } } },
    });

    const totalScans = qrCodes.reduce((sum, qr) => sum + qr._count.scans, 0);
    const cafeScans = qrCodes.filter(q => q.type === 'cafe').reduce((sum, qr) => sum + qr._count.scans, 0);
    const advertiserScans = qrCodes.filter(q => q.type === 'advertiser').reduce((sum, qr) => sum + qr._count.scans, 0);

    // Daily scan trend (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const qrCodeIds = qrCodes.map(q => q.id);

    const dailyScans = qrCodeIds.length > 0 ? await prisma.qRScan.groupBy({
      by: ['scannedAt'],
      where: { qrCodeId: { in: qrCodeIds }, scannedAt: { gte: thirtyDaysAgo } },
      _count: true,
    }) : [];

    // Device breakdown
    const deviceBreakdown = qrCodeIds.length > 0 ? await prisma.qRScan.groupBy({
      by: ['deviceType'],
      where: { qrCodeId: { in: qrCodeIds } },
      _count: true,
    }) : [];

    // Suburb distribution
    const suburbDistribution = qrCodeIds.length > 0 ? await prisma.qRScan.groupBy({
      by: ['scanSuburb'],
      where: { qrCodeId: { in: qrCodeIds }, scanSuburb: { not: null } },
      _count: true,
      orderBy: { _count: { qrCodeId: 'desc' } },
      take: 20,
    }) : [];

    return {
      totalCodes: qrCodes.length,
      totalScans,
      cafeScans,
      advertiserScans,
      scanRate: qrCodes.length > 0 ? ((totalScans / qrCodes.length) * 100).toFixed(1) : '0',
      deviceBreakdown: deviceBreakdown.map(d => ({ device: d.deviceType, count: d._count })),
      suburbDistribution: suburbDistribution.map(s => ({ suburb: s.scanSuburb, count: s._count })),
    };
  },

  async getCafeAnalytics(cafeId: string) {
    const qrCodes = await prisma.qRCode.findMany({
      where: { cafeId },
      include: { _count: { select: { scans: true } } },
    });

    const totalScans = qrCodes.reduce((sum, qr) => sum + qr._count.scans, 0);
    const qrCodeIds = qrCodes.map(q => q.id);

    // Daily scans (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const scans = qrCodeIds.length > 0 ? await prisma.qRScan.findMany({
      where: { qrCodeId: { in: qrCodeIds }, scannedAt: { gte: thirtyDaysAgo } },
      select: { scannedAt: true, deviceType: true, scanSuburb: true },
    }) : [];

    // Aggregate daily
    const dailyMap = new Map<string, number>();
    const hourMap = new Map<number, number>();
    const deviceMap = new Map<string, number>();
    const suburbMap = new Map<string, number>();

    for (const scan of scans) {
      const day = scan.scannedAt.toISOString().split('T')[0];
      dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
      hourMap.set(scan.scannedAt.getHours(), (hourMap.get(scan.scannedAt.getHours()) || 0) + 1);
      if (scan.deviceType) deviceMap.set(scan.deviceType, (deviceMap.get(scan.deviceType) || 0) + 1);
      if (scan.scanSuburb) suburbMap.set(scan.scanSuburb, (suburbMap.get(scan.scanSuburb) || 0) + 1);
    }

    return {
      totalCodes: qrCodes.length,
      totalScans,
      dailyScans: Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
      peakHours: Array.from(hourMap.entries()).map(([hour, count]) => ({ hour, count })).sort((a, b) => a.hour - b.hour),
      deviceBreakdown: Array.from(deviceMap.entries()).map(([device, count]) => ({ device, count })),
      suburbDistribution: Array.from(suburbMap.entries()).map(([suburb, count]) => ({ suburb, count })).sort((a, b) => b.count - a.count),
    };
  },

  async getOverviewAnalytics() {
    const [totalCodes, totalScans, activeCodes] = await Promise.all([
      prisma.qRCode.count(),
      prisma.qRScan.count(),
      prisma.qRCode.count({ where: { isActive: true } }),
    ]);

    return { totalCodes, totalScans, activeCodes, scanRate: totalCodes > 0 ? ((totalScans / totalCodes) * 100).toFixed(1) : '0' };
  },

  async getLiveScans(limit = 50) {
    return prisma.qRScan.findMany({
      take: limit,
      orderBy: { scannedAt: 'desc' },
      include: {
        qrCode: {
          select: { code: true, type: true, campaignId: true, cafeId: true },
        },
      },
    });
  },

  async getGeographyAnalytics() {
    const distribution = await prisma.qRScan.groupBy({
      by: ['scanSuburb'],
      where: { scanSuburb: { not: null } },
      _count: true,
      orderBy: { _count: { scanSuburb: 'desc' } },
    });

    return distribution.map(d => ({ suburb: d.scanSuburb, count: d._count }));
  },
};
