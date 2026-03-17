// OpenStreetMap Overpass API Integration
// Free, no authentication required
// Maps cafe density, nearby POIs, competition, and contextual data
//
// How we use this:
// 1. Cafe density mapping: How many cafes are in each suburb (competition)
// 2. POI context: Universities, offices, shopping centers nearby each cafe
// 3. Walk traffic generators: Train stations, bus stops, parks nearby
// 4. Competition analysis: Density of similar businesses near each cafe
// 5. Matching engine enhancement: POI context feeds into relevance scoring

import { prisma } from '../../lib/prisma.js';
import { fetchWithRetry, RateLimiter, processBatch } from './http-client.js';
import { getDistance } from 'geolib';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const rateLimiter = new RateLimiter({ maxRequestsPerSecond: 1 }); // Overpass is strict

// Brisbane bounding box
const BRISBANE_BBOX = '-27.65,152.85,-27.30,153.20';

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

interface SuburbPOIContext {
  suburb: string;
  cafeCount: number;
  restaurantCount: number;
  universityCount: number;
  officeCount: number;
  shopCount: number;
  transitStopCount: number;
  parkCount: number;
  competitionDensity: 'low' | 'medium' | 'high' | 'very_high';
  footTrafficScore: number; // 0-100 based on nearby POIs
  nearbyPOIs: Array<{
    name: string;
    type: string;
    lat: number;
    lng: number;
    distanceM?: number;
  }>;
}

interface CafeContext {
  cafeId: string;
  nearbyCompetitors: number;
  nearbyUniversities: Array<{ name: string; distanceM: number }>;
  nearbyOffices: Array<{ name: string; distanceM: number }>;
  nearbyTransit: Array<{ name: string; distanceM: number }>;
  contextScore: number; // 0-100, higher = better location context
  contextTags: string[]; // Tags derived from nearby POIs
}

/**
 * Execute an Overpass QL query
 */
async function queryOverpass(query: string): Promise<OverpassElement[]> {
  await rateLimiter.acquire();
  try {
    const result = await fetchWithRetry<OverpassResponse>(
      OVERPASS_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      },
      { maxRetries: 2, baseDelayMs: 5000, maxDelayMs: 30000 }
    );
    return result.data.elements || [];
  } catch (err) {
    console.error('[Overpass] Query failed:', err instanceof Error ? err.message : err);
    return [];
  } finally {
    rateLimiter.release();
  }
}

/**
 * Calculate distance between two points in meters
 */
function distanceM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return getDistance(
    { latitude: lat1, longitude: lng1 },
    { latitude: lat2, longitude: lng2 }
  );
}

/**
 * Classify competition density based on cafe count in area
 */
function classifyCompetition(cafeCount: number): 'low' | 'medium' | 'high' | 'very_high' {
  if (cafeCount <= 3) return 'low';
  if (cafeCount <= 8) return 'medium';
  if (cafeCount <= 15) return 'high';
  return 'very_high';
}

/**
 * Calculate foot traffic score based on nearby POIs
 */
function calculateFootTrafficScore(context: {
  universityCount: number;
  officeCount: number;
  shopCount: number;
  transitStopCount: number;
  parkCount: number;
}): number {
  let score = 0;
  score += Math.min(30, context.universityCount * 15); // Unis are huge traffic generators
  score += Math.min(25, context.officeCount * 5);
  score += Math.min(20, context.shopCount * 3);
  score += Math.min(15, context.transitStopCount * 3);
  score += Math.min(10, context.parkCount * 2);
  return Math.min(100, score);
}

