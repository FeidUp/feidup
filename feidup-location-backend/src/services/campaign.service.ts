// Campaign Service
// Handles campaign creation and placement management

import { prisma } from '../lib/prisma.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import { recommendationService } from './recommendation.service.js';
import type { CreateCampaignInput, CampaignResponse, PlacementSummary } from '../types/index.js';

export class CampaignService {
  /**
   * Create a new campaign with auto-selected or specified cafes
   */
  async create(input: CreateCampaignInput): Promise<CampaignResponse> {
    // Validate
    if (!input.advertiserId?.trim()) {
      throw new ValidationError('Advertiser ID is required');
    }
    if (!input.name?.trim()) {
      throw new ValidationError('Campaign name is required');
    }

    // Verify advertiser exists
    const advertiser = await prisma.advertiser.findUnique({
      where: { id: input.advertiserId },
    });

    if (!advertiser) {
      throw new NotFoundError('Advertiser');
    }

    // Get cafe placements
    let placements: { cafeId: string; matchScore: number; matchReason: string }[] = [];

    if (input.autoSelectCafes) {
      // Auto-select based on recommendations
      const recommendations = await recommendationService.getRecommendations(input.advertiserId, {
        limit: 10,
        minScore: 40,
      });

      placements = recommendations.recommendations.map((rec) => ({
        cafeId: rec.cafeId,
        matchScore: rec.matchScore,
        matchReason: rec.matchReason,
      }));
    } else if (input.cafeIds?.length) {
      // Use specified cafes - score each one
      for (const cafeId of input.cafeIds) {
        try {
          const explanation = await recommendationService.explainRecommendation(
            input.advertiserId,
            cafeId
          );
          placements.push({
            cafeId,
            matchScore: explanation.analysis.finalScore,
            matchReason: explanation.analysis.reasons[0] || 'Manually selected',
          });
        } catch {
          // Cafe might not exist, skip it
          console.warn(`Cafe ${cafeId} not found, skipping`);
        }
      }
    }

    // Calculate estimated impressions
    const cafeIds = placements.map((p) => p.cafeId);
    const cafes = await prisma.cafe.findMany({
      where: { id: { in: cafeIds } },
      select: { id: true, packagingVolume: true },
    });

    const cafeVolumeMap = new Map(cafes.map((c) => [c.id, c.packagingVolume]));
    const estimatedDailyTotal = placements.reduce(
      (sum, p) => sum + (cafeVolumeMap.get(p.cafeId) || 0),
      0
    );

    // Calculate campaign duration in days
    let durationDays = 30; // Default
    if (input.startDate && input.endDate) {
      durationDays = Math.ceil(
        (new Date(input.endDate).getTime() - new Date(input.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
    }

    const estimatedImpressions = estimatedDailyTotal * durationDays;

    // Parse advertiser JSON strings for fallback values
    const advertiserSuburbs = JSON.parse(advertiser.targetSuburbs || '[]') as string[];
    const advertiserPostcodes = JSON.parse(advertiser.targetPostcodes || '[]') as string[];

    // Create campaign with placements
    const campaign = await prisma.campaign.create({
      data: {
        advertiserId: input.advertiserId,
        name: input.name.trim(),
        startDate: input.startDate,
        endDate: input.endDate,
        status: 'draft',
        targetSuburbs: JSON.stringify(input.targetSuburbs || advertiserSuburbs),
        targetPostcodes: JSON.stringify(input.targetPostcodes || advertiserPostcodes),
        targetRadiusKm: input.targetRadiusKm || advertiser.targetRadiusKm,
        estimatedImpressions,
        placements: {
          create: placements.map((p) => ({
            cafeId: p.cafeId,
            matchScore: p.matchScore,
            matchReason: p.matchReason,
            scoreBreakdown: JSON.stringify({}),
            status: 'proposed',
            estimatedDailyImpressions: cafeVolumeMap.get(p.cafeId) || 0,
          })),
        },
      },
      include: {
        placements: {
          include: {
            cafe: true,
          },
        },
      },
    });

    return this.formatResponse(campaign);
  }

  /**
   * Get campaign by ID
   */
  async getById(id: string): Promise<CampaignResponse> {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        placements: {
          include: { cafe: true },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundError('Campaign');
    }

    return this.formatResponse(campaign);
  }

  /**
   * Get all campaigns for an advertiser
   */
  async getByAdvertiser(
    advertiserId: string,
    options: { status?: string; limit?: number; offset?: number } = {}
  ): Promise<{ campaigns: CampaignResponse[]; total: number }> {
    const where: Record<string, unknown> = { advertiserId };
    if (options.status) where.status = options.status;

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        take: options.limit || 50,
        skip: options.offset || 0,
        orderBy: { createdAt: 'desc' },
        include: {
          placements: {
            include: { cafe: true },
          },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    return {
      campaigns: campaigns.map(this.formatResponse),
      total,
    };
  }

  /**
   * Update campaign status
   */
  async updateStatus(id: string, status: string): Promise<CampaignResponse> {
    const validStatuses = ['draft', 'proposed', 'active', 'paused', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    await this.getById(id);

    const campaign = await prisma.campaign.update({
      where: { id },
      data: { status },
      include: {
        placements: {
          include: { cafe: true },
        },
      },
    });

    return this.formatResponse(campaign);
  }

  /**
   * Add a placement to a campaign
   */
  async addPlacement(
    campaignId: string,
    cafeId: string
  ): Promise<PlacementSummary> {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundError('Campaign');
    }

    const cafe = await prisma.cafe.findUnique({
      where: { id: cafeId },
    });

    if (!cafe) {
      throw new NotFoundError('Cafe');
    }

    // Check for existing placement
    const existing = await prisma.placement.findUnique({
      where: {
        campaignId_cafeId: { campaignId, cafeId },
      },
    });

    if (existing) {
      throw new ValidationError('Placement already exists for this cafe in this campaign');
    }

    // Get match score
    const explanation = await recommendationService.explainRecommendation(
      campaign.advertiserId,
      cafeId
    );

    const placement = await prisma.placement.create({
      data: {
        campaignId,
        cafeId,
        matchScore: explanation.analysis.finalScore,
        matchReason: explanation.analysis.reasons[0] || 'Manually added',
        scoreBreakdown: JSON.stringify(explanation.analysis.scoreBreakdown),
        status: 'proposed',
        estimatedDailyImpressions: cafe.packagingVolume,
      },
    });

    return {
      id: placement.id,
      cafeId: placement.cafeId,
      cafeName: cafe.name,
      matchScore: placement.matchScore,
      matchReason: placement.matchReason,
      status: placement.status,
      estimatedDailyImpressions: placement.estimatedDailyImpressions,
    };
  }

  /**
   * Update placement status
   */
  async updatePlacementStatus(
    placementId: string,
    status: string
  ): Promise<PlacementSummary> {
    const validStatuses = ['proposed', 'accepted', 'rejected', 'active', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const placement = await prisma.placement.update({
      where: { id: placementId },
      data: { status },
      include: { cafe: true },
    });

    return {
      id: placement.id,
      cafeId: placement.cafeId,
      cafeName: placement.cafe.name,
      matchScore: placement.matchScore,
      matchReason: placement.matchReason,
      status: placement.status,
      estimatedDailyImpressions: placement.estimatedDailyImpressions,
    };
  }

  /**
   * Delete a campaign
   */
  async delete(id: string): Promise<void> {
    await this.getById(id);
    await prisma.campaign.delete({ where: { id } });
  }

  /**
   * Format database model to API response
   */
  private formatResponse(campaign: {
    id: string;
    advertiserId: string;
    name: string;
    status: string;
    startDate: Date | null;
    endDate: Date | null;
    targetSuburbs: string;
    targetPostcodes: string;
    estimatedImpressions: number;
    createdAt: Date;
    placements: Array<{
      id: string;
      cafeId: string;
      matchScore: number;
      matchReason: string;
      status: string;
      estimatedDailyImpressions: number;
      cafe: { name: string };
    }>;
  }): CampaignResponse {
    // Parse JSON strings from SQLite
    const targetSuburbs = JSON.parse(campaign.targetSuburbs || '[]') as string[];
    const targetPostcodes = JSON.parse(campaign.targetPostcodes || '[]') as string[];

    return {
      id: campaign.id,
      advertiserId: campaign.advertiserId,
      name: campaign.name,
      status: campaign.status,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      targetSuburbs,
      targetPostcodes,
      estimatedImpressions: campaign.estimatedImpressions,
      placements: campaign.placements.map((p) => ({
        id: p.id,
        cafeId: p.cafeId,
        cafeName: p.cafe.name,
        matchScore: p.matchScore,
        matchReason: p.matchReason,
        status: p.status,
        estimatedDailyImpressions: p.estimatedDailyImpressions,
      })),
      createdAt: campaign.createdAt,
    };
  }
}

export const campaignService = new CampaignService();
