// Seed script for FeidUp CRM + Location Backend
// Populates the database with realistic Brisbane data and default users

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Brisbane suburb reference data — comprehensive coverage
const brisbaneSuburbs = [
  // Inner city
  { suburb: 'Brisbane City', postcode: '4000', lat: -27.4698, lng: 153.0251, population: 12486, medianAge: 32, primaryDemographic: 'professionals', trendingInterests: ['coffee', 'business', 'fitness'] },
  { suburb: 'Spring Hill', postcode: '4000', lat: -27.4612, lng: 153.0241, population: 6800, medianAge: 33, primaryDemographic: 'professionals', trendingInterests: ['business', 'dining', 'fitness'] },
  { suburb: 'Kangaroo Point', postcode: '4169', lat: -27.4785, lng: 153.0355, population: 8200, medianAge: 31, primaryDemographic: 'young_professionals', trendingInterests: ['climbing', 'views', 'brunch'] },
  // Inner north
  { suburb: 'New Farm', postcode: '4005', lat: -27.4673, lng: 153.0505, population: 12822, medianAge: 35, primaryDemographic: 'young_professionals', trendingInterests: ['brunch', 'fitness', 'art'] },
  { suburb: 'Fortitude Valley', postcode: '4006', lat: -27.4567, lng: 153.0359, population: 9245, medianAge: 29, primaryDemographic: 'young_adults', trendingInterests: ['nightlife', 'music', 'fashion'] },
  { suburb: 'Teneriffe', postcode: '4005', lat: -27.4548, lng: 153.0463, population: 5234, medianAge: 34, primaryDemographic: 'young_professionals', trendingInterests: ['brunch', 'fitness', 'dogs'] },
  { suburb: 'Newstead', postcode: '4006', lat: -27.4482, lng: 153.0448, population: 4800, medianAge: 33, primaryDemographic: 'young_professionals', trendingInterests: ['gastronomy', 'lifestyle', 'fitness'] },
  { suburb: 'Albion', postcode: '4010', lat: -27.4315, lng: 153.0444, population: 5100, medianAge: 31, primaryDemographic: 'young_adults', trendingInterests: ['markets', 'craft', 'brunch'] },
  { suburb: 'Windsor', postcode: '4030', lat: -27.4358, lng: 153.0302, population: 7200, medianAge: 33, primaryDemographic: 'young_professionals', trendingInterests: ['cafes', 'vintage', 'cycling'] },
  { suburb: 'Wilston', postcode: '4051', lat: -27.4274, lng: 153.0123, population: 5600, medianAge: 37, primaryDemographic: 'families', trendingInterests: ['markets', 'family', 'organic'] },
  { suburb: 'Kelvin Grove', postcode: '4059', lat: -27.4498, lng: 153.0101, population: 8900, medianAge: 26, primaryDemographic: 'students', trendingInterests: ['university', 'arts', 'affordable'] },
  { suburb: 'Red Hill', postcode: '4059', lat: -27.4549, lng: 153.0050, population: 5400, medianAge: 35, primaryDemographic: 'young_professionals', trendingInterests: ['cafes', 'views', 'walking'] },
  { suburb: 'Herston', postcode: '4006', lat: -27.4440, lng: 153.0200, population: 4200, medianAge: 28, primaryDemographic: 'students', trendingInterests: ['hospital', 'study', 'quick-service'] },
  // Inner south
  { suburb: 'South Brisbane', postcode: '4101', lat: -27.4818, lng: 153.0205, population: 8523, medianAge: 31, primaryDemographic: 'professionals', trendingInterests: ['art', 'culture', 'food'] },
  { suburb: 'West End', postcode: '4101', lat: -27.4836, lng: 153.0077, population: 11234, medianAge: 34, primaryDemographic: 'creative_professionals', trendingInterests: ['organic', 'sustainability', 'arts'] },
  { suburb: 'Woolloongabba', postcode: '4102', lat: -27.4920, lng: 153.0343, population: 8123, medianAge: 30, primaryDemographic: 'young_professionals', trendingInterests: ['sports', 'food', 'nightlife'] },
  { suburb: 'Highgate Hill', postcode: '4101', lat: -27.4895, lng: 153.0140, population: 5100, medianAge: 33, primaryDemographic: 'creative_professionals', trendingInterests: ['views', 'organic', 'community'] },
  { suburb: 'Dutton Park', postcode: '4102', lat: -27.4975, lng: 153.0265, population: 3200, medianAge: 29, primaryDemographic: 'students', trendingInterests: ['university', 'parks', 'budget'] },
  // Inner east
  { suburb: 'Bulimba', postcode: '4171', lat: -27.4531, lng: 153.0609, population: 9612, medianAge: 38, primaryDemographic: 'families', trendingInterests: ['family', 'brunch', 'parks'] },
  { suburb: 'Hawthorne', postcode: '4171', lat: -27.4609, lng: 153.0542, population: 6834, medianAge: 39, primaryDemographic: 'affluent_families', trendingInterests: ['premium', 'boutique', 'fitness'] },
  { suburb: 'Morningside', postcode: '4170', lat: -27.4575, lng: 153.0700, population: 9800, medianAge: 34, primaryDemographic: 'young_professionals', trendingInterests: ['village', 'fitness', 'dogs'] },
  { suburb: 'Norman Park', postcode: '4170', lat: -27.4710, lng: 153.0610, population: 5200, medianAge: 36, primaryDemographic: 'families', trendingInterests: ['family', 'quiet', 'parks'] },
  { suburb: 'Coorparoo', postcode: '4151', lat: -27.4930, lng: 153.0575, population: 10400, medianAge: 34, primaryDemographic: 'young_professionals', trendingInterests: ['cinema', 'dining', 'sport'] },
  // Inner west
  { suburb: 'Paddington', postcode: '4064', lat: -27.4597, lng: 152.9992, population: 8912, medianAge: 36, primaryDemographic: 'families', trendingInterests: ['antiques', 'brunch', 'boutique'] },
  { suburb: 'Milton', postcode: '4064', lat: -27.4700, lng: 153.0010, population: 4500, medianAge: 30, primaryDemographic: 'young_professionals', trendingInterests: ['nightlife', 'dining', 'sport'] },
  { suburb: 'Auchenflower', postcode: '4066', lat: -27.4750, lng: 152.9920, population: 5100, medianAge: 29, primaryDemographic: 'students', trendingInterests: ['university', 'quiet', 'riverside'] },
  { suburb: 'Toowong', postcode: '4066', lat: -27.4847, lng: 152.9882, population: 14523, medianAge: 28, primaryDemographic: 'students', trendingInterests: ['study', 'coffee', 'budget'] },
  { suburb: 'St Lucia', postcode: '4067', lat: -27.4977, lng: 153.0013, population: 11834, medianAge: 24, primaryDemographic: 'students', trendingInterests: ['university', 'study', 'budget'] },
  { suburb: 'Taringa', postcode: '4068', lat: -27.4950, lng: 152.9780, population: 7800, medianAge: 30, primaryDemographic: 'students', trendingInterests: ['university', 'quiet', 'affordable'] },
  { suburb: 'Indooroopilly', postcode: '4068', lat: -27.5010, lng: 152.9720, population: 12100, medianAge: 32, primaryDemographic: 'families', trendingInterests: ['shopping', 'family', 'cinema'] },
  { suburb: 'Bardon', postcode: '4065', lat: -27.4570, lng: 152.9800, population: 9400, medianAge: 40, primaryDemographic: 'families', trendingInterests: ['bushwalking', 'family', 'quiet'] },
  { suburb: 'Ashgrove', postcode: '4060', lat: -27.4410, lng: 152.9890, population: 11200, medianAge: 38, primaryDemographic: 'families', trendingInterests: ['family', 'sport', 'cafes'] },
  // Outer suburbs
  { suburb: 'Chermside', postcode: '4032', lat: -27.3856, lng: 153.0321, population: 9800, medianAge: 35, primaryDemographic: 'families', trendingInterests: ['shopping', 'family', 'dining'] },
  { suburb: 'Nundah', postcode: '4012', lat: -27.4021, lng: 153.0617, population: 12500, medianAge: 32, primaryDemographic: 'young_professionals', trendingInterests: ['village', 'cafes', 'cycling'] },
  { suburb: 'Clayfield', postcode: '4011', lat: -27.4193, lng: 153.0575, population: 7800, medianAge: 36, primaryDemographic: 'affluent_families', trendingInterests: ['premium', 'dining', 'leafy'] },
  { suburb: 'Ascot', postcode: '4007', lat: -27.4280, lng: 153.0600, population: 5600, medianAge: 40, primaryDemographic: 'affluent_families', trendingInterests: ['racing', 'premium', 'brunch'] },
  { suburb: 'Hamilton', postcode: '4007', lat: -27.4390, lng: 153.0630, population: 6100, medianAge: 35, primaryDemographic: 'affluent_families', trendingInterests: ['portside', 'dining', 'lifestyle'] },
  { suburb: 'Carindale', postcode: '4152', lat: -27.5055, lng: 153.1025, population: 15200, medianAge: 37, primaryDemographic: 'families', trendingInterests: ['shopping', 'family', 'sport'] },
  { suburb: 'Mount Gravatt', postcode: '4122', lat: -27.5350, lng: 153.0780, population: 8900, medianAge: 31, primaryDemographic: 'students', trendingInterests: ['university', 'multicultural', 'food'] },
  { suburb: 'Sunnybank', postcode: '4109', lat: -27.5790, lng: 153.0630, population: 11600, medianAge: 33, primaryDemographic: 'families', trendingInterests: ['asian-food', 'multicultural', 'shopping'] },
  { suburb: 'Greenslopes', postcode: '4120', lat: -27.5070, lng: 153.0460, population: 7400, medianAge: 33, primaryDemographic: 'young_professionals', trendingInterests: ['hospital', 'cafes', 'cycling'] },
  { suburb: 'Camp Hill', postcode: '4152', lat: -27.4940, lng: 153.0740, population: 8100, medianAge: 36, primaryDemographic: 'families', trendingInterests: ['family', 'parks', 'cafes'] },
  // Gold Coast
  { suburb: 'Surfers Paradise', postcode: '4217', lat: -28.0027, lng: 153.4300, population: 23200, medianAge: 34, primaryDemographic: 'young_adults', trendingInterests: ['tourism', 'nightlife', 'beach'] },
  { suburb: 'Broadbeach', postcode: '4218', lat: -28.0268, lng: 153.4330, population: 8400, medianAge: 36, primaryDemographic: 'professionals', trendingInterests: ['dining', 'casino', 'beach'] },
  { suburb: 'Burleigh Heads', postcode: '4220', lat: -28.0870, lng: 153.4480, population: 10200, medianAge: 33, primaryDemographic: 'young_professionals', trendingInterests: ['surf', 'organic', 'fitness'] },
  { suburb: 'Coolangatta', postcode: '4225', lat: -28.1667, lng: 153.5360, population: 7100, medianAge: 38, primaryDemographic: 'mixed', trendingInterests: ['surf', 'airport', 'relaxed'] },
  { suburb: 'Robina', postcode: '4226', lat: -28.0780, lng: 153.3850, population: 18500, medianAge: 35, primaryDemographic: 'families', trendingInterests: ['shopping', 'family', 'sport'] },
  { suburb: 'Southport', postcode: '4215', lat: -27.9670, lng: 153.4020, population: 31400, medianAge: 32, primaryDemographic: 'young_adults', trendingInterests: ['chinatown', 'business', 'university'] },
  { suburb: 'Palm Beach', postcode: '4221', lat: -28.1120, lng: 153.4660, population: 13200, medianAge: 35, primaryDemographic: 'young_professionals', trendingInterests: ['surf', 'cafes', 'lifestyle'] },
  { suburb: 'Mermaid Beach', postcode: '4218', lat: -28.0450, lng: 153.4380, population: 7800, medianAge: 37, primaryDemographic: 'affluent_families', trendingInterests: ['premium', 'beach', 'dining'] },
  // Sunshine Coast
  { suburb: 'Maroochydore', postcode: '4558', lat: -26.6590, lng: 153.0990, population: 17800, medianAge: 36, primaryDemographic: 'professionals', trendingInterests: ['beach', 'business', 'surf'] },
  { suburb: 'Noosa Heads', postcode: '4567', lat: -26.3930, lng: 153.0870, population: 5200, medianAge: 42, primaryDemographic: 'affluent_families', trendingInterests: ['premium', 'nature', 'dining'] },
  { suburb: 'Caloundra', postcode: '4551', lat: -26.7980, lng: 153.1390, population: 11900, medianAge: 45, primaryDemographic: 'established', trendingInterests: ['beach', 'retirement', 'family'] },
  { suburb: 'Mooloolaba', postcode: '4557', lat: -26.6810, lng: 153.1190, population: 8200, medianAge: 35, primaryDemographic: 'young_professionals', trendingInterests: ['beach', 'wharf', 'fitness'] },
  { suburb: 'Nambour', postcode: '4560', lat: -26.6260, lng: 152.9590, population: 12400, medianAge: 38, primaryDemographic: 'families', trendingInterests: ['hinterland', 'markets', 'heritage'] },
  { suburb: 'Buderim', postcode: '4556', lat: -26.6840, lng: 153.0560, population: 28500, medianAge: 41, primaryDemographic: 'families', trendingInterests: ['views', 'family', 'markets'] },
  // Logan / Redlands / Bayside
  { suburb: 'Logan Central', postcode: '4114', lat: -27.6390, lng: 153.1080, population: 8700, medianAge: 29, primaryDemographic: 'young_adults', trendingInterests: ['multicultural', 'affordable', 'community'] },
  { suburb: 'Springwood', postcode: '4127', lat: -27.5980, lng: 153.1290, population: 12300, medianAge: 33, primaryDemographic: 'families', trendingInterests: ['shopping', 'family', 'sport'] },
  { suburb: 'Capalaba', postcode: '4157', lat: -27.5230, lng: 153.1870, population: 14800, medianAge: 35, primaryDemographic: 'families', trendingInterests: ['shopping', 'family', 'outdoor'] },
  { suburb: 'Cleveland', postcode: '4163', lat: -27.5260, lng: 153.2640, population: 15100, medianAge: 40, primaryDemographic: 'families', trendingInterests: ['bay', 'island', 'heritage'] },
  { suburb: 'Victoria Point', postcode: '4165', lat: -27.5850, lng: 153.2810, population: 16200, medianAge: 38, primaryDemographic: 'families', trendingInterests: ['bay', 'family', 'shopping'] },
  { suburb: 'Wynnum', postcode: '4178', lat: -27.4510, lng: 153.1710, population: 12800, medianAge: 36, primaryDemographic: 'families', trendingInterests: ['bay', 'village', 'cafes'] },
  { suburb: 'Manly', postcode: '4179', lat: -27.4580, lng: 153.1880, population: 4500, medianAge: 37, primaryDemographic: 'families', trendingInterests: ['harbour', 'dining', 'boating'] },
  // Ipswich / Western corridor
  { suburb: 'Ipswich', postcode: '4305', lat: -27.6140, lng: 152.7610, population: 6200, medianAge: 34, primaryDemographic: 'families', trendingInterests: ['heritage', 'affordable', 'community'] },
  { suburb: 'Springfield', postcode: '4300', lat: -27.6660, lng: 152.9070, population: 22000, medianAge: 30, primaryDemographic: 'young_families', trendingInterests: ['new-development', 'family', 'university'] },
  // Northern corridor
  { suburb: 'Caboolture', postcode: '4510', lat: -27.0850, lng: 152.9510, population: 14800, medianAge: 34, primaryDemographic: 'families', trendingInterests: ['rural', 'family', 'affordable'] },
  { suburb: 'North Lakes', postcode: '4509', lat: -27.2330, lng: 153.0180, population: 25400, medianAge: 31, primaryDemographic: 'young_families', trendingInterests: ['new-development', 'shopping', 'family'] },
  { suburb: 'Redcliffe', postcode: '4020', lat: -27.2290, lng: 153.1050, population: 12600, medianAge: 42, primaryDemographic: 'established', trendingInterests: ['seaside', 'markets', 'heritage'] },
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
  // Newstead
  { name: 'Newstead Brew Co', address: '88 Skyring Terrace', suburb: 'Newstead', postcode: '4006', lat: -27.4482, lng: 153.0448, avgDailyFootTraffic: 400, packagingVolume: 250, demographics: { primaryAge: '25-40', income: 'high', type: 'young_professionals' }, tags: ['riverside', 'modern', 'gastro'] },
  // Spring Hill
  { name: 'Spring Hill Deli Cafe', address: '14 Astor Terrace', suburb: 'Spring Hill', postcode: '4000', lat: -27.4612, lng: 153.0241, avgDailyFootTraffic: 280, packagingVolume: 160, demographics: { primaryAge: '25-45', income: 'medium-high', type: 'professionals' }, tags: ['heritage', 'local', 'quick-service'] },
  // Kangaroo Point
  { name: 'Story Bridge Cafe', address: '45 Main Street', suburb: 'Kangaroo Point', postcode: '4169', lat: -27.4785, lng: 153.0355, avgDailyFootTraffic: 350, packagingVolume: 200, demographics: { primaryAge: '25-40', income: 'medium-high', type: 'young_professionals' }, tags: ['riverside', 'views', 'brunch'] },
  // Kelvin Grove
  { name: 'QUT Kelvin Grove Cafe', address: 'Victoria Park Road', suburb: 'Kelvin Grove', postcode: '4059', lat: -27.4498, lng: 153.0101, avgDailyFootTraffic: 550, packagingVolume: 350, demographics: { primaryAge: '18-28', income: 'low', type: 'students' }, tags: ['university', 'student', 'quick-service'] },
  // Windsor
  { name: 'Windsor Espresso', address: '190 Lutwyche Road', suburb: 'Windsor', postcode: '4030', lat: -27.4358, lng: 153.0302, avgDailyFootTraffic: 280, packagingVolume: 170, demographics: { primaryAge: '25-38', income: 'medium', type: 'young_professionals' }, tags: ['local', 'vintage', 'cozy'] },
  // Woolloongabba
  { name: 'Gabba Central Coffee', address: '104 Logan Road', suburb: 'Woolloongabba', postcode: '4102', lat: -27.4920, lng: 153.0343, avgDailyFootTraffic: 380, packagingVolume: 220, demographics: { primaryAge: '22-35', income: 'medium', type: 'young_adults' }, tags: ['sports', 'local', 'lively'] },
  // Morningside
  { name: 'Morningside Social', address: '620 Wynnum Road', suburb: 'Morningside', postcode: '4170', lat: -27.4575, lng: 153.0700, avgDailyFootTraffic: 320, packagingVolume: 200, demographics: { primaryAge: '28-42', income: 'medium-high', type: 'families' }, tags: ['village', 'family-friendly', 'dogs-welcome'] },
  // Coorparoo
  { name: 'Coorparoo Corner', address: '283 Old Cleveland Road', suburb: 'Coorparoo', postcode: '4151', lat: -27.4930, lng: 153.0575, avgDailyFootTraffic: 290, packagingVolume: 180, demographics: { primaryAge: '25-40', income: 'medium-high', type: 'young_professionals' }, tags: ['local', 'brunch', 'cinema-adjacent'] },
  // Milton
  { name: 'Milton Mango', address: '22 Park Road', suburb: 'Milton', postcode: '4064', lat: -27.4700, lng: 153.0010, avgDailyFootTraffic: 450, packagingVolume: 280, demographics: { primaryAge: '22-38', income: 'medium-high', type: 'young_professionals' }, tags: ['suncorp-adjacent', 'nightlife', 'modern'] },
  // Indooroopilly
  { name: 'Indro Coffee Hub', address: '318 Moggill Road', suburb: 'Indooroopilly', postcode: '4068', lat: -27.5010, lng: 152.9720, avgDailyFootTraffic: 400, packagingVolume: 250, demographics: { primaryAge: '25-45', income: 'medium-high', type: 'families' }, tags: ['shopping', 'family', 'high-traffic'] },
  // Ashgrove
  { name: 'Ashgrove Roast', address: '160 Waterworks Road', suburb: 'Ashgrove', postcode: '4060', lat: -27.4410, lng: 152.9890, avgDailyFootTraffic: 260, packagingVolume: 160, demographics: { primaryAge: '30-50', income: 'high', type: 'families' }, tags: ['local', 'family', 'organic'] },
  // Nundah
  { name: 'Nundah Village Brew', address: '8 Station Street', suburb: 'Nundah', postcode: '4012', lat: -27.4021, lng: 153.0617, avgDailyFootTraffic: 350, packagingVolume: 210, demographics: { primaryAge: '25-38', income: 'medium', type: 'young_professionals' }, tags: ['village', 'cycling', 'local'] },
  // Hamilton
  { name: 'Portside Espresso', address: 'Portside Wharf', suburb: 'Hamilton', postcode: '4007', lat: -27.4390, lng: 153.0630, avgDailyFootTraffic: 480, packagingVolume: 300, demographics: { primaryAge: '30-50', income: 'high', type: 'affluent_families' }, tags: ['premium', 'portside', 'dining'] },
  // Wynnum
  { name: 'Bay Breeze Cafe', address: '68 Bay Terrace', suburb: 'Wynnum', postcode: '4178', lat: -27.4510, lng: 153.1710, avgDailyFootTraffic: 310, packagingVolume: 190, demographics: { primaryAge: '30-50', income: 'medium', type: 'families' }, tags: ['bay', 'village', 'family-friendly'] },
  // Chermside
  { name: 'Chermside Brew Hub', address: '700 Gympie Road', suburb: 'Chermside', postcode: '4032', lat: -27.3856, lng: 153.0321, avgDailyFootTraffic: 520, packagingVolume: 320, demographics: { primaryAge: '25-50', income: 'medium', type: 'families' }, tags: ['shopping-centre', 'high-traffic', 'family'] },
  // Gold Coast
  { name: 'Surfers Paradise Sunrise', address: '3118 Gold Coast Highway', suburb: 'Surfers Paradise', postcode: '4217', lat: -28.0027, lng: 153.4300, avgDailyFootTraffic: 700, packagingVolume: 400, demographics: { primaryAge: '20-40', income: 'medium', type: 'tourists_locals' }, tags: ['beach', 'tourist', 'high-traffic'] },
  { name: 'Burleigh Social', address: '1841 Gold Coast Highway', suburb: 'Burleigh Heads', postcode: '4220', lat: -28.0870, lng: 153.4480, avgDailyFootTraffic: 500, packagingVolume: 310, demographics: { primaryAge: '25-40', income: 'medium-high', type: 'young_professionals' }, tags: ['surf', 'organic', 'trendy'] },
  { name: 'Broadbeach Blend', address: '12 Albert Avenue', suburb: 'Broadbeach', postcode: '4218', lat: -28.0268, lng: 153.4330, avgDailyFootTraffic: 420, packagingVolume: 260, demographics: { primaryAge: '25-50', income: 'high', type: 'professionals' }, tags: ['casino-adjacent', 'premium', 'dining'] },
  { name: 'Southport Central Cafe', address: '56 Scarborough Street', suburb: 'Southport', postcode: '4215', lat: -27.9670, lng: 153.4020, avgDailyFootTraffic: 380, packagingVolume: 230, demographics: { primaryAge: '20-35', income: 'medium', type: 'young_adults' }, tags: ['chinatown', 'multicultural', 'student'] },
  { name: 'Palm Beach Grind', address: '1100 Gold Coast Highway', suburb: 'Palm Beach', postcode: '4221', lat: -28.1120, lng: 153.4660, avgDailyFootTraffic: 340, packagingVolume: 210, demographics: { primaryAge: '25-40', income: 'medium-high', type: 'young_professionals' }, tags: ['surf', 'lifestyle', 'brunch'] },
  // Sunshine Coast
  { name: 'Mooloolaba Wharf Cafe', address: '123 Parkyn Parade', suburb: 'Mooloolaba', postcode: '4557', lat: -26.6810, lng: 153.1190, avgDailyFootTraffic: 450, packagingVolume: 270, demographics: { primaryAge: '25-50', income: 'medium-high', type: 'tourists_locals' }, tags: ['wharf', 'beach', 'tourist'] },
  { name: 'Maroochydore Main Street', address: '10 Ocean Street', suburb: 'Maroochydore', postcode: '4558', lat: -26.6590, lng: 153.0990, avgDailyFootTraffic: 380, packagingVolume: 230, demographics: { primaryAge: '25-45', income: 'medium', type: 'professionals' }, tags: ['cbd', 'business', 'local'] },
  { name: 'Noosa Heads Roasters', address: '2 Hastings Street', suburb: 'Noosa Heads', postcode: '4567', lat: -26.3930, lng: 153.0870, avgDailyFootTraffic: 600, packagingVolume: 350, demographics: { primaryAge: '30-55', income: 'high', type: 'affluent_families' }, tags: ['premium', 'tourist', 'hastings-street'] },
  { name: 'Caloundra Coastal Brew', address: '77 Bulcock Street', suburb: 'Caloundra', postcode: '4551', lat: -26.7980, lng: 153.1390, avgDailyFootTraffic: 290, packagingVolume: 170, demographics: { primaryAge: '35-60', income: 'medium', type: 'established' }, tags: ['beach', 'retirement', 'family'] },
  // Logan & Redlands
  { name: 'Springwood Coffee Co', address: '60 Rochedale Road', suburb: 'Springwood', postcode: '4127', lat: -27.5980, lng: 153.1290, avgDailyFootTraffic: 340, packagingVolume: 200, demographics: { primaryAge: '25-45', income: 'medium', type: 'families' }, tags: ['shopping', 'family', 'community'] },
  { name: 'Capalaba Central Cafe', address: '38 Redland Bay Road', suburb: 'Capalaba', postcode: '4157', lat: -27.5230, lng: 153.1870, avgDailyFootTraffic: 310, packagingVolume: 190, demographics: { primaryAge: '25-50', income: 'medium', type: 'families' }, tags: ['shopping', 'local', 'family'] },
  { name: 'Cleveland Point Cafe', address: '1 North Street', suburb: 'Cleveland', postcode: '4163', lat: -27.5260, lng: 153.2640, avgDailyFootTraffic: 280, packagingVolume: 170, demographics: { primaryAge: '30-55', income: 'medium-high', type: 'families' }, tags: ['bay', 'heritage', 'relaxed'] },
  // Ipswich & West
  { name: 'Ipswich CBD Coffee', address: '80 Brisbane Street', suburb: 'Ipswich', postcode: '4305', lat: -27.6140, lng: 152.7610, avgDailyFootTraffic: 260, packagingVolume: 160, demographics: { primaryAge: '25-50', income: 'medium', type: 'professionals' }, tags: ['heritage', 'local', 'community'] },
  { name: 'Springfield Orion Brew', address: 'Orion Springfield Central', suburb: 'Springfield', postcode: '4300', lat: -27.6660, lng: 152.9070, avgDailyFootTraffic: 420, packagingVolume: 260, demographics: { primaryAge: '25-40', income: 'medium', type: 'young_families' }, tags: ['new-development', 'shopping', 'family'] },
  // Northern corridor
  { name: 'North Lakes Lakeside', address: 'North Lakes Boulevard', suburb: 'North Lakes', postcode: '4509', lat: -27.2330, lng: 153.0180, avgDailyFootTraffic: 480, packagingVolume: 290, demographics: { primaryAge: '25-45', income: 'medium', type: 'families' }, tags: ['shopping', 'new-development', 'family'] },
  { name: 'Redcliffe Waterfront', address: '133 Redcliffe Parade', suburb: 'Redcliffe', postcode: '4020', lat: -27.2290, lng: 153.1050, avgDailyFootTraffic: 320, packagingVolume: 190, demographics: { primaryAge: '35-55', income: 'medium', type: 'established' }, tags: ['seaside', 'heritage', 'markets'] },
  { name: 'Caboolture Hub Cafe', address: '18 King Street', suburb: 'Caboolture', postcode: '4510', lat: -27.0850, lng: 152.9510, avgDailyFootTraffic: 250, packagingVolume: 150, demographics: { primaryAge: '25-50', income: 'low-medium', type: 'families' }, tags: ['local', 'community', 'affordable'] },
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
  await prisma.qRScan.deleteMany();
  await prisma.qRCode.deleteMany();
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
      firstName: 'Sales',
      lastName: 'FeidUp',
      role: 'sales',
    },
  });
  
  await prisma.user.create({
    data: {
      email: 'ops@feidup.com',
      passwordHash,
      firstName: 'Operations',
      lastName: 'FeidUp',
      role: 'operations',
    },
  });
  
  console.log('  ✓ Created 3 staff users (admin@feidup.com / sales@feidup.com / ops@feidup.com, password: password123)');
  // Note: advertiser/restaurant users will be linked after entities are created

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
  const createdCafes = [];
  for (const cafe of brisbaneCafes) {
    const created = await prisma.cafe.create({
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
    createdCafes.push(created);
  }
  console.log(`  ✓ Created ${brisbaneCafes.length} cafes`);

  // Seed advertisers
  console.log('Seeding advertisers...');
  const createdAdvertisers = [];
  for (const advertiser of sampleAdvertisers) {
    const created = await prisma.advertiser.create({
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
    createdAdvertisers.push(created);
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

  // Link demo users to entities
  console.log('Linking demo users to entities...');
  const firstAdvertiser = createdAdvertisers[0];
  const firstCafe = createdCafes[0];

  const advertiserUser = await prisma.user.create({
    data: {
      email: 'advertiser@feidup.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'Advertiser',
      role: 'advertiser',
      advertiserId: firstAdvertiser.id,
    },
  });

  const restaurantUser = await prisma.user.create({
    data: {
      email: 'restaurant@feidup.com',
      passwordHash,
      firstName: 'Demo',
      lastName: 'Restaurant',
      role: 'restaurant',
      restaurantId: firstCafe.id,
    },
  });
  console.log('  ✓ Created linked demo users (advertiser@feidup.com → FitLife Brisbane, restaurant@feidup.com → Central Perk Coffee)');

  // Seed campaigns with placements
  console.log('Seeding campaigns...');
  const campaign1 = await prisma.campaign.create({
    data: {
      advertiserId: firstAdvertiser.id,
      name: 'FitLife Brisbane Summer Push',
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-04-15'),
      status: 'active',
      packagingQuantity: 5000,
      packagingType: 'cups',
      adFormat: 'qr_code',
      budget: 3500,
      totalImpressions: 12500,
      estimatedImpressions: 15000,
      targetSuburbs: JSON.stringify(['New Farm', 'Teneriffe', 'Fortitude Valley']),
    },
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      advertiserId: createdAdvertisers[1].id,
      name: 'Language School Uni Semester',
      startDate: new Date('2026-02-20'),
      endDate: new Date('2026-06-30'),
      status: 'active',
      packagingQuantity: 3000,
      packagingType: 'cups',
      adFormat: 'qr_code',
      budget: 2200,
      totalImpressions: 7500,
      estimatedImpressions: 10000,
      targetSuburbs: JSON.stringify(['St Lucia', 'Toowong']),
    },
  });

  const campaign3 = await prisma.campaign.create({
    data: {
      advertiserId: createdAdvertisers[2].id,
      name: 'River City FinTech Launch',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-05-31'),
      status: 'active',
      packagingQuantity: 4000,
      packagingType: 'cups',
      adFormat: 'qr_code',
      budget: 5000,
      totalImpressions: 9800,
      estimatedImpressions: 12000,
      targetSuburbs: JSON.stringify(['Brisbane City', 'South Brisbane']),
    },
  });
  console.log('  ✓ Created 3 campaigns');

  // Seed placements
  console.log('Seeding placements...');
  const placements = [
    { campaignId: campaign1.id, cafeId: createdCafes[2].id, matchScore: 92, matchReason: 'High foot traffic young professional area', status: 'active', estimatedDailyImpressions: 400 },
    { campaignId: campaign1.id, cafeId: createdCafes[3].id, matchScore: 85, matchReason: 'Arts/culture area with fitness interest', status: 'active', estimatedDailyImpressions: 350 },
    { campaignId: campaign1.id, cafeId: createdCafes[0].id, matchScore: 78, matchReason: 'CBD location, high traffic', status: 'active', estimatedDailyImpressions: 800 },
    { campaignId: campaign2.id, cafeId: createdCafes[13].id, matchScore: 95, matchReason: 'University campus - primary student demographic', status: 'active', estimatedDailyImpressions: 700 },
    { campaignId: campaign2.id, cafeId: createdCafes[12].id, matchScore: 88, matchReason: 'Student suburb, high volume', status: 'active', estimatedDailyImpressions: 500 },
    { campaignId: campaign3.id, cafeId: createdCafes[0].id, matchScore: 90, matchReason: 'CBD business professionals', status: 'active', estimatedDailyImpressions: 800 },
    { campaignId: campaign3.id, cafeId: createdCafes[1].id, matchScore: 87, matchReason: 'Eagle Street executive crowd', status: 'active', estimatedDailyImpressions: 650 },
    { campaignId: campaign3.id, cafeId: createdCafes[6].id, matchScore: 82, matchReason: 'South Brisbane creative professionals', status: 'active', estimatedDailyImpressions: 600 },
  ];

  const createdPlacements = [];
  for (const p of placements) {
    const created = await prisma.placement.create({ data: p });
    createdPlacements.push(created);
  }
  console.log(`  ✓ Created ${placements.length} placements`);

  // Seed QR codes
  console.log('Seeding QR codes...');
  const crypto = await import('crypto');
  const qrCodes = [];
  for (const p of createdPlacements) {
    const campaign = [campaign1, campaign2, campaign3].find(c => c.id === p.campaignId)!;
    // Create cafe QR code
    qrCodes.push({
      code: crypto.randomBytes(4).toString('hex'),
      type: 'cafe',
      targetUrl: 'https://example.com/cafe',
      campaignId: p.campaignId,
      cafeId: p.cafeId,
      placementId: p.id,
      advertiserId: campaign.advertiserId,
    });
    // Create advertiser QR code
    qrCodes.push({
      code: crypto.randomBytes(4).toString('hex'),
      type: 'advertiser',
      targetUrl: 'https://example.com/advertiser',
      campaignId: p.campaignId,
      cafeId: p.cafeId,
      placementId: p.id,
      advertiserId: campaign.advertiserId,
    });
  }
  await prisma.qRCode.createMany({ data: qrCodes });
  console.log(`  ✓ Created ${qrCodes.length} QR codes`);

  // Seed QR scans (50-100 sample scans)
  console.log('Seeding QR scans...');
  const allQRCodes = await prisma.qRCode.findMany();
  const devices = ['mobile', 'mobile', 'mobile', 'tablet', 'desktop']; // weighted toward mobile
  const oses = ['iOS', 'Android', 'iOS', 'macOS', 'Windows'];
  const browsers = ['Safari', 'Chrome', 'Safari', 'Chrome', 'Chrome'];
  const scanSuburbs = ['Brisbane City', 'New Farm', 'Fortitude Valley', 'South Brisbane', 'West End', 'Toowong', 'St Lucia', 'Paddington', 'Bulimba', null];

  const scanData = [];
  for (let i = 0; i < 80; i++) {
    const qr = allQRCodes[Math.floor(Math.random() * allQRCodes.length)];
    const dIdx = Math.floor(Math.random() * devices.length);
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursOffset = Math.floor(Math.random() * 14) + 6; // 6am-8pm
    const scanDate = new Date();
    scanDate.setDate(scanDate.getDate() - daysAgo);
    scanDate.setHours(hoursOffset, Math.floor(Math.random() * 60), 0, 0);

    scanData.push({
      qrCodeId: qr.id,
      deviceType: devices[dIdx],
      os: oses[dIdx],
      browser: browsers[dIdx],
      userAgent: `Mozilla/5.0 (${oses[dIdx]})`,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      scanSuburb: scanSuburbs[Math.floor(Math.random() * scanSuburbs.length)],
      redirected: Math.random() > 0.05,
      scannedAt: scanDate,
    });
  }
  await prisma.qRScan.createMany({ data: scanData });
  console.log(`  ✓ Created ${scanData.length} QR scans`);

  // Seed packaging batches and inventory
  console.log('Seeding packaging inventory...');
  const batch1 = await prisma.packagingBatch.create({
    data: {
      campaignId: campaign1.id,
      packagingType: 'cups',
      quantityProduced: 5000,
      quantityShipped: 4500,
      status: 'delivered',
      productionDate: new Date('2026-01-05'),
    },
  });
  const batch2 = await prisma.packagingBatch.create({
    data: {
      campaignId: campaign2.id,
      packagingType: 'cups',
      quantityProduced: 3000,
      quantityShipped: 2800,
      status: 'delivered',
      productionDate: new Date('2026-02-10'),
    },
  });

  // Allocate inventory to cafes
  await prisma.packagingInventory.create({
    data: {
      batchId: batch1.id,
      cafeId: createdCafes[0].id,
      quantityAllocated: 2000,
      quantityUsed: 1200,
      quantityRemaining: 800,
    },
  });
  await prisma.packagingInventory.create({
    data: {
      batchId: batch1.id,
      cafeId: createdCafes[2].id,
      quantityAllocated: 1500,
      quantityUsed: 900,
      quantityRemaining: 600,
    },
  });
  await prisma.packagingInventory.create({
    data: {
      batchId: batch2.id,
      cafeId: createdCafes[13].id,
      quantityAllocated: 1800,
      quantityUsed: 1100,
      quantityRemaining: 700,
    },
  });
  console.log('  ✓ Created packaging batches and inventory');

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
