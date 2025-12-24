// Cafe Service
// Handles CRUD operations for cafe partners

import { prisma } from '../lib/prisma.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';
import type { CreateCafeInput, CafeResponse, CafeDemographics } from '../types/index.js';

export class CafeService {
  /**
   * Create a new cafe partner
   */
  async create(input: CreateCafeInput): Promise<CafeResponse> {
    // Validate required fields
    if (!input.name?.trim()) {
      throw new ValidationError('Cafe name is required');
    }
    if (!input.address?.trim()) {
      throw new ValidationError('Address is required');
    }
    if (!input.suburb?.trim()) {
      throw new ValidationError('Suburb is required');
    }
    if (!input.postcode?.trim()) {
      throw new ValidationError('Postcode is required');
    }
    if (!input.location?.lat || !input.location?.lng) {
      throw new ValidationError('Location coordinates (lat, lng) are required');
    }

    const cafe = await prisma.cafe.create({
      data: {
        name: input.name.trim(),
        address: input.address.trim(),
        suburb: input.suburb.trim(),
        postcode: input.postcode.trim(),
        city: input.city || 'Brisbane',
        lat: input.location.lat,
        lng: input.location.lng,
        avgDailyFootTraffic: input.avgDailyFootTraffic || 0,
        packagingVolume: input.packagingVolume || 0,
        demographics: input.demographics ? JSON.stringify(input.demographics) : undefined,
        operatingHours: input.operatingHours ? JSON.stringify(input.operatingHours) : undefined,
        tags: JSON.stringify(input.tags || []),
      },
    });

    return this.formatResponse(cafe);
  }

  /**
   * Get cafe by ID
   */
  async getById(id: string): Promise<CafeResponse> {
    const cafe = await prisma.cafe.findUnique({
      where: { id },
    });

    if (!cafe) {
      throw new NotFoundError('Cafe');
    }

    return this.formatResponse(cafe);
  }

  /**
   * Get all cafes with filtering options
   */
  async getAll(options: {
    city?: string;
    suburb?: string;
    postcode?: string;
    isActive?: boolean;
    minTraffic?: number;
    tags?: string[];
    limit?: number;
    offset?: number;
  } = {}): Promise<{ cafes: CafeResponse[]; total: number }> {
    const where: Record<string, unknown> = {};

    if (options.city) where.city = options.city;
    if (options.suburb) where.suburb = options.suburb;
    if (options.postcode) where.postcode = options.postcode;
    if (options.isActive !== undefined) where.isActive = options.isActive;
    if (options.minTraffic) {
      where.avgDailyFootTraffic = { gte: options.minTraffic };
    }
    // Note: Tag filtering with hasSome not supported in SQLite
    // Tags are filtered in-memory if needed

    const [cafes, total] = await Promise.all([
      prisma.cafe.findMany({
        where,
        take: options.limit || 50,
        skip: options.offset || 0,
        orderBy: { packagingVolume: 'desc' },
      }),
      prisma.cafe.count({ where }),
    ]);

    return {
      cafes: cafes.map(this.formatResponse),
      total,
    };
  }

  /**
   * Get cafes by suburb list
   */
  async getBySuburbs(suburbs: string[], city: string = 'Brisbane'): Promise<CafeResponse[]> {
    const cafes = await prisma.cafe.findMany({
      where: {
        city,
        suburb: { in: suburbs },
        isActive: true,
      },
      orderBy: { packagingVolume: 'desc' },
    });

    return cafes.map(this.formatResponse);
  }

  /**
   * Get cafes by postcode list
   */
  async getByPostcodes(postcodes: string[], city: string = 'Brisbane'): Promise<CafeResponse[]> {
    const cafes = await prisma.cafe.findMany({
      where: {
        city,
        postcode: { in: postcodes },
        isActive: true,
      },
      orderBy: { packagingVolume: 'desc' },
    });

    return cafes.map(this.formatResponse);
  }

  /**
   * Get all active cafes for a city (used by matching engine)
   */
  async getActiveForCity(city: string = 'Brisbane') {
    return prisma.cafe.findMany({
      where: {
        city,
        isActive: true,
      },
    });
  }

