#!/usr/bin/env npx tsx
// Comprehensive Stress Test for Data Enrichment Services
// Tests: ABS Census, Google Places, OpenStreetMap Overpass
// Run: npx tsx tests/enrichment-stress-test.ts

import { absCensusService } from '../src/services/enrichment/abs-census.service.js';
import { googlePlacesService } from '../src/services/enrichment/google-places.service.js';
import { overpassService } from '../src/services/enrichment/overpass.service.js';
import { fetchWithRetry, RateLimiter, processBatch } from '../src/services/enrichment/http-client.js';

// ============================================================
// TEST HARNESS
// ============================================================

interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];
let totalPassed = 0;
let totalFailed = 0;

async function runTest(name: string, fn: () => Promise<void>): Promise<void> {
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    results.push({ name, passed: true, duration });
    totalPassed++;
    console.log(`  ✅ ${name} (${duration}ms)`);
  } catch (err) {
    const duration = Date.now() - start;
    const error = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, duration, error });
    totalFailed++;
    console.log(`  ❌ ${name} (${duration}ms): ${error}`);
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function assertDefined<T>(value: T | undefined | null, message: string): asserts value is T {
  if (value === undefined || value === null) throw new Error(`Expected defined: ${message}`);
}

// ============================================================
// HTTP CLIENT TESTS
// ============================================================

async function testHttpClient() {
  console.log('\n📡 HTTP Client Tests');

  await runTest('fetchWithRetry handles successful request', async () => {
    const result = await fetchWithRetry<any>('https://httpbin.org/get');
    assert(result.statusCode === 200, 'Expected 200');
    assert(result.duration > 0, 'Duration should be positive');
    assert(result.retries === 0, 'Should not retry on success');
  });

  await runTest('fetchWithRetry handles 404 without retry', async () => {
    try {
      await fetchWithRetry<any>('https://httpbin.org/status/404');
      throw new Error('Should have thrown');
    } catch (err) {
      assert(err instanceof Error, 'Should throw an error');
      assert(err.message.includes('404') || err.message.includes('Client error'), `Expected 404 error, got: ${err.message}`);
    }
  });

  await runTest('fetchWithRetry handles timeout', async () => {
    try {
      await fetchWithRetry<any>('https://httpbin.org/delay/60', {}, {
        maxRetries: 0, baseDelayMs: 100, maxDelayMs: 100,
      });
      throw new Error('Should have thrown');
    } catch (err) {
      assert(err instanceof Error, 'Should throw on timeout');
    }
  });

  await runTest('RateLimiter enforces request spacing', async () => {
    const limiter = new RateLimiter({ maxRequestsPerSecond: 10 });
    const times: number[] = [];

    for (let i = 0; i < 5; i++) {
      await limiter.acquire();
      times.push(Date.now());
      limiter.release();
    }

    // Check that requests are spaced ~100ms apart (10/sec)
    for (let i = 1; i < times.length; i++) {
      const gap = times[i] - times[i - 1];
      assert(gap >= 50, `Gap too small: ${gap}ms (expected ≥50ms for 10/sec)`);
    }
  });

  await runTest('processBatch handles concurrent items', async () => {
    const items = [1, 2, 3, 4, 5];
    const processed: number[] = [];

    const { results, errors } = await processBatch(
      items,
      async (item) => {
        await new Promise(r => setTimeout(r, 50));
        processed.push(item);
        return item * 2;
      },
      { concurrency: 3 }
    );

    assert(results.length === 5, `Expected 5 results, got ${results.length}`);
    assert(errors.length === 0, `Expected 0 errors, got ${errors.length}`);
    assert(processed.length === 5, 'All items should be processed');
  });

  await runTest('processBatch handles errors gracefully', async () => {
    const items = [1, 2, 3, 4, 5];

    const { results, errors } = await processBatch(
      items,
      async (item) => {
        if (item === 3) throw new Error('Simulated failure');
        return item;
      },
      { concurrency: 2 }
    );

    assert(results.length === 4, `Expected 4 results, got ${results.length}`);
    assert(errors.length === 1, `Expected 1 error, got ${errors.length}`);
    assert(errors[0].index === 2, 'Error should be at index 2');
  });

  await runTest('processBatch progress callback fires', async () => {
    let progressCalls = 0;
    await processBatch([1, 2, 3], async () => 'ok', {
      concurrency: 1,
      onProgress: () => { progressCalls++; },
    });
    assert(progressCalls === 3, `Expected 3 progress calls, got ${progressCalls}`);
  });
}

