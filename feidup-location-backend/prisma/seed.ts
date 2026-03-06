// Seed script for FeidUp CRM + Location Backend
// Populates the database with realistic Brisbane data and default users

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Brisbane suburb reference data
const brisbaneSuburbs = [
  { suburb: 'Brisbane City', postcode: '4000', lat: -27.4698, lng: 153.0251, population: 12500, medianAge: 32, primaryDemographic: 'professionals', trendingInterests: ['coffee', 'business', 'fitness'] },
  { suburb: 'New Farm', postcode: '4005', lat: -27.4673, lng: 153.0505, population: 12800, medianAge: 35, primaryDemographic: 'young_professionals', trendingInterests: ['brunch', 'fitness', 'art'] },
  { suburb: 'Fortitude Valley', postcode: '4006', lat: -27.4567, lng: 153.0359, population: 9200, medianAge: 29, primaryDemographic: 'young_adults', trendingInterests: ['nightlife', 'music', 'fashion'] },
  { suburb: 'South Brisbane', postcode: '4101', lat: -27.4818, lng: 153.0205, population: 8500, medianAge: 31, primaryDemographic: 'professionals', trendingInterests: ['art', 'culture', 'food'] },
  { suburb: 'West End', postcode: '4101', lat: -27.4836, lng: 153.0077, population: 11200, medianAge: 34, primaryDemographic: 'creative_professionals', trendingInterests: ['organic', 'sustainability', 'arts'] },
  { suburb: 'Paddington', postcode: '4064', lat: -27.4597, lng: 152.9992, population: 8900, medianAge: 36, primaryDemographic: 'families', trendingInterests: ['antiques', 'brunch', 'boutique'] },
  { suburb: 'Toowong', postcode: '4066', lat: -27.4847, lng: 152.9882, population: 14500, medianAge: 28, primaryDemographic: 'students', trendingInterests: ['study', 'coffee', 'budget'] },
  { suburb: 'St Lucia', postcode: '4067', lat: -27.4977, lng: 153.0013, population: 11800, medianAge: 24, primaryDemographic: 'students', trendingInterests: ['university', 'study', 'budget'] },
  { suburb: 'Bulimba', postcode: '4171', lat: -27.4531, lng: 153.0609, population: 9600, medianAge: 38, primaryDemographic: 'families', trendingInterests: ['family', 'brunch', 'parks'] },
  { suburb: 'Hawthorne', postcode: '4171', lat: -27.4609, lng: 153.0542, population: 6800, medianAge: 39, primaryDemographic: 'affluent_families', trendingInterests: ['premium', 'boutique', 'fitness'] },
  { suburb: 'Teneriffe', postcode: '4005', lat: -27.4548, lng: 153.0463, population: 5200, medianAge: 34, primaryDemographic: 'young_professionals', trendingInterests: ['brunch', 'fitness', 'dogs'] },
  { suburb: 'Woolloongabba', postcode: '4102', lat: -27.4920, lng: 153.0343, population: 8100, medianAge: 30, primaryDemographic: 'young_professionals', trendingInterests: ['sports', 'food', 'nightlife'] },
];