export const overpassService = {
  /**
   * Get all cafes/coffee shops in Brisbane from OpenStreetMap
   */
  async getAllBrisbaneCafes(): Promise<OverpassElement[]> {
    const query = `
      [out:json][timeout:60];
      (
        node["amenity"="cafe"](${BRISBANE_BBOX});
        way["amenity"="cafe"](${BRISBANE_BBOX});
        node["cuisine"~"coffee"](${BRISBANE_BBOX});
      );
      out center body;
    `;
    return queryOverpass(query);
  },

  /**
   * Get POI context for a specific location (within 1km radius)
   */
  async getPOIContext(lat: number, lng: number, radiusM: number = 1000): Promise<{
    cafes: OverpassElement[];
    universities: OverpassElement[];
    offices: OverpassElement[];
    shops: OverpassElement[];
    transit: OverpassElement[];
    parks: OverpassElement[];
  }> {
    // Single query to get all POI types at once (more efficient)
    const query = `
      [out:json][timeout:60];
      (
        node["amenity"="cafe"](around:${radiusM},${lat},${lng});
        way["amenity"="cafe"](around:${radiusM},${lat},${lng});
        node["amenity"="university"](around:${radiusM},${lat},${lng});
        way["amenity"="university"](around:${radiusM},${lat},${lng});
        node["office"](around:${radiusM},${lat},${lng});
        way["office"](around:${radiusM},${lat},${lng});
        node["shop"](around:${radiusM},${lat},${lng});
        way["shop"](around:${radiusM},${lat},${lng});
        node["public_transport"="station"](around:${radiusM},${lat},${lng});
        node["railway"="station"](around:${radiusM},${lat},${lng});
        node["highway"="bus_stop"](around:${radiusM},${lat},${lng});
        node["leisure"="park"](around:${radiusM},${lat},${lng});
        way["leisure"="park"](around:${radiusM},${lat},${lng});
      );
      out center body;
    `;

    const elements = await queryOverpass(query);

    // Categorize results
    const categorize = (el: OverpassElement): string => {
      const tags = el.tags || {};
      if (tags.amenity === 'cafe' || tags.cuisine?.includes('coffee')) return 'cafe';
      if (tags.amenity === 'university') return 'university';
      if (tags.office) return 'office';
      if (tags.shop) return 'shop';
      if (tags.public_transport || tags.railway || tags.highway === 'bus_stop') return 'transit';
      if (tags.leisure === 'park') return 'park';
      return 'other';
    };

    const grouped: Record<string, OverpassElement[]> = {
      cafe: [], university: [], office: [], shop: [], transit: [], park: [],
    };

    for (const el of elements) {
      const category = categorize(el);
      if (grouped[category]) grouped[category].push(el);
    }

    return {
      cafes: grouped.cafe,
      universities: grouped.university,
      offices: grouped.office,
      shops: grouped.shop,
      transit: grouped.transit,
      parks: grouped.park,
    };
  },

  /**
   * Analyze suburb-level POI context for all Brisbane suburbs
   */
  async analyzeSuburbs(options?: {
    onProgress?: (suburb: string, index: number, total: number) => void;
  }): Promise<SuburbPOIContext[]> {
    const suburbs = await prisma.suburbData.findMany({
      where: { city: 'Brisbane' },
    });

    const results: SuburbPOIContext[] = [];

    for (let i = 0; i < suburbs.length; i++) {
      const suburb = suburbs[i];
      console.log(`[Overpass] Analyzing ${suburb.suburb} (${i + 1}/${suburbs.length})...`);
      options?.onProgress?.(suburb.suburb, i, suburbs.length);

      const pois = await this.getPOIContext(suburb.lat, suburb.lng, 1500);

      const poiList = [
        ...pois.universities.map(e => ({
          name: e.tags?.name || 'University',
          type: 'university' as const,
          lat: e.lat || e.center?.lat || 0,
          lng: e.lon || e.center?.lon || 0,
        })),
        ...pois.offices.slice(0, 10).map(e => ({
          name: e.tags?.name || e.tags?.office || 'Office',
          type: 'office' as const,
          lat: e.lat || e.center?.lat || 0,
          lng: e.lon || e.center?.lon || 0,
        })),
        ...pois.transit.slice(0, 10).map(e => ({
          name: e.tags?.name || 'Transit Stop',
          type: 'transit' as const,
          lat: e.lat || e.center?.lat || 0,
          lng: e.lon || e.center?.lon || 0,
        })),
      ];

      const context: SuburbPOIContext = {
        suburb: suburb.suburb,
        cafeCount: pois.cafes.length,
        restaurantCount: 0, // Could add restaurant query
        universityCount: pois.universities.length,
        officeCount: pois.offices.length,
        shopCount: pois.shops.length,
        transitStopCount: pois.transit.length,
        parkCount: pois.parks.length,
        competitionDensity: classifyCompetition(pois.cafes.length),
        footTrafficScore: calculateFootTrafficScore({
          universityCount: pois.universities.length,
          officeCount: pois.offices.length,
          shopCount: pois.shops.length,
          transitStopCount: pois.transit.length,
          parkCount: pois.parks.length,
        }),
        nearbyPOIs: poiList,
      };

      results.push(context);

      // Be gentle with Overpass API
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  },

  /**
   * Get detailed context for a specific cafe
   * Used to enrich individual cafe profiles with nearby POI data
   */
  async getCafeContext(cafeId: string): Promise<CafeContext | null> {
    const cafe = await prisma.cafe.findUnique({ where: { id: cafeId } });
    if (!cafe) return null;

    const pois = await this.getPOIContext(cafe.lat, cafe.lng, 800);

    // Calculate distances to each POI
    const nearbyCompetitors = pois.cafes.length - 1; // Exclude self

    const nearbyUniversities = pois.universities
      .filter(e => e.tags?.name)
      .map(e => ({
        name: e.tags!.name!,
        distanceM: distanceM(cafe.lat, cafe.lng, e.lat || e.center?.lat || 0, e.lon || e.center?.lon || 0),
      }))
      .sort((a, b) => a.distanceM - b.distanceM);

    const nearbyOffices = pois.offices
      .filter(e => e.tags?.name)
      .slice(0, 5)
      .map(e => ({
        name: e.tags!.name!,
        distanceM: distanceM(cafe.lat, cafe.lng, e.lat || e.center?.lat || 0, e.lon || e.center?.lon || 0),
      }))
      .sort((a, b) => a.distanceM - b.distanceM);

    const nearbyTransit = pois.transit
      .filter(e => e.tags?.name)
      .slice(0, 5)
      .map(e => ({
        name: e.tags!.name!,
        distanceM: distanceM(cafe.lat, cafe.lng, e.lat || e.center?.lat || 0, e.lon || e.center?.lon || 0),
      }))
      .sort((a, b) => a.distanceM - b.distanceM);

    // Calculate context score
    let contextScore = 30; // Baseline
    if (nearbyUniversities.length > 0) contextScore += 25;
    if (nearbyOffices.length > 0) contextScore += Math.min(20, nearbyOffices.length * 5);
    if (nearbyTransit.length > 0) contextScore += Math.min(15, nearbyTransit.length * 5);
    if (nearbyCompetitors > 5) contextScore -= 10; // Too much competition
    contextScore = Math.max(0, Math.min(100, contextScore));

    // Derive context tags
    const contextTags: string[] = [];
    if (nearbyUniversities.length > 0) contextTags.push('near-university', 'student');
    if (nearbyOffices.length >= 3) contextTags.push('business-district', 'professional');
    if (nearbyTransit.length >= 2) contextTags.push('transit-hub', 'high-traffic');
    if (nearbyCompetitors <= 2) contextTags.push('low-competition');
    if (pois.parks.length > 0) contextTags.push('near-park');
    if (pois.shops.length >= 5) contextTags.push('shopping-area');

    return {
      cafeId,
      nearbyCompetitors,
      nearbyUniversities,
      nearbyOffices,
      nearbyTransit,
      contextScore,
      contextTags,
    };
  },

  /**
   * Enrich all cafes in the database with OSM context data
   * Updates cafe tags with POI-derived context
   */
  async enrichAllCafes(options?: {
    onProgress?: (cafe: string, index: number, total: number) => void;
  }): Promise<{
    total: number;
    enriched: number;
    errors: number;
  }> {
    const cafes = await prisma.cafe.findMany({
      where: { city: 'Brisbane', isActive: true },
    });

    let enriched = 0;
    let errors = 0;

    for (let i = 0; i < cafes.length; i++) {
      const cafe = cafes[i];
      try {
        console.log(`[Overpass] Enriching ${cafe.name} (${i + 1}/${cafes.length})...`);
        options?.onProgress?.(cafe.name, i, cafes.length);

        const context = await this.getCafeContext(cafe.id);
        if (!context) continue;

        // Merge context tags with existing tags
        const existingTags = JSON.parse(cafe.tags || '[]') as string[];
        const mergedTags = [...new Set([...existingTags, ...context.contextTags])];

        await prisma.cafe.update({
          where: { id: cafe.id },
          data: {
            tags: JSON.stringify(mergedTags),
          },
        });
        enriched++;

        // Rate limit
        await new Promise(resolve => setTimeout(resolve, 3000));
      } catch (err) {
        console.error(`[Overpass] Failed to enrich ${cafe.name}:`, err);
        errors++;
      }
    }

    return { total: cafes.length, enriched, errors };
  },

  /**
   * Get competition density map for Brisbane
   * Shows how many cafes are in each suburb according to OSM
   */
  async getCompetitionMap(): Promise<Array<{
    suburb: string;
    osmCafeCount: number;
    ourCafeCount: number;
    penetration: number; // Our cafes / total cafes (0-1)
    competitionLevel: string;
  }>> {
    // Get all cafes from OSM
    const osmCafes = await this.getAllBrisbaneCafes();

    // Get our cafes
    const ourCafes = await prisma.cafe.findMany({
      where: { city: 'Brisbane', isActive: true },
      select: { suburb: true },
    });

    // Get suburb data for coordinates
    const suburbs = await prisma.suburbData.findMany({
      where: { city: 'Brisbane' },
    });

    // Count OSM cafes per suburb (approximate by nearest suburb center)
    const osmBySuburb = new Map<string, number>();
    for (const cafe of osmCafes) {
      const lat = cafe.lat || cafe.center?.lat;
      const lng = cafe.lon || cafe.center?.lon;
      if (!lat || !lng) continue;

      // Find nearest suburb
      let nearest = suburbs[0];
      let nearestDist = Infinity;
      for (const sub of suburbs) {
        const d = distanceM(lat, lng, sub.lat, sub.lng);
        if (d < nearestDist) {
          nearestDist = d;
          nearest = sub;
        }
      }
      osmBySuburb.set(nearest.suburb, (osmBySuburb.get(nearest.suburb) || 0) + 1);
    }

    // Count our cafes per suburb
    const ourBySuburb = new Map<string, number>();
    for (const cafe of ourCafes) {
      ourBySuburb.set(cafe.suburb, (ourBySuburb.get(cafe.suburb) || 0) + 1);
    }

    return suburbs.map(s => {
      const osmCount = osmBySuburb.get(s.suburb) || 0;
      const ourCount = ourBySuburb.get(s.suburb) || 0;
      return {
        suburb: s.suburb,
        osmCafeCount: osmCount,
        ourCafeCount: ourCount,
        penetration: osmCount > 0 ? Math.round((ourCount / osmCount) * 100) / 100 : 0,
        competitionLevel: classifyCompetition(osmCount),
      };
    });
  },

  /**
   * Health check for Overpass API
   */
  async healthCheck(): Promise<{ working: boolean; latencyMs: number; error?: string }> {
    const start = Date.now();
    try {
      const query = `[out:json][timeout:10];node["amenity"="cafe"](around:500,-27.4698,153.0251);out count;`;
      const elements = await queryOverpass(query);
      return { working: true, latencyMs: Date.now() - start };
    } catch (err) {
      return { working: false, latencyMs: Date.now() - start, error: err instanceof Error ? err.message : String(err) };
    }
  },
};
