// Google Maps Places API Integration
// Discovers real cafes in Brisbane and enriches existing cafe data
//
// How we use this:
// 1. Discovery: Search for cafes in target suburbs to build our partner network
// 2. Enrichment: Pull ratings, review counts, price levels for existing cafes
// 3. Prospecting: Identify high-traffic cafes we should reach out to
// 4. Validation: Verify cafe claims (hours, address) against Google data

import { config } from '../../config/index.js';
import { prisma } from '../../lib/prisma.js';
import { fetchWithRetry, RateLimiter, processBatch } from './http-client.js';

const PLACES_API_V1 = 'https://places.googleapis.com/v1';
const rateLimiter = new RateLimiter({ maxRequestsPerSecond: 5 });

// Brisbane bounding box for searches
const BRISBANE_BOUNDS = {
  sw: { lat: -27.65, lng: 152.85 },
  ne: { lat: -27.30, lng: 153.20 },
};

interface GooglePlace {
  id: string;
  displayName?: { text: string; languageCode?: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  currentOpeningHours?: {
    openNow?: boolean;
    weekdayDescriptions?: string[];
    periods?: Array<{
      open?: { day: number; hour: number; minute: number };
      close?: { day: number; hour: number; minute: number };
    }>;
  };
  types?: string[];
  websiteUri?: string;
  googleMapsUri?: string;
  businessStatus?: string;
  primaryType?: string;
}

interface DiscoveredCafe {
  googlePlaceId: string;
  name: string;
  address: string;
  suburb: string;
  postcode: string;
  lat: number;
  lng: number;
  rating?: number;
  reviewCount?: number;
  priceLevel?: string;
  websiteUrl?: string;
  googleMapsUrl?: string;
  types: string[];
  businessStatus?: string;
  isOpen?: boolean;
  openingHours?: Record<string, { open: string; close: string }>;
  estimatedFootTraffic: number; // Estimated from rating + review count
}

/**
 * Estimate daily foot traffic from Google review data
 * Industry heuristic: ~1% of visitors leave reviews
 * So reviewCount * 100 / yearsOpen ≈ annual visitors, / 365 = daily
 * We simplify: reviewCount * 0.5-2 depending on rating as a proxy
 */
function estimateFootTraffic(reviewCount: number, rating: number): number {
  if (!reviewCount) return 100; // Minimum estimate
  // Higher-rated places get more foot traffic per review
  const multiplier = rating >= 4.5 ? 2.0 : rating >= 4.0 ? 1.5 : rating >= 3.5 ? 1.0 : 0.7;
  // Reviews accumulate over years, estimate daily from total
  const dailyEstimate = Math.round((reviewCount * multiplier) / 365 * 10);
  return Math.max(50, Math.min(1500, dailyEstimate));
}

/**
 * Extract suburb and postcode from a formatted Australian address
 */
function parseAustralianAddress(address: string): { suburb: string; postcode: string } {
  // Pattern: "... SUBURB STATE POSTCODE, Australia" or "... SUBURB QLD POSTCODE"
  const match = address.match(/,?\s*([A-Za-z\s]+?)\s+(?:QLD|Queensland)\s+(\d{4})/i);
  if (match) {
    return { suburb: match[1].trim(), postcode: match[2] };
  }
  // Fallback: try to extract just postcode
  const postcodeMatch = address.match(/\b(\d{4})\b/);
  return {
    suburb: 'Unknown',
    postcode: postcodeMatch ? postcodeMatch[1] : '4000',
  };
}

/**
 * Parse Google opening hours into our format
 */
function parseOpeningHours(
  periods?: Array<{
    open?: { day: number; hour: number; minute: number };
    close?: { day: number; hour: number; minute: number };
  }>
): Record<string, { open: string; close: string }> | undefined {
  if (!periods || periods.length === 0) return undefined;

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const hours: Record<string, { open: string; close: string }> = {};

  for (const period of periods) {
    if (period.open && period.close) {
      const dayName = dayNames[period.open.day];
      if (dayName) {
        hours[dayName] = {
          open: `${String(period.open.hour).padStart(2, '0')}:${String(period.open.minute).padStart(2, '0')}`,
          close: `${String(period.close.hour).padStart(2, '0')}:${String(period.close.minute).padStart(2, '0')}`,
        };
      }
    }
  }

  return Object.keys(hours).length > 0 ? hours : undefined;
}

/**
 * Search for cafes near a location using Places API (New)
 */
async function searchNearbyCafes(
  lat: number,
  lng: number,
  radiusM: number = 2000
): Promise<GooglePlace[]> {
  const apiKey = config.googleMapsApiKey;
  if (!apiKey) {
    console.warn('[GooglePlaces] No API key configured (GOOGLE_MAPS_API_KEY)');
    return [];
  }

  await rateLimiter.acquire();
  try {
    const result = await fetchWithRetry<{ places?: GooglePlace[] }>(
      `${PLACES_API_V1}/places:searchNearby`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.priceLevel,places.currentOpeningHours,places.types,places.websiteUri,places.googleMapsUri,places.businessStatus,places.primaryType',
        },
        body: JSON.stringify({
          includedTypes: ['cafe', 'coffee_shop'],
          locationRestriction: {
            circle: {
              center: { latitude: lat, longitude: lng },
              radius: radiusM,
            },
          },
          maxResultCount: 20,
          rankPreference: 'POPULARITY',
        }),
      }
    );