// ============================================================
// ABS CENSUS TESTS
// ============================================================

async function testABSCensus() {
  console.log('\n📊 ABS Census Service Tests');

  await runTest('enrichSuburb returns fallback data for known suburbs', async () => {
    const result = await absCensusService.enrichSuburb('Brisbane City');
    assertDefined(result, 'Result should exist');
    assert(result.suburb === 'Brisbane City', 'Suburb name should match');
    assert(result.dataSource === 'abs_census', 'Data source should be abs_census');
    // Should have some data (either API or fallback)
    assert(
      result.population !== undefined || result.medianAge !== undefined,
      'Should have population or medianAge'
    );
  });

  await runTest('enrichSuburb handles unknown suburbs gracefully', async () => {
    const result = await absCensusService.enrichSuburb('Nonexistent Suburb XYZ');
    assertDefined(result, 'Result should exist even for unknown suburbs');
    assert(result.suburb === 'Nonexistent Suburb XYZ', 'Suburb name should match');
    // No data expected, but should not crash
  });

  await runTest('enrichAllSuburbs with fallback mode works', async () => {
    const result = await absCensusService.enrichAllSuburbs({ useFallback: true });
    assert(result.total > 0, 'Should have suburbs to process');
    assert(result.updated > 0, 'Should update some suburbs');
    assert(result.failed === 0, 'Fallback mode should not fail');
    console.log(`    Updated ${result.updated}/${result.total} suburbs`);
  });

  await runTest('getSuburbProfiles returns enriched data', async () => {
    const profiles = await absCensusService.getSuburbProfiles('Brisbane');
    assert(Array.isArray(profiles), 'Should return array');
    assert(profiles.length > 0, 'Should have suburb profiles');

    const brisbaneCity = profiles.find(p => p.suburb === 'Brisbane City');
    assertDefined(brisbaneCity, 'Brisbane City should exist');
    assert(typeof brisbaneCity.incomeLevel === 'string', 'Should have income level');
    assert(typeof brisbaneCity.cafeCount === 'number', 'Should have cafe count');
  });

  await runTest('getSA2Codes returns mapping', async () => {
    const codes = absCensusService.getSA2Codes();
    assert(typeof codes === 'object', 'Should return object');
    assert(Object.keys(codes).length > 0, 'Should have SA2 codes');
    assert('Brisbane City' in codes, 'Should include Brisbane City');
    assert('St Lucia' in codes, 'Should include St Lucia');
  });

  await runTest('enrichAllSuburbs is idempotent', async () => {
    // Run twice with fallback
    const result1 = await absCensusService.enrichAllSuburbs({ useFallback: true });
    const result2 = await absCensusService.enrichAllSuburbs({ useFallback: true });

    assert(result1.updated === result2.updated, 'Idempotent: same updated count');
    assert(result1.total === result2.total, 'Same total count');
  });
}

// ============================================================
// GOOGLE PLACES TESTS
// ============================================================

