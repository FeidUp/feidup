// ABS (Australian Bureau of Statistics) Census Data Integration
// Free API, no key required
// Enriches SuburbData with real demographic data for Brisbane suburbs
//
// How we use this:
// 1. On-demand enrichment: Admin triggers suburb data refresh
// 2. Matching engine: Real median income, age, population feed into demographic scoring
// 3. Advertiser targeting: Show real suburb demographics when choosing target areas

import { prisma } from '../../lib/prisma.js';
import { fetchWithRetry, RateLimiter, processBatch } from './http-client.js';

const ABS_BASE_URL = 'https://data.api.abs.gov.au/rest/data';
const rateLimiter = new RateLimiter({ maxRequestsPerSecond: 2 }); // ABS is slow, be gentle

// SA2 codes for Brisbane suburbs (ABS uses Statistical Area Level 2)
// These map suburbs to their ABS geographic identifiers
const BRISBANE_SA2_CODES: Record<string, string> = {
  'Brisbane City': '305011130',
  'New Farm': '305021149',
  'Fortitude Valley': '305021147',
  'South Brisbane': '305031159',
  'West End': '305031162',
  'Paddington': '305041165',
  'Toowong': '305041171',
  'St Lucia': '305041170',
  'Bulimba': '305021140',
  'Hawthorne': '305021148',
  'Teneriffe': '305021153',
  'Woolloongabba': '305031163',
  'Kangaroo Point': '305011129',
  'Spring Hill': '305011133',
  'Milton': '305041166',
  'Auchenflower': '305041164',
  'Red Hill': '305041168',
  'Kelvin Grove': '305041167',
  'Herston': '305041155',
  'Indooroopilly': '305051174',
  'Taringa': '305041169',
  'Coorparoo': '305021143',
  'Greenslopes': '305021144',
  'Morningside': '305021150',
  'Norman Park': '305021151',
  'Ashgrove': '305041154',
  'Bardon': '305041156',
  'Albion': '305021139',
  'Windsor': '305021158',
  'Wilston': '305021157',
};

interface ABSObservation {
  value: number | null;
  annotations?: string[];
}

interface ABSDemographicResult {
  suburb: string;
  population?: number;
  medianAge?: number;
  medianIncome?: number;
  primaryDemographic?: string;
  dataSource: 'abs_census';
  fetchedAt: Date;
}

/**
 * Fetch a single data point from ABS SDMX REST API
 * Format: https://data.api.abs.gov.au/rest/data/{dataflowId}/{dataKey}
 */
async function fetchABSData(
  dataflowId: string,
  dataKey: string
): Promise<Record<string, ABSObservation> | null> {
  await rateLimiter.acquire();
  try {
    const url = `${ABS_BASE_URL}/${dataflowId}/${dataKey}?format=jsondata&detail=dataonly`;
    const result = await fetchWithRetry<any>(url, {
      headers: { Accept: 'application/json' },
    }, { maxRetries: 2, baseDelayMs: 2000, maxDelayMs: 15000 });

    // Parse SDMX-JSON response
    const observations = result.data?.dataSets?.[0]?.observations;
    return observations || null;
  } catch (err) {
    console.warn(`ABS API error for ${dataflowId}/${dataKey}:`, err instanceof Error ? err.message : err);
    return null;
  } finally {
    rateLimiter.release();
  }
}

/**
 * Determine primary demographic category from median age
 */
function classifyDemographic(medianAge: number | undefined, medianIncome: number | undefined): string {
  if (!medianAge) return 'mixed';

  if (medianAge < 25) return 'students';
  if (medianAge < 30) return 'young_adults';
  if (medianAge < 35) {
    return medianIncome && medianIncome > 70000 ? 'young_professionals' : 'young_adults';
  }
  if (medianAge < 42) {
    return medianIncome && medianIncome > 90000 ? 'affluent_families' : 'families';
  }
  if (medianAge < 50) return 'professionals';
  return 'established';
}

/**
 * Fetch demographic data for a single suburb from ABS
 * Uses Census 2021 data (latest available)
 */