    return result.data.places || [];
  } catch (err) {
    console.error(`[GooglePlaces] Search failed for (${lat}, ${lng}):`, err instanceof Error ? err.message : err);
    return [];
  } finally {
    rateLimiter.release();
  }
}

/**
 * Get detailed place info by ID
 */
async function getPlaceDetails(placeId: string): Promise<GooglePlace | null> {
  const apiKey = config.googleMapsApiKey;
  if (!apiKey) return null;

  await rateLimiter.acquire();
  try {
    const result = await fetchWithRetry<GooglePlace>(
      `${PLACES_API_V1}/places/${placeId}`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,rating,userRatingCount,priceLevel,currentOpeningHours,types,websiteUri,googleMapsUri,businessStatus,primaryType',
        },
      }
    );
    return result.data;
  } catch (err) {
    console.error(`[GooglePlaces] Details failed for ${placeId}:`, err instanceof Error ? err.message : err);
    return null;
  } finally {
    rateLimiter.release();
  }
}

/**
 * Convert a Google Place to our DiscoveredCafe format
 */
function toDiscoveredCafe(place: GooglePlace): DiscoveredCafe | null {
  if (!place.displayName?.text || !place.location) return null;

  const address = place.formattedAddress || '';
  const { suburb, postcode } = parseAustralianAddress(address);
  const rating = place.rating || 0;
  const reviewCount = place.userRatingCount || 0;

  return {
    googlePlaceId: place.id,
    name: place.displayName.text,
    address,
    suburb,
    postcode,
    lat: place.location.latitude,
    lng: place.location.longitude,
    rating,
    reviewCount,
    priceLevel: place.priceLevel,
    websiteUrl: place.websiteUri,
    googleMapsUrl: place.googleMapsUri,
    types: place.types || [],
    businessStatus: place.businessStatus,
    isOpen: place.currentOpeningHours?.openNow,
    openingHours: parseOpeningHours(place.currentOpeningHours?.periods),
    estimatedFootTraffic: estimateFootTraffic(reviewCount, rating),
  };
}