async function testGooglePlaces() {
  console.log('\n🗺️  Google Places Service Tests');

  await runTest('healthCheck reports API status correctly', async () => {
    const health = await googlePlacesService.healthCheck();
    assert(typeof health.configured === 'boolean', 'Should report configured status');
    assert(typeof health.working === 'boolean', 'Should report working status');
    if (!health.configured) {
      console.log('    ⚠️  Google Places API not configured — skipping API-dependent tests');
    }
  });

  await runTest('discoverCafesInSuburb handles missing suburb', async () => {
    const result = await googlePlacesService.discoverCafesInSuburb('Nonexistent Suburb XYZ');
    assert(result.discovered.length === 0, 'Should return empty for unknown suburb');
    assert(result.total === 0, 'Total should be 0');
  });

  await runTest('discoverCafesInSuburb returns structured data for known suburb', async () => {
    const result = await googlePlacesService.discoverCafesInSuburb('Brisbane City');
    // This will work if API key is set, otherwise empty
    assert(typeof result.discovered === 'object', 'Should return array');
    assert(typeof result.alreadyKnown === 'number', 'Should track known cafes');
    assert(typeof result.total === 'number', 'Should track total');

    if (result.discovered.length > 0) {
      const cafe = result.discovered[0];
      assert(typeof cafe.name === 'string', 'Cafe should have name');
      assert(typeof cafe.lat === 'number', 'Cafe should have lat');
      assert(typeof cafe.lng === 'number', 'Cafe should have lng');
      assert(typeof cafe.estimatedFootTraffic === 'number', 'Should estimate foot traffic');
      assert(cafe.estimatedFootTraffic >= 50, 'Foot traffic estimate should be >= 50');
    }
  });

  await runTest('importDiscoveredCafes validates input', async () => {
    // Test with empty cafe that should be skippable
    const result = await googlePlacesService.importDiscoveredCafes([{
      googlePlaceId: 'test-stress-id',
      name: `Stress Test Cafe ${Date.now()}`,
      address: '1 Test Street, Brisbane City QLD 4000',
      suburb: 'Brisbane City',
      postcode: '4000',
      lat: -27.4698,
      lng: 153.0251,
      types: ['cafe'],
      estimatedFootTraffic: 200,
    }]);

    assert(result.imported + result.skipped === 1, 'Should process 1 cafe');
    assert(result.errors.length === 0, 'Should have no errors');

    // Clean up test data
    const { prisma } = await import('../src/lib/prisma.js');
    await prisma.cafe.deleteMany({
      where: { name: { startsWith: 'Stress Test Cafe' } },
    });
  });

  await runTest('enrichCafe handles non-existent cafe', async () => {
    const result = await googlePlacesService.enrichCafe('non-existent-id');
    assert(result.updated === false, 'Should not update non-existent cafe');
  });
}

// ============================================================
// OVERPASS (OSM) TESTS
// ============================================================

async function testOverpass() {
  console.log('\n🌍 OpenStreetMap Overpass Service Tests');

  await runTest('healthCheck confirms Overpass API is available', async () => {
    const health = await overpassService.healthCheck();
    assert(health.working === true, `Overpass API should be working. Error: ${health.error}`);
    assert(health.latencyMs > 0, 'Should report latency');
    console.log(`    Overpass latency: ${health.latencyMs}ms`);
  });

  await runTest('getAllBrisbaneCafes returns OSM cafe data', async () => {
    const cafes = await overpassService.getAllBrisbaneCafes();
    assert(Array.isArray(cafes), 'Should return array');
    assert(cafes.length > 10, `Expected > 10 cafes from OSM, got ${cafes.length}`);
    console.log(`    Found ${cafes.length} cafes in Brisbane from OSM`);

    // Verify structure
    const withNames = cafes.filter(c => c.tags?.name);
    assert(withNames.length > 0, 'Some cafes should have names');
  });

  await runTest('getPOIContext returns categorized POIs', async () => {
    // Brisbane CBD coordinates
    const pois = await overpassService.getPOIContext(-27.4698, 153.0251, 1000);

    assert(Array.isArray(pois.cafes), 'Should have cafes array');
    assert(Array.isArray(pois.shops), 'Should have shops array');
    assert(Array.isArray(pois.transit), 'Should have transit array');

    const totalPOIs = pois.cafes.length + pois.shops.length + pois.transit.length +
      pois.offices.length + pois.universities.length + pois.parks.length;
    assert(totalPOIs > 0, `Expected POIs near Brisbane CBD, got ${totalPOIs}`);
    console.log(`    CBD POIs: ${pois.cafes.length} cafes, ${pois.shops.length} shops, ${pois.transit.length} transit, ${pois.offices.length} offices`);
  });

  await runTest('getCafeContext returns context for existing cafe', async () => {
    const { prisma } = await import('../src/lib/prisma.js');
    const cafe = await prisma.cafe.findFirst({ where: { city: 'Brisbane' } });
    assertDefined(cafe, 'Should have at least one cafe in DB');

    const context = await overpassService.getCafeContext(cafe.id);
    assertDefined(context, 'Should return context');
    assert(context.cafeId === cafe.id, 'Cafe ID should match');
    assert(typeof context.nearbyCompetitors === 'number', 'Should have competitor count');
    assert(typeof context.contextScore === 'number', 'Should have context score');
    assert(context.contextScore >= 0 && context.contextScore <= 100, 'Score should be 0-100');
    assert(Array.isArray(context.contextTags), 'Should have context tags');
    console.log(`    ${cafe.name}: competitors=${context.nearbyCompetitors}, score=${context.contextScore}, tags=${context.contextTags.join(',')}`);
  });

  await runTest('getCafeContext returns null for non-existent cafe', async () => {
    const result = await overpassService.getCafeContext('non-existent-id');
    assert(result === null, 'Should return null for non-existent cafe');
  });

  await runTest('getCompetitionMap returns suburb competition data', async () => {
    const map = await overpassService.getCompetitionMap();
    assert(Array.isArray(map), 'Should return array');
    assert(map.length > 0, 'Should have suburb data');

    for (const entry of map) {
      assert(typeof entry.suburb === 'string', 'Should have suburb');
      assert(typeof entry.osmCafeCount === 'number', 'Should have OSM cafe count');
      assert(typeof entry.ourCafeCount === 'number', 'Should have our cafe count');
      assert(typeof entry.penetration === 'number', 'Should have penetration');
      assert(typeof entry.competitionLevel === 'string', 'Should have competition level');
    }

    const highComp = map.filter(m => m.competitionLevel === 'high' || m.competitionLevel === 'very_high');
    console.log(`    Competition map: ${map.length} suburbs, ${highComp.length} high competition`);
  });
}