  /**
   * Update a cafe
   */
  async update(id: string, input: Partial<CreateCafeInput>): Promise<CafeResponse> {
    await this.getById(id);

    const updateData: Record<string, unknown> = {};

    if (input.name) updateData.name = input.name.trim();
    if (input.address) updateData.address = input.address.trim();
    if (input.suburb) updateData.suburb = input.suburb.trim();
    if (input.postcode) updateData.postcode = input.postcode.trim();
    if (input.city) updateData.city = input.city;
    if (input.location) {
      updateData.lat = input.location.lat;
      updateData.lng = input.location.lng;
    }
    if (input.avgDailyFootTraffic !== undefined) {
      updateData.avgDailyFootTraffic = input.avgDailyFootTraffic;
    }
    if (input.packagingVolume !== undefined) {
      updateData.packagingVolume = input.packagingVolume;
    }
    if (input.demographics) updateData.demographics = JSON.stringify(input.demographics);
    if (input.operatingHours) updateData.operatingHours = JSON.stringify(input.operatingHours);
    if (input.tags) updateData.tags = JSON.stringify(input.tags);

    const cafe = await prisma.cafe.update({
      where: { id },
      data: updateData,
    });

    return this.formatResponse(cafe);
  }

  /**
   * Update cafe metrics
   */
  async updateMetrics(
    id: string,
    metrics: { avgDailyFootTraffic?: number; packagingVolume?: number }
  ): Promise<CafeResponse> {
    await this.getById(id);

    const cafe = await prisma.cafe.update({
      where: { id },
      data: metrics,
    });

    return this.formatResponse(cafe);
  }

  /**
   * Delete a cafe
   */
  async delete(id: string): Promise<void> {
    await this.getById(id);
    await prisma.cafe.delete({ where: { id } });
  }

  /**
   * Deactivate a cafe (soft delete)
   */
  async deactivate(id: string): Promise<CafeResponse> {
    await this.getById(id);

    const cafe = await prisma.cafe.update({
      where: { id },
      data: { isActive: false },
    });

    return this.formatResponse(cafe);
  }

  /**
   * Get suburb statistics
   */
  async getSuburbStats(city: string = 'Brisbane') {
    const cafes = await prisma.cafe.findMany({
      where: { city, isActive: true },
      select: {
        suburb: true,
        postcode: true,
        avgDailyFootTraffic: true,
        packagingVolume: true,
      },
    });

    // Group by suburb
    const suburbMap = new Map<
      string,
      { count: number; totalTraffic: number; totalVolume: number; postcode: string }
    >();

    for (const cafe of cafes) {
      const existing = suburbMap.get(cafe.suburb);
      if (existing) {
        existing.count++;
        existing.totalTraffic += cafe.avgDailyFootTraffic;
        existing.totalVolume += cafe.packagingVolume;
      } else {
        suburbMap.set(cafe.suburb, {
          count: 1,
          totalTraffic: cafe.avgDailyFootTraffic,
          totalVolume: cafe.packagingVolume,
          postcode: cafe.postcode,
        });
      }
    }

    return Array.from(suburbMap.entries())
      .map(([suburb, stats]) => ({
        suburb,
        postcode: stats.postcode,
        cafeCount: stats.count,
        avgDailyTraffic: Math.round(stats.totalTraffic / stats.count),
        totalDailyImpressions: stats.totalVolume,
      }))
      .sort((a, b) => b.totalDailyImpressions - a.totalDailyImpressions);
  }

  /**
   * Format database model to API response
   */
  private formatResponse(cafe: {
    id: string;
    name: string;
    address: string;
    suburb: string;
    postcode: string;
    city: string;
    lat: number;
    lng: number;
    avgDailyFootTraffic: number;
    packagingVolume: number;
    demographics: string | null;
    tags: string;
    isActive: boolean;
    createdAt: Date;
  }): CafeResponse {
    // Parse JSON strings back to objects/arrays (SQLite compatibility)
    const demographics = cafe.demographics ? JSON.parse(cafe.demographics) : null;
    const tags = JSON.parse(cafe.tags || '[]') as string[];

    return {
      id: cafe.id,
      name: cafe.name,
      address: cafe.address,
      suburb: cafe.suburb,
      postcode: cafe.postcode,
      city: cafe.city,
      location: { lat: cafe.lat, lng: cafe.lng },
      avgDailyFootTraffic: cafe.avgDailyFootTraffic,
      packagingVolume: cafe.packagingVolume,
      demographics: demographics as CafeDemographics | null,
      tags,
      isActive: cafe.isActive,
      createdAt: cafe.createdAt,
    };
  }
}

export const cafeService = new CafeService();