export const googlePlacesService = {
  /**
   * Discover cafes in a specific Brisbane suburb
   * Returns cafes found but NOT yet in our database
   */
  async discoverCafesInSuburb(suburb: string): Promise<{
    discovered: DiscoveredCafe[];
    alreadyKnown: number;
    total: number;
  }> {
    // Get suburb coordinates
    const suburbData = await prisma.suburbData.findFirst({
      where: { suburb, city: 'Brisbane' },
    });

    if (!suburbData) {
      return { discovered: [], alreadyKnown: 0, total: 0 };
    }

    const places = await searchNearbyCafes(suburbData.lat, suburbData.lng, 1500);
    const discovered: DiscoveredCafe[] = [];
    let alreadyKnown = 0;

    for (const place of places) {
      const cafe = toDiscoveredCafe(place);
      if (!cafe) continue;

      // Check if we already have this cafe (by name similarity in same suburb)
      const existing = await prisma.cafe.findFirst({
        where: {
          OR: [
            { name: { contains: cafe.name.split(' ')[0] }, suburb: cafe.suburb },
            { address: { contains: cafe.address.split(',')[0] } },
          ],
        },
      });

      if (existing) {
        alreadyKnown++;
      } else {
        discovered.push(cafe);
      }
    }

    return {
      discovered,
      alreadyKnown,
      total: places.length,
    };
  },

  /**
   * Discover cafes across all Brisbane suburbs
   * Big operation — processes all suburbs sequentially
   */
  async discoverAllBrisbaneCafes(options?: {
    onProgress?: (suburb: string, found: number, total: number) => void;
  }): Promise<{
    totalDiscovered: number;
    bySuburb: Record<string, number>;
    cafes: DiscoveredCafe[];
  }> {
    const suburbs = await prisma.suburbData.findMany({
      where: { city: 'Brisbane' },
    });

    const allCafes: DiscoveredCafe[] = [];
    const bySuburb: Record<string, number> = {};

    for (let i = 0; i < suburbs.length; i++) {
      const suburb = suburbs[i];
      console.log(`[GooglePlaces] Searching ${suburb.suburb} (${i + 1}/${suburbs.length})...`);

      const result = await this.discoverCafesInSuburb(suburb.suburb);
      allCafes.push(...result.discovered);
      bySuburb[suburb.suburb] = result.discovered.length;

      options?.onProgress?.(suburb.suburb, result.discovered.length, suburbs.length);

      // Rate limit between suburb searches
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return {
      totalDiscovered: allCafes.length,
      bySuburb,
      cafes: allCafes,
    };
  },

  /**
   * Import discovered cafes into the database as potential partners
   * Creates cafe records with estimated metrics from Google data
   */
  async importDiscoveredCafes(cafes: DiscoveredCafe[]): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const cafe of cafes) {
      try {
        // Skip if name already exists in same suburb
        const existing = await prisma.cafe.findFirst({
          where: { name: cafe.name, suburb: cafe.suburb },
        });
        if (existing) {
          skipped++;
          continue;
        }

        // Determine tags from Google types + rating
        const tags: string[] = [];
        if (cafe.types.includes('cafe')) tags.push('cafe');
        if (cafe.types.includes('coffee_shop')) tags.push('coffee');
        if (cafe.rating && cafe.rating >= 4.5) tags.push('premium', 'high-rated');
        else if (cafe.rating && cafe.rating >= 4.0) tags.push('popular');
        if (cafe.priceLevel === 'PRICE_LEVEL_EXPENSIVE' || cafe.priceLevel === 'PRICE_LEVEL_VERY_EXPENSIVE') {
          tags.push('premium');
        }
        if (cafe.reviewCount && cafe.reviewCount > 500) tags.push('high-traffic');

        await prisma.cafe.create({
          data: {
            name: cafe.name,
            address: cafe.address,
            suburb: cafe.suburb,
            postcode: cafe.postcode,
            city: 'Brisbane',
            lat: cafe.lat,
            lng: cafe.lng,
            avgDailyFootTraffic: cafe.estimatedFootTraffic,
            avgDailyOrders: Math.round(cafe.estimatedFootTraffic * 0.6),
            packagingVolume: Math.round(cafe.estimatedFootTraffic * 0.4),
            demographics: JSON.stringify({
              source: 'google_places',
              rating: cafe.rating,
              reviewCount: cafe.reviewCount,
              priceLevel: cafe.priceLevel,
            }),
            operatingHours: cafe.openingHours ? JSON.stringify(cafe.openingHours) : null,
            tags: JSON.stringify(tags),
          },
        });
        imported++;
      } catch (err) {
        errors.push(`Failed to import ${cafe.name}: ${err instanceof Error ? err.message : err}`);
      }
    }

    return { imported, skipped, errors };
  },

  /**
   * Enrich an existing cafe with fresh Google data (ratings, hours, status)
   */
  async enrichCafe(cafeId: string): Promise<{
    updated: boolean;
    fields: string[];
  }> {
    const apiKey = config.googleMapsApiKey;
    if (!apiKey) return { updated: false, fields: [] };

    const cafe = await prisma.cafe.findUnique({ where: { id: cafeId } });
    if (!cafe) return { updated: false, fields: [] };

    // Search for this cafe on Google
    const places = await searchNearbyCafes(cafe.lat, cafe.lng, 200);
    const match = places.find(p =>
      p.displayName?.text?.toLowerCase().includes(cafe.name.toLowerCase().split(' ')[0])
    );

    if (!match) return { updated: false, fields: [] };

    const updates: Record<string, unknown> = {};
    const fields: string[] = [];

    // Update demographics with Google data
    const existingDemo = cafe.demographics ? JSON.parse(cafe.demographics) : {};
    if (match.rating) {
      existingDemo.rating = match.rating;
      existingDemo.reviewCount = match.userRatingCount;
      existingDemo.priceLevel = match.priceLevel;
      existingDemo.lastGoogleUpdate = new Date().toISOString();
      updates.demographics = JSON.stringify(existingDemo);
      fields.push('demographics');
    }

    // Update operating hours if available
    if (match.currentOpeningHours?.periods) {
      const hours = parseOpeningHours(match.currentOpeningHours.periods);
      if (hours) {
        updates.operatingHours = JSON.stringify(hours);
        fields.push('operatingHours');
      }
    }

    if (Object.keys(updates).length > 0) {
      await prisma.cafe.update({ where: { id: cafeId }, data: updates });
    }

    return { updated: fields.length > 0, fields };
  },

  /**
   * Check if Google Places API is configured and working
   */
  async healthCheck(): Promise<{
    configured: boolean;
    working: boolean;
    error?: string;
  }> {
    if (!config.googleMapsApiKey) {
      return { configured: false, working: false, error: 'GOOGLE_MAPS_API_KEY not set' };
    }

    try {
      const places = await searchNearbyCafes(-27.4698, 153.0251, 500); // Brisbane CBD
      return { configured: true, working: places.length > 0 };
    } catch (err) {
      return { configured: true, working: false, error: err instanceof Error ? err.message : String(err) };
    }
  },
};
