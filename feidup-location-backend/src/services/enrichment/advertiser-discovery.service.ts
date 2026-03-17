// Advertiser Discovery Service
// Uses Google Places API to find local businesses that could advertise on cafe cups
// Target: gyms, padel courts, dentists, real estate agents, schools, beauty salons, etc.

import { config } from '../../config/index.js';
import { fetchWithRetry, RateLimiter } from './http-client.js';

const PLACES_API_V1 = 'https://places.googleapis.com/v1';
const rateLimiter = new RateLimiter({ maxRequestsPerSecond: 5 });

// Business types we want to discover as potential advertisers
const ADVERTISER_TYPES = [
  { types: ['gym', 'fitness_center'], industry: 'fitness', label: 'Gyms & Fitness' },
  { types: ['dentist'], industry: 'health', label: 'Dentists' },
  { types: ['real_estate_agency'], industry: 'real_estate', label: 'Real Estate' },
  { types: ['beauty_salon', 'hair_salon', 'spa'], industry: 'beauty', label: 'Beauty & Wellness' },
  { types: ['school', 'university'], industry: 'education', label: 'Education' },
  { types: ['veterinary_care'], industry: 'health', label: 'Vets' },
  { types: ['physiotherapist', 'doctor'], industry: 'health', label: 'Health Services' },
  { types: ['lawyer', 'accounting'], industry: 'professional_services', label: 'Professional Services' },
  { types: ['car_dealer', 'car_repair'], industry: 'automotive', label: 'Automotive' },
  { types: ['pet_store'], industry: 'retail', label: 'Pet Services' },
  { types: ['sports_club'], industry: 'fitness', label: 'Sports & Recreation' },
];

interface DiscoveredAdvertiser {
  googlePlaceId: string;
  name: string;
  address: string;
  suburb: string;
  postcode: string;
  lat: number;
  lng: number;
  industry: string;
  businessType: string;
  rating?: number;
  reviewCount?: number;
  websiteUrl?: string;
  googleMapsUrl?: string;
  phone?: string;
  isOpen?: boolean;
}

function parseAddress(address: string): { suburb: string; postcode: string } {
  const match = address.match(/,?\s*([A-Za-z\s]+?)\s+(?:QLD|Queensland)\s+(\d{4})/i);
  if (match) return { suburb: match[1].trim(), postcode: match[2] };
  const pc = address.match(/\b(\d{4})\b/);
  return { suburb: 'Unknown', postcode: pc ? pc[1] : '4000' };
}

async function searchBusinesses(
  lat: number, lng: number, types: string[], radiusM: number = 3000
): Promise<any[]> {
  const apiKey = config.googleMapsApiKey;
  if (!apiKey) return [];

  await rateLimiter.acquire();
  try {
    const result = await fetchWithRetry<{ places?: any[] }>(
      `${PLACES_API_V1}/places:searchNearby`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.websiteUri,places.googleMapsUri,places.nationalPhoneNumber,places.currentOpeningHours,places.primaryType',
        },
        body: JSON.stringify({
          includedTypes: types,
          locationRestriction: {
            circle: { center: { latitude: lat, longitude: lng }, radius: radiusM },
          },
          maxResultCount: 20,
          rankPreference: 'POPULARITY',
        }),
      }
    );
    return result.data.places || [];
  } catch (err) {
    console.error(`[AdvertiserDiscovery] Search failed:`, err instanceof Error ? err.message : err);
    return [];
  } finally {
    rateLimiter.release();
  }
}

export const advertiserDiscoveryService = {
  /**
   * Discover potential advertisers near a location
   */
  async discoverNear(lat: number, lng: number, options?: {
    industries?: string[];
    radiusM?: number;
  }): Promise<DiscoveredAdvertiser[]> {
    const radius = options?.radiusM || 3000;
    const targetTypes = options?.industries
      ? ADVERTISER_TYPES.filter(t => options.industries!.includes(t.industry))
      : ADVERTISER_TYPES;

    const results: DiscoveredAdvertiser[] = [];

    for (const typeGroup of targetTypes) {
      const places = await searchBusinesses(lat, lng, typeGroup.types, radius);

      for (const place of places) {
        if (!place.displayName?.text || !place.location) continue;
        const { suburb, postcode } = parseAddress(place.formattedAddress || '');

        results.push({
          googlePlaceId: place.id,
          name: place.displayName.text,
          address: place.formattedAddress || '',
          suburb,
          postcode,
          lat: place.location.latitude,
          lng: place.location.longitude,
          industry: typeGroup.industry,
          businessType: typeGroup.label,
          rating: place.rating,
          reviewCount: place.userRatingCount,
          websiteUrl: place.websiteUri,
          googleMapsUrl: place.googleMapsUri,
          phone: place.nationalPhoneNumber,
          isOpen: place.currentOpeningHours?.openNow,
        });
      }
    }

    return results;
  },

  /**
   * Discover potential advertisers in a suburb
   */
  async discoverInSuburb(suburb: string, suburbLat: number, suburbLng: number): Promise<DiscoveredAdvertiser[]> {
    return this.discoverNear(suburbLat, suburbLng, { radiusM: 2000 });
  },

  /**
   * Search for a specific type of business (e.g. "padel" or "crossfit")
   */
  async searchByKeyword(keyword: string, lat: number, lng: number, radiusM: number = 5000): Promise<DiscoveredAdvertiser[]> {
    const apiKey = config.googleMapsApiKey;
    if (!apiKey) return [];

    await rateLimiter.acquire();
    try {
      const result = await fetchWithRetry<{ places?: any[] }>(
        `${PLACES_API_V1}/places:searchText`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.websiteUri,places.googleMapsUri,places.nationalPhoneNumber,places.primaryType',
          },
          body: JSON.stringify({
            textQuery: `${keyword} near Brisbane QLD`,
            locationBias: {
              circle: { center: { latitude: lat, longitude: lng }, radius: radiusM },
            },
            maxResultCount: 20,
          }),
        }
      );

      return (result.data.places || []).map((place: any) => {
        const { suburb, postcode } = parseAddress(place.formattedAddress || '');
        return {
          googlePlaceId: place.id,
          name: place.displayName?.text || '',
          address: place.formattedAddress || '',
          suburb, postcode,
          lat: place.location?.latitude || 0,
          lng: place.location?.longitude || 0,
          industry: 'other',
          businessType: keyword,
          rating: place.rating,
          reviewCount: place.userRatingCount,
          websiteUrl: place.websiteUri,
          googleMapsUrl: place.googleMapsUri,
          phone: place.nationalPhoneNumber,
        };
      });
    } catch (err) {
      console.error(`[AdvertiserDiscovery] Text search failed:`, err instanceof Error ? err.message : err);
      return [];
    } finally {
      rateLimiter.release();
    }
  },

  getAvailableIndustries() {
    return ADVERTISER_TYPES.map(t => ({ industry: t.industry, label: t.label, types: t.types }));
  },
};
