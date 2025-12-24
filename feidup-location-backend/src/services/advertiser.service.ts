// Advertiser Service
// Handles CRUD operations for advertisers

import { prisma } from '../lib/prisma.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import type { CreateAdvertiserInput, AdvertiserResponse, Coordinates } from '../types/index.js';

export class AdvertiserService {
  /**
   * Create a new advertiser
   */
  async create(input: CreateAdvertiserInput): Promise<AdvertiserResponse> {
    // Validate required fields
    if (!input.businessName?.trim()) {
      throw new ValidationError('Business name is required');
    }
    if (!input.industry?.trim()) {
      throw new ValidationError('Industry is required');
    }

    const advertiser = await prisma.advertiser.create({
      data: {
        businessName: input.businessName.trim(),
        industry: input.industry.toLowerCase().trim(),
        targetSuburbs: JSON.stringify(input.targetSuburbs || []),
        targetPostcodes: JSON.stringify(input.targetPostcodes || []),
        targetRadiusKm: input.targetRadiusKm,
        targetLat: input.targetLocation?.lat,
        targetLng: input.targetLocation?.lng,
        targetAudience: input.targetAudience ? JSON.stringify(input.targetAudience) : undefined,
        campaignGoal: input.campaignGoal || 'brand_awareness',
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        city: input.city || 'Brisbane',
      },
    });

    return this.formatResponse(advertiser);
  }

  /**
   * Get advertiser by ID
   */
  async getById(id: string): Promise<AdvertiserResponse> {
    const advertiser = await prisma.advertiser.findUnique({
      where: { id },
    });

    if (!advertiser) {
      throw new NotFoundError('Advertiser');
    }

    return this.formatResponse(advertiser);
  }

  /**
   * Get all advertisers
   */
  async getAll(options: {
    city?: string;
    industry?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ advertisers: AdvertiserResponse[]; total: number }> {
    const where: Record<string, unknown> = {};

    if (options.city) where.city = options.city;
    if (options.industry) where.industry = options.industry.toLowerCase();
    if (options.isActive !== undefined) where.isActive = options.isActive;

    const [advertisers, total] = await Promise.all([
      prisma.advertiser.findMany({
        where,
        take: options.limit || 50,
        skip: options.offset || 0,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.advertiser.count({ where }),
    ]);

    return {
      advertisers: advertisers.map(this.formatResponse),
      total,
    };
  }

  /**
   * Update an advertiser
   */
  async update(id: string, input: Partial<CreateAdvertiserInput>): Promise<AdvertiserResponse> {
    // Check existence
    await this.getById(id);

    const updateData: Record<string, unknown> = {};

    if (input.businessName) updateData.businessName = input.businessName.trim();
    if (input.industry) updateData.industry = input.industry.toLowerCase().trim();
    if (input.targetSuburbs) updateData.targetSuburbs = JSON.stringify(input.targetSuburbs);
    if (input.targetPostcodes) updateData.targetPostcodes = JSON.stringify(input.targetPostcodes);
    if (input.targetRadiusKm !== undefined) updateData.targetRadiusKm = input.targetRadiusKm;
    if (input.targetLocation) {
      updateData.targetLat = input.targetLocation.lat;
      updateData.targetLng = input.targetLocation.lng;
    }
    if (input.targetAudience) updateData.targetAudience = JSON.stringify(input.targetAudience);
    if (input.campaignGoal) updateData.campaignGoal = input.campaignGoal;
    if (input.contactEmail !== undefined) updateData.contactEmail = input.contactEmail;
    if (input.contactPhone !== undefined) updateData.contactPhone = input.contactPhone;
    if (input.city) updateData.city = input.city;

    const advertiser = await prisma.advertiser.update({
      where: { id },
      data: updateData,
    });

    return this.formatResponse(advertiser);
  }

  /**
   * Delete an advertiser
   */
  async delete(id: string): Promise<void> {
    await this.getById(id);
    await prisma.advertiser.delete({ where: { id } });
  }

  /**
   * Deactivate an advertiser (soft delete)
   */
  async deactivate(id: string): Promise<AdvertiserResponse> {
    await this.getById(id);

    const advertiser = await prisma.advertiser.update({
      where: { id },
      data: { isActive: false },
    });

    return this.formatResponse(advertiser);
  }

  /**
   * Format database model to API response
   */
  private formatResponse(advertiser: {
    id: string;
    businessName: string;
    industry: string;
    targetSuburbs: string;
    targetPostcodes: string;
    targetRadiusKm: number | null;
    targetLat: number | null;
    targetLng: number | null;
    targetAudience: string | null;
    campaignGoal: string;
    city: string;
    isActive: boolean;
    createdAt: Date;
  }): AdvertiserResponse {
    let targetLocation: Coordinates | null = null;
    if (advertiser.targetLat && advertiser.targetLng) {
      targetLocation = { lat: advertiser.targetLat, lng: advertiser.targetLng };
    }

    // Parse JSON strings back to arrays/objects (SQLite compatibility)
    const targetSuburbs = JSON.parse(advertiser.targetSuburbs || '[]') as string[];
    const targetPostcodes = JSON.parse(advertiser.targetPostcodes || '[]') as string[];
    const targetAudience = advertiser.targetAudience ? JSON.parse(advertiser.targetAudience) : null;

    return {
      id: advertiser.id,
      businessName: advertiser.businessName,
      industry: advertiser.industry,
      targetSuburbs,
      targetPostcodes,
      targetRadiusKm: advertiser.targetRadiusKm,
      targetLocation,
      targetAudience: targetAudience as AdvertiserResponse['targetAudience'],
      campaignGoal: advertiser.campaignGoal,
      city: advertiser.city,
      isActive: advertiser.isActive,
      createdAt: advertiser.createdAt,
    };
  }
}

export const advertiserService = new AdvertiserService();