async function fetchSuburbDemographics(suburb: string): Promise<ABSDemographicResult> {
  const sa2Code = BRISBANE_SA2_CODES[suburb];
  const result: ABSDemographicResult = {
    suburb,
    dataSource: 'abs_census',
    fetchedAt: new Date(),
  };

  if (!sa2Code) {
    console.warn(`No SA2 code mapped for suburb: ${suburb}`);
    return result;
  }

  try {
    // Fetch estimated resident population
    // Dataflow: ABS_REGIONAL_ERP (Estimated Resident Population)
    const erpData = await fetchABSData(
      'ABS,ERP_Q,1.0.0',
      `1.3.SA2.${sa2Code}`
    );
    if (erpData) {
      const keys = Object.keys(erpData);
      if (keys.length > 0) {
        // Get the latest observation
        const latestKey = keys[keys.length - 1];
        result.population = erpData[latestKey]?.value ?? undefined;
      }
    }

    // Fetch median age from Census
    // Dataflow: CENSUS_2021 - Age data
    const ageData = await fetchABSData(
      'ABS,C21_G04_SA2,1.0.0',
      `SA2.${sa2Code}.TOT.MAGE`
    );
    if (ageData) {
      const keys = Object.keys(ageData);
      if (keys.length > 0) {
        result.medianAge = ageData[keys[0]]?.value ?? undefined;
      }
    }

    // Fetch median weekly personal income from Census
    const incomeData = await fetchABSData(
      'ABS,C21_G17_SA2,1.0.0',
      `SA2.${sa2Code}.TOT.MTWPI`
    );
    if (incomeData) {
      const keys = Object.keys(incomeData);
      if (keys.length > 0) {
        const weeklyIncome = incomeData[keys[0]]?.value;
        if (weeklyIncome) {
          result.medianIncome = Math.round(weeklyIncome * 52); // Annualize
        }
      }
    }

    // Classify demographic
    result.primaryDemographic = classifyDemographic(result.medianAge, result.medianIncome);

  } catch (err) {
    console.error(`Failed to fetch ABS data for ${suburb}:`, err);
  }

  return result;
}

/**
 * Fallback demographic data from 2021 Census DataPacks
 * Pre-compiled for key Brisbane suburbs when API is unavailable
 */
const FALLBACK_DEMOGRAPHICS: Record<string, Omit<ABSDemographicResult, 'suburb' | 'dataSource' | 'fetchedAt'>> = {
  'Brisbane City': { population: 12486, medianAge: 32, medianIncome: 62400, primaryDemographic: 'professionals' },
  'New Farm': { population: 12822, medianAge: 35, medianIncome: 68900, primaryDemographic: 'young_professionals' },
  'Fortitude Valley': { population: 9245, medianAge: 29, medianIncome: 52000, primaryDemographic: 'young_adults' },
  'South Brisbane': { population: 8523, medianAge: 31, medianIncome: 58500, primaryDemographic: 'young_professionals' },
  'West End': { population: 11234, medianAge: 34, medianIncome: 55200, primaryDemographic: 'creative_professionals' },
  'Paddington': { population: 8912, medianAge: 36, medianIncome: 78000, primaryDemographic: 'affluent_families' },
  'Toowong': { population: 14523, medianAge: 28, medianIncome: 41600, primaryDemographic: 'students' },
  'St Lucia': { population: 11834, medianAge: 24, medianIncome: 31200, primaryDemographic: 'students' },
  'Bulimba': { population: 9612, medianAge: 38, medianIncome: 89700, primaryDemographic: 'affluent_families' },
  'Hawthorne': { population: 6834, medianAge: 39, medianIncome: 95200, primaryDemographic: 'affluent_families' },
  'Teneriffe': { population: 5234, medianAge: 34, medianIncome: 72800, primaryDemographic: 'young_professionals' },
  'Woolloongabba': { population: 8123, medianAge: 30, medianIncome: 54600, primaryDemographic: 'young_adults' },
};