// Sample cafes across Brisbane
const brisbaneCafes = [
  // Brisbane City
  { name: 'Central Perk Coffee', address: '123 Queen Street', suburb: 'Brisbane City', postcode: '4000', lat: -27.4698, lng: 153.0251, avgDailyFootTraffic: 800, packagingVolume: 450, demographics: { primaryAge: '25-45', income: 'high', type: 'business_professionals' }, tags: ['cbd', 'business', 'high-traffic'] },
  { name: 'Eagle Street Espresso', address: '45 Eagle Street', suburb: 'Brisbane City', postcode: '4000', lat: -27.4671, lng: 153.0291, avgDailyFootTraffic: 650, packagingVolume: 380, demographics: { primaryAge: '30-50', income: 'high', type: 'executives' }, tags: ['riverside', 'premium', 'business'] },
  
  // New Farm
  { name: 'Brunswick Street Beans', address: '78 Brunswick Street', suburb: 'New Farm', postcode: '4005', lat: -27.4573, lng: 153.0455, avgDailyFootTraffic: 420, packagingVolume: 280, demographics: { primaryAge: '25-40', income: 'medium-high', type: 'young_professionals' }, tags: ['brunch', 'trendy', 'instagram'] },
  { name: 'Powerhouse Cafe', address: '119 Lamington Street', suburb: 'New Farm', postcode: '4005', lat: -27.4668, lng: 153.0511, avgDailyFootTraffic: 380, packagingVolume: 220, demographics: { primaryAge: '25-45', income: 'medium-high', type: 'arts_culture' }, tags: ['cultural', 'riverside', 'events'] },
  
  // Fortitude Valley
  { name: 'Valley Grind', address: '234 Brunswick Street', suburb: 'Fortitude Valley', postcode: '4006', lat: -27.4567, lng: 153.0359, avgDailyFootTraffic: 550, packagingVolume: 320, demographics: { primaryAge: '18-30', income: 'medium', type: 'young_adults' }, tags: ['nightlife-adjacent', 'trendy', 'music'] },
  { name: 'James Street Cafe', address: '12 James Street', suburb: 'Fortitude Valley', postcode: '4006', lat: -27.4534, lng: 153.0382, avgDailyFootTraffic: 480, packagingVolume: 290, demographics: { primaryAge: '25-40', income: 'high', type: 'fashion_conscious' }, tags: ['boutique', 'premium', 'fashion'] },
  
  // South Brisbane
  { name: 'GOMA Grounds', address: '1 Melbourne Street', suburb: 'South Brisbane', postcode: '4101', lat: -27.4718, lng: 153.0175, avgDailyFootTraffic: 600, packagingVolume: 350, demographics: { primaryAge: '25-50', income: 'medium-high', type: 'tourists_locals' }, tags: ['cultural', 'museum', 'tourists'] },
  { name: 'Fish Lane Roasters', address: '88 Fish Lane', suburb: 'South Brisbane', postcode: '4101', lat: -27.4788, lng: 153.0203, avgDailyFootTraffic: 320, packagingVolume: 200, demographics: { primaryAge: '22-35', income: 'medium', type: 'creative_professionals' }, tags: ['laneway', 'hipster', 'specialty'] },
  
  // West End
  { name: 'Boundary Street Brew', address: '156 Boundary Street', suburb: 'West End', postcode: '4101', lat: -27.4836, lng: 153.0077, avgDailyFootTraffic: 380, packagingVolume: 240, demographics: { primaryAge: '25-40', income: 'medium', type: 'alternative_creative' }, tags: ['organic', 'vegan-friendly', 'community'] },
  { name: 'West Village Coffee', address: '97 Boundary Street', suburb: 'West End', postcode: '4101', lat: -27.4811, lng: 153.0062, avgDailyFootTraffic: 450, packagingVolume: 280, demographics: { primaryAge: '28-45', income: 'medium-high', type: 'families_professionals' }, tags: ['modern', 'family-friendly', 'shopping'] },
  
  // Paddington
  { name: 'Given Terrace Grind', address: '201 Given Terrace', suburb: 'Paddington', postcode: '4064', lat: -27.4597, lng: 152.9992, avgDailyFootTraffic: 280, packagingVolume: 180, demographics: { primaryAge: '30-50', income: 'high', type: 'affluent_locals' }, tags: ['boutique', 'antiques', 'weekend'] },
  
  // Toowong
  { name: 'Toowong Village Cafe', address: '9 Sherwood Road', suburb: 'Toowong', postcode: '4066', lat: -27.4847, lng: 152.9882, avgDailyFootTraffic: 520, packagingVolume: 340, demographics: { primaryAge: '18-30', income: 'low-medium', type: 'students' }, tags: ['student', 'budget', 'study-friendly'] },
  
  // St Lucia
  { name: 'UQ Lakes Cafe', address: 'University of Queensland', suburb: 'St Lucia', postcode: '4067', lat: -27.4977, lng: 153.0013, avgDailyFootTraffic: 700, packagingVolume: 480, demographics: { primaryAge: '18-25', income: 'low', type: 'students' }, tags: ['university', 'student', 'high-volume'] },
  { name: 'Hawken Drive Coffee', address: '14 Hawken Drive', suburb: 'St Lucia', postcode: '4067', lat: -27.5012, lng: 152.9987, avgDailyFootTraffic: 350, packagingVolume: 220, demographics: { primaryAge: '18-28', income: 'low-medium', type: 'students_staff' }, tags: ['university', 'academic', 'quick-service'] },
  
  // Bulimba
  { name: 'Oxford Street Cafe', address: '45 Oxford Street', suburb: 'Bulimba', postcode: '4171', lat: -27.4531, lng: 153.0609, avgDailyFootTraffic: 340, packagingVolume: 210, demographics: { primaryAge: '30-45', income: 'high', type: 'families' }, tags: ['family', 'weekend', 'riverside'] },
  
  // Teneriffe
  { name: 'Woolstore Roasters', address: '24 Vernon Terrace', suburb: 'Teneriffe', postcode: '4005', lat: -27.4548, lng: 153.0463, avgDailyFootTraffic: 300, packagingVolume: 190, demographics: { primaryAge: '28-42', income: 'high', type: 'young_professionals' }, tags: ['warehouse', 'dogs-welcome', 'brunch'] },
];

