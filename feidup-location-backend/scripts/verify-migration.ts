/**
 * FeidUp - Database Migration Verification
 * Checks that all tables and data were migrated successfully
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TableCount {
  table: string;
  count: number;
  expected: string;
}

async function verifyMigration() {
  console.log('🔍 Verifying Supabase migration...\n');

  const results: TableCount[] = [];

  try {
    // Count records in each table
    const counts = {
      users: await prisma.user.count(),
      advertisers: await prisma.advertiser.count(),
      cafes: await prisma.cafe.count(),
      campaigns: await prisma.campaign.count(),
      placements: await prisma.placement.count(),
      qrCodes: await prisma.qRCode.count(),
      qrScans: await prisma.qRScan.count(),
      leads: await prisma.lead.count(),
      activities: await prisma.activity.count(),
      suburbData: await prisma.suburbData.count(),
      packagingBatches: await prisma.packagingBatch.count(),
      packagingInventory: await prisma.packagingInventory.count(),
      analyticsEvents: await prisma.analyticsEvent.count(),
    };

    results.push(
      { table: 'Users', count: counts.users, expected: '5 test accounts' },
      { table: 'Advertisers', count: counts.advertisers, expected: '~5' },
      { table: 'Cafes', count: counts.cafes, expected: '48 seeded + 967 discovered = 1015' },
      { table: 'Campaigns', count: counts.campaigns, expected: '~3' },
      { table: 'Placements', count: counts.placements, expected: '~8' },
      { table: 'QR Codes', count: counts.qrCodes, expected: '~16' },
      { table: 'QR Scans', count: counts.qrScans, expected: '~80' },
      { table: 'Leads', count: counts.leads, expected: 'varies' },
      { table: 'Activities', count: counts.activities, expected: 'varies' },
      { table: 'Suburb Data', count: counts.suburbData, expected: '68 SEQ suburbs' },
      { table: 'Packaging Batches', count: counts.packagingBatches, expected: 'varies' },
      { table: 'Packaging Inventory', count: counts.packagingInventory, expected: 'varies' },
      { table: 'Analytics Events', count: counts.analyticsEvents, expected: 'varies' },
    );

    // Print results table
    console.log('📊 Table Row Counts:');
    console.log('════════════════════════════════════════════════════════');
    console.table(results);

    // Check for critical data
    console.log('\n🔑 Critical Data Checks:');
    console.log('────────────────────────────────────────────────────────');

    // Check test accounts
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@feidup.com' }
    });
    console.log(adminUser ? '✅ Admin account exists' : '❌ Admin account missing');

    const advertiserUser = await prisma.user.findUnique({
      where: { email: 'advertiser@feidup.com' }
    });
    console.log(advertiserUser ? '✅ Advertiser account exists' : '❌ Advertiser account missing');

    const restaurantUser = await prisma.user.findUnique({
      where: { email: 'restaurant@feidup.com' }
    });
    console.log(restaurantUser ? '✅ Restaurant account exists' : '❌ Restaurant account missing');

    // Check key cafes
    const centralPerk = await prisma.cafe.findFirst({
      where: { name: { contains: 'Central Perk' } }
    });
    console.log(centralPerk ? '✅ Central Perk Coffee exists' : '❌ Central Perk Coffee missing');

    // Check active campaigns
    const activeCampaigns = await prisma.campaign.findMany({
      where: { status: 'active' }
    });
    console.log(`✅ ${activeCampaigns.length} active campaigns`);

    // Check QR codes
    const activeQRCodes = await prisma.qRCode.findMany({
      where: { isActive: true }
    });
    console.log(`✅ ${activeQRCodes.length} active QR codes`);

    // Check Brisbane suburbs
    const brisbaneSuburbs = await prisma.suburbData.findMany({
      where: { city: 'Brisbane' }
    });
    console.log(`✅ ${brisbaneSuburbs.length} Brisbane suburbs in database`);

    console.log('\n════════════════════════════════════════════════════════');
    console.log('✅ Migration verification complete!\n');

    // Summary
    const totalRecords = Object.values(counts).reduce((a, b) => a + b, 0);
    console.log(`📈 Total records migrated: ${totalRecords.toLocaleString()}`);

  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyMigration();