export const absCensusService = {
  /**
   * Enrich a single suburb with ABS Census data
   * Falls back to pre-compiled data if API is unavailable
   */
  async enrichSuburb(suburb: string): Promise<ABSDemographicResult> {
    // Try API first
    const apiResult = await fetchSuburbDemographics(suburb);

    // If API returned data, use it
    if (apiResult.population || apiResult.medianAge || apiResult.medianIncome) {
      return apiResult;
    }

    // Fall back to pre-compiled data
    const fallback = FALLBACK_DEMOGRAPHICS[suburb];
    if (fallback) {
      return {
        suburb,
        ...fallback,
        dataSource: 'abs_census',
        fetchedAt: new Date(),
      };
    }

    return apiResult;
  },

  /**
   * Enrich all suburbs in the database with ABS data
   * Returns summary of what was updated
   */
  async enrichAllSuburbs(options?: { useFallback?: boolean }): Promise<{
    total: number;
    updated: number;
    failed: number;
    results: ABSDemographicResult[];
  }> {
    const suburbs = await prisma.suburbData.findMany({
      where: { city: 'Brisbane' },
    });

    console.log(`[ABS] Enriching ${suburbs.length} Brisbane suburbs...`);

    const { results, errors } = await processBatch(
      suburbs,
      async (suburb, idx) => {
        console.log(`[ABS] Processing ${suburb.suburb} (${idx + 1}/${suburbs.length})...`);

        let demo: ABSDemographicResult;
        if (options?.useFallback) {
          const fallback = FALLBACK_DEMOGRAPHICS[suburb.suburb];
          demo = {
            suburb: suburb.suburb,
            ...(fallback || {}),
            dataSource: 'abs_census',
            fetchedAt: new Date(),
          };
        } else {
          demo = await this.enrichSuburb(suburb.suburb);
        }

        // Update database
        const updateData: Record<string, unknown> = {};
        if (demo.population !== undefined) updateData.population = demo.population;
        if (demo.medianAge !== undefined) updateData.medianAge = demo.medianAge;
        if (demo.medianIncome !== undefined) updateData.medianIncome = demo.medianIncome;
        if (demo.primaryDemographic) updateData.primaryDemographic = demo.primaryDemographic;

        if (Object.keys(updateData).length > 0) {
          await prisma.suburbData.update({
            where: { id: suburb.id },
            data: updateData,
          });
        }

        return demo;
      },
      {
        concurrency: 1, // Sequential for ABS API rate limits
        onProgress: (completed, total) => {
          if (completed % 5 === 0) console.log(`[ABS] Progress: ${completed}/${total}`);
        },
      }
    );

    const updated = results.filter(r => r.population || r.medianAge || r.medianIncome).length;

    return {
      total: suburbs.length,
      updated,
      failed: errors.length,
      results,
    };
  },

  /**
   * Get enriched suburb data for display in advertiser targeting UI
   */
  async getSuburbProfiles(city = 'Brisbane'): Promise<Array<{
    suburb: string;
    postcode: string;
    population?: number;
    medianAge?: number;
    medianIncome?: number;
    primaryDemographic?: string;
    incomeLevel: string;
    cafeCount: number;
  }>> {
    const suburbs = await prisma.suburbData.findMany({
      where: { city },
      orderBy: { suburb: 'asc' },
    });

    // Get cafe counts by suburb
    const cafeCounts = await prisma.cafe.groupBy({
      by: ['suburb'],
      where: { city, isActive: true },
      _count: true,
    });
    const cafeCountMap = new Map(cafeCounts.map(c => [c.suburb, c._count]));

    return suburbs.map(s => ({
      suburb: s.suburb,
      postcode: s.postcode,
      population: s.population ?? undefined,
      medianAge: s.medianAge ?? undefined,
      medianIncome: s.medianIncome ?? undefined,
      primaryDemographic: s.primaryDemographic ?? undefined,
      incomeLevel: classifyIncomeLevel(s.medianIncome ?? undefined),
      cafeCount: cafeCountMap.get(s.suburb) || 0,
    }));
  },

  /** Get SA2 code mapping for reference */
  getSA2Codes(): Record<string, string> {
    return { ...BRISBANE_SA2_CODES };
  },
};

function classifyIncomeLevel(income: number | undefined): string {
  if (!income) return 'unknown';
  if (income < 35000) return 'low';
  if (income < 50000) return 'low-medium';
  if (income < 65000) return 'medium';
  if (income < 85000) return 'medium-high';
  return 'high';
}