// ============================================================
// STRESS TESTS
// ============================================================

async function testStress() {
  console.log('\n🔨 Stress Tests');

  await runTest('HTTP client handles 20 concurrent requests', async () => {
    const urls = Array.from({ length: 20 }, (_, i) => `https://httpbin.org/get?n=${i}`);
    const start = Date.now();

    const { results, errors } = await processBatch(
      urls,
      async (url) => fetchWithRetry<any>(url),
      { concurrency: 5 }
    );

    const duration = Date.now() - start;
    assert(results.length >= 15, `Expected ≥15 successful, got ${results.length}`);
    console.log(`    20 requests: ${results.length} success, ${errors.length} errors in ${duration}ms`);
  });

  await runTest('RateLimiter handles burst of 50 acquires', async () => {
    const limiter = new RateLimiter({ maxRequestsPerSecond: 20 });
    const start = Date.now();

    for (let i = 0; i < 50; i++) {
      await limiter.acquire();
      limiter.release();
    }

    const duration = Date.now() - start;
    // 50 requests at 20/sec = minimum 2.5 seconds
    assert(duration >= 2000, `Rate limiting too fast: ${duration}ms (expected ≥2000ms)`);
    console.log(`    50 rate-limited acquires in ${duration}ms`);
  });

  await runTest('ABS fallback enrichment handles all suburbs rapidly', async () => {
    const start = Date.now();
    const result = await absCensusService.enrichAllSuburbs({ useFallback: true });
    const duration = Date.now() - start;

    assert(result.total >= 10, 'Should process at least 10 suburbs');
    assert(duration < 5000, `Fallback enrichment too slow: ${duration}ms`);
    console.log(`    ${result.total} suburbs enriched in ${duration}ms`);
  });

  await runTest('Overpass handles rapid sequential queries', async () => {
    // Make 3 quick queries (rate limiter should space them)
    const start = Date.now();
    const locations = [
      [-27.4698, 153.0251], // Brisbane CBD
      [-27.4573, 153.0455], // New Farm
      [-27.4977, 153.0013], // St Lucia
    ];

    for (const [lat, lng] of locations) {
      const pois = await overpassService.getPOIContext(lat, lng, 500);
      assert(typeof pois.cafes.length === 'number', 'Should return data');
    }

    const duration = Date.now() - start;
    console.log(`    3 Overpass queries in ${duration}ms`);
  });

  await runTest('ABS enrichSuburb handles all 12 seeded suburbs', async () => {
    const suburbs = [
      'Brisbane City', 'New Farm', 'Fortitude Valley', 'South Brisbane',
      'West End', 'Paddington', 'Toowong', 'St Lucia',
      'Bulimba', 'Hawthorne', 'Teneriffe', 'Woolloongabba',
    ];

    const results: any[] = [];
    for (const suburb of suburbs) {
      const result = await absCensusService.enrichSuburb(suburb);
      results.push(result);
    }

    const withData = results.filter(r => r.population || r.medianAge);
    assert(withData.length >= 10, `Expected ≥10 suburbs with data, got ${withData.length}`);
    console.log(`    ${withData.length}/${suburbs.length} suburbs have demographic data`);
  });
}