// Sample advertisers
const sampleAdvertisers = [
  {
    businessName: 'FitLife Brisbane',
    industry: 'fitness',
    targetSuburbs: ['New Farm', 'Teneriffe', 'Fortitude Valley', 'Brisbane City'],
    targetPostcodes: ['4005', '4006', '4000'],
    targetRadiusKm: 5,
    targetLat: -27.4573,
    targetLng: 153.0455,
    targetAudience: { ageRange: { min: 22, max: 40 }, interests: ['fitness', 'health', 'wellness'], incomeLevel: 'medium-high' },
    campaignGoal: 'local_reach',
    contactEmail: 'marketing@fitlifebrisbane.com.au',
  },
  {
    businessName: 'Brisbane Language School',
    industry: 'education',
    targetSuburbs: ['St Lucia', 'Toowong', 'Brisbane City'],
    targetPostcodes: ['4067', '4066', '4000'],
    targetRadiusKm: 8,
    targetLat: -27.4977,
    targetLng: 153.0013,
    targetAudience: { ageRange: { min: 18, max: 35 }, interests: ['education', 'languages', 'travel'], incomeLevel: 'low-medium' },
    campaignGoal: 'brand_awareness',
    contactEmail: 'hello@brisbanelanguage.edu.au',
  },
  {
    businessName: 'River City FinTech',
    industry: 'fintech',
    targetSuburbs: ['Brisbane City', 'South Brisbane', 'Fortitude Valley'],
    targetPostcodes: ['4000', '4101', '4006'],
    targetRadiusKm: 3,
    targetLat: -27.4698,
    targetLng: 153.0251,
    targetAudience: { ageRange: { min: 25, max: 45 }, interests: ['technology', 'finance', 'startups'], incomeLevel: 'high' },
    campaignGoal: 'brand_awareness',
    contactEmail: 'growth@rivercityfintech.com.au',
  },
  {
    businessName: 'Organic Bites Brisbane',
    industry: 'food',
    targetSuburbs: ['West End', 'South Brisbane', 'Paddington', 'New Farm'],
    targetPostcodes: ['4101', '4064', '4005'],
    targetRadiusKm: 6,
    targetLat: -27.4836,
    targetLng: 153.0077,
    targetAudience: { ageRange: { min: 25, max: 50 }, interests: ['organic', 'sustainability', 'health'], incomeLevel: 'medium-high' },
    campaignGoal: 'local_reach',
    contactEmail: 'info@organicbitesbrisbane.com.au',
  },
  {
    businessName: 'Brisbane Art Gallery',
    industry: 'arts_culture',
    targetSuburbs: ['South Brisbane', 'West End', 'New Farm', 'Fortitude Valley'],
    targetPostcodes: ['4101', '4005', '4006'],
    targetRadiusKm: 5,
    targetLat: -27.4718,
    targetLng: 153.0175,
    targetAudience: { ageRange: { min: 20, max: 55 }, interests: ['art', 'culture', 'exhibitions'], incomeLevel: 'medium-high' },
    campaignGoal: 'event_promotion',
    contactEmail: 'marketing@brisbaneartgallery.org.au',
  },
];