// ============================================================
// INTEGRATION TESTS — End-to-end data flow
// ============================================================

async function testIntegration() {
  console.log('\n🔗 Integration Tests');

  await runTest('Full enrichment pipeline: ABS → Overpass → verify matching data', async () => {
    // Step 1: Enrich suburbs with ABS data
    const absResult = await absCensusService.enrichAllSuburbs({ useFallback: true });
    assert(absResult.updated > 0, 'ABS should update suburbs');

    // Step 2: Get suburb profiles and verify they have demographic data
    const profiles = await absCensusService.getSuburbProfiles('Brisbane');
    const enrichedProfiles = profiles.filter(p => p.population && p.medianIncome);
    assert(enrichedProfiles.length > 0, 'Should have enriched profiles');

    // Step 3: Verify data is usable by checking income levels exist
    const incomeLevels = new Set(profiles.map(p => p.incomeLevel));
    assert(incomeLevels.size >= 2, `Expected ≥2 income levels, got ${incomeLevels.size}: ${[...incomeLevels]}`);

    console.log(`    Pipeline: ${absResult.updated} suburbs enriched, ${enrichedProfiles.length} with full data`);
    console.log(`    Income levels: ${[...incomeLevels].join(', ')}`);
  });

  await runTest('Suburb profiles align with cafe data', async () => {
    const profiles = await absCensusService.getSuburbProfiles('Brisbane');
    const suburbsWithCafes = profiles.filter(p => p.cafeCount > 0);

    assert(suburbsWithCafes.length > 0, 'Should have suburbs with cafes');

    // Verify the suburbs with most cafes have reasonable demographics
    const topSuburbs = suburbsWithCafes.sort((a, b) => b.cafeCount - a.cafeCount).slice(0, 5);
    for (const s of topSuburbs) {
      console.log(`    ${s.suburb}: ${s.cafeCount} cafes, pop=${s.population}, income=$${s.medianIncome}, demo=${s.primaryDemographic}`);
    }
  });

  await runTest('Competition map data is consistent', async () => {
    const map = await overpassService.getCompetitionMap();
    const { prisma } = await import('../src/lib/prisma.js');
    const ourCafeCount = await prisma.cafe.count({ where: { city: 'Brisbane', isActive: true } });

    const totalOurCafes = map.reduce((s, m) => s + m.ourCafeCount, 0);
    assert(totalOurCafes === ourCafeCount, `Competition map our count (${totalOurCafes}) should match DB count (${ourCafeCount})`);

    console.log(`    Our cafes: ${totalOurCafes}, OSM cafes: ${map.reduce((s, m) => s + m.osmCafeCount, 0)}`);
  });
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  FeidUp Data Enrichment — Comprehensive Stress Test');
  console.log('═══════════════════════════════════════════════════════════');

  const startTime = Date.now();

  await testHttpClient();
  await testABSCensus();
  await testGooglePlaces();
  await testOverpass();
  await testStress();
  await testIntegration();

  const totalDuration = Date.now() - startTime;

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`  Results: ${totalPassed} passed, ${totalFailed} failed (${totalDuration / 1000}s)`);
  console.log('═══════════════════════════════════════════════════════════');

  if (totalFailed > 0) {
    console.log('\nFailed tests:');
    for (const r of results.filter(r => !r.passed)) {
      console.log(`  ❌ ${r.name}: ${r.error}`);
    }
  }

  console.log('\nSlowest tests:');
  const sorted = [...results].sort((a, b) => b.duration - a.duration);
  for (const r of sorted.slice(0, 5)) {
    console.log(`  ${r.passed ? '✅' : '❌'} ${r.name}: ${r.duration}ms`);
  }

  process.exit(totalFailed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