async function main() {
  console.log('🌱 Seeding FeidUp database...\n');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.activity.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.usageReport.deleteMany();
  await prisma.packagingInventory.deleteMany();
  await prisma.packagingBatch.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();
  await prisma.advertiser.deleteMany();
  await prisma.cafe.deleteMany();
  await prisma.suburbData.deleteMany();

  // Seed default users
  console.log('Seeding users...');
  const passwordHash = await bcrypt.hash('password123', 12);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@feidup.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'FeidUp',
      role: 'admin',
    },
  });
  
  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@feidup.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Chen',
      role: 'sales',
    },
  });
  
  await prisma.user.create({
    data: {
      email: 'ops@feidup.com',
      passwordHash,
      firstName: 'Jake',
      lastName: 'Morrison',
      role: 'operations',
    },
  });
  
  console.log('  ✓ Created 3 staff users (admin@feidup.com / sales@feidup.com / ops@feidup.com, password: password123)');

  // Seed suburb data
  console.log('Seeding Brisbane suburbs...');
  for (const suburb of brisbaneSuburbs) {
    await prisma.suburbData.create({
      data: {
        suburb: suburb.suburb,
        postcode: suburb.postcode,
        city: 'Brisbane',
        lat: suburb.lat,
        lng: suburb.lng,
        population: suburb.population,
        medianAge: suburb.medianAge,
        primaryDemographic: suburb.primaryDemographic,
        trendingInterests: JSON.stringify(suburb.trendingInterests),
      },
    });
  }
  console.log(`  ✓ Created ${brisbaneSuburbs.length} suburbs`);

  // Seed cafes
  console.log('Seeding cafes...');
  for (const cafe of brisbaneCafes) {
    await prisma.cafe.create({
      data: {
        name: cafe.name,
        address: cafe.address,
        suburb: cafe.suburb,
        postcode: cafe.postcode,
        city: 'Brisbane',
        lat: cafe.lat,
        lng: cafe.lng,
        avgDailyFootTraffic: cafe.avgDailyFootTraffic,
        packagingVolume: cafe.packagingVolume,
        demographics: JSON.stringify(cafe.demographics),
        tags: JSON.stringify(cafe.tags),
        operatingHours: JSON.stringify({
          monday: { open: '06:30', close: '16:00' },
          tuesday: { open: '06:30', close: '16:00' },
          wednesday: { open: '06:30', close: '16:00' },
          thursday: { open: '06:30', close: '16:00' },
          friday: { open: '06:30', close: '16:00' },
          saturday: { open: '07:00', close: '15:00' },
          sunday: { open: '07:30', close: '14:00' },
        }),
      },
    });
  }
  console.log(`  ✓ Created ${brisbaneCafes.length} cafes`);

  // Seed advertisers
  console.log('Seeding advertisers...');
  for (const advertiser of sampleAdvertisers) {
    await prisma.advertiser.create({
      data: {
        businessName: advertiser.businessName,
        industry: advertiser.industry,
        targetSuburbs: JSON.stringify(advertiser.targetSuburbs),
        targetPostcodes: JSON.stringify(advertiser.targetPostcodes),
        targetRadiusKm: advertiser.targetRadiusKm,
        targetLat: advertiser.targetLat,
        targetLng: advertiser.targetLng,
        targetAudience: JSON.stringify(advertiser.targetAudience),
        campaignGoal: advertiser.campaignGoal,
        contactEmail: advertiser.contactEmail,
      },
    });
  }
  console.log(`  ✓ Created ${sampleAdvertisers.length} advertisers`);

  // Seed sample leads
  console.log('Seeding leads...');
  const sampleLeads = [
    { companyName: 'Gold Coast Fitness Hub', contactName: 'Mike Thompson', contactEmail: 'mike@gcfitness.com.au', type: 'advertiser', stage: 'lead', priority: 'high', source: 'website', estimatedValue: 5000, suburb: 'Surfers Paradise', city: 'Gold Coast' },
    { companyName: 'Sunshine Bakery', contactName: 'Emma Wilson', contactEmail: 'emma@sunshinebakery.com.au', type: 'restaurant', stage: 'contacted', priority: 'medium', source: 'cold_outreach', suburb: 'Maroochydore', city: 'Sunshine Coast' },
    { companyName: 'Springfield Dental', contactName: 'Dr James Liu', contactEmail: 'james@springfielddental.com.au', type: 'advertiser', stage: 'negotiation', priority: 'high', source: 'referral', estimatedValue: 8000, suburb: 'Springfield', city: 'Ipswich' },
    { companyName: 'The Daily Grind Ipswich', contactName: 'Olivia Brown', contactEmail: 'olivia@dailygrind.com.au', type: 'restaurant', stage: 'signed', priority: 'medium', source: 'cold_outreach', suburb: 'Ipswich', city: 'Ipswich' },
    { companyName: 'BrisVet Animal Hospital', contactName: 'Dr Sarah Park', contactEmail: 'sarah@brisvet.com.au', type: 'advertiser', stage: 'lead', priority: 'low', source: 'manual', estimatedValue: 3000, suburb: 'Indooroopilly', city: 'Brisbane' },
    { companyName: 'Currumbin Surf School', contactName: 'Brody Walsh', contactEmail: 'brody@currumbinsurf.com.au', type: 'advertiser', stage: 'contacted', priority: 'medium', source: 'website', estimatedValue: 4500, suburb: 'Currumbin', city: 'Gold Coast' },
  ];
  
  for (const lead of sampleLeads) {
    await prisma.lead.create({
      data: {
        ...lead,
        createdById: salesUser.id,
        assignedToId: salesUser.id,
      },
    });
  }
  console.log(`  ✓ Created ${sampleLeads.length} sample leads`);

  console.log('\n✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
