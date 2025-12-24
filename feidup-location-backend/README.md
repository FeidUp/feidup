# FeidUp Location Backend

A location-based advertising backend that intelligently matches advertisers to the most suitable cafes in Brisbane, Australia.

## Overview

FeidUp connects advertisers with physical cafes and restaurants by placing branded ads on custom packaging (e.g., coffee cups). This backend system provides:

- **Advertiser Management**: Create and manage advertiser profiles with targeting preferences
- **Cafe Partner Management**: Onboard cafes with location data, traffic metrics, and demographics
- **Intelligent Matching Engine**: Rule-based scoring algorithm that ranks cafes by relevance
- **Campaign Management**: Create campaigns with automatic or manual cafe selection
- **Explainable Recommendations**: Every recommendation comes with a human-readable explanation

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (with Prisma ORM)
- **Distance Calculations**: geolib

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or use Docker)
- npm or yarn

### 1. Install Dependencies

```bash
cd feidup-location-backend
npm install
```

### 2. Set Up Environment

```bash
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL` with your PostgreSQL connection string:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/feidup_dev?schema=public"
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed with sample Brisbane data
npm run db:seed
```

### 4. Start the Server

```bash
# Development mode with hot reload
npm run dev

# Or build and run production
npm run build
npm start
```

The server will start at `http://localhost:3001`.

## API Endpoints

### Health Check
- `GET /health` - Service health status
- `GET /health/ready` - Database readiness

### Advertisers
- `POST /api/advertisers` - Create advertiser
- `GET /api/advertisers` - List all advertisers
- `GET /api/advertisers/:id` - Get advertiser by ID
- `PUT /api/advertisers/:id` - Update advertiser
- `DELETE /api/advertisers/:id` - Delete advertiser

### Cafes
- `POST /api/cafes` - Create cafe
- `GET /api/cafes` - List all cafes (with filters)
- `GET /api/cafes/:id` - Get cafe by ID
- `GET /api/cafes/stats/suburbs` - Get statistics by suburb
- `PUT /api/cafes/:id` - Update cafe
- `PATCH /api/cafes/:id/metrics` - Update traffic metrics

### Recommendations (Core Feature)
- `GET /api/recommendations?advertiser_id=...` - Get matched cafes
- `GET /api/recommendations/area?advertiser_id=...&suburb=...` - Filter by area
- `GET /api/recommendations/explain?advertiser_id=...&cafe_id=...` - Explain match

### Campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns?advertiser_id=...` - List campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `PATCH /api/campaigns/:id/status` - Update status
- `POST /api/campaigns/:id/placements` - Add cafe placement

## Example Usage

### 1. Create an Advertiser

```bash
curl -X POST http://localhost:3001/api/advertisers \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "FitLife Gym",
    "industry": "fitness",
    "targetSuburbs": ["New Farm", "Teneriffe", "Fortitude Valley"],
    "targetRadiusKm": 5,
    "targetLocation": { "lat": -27.4573, "lng": 153.0455 },
    "targetAudience": {
      "ageRange": { "min": 22, "max": 40 },
      "interests": ["fitness", "health"]
    },
    "campaignGoal": "local_reach"
  }'
```

### 2. Get Recommendations

```bash
curl "http://localhost:3001/api/recommendations?advertiser_id=YOUR_ADVERTISER_ID"
```

Response:
```json
{
  "success": true,
  "data": {
    "advertiserId": "...",
    "advertiserName": "FitLife Gym",
    "targetSummary": "Suburbs: New Farm, Teneriffe, Fortitude Valley • 5km radius",
    "recommendations": [
      {
        "cafeId": "...",
        "name": "Brunswick Street Beans",
        "suburb": "New Farm",
        "matchScore": 85,
        "matchReason": "Located in target suburb: New Farm. Good foot traffic: 420 visitors/day.",
        "scoreBreakdown": {
          "locationScore": 36,
          "volumeScore": 25,
          "demographicScore": 15,
          "relevanceScore": 9
        },
        "distanceKm": 0.8,
        "estimatedDailyImpressions": 280
      }
    ],
    "totalCafesEvaluated": 17
  }
}
```

### 3. Create a Campaign with Auto-Selected Cafes

```bash
curl -X POST http://localhost:3001/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "advertiserId": "YOUR_ADVERTISER_ID",
    "name": "Summer Fitness Push",
    "autoSelectCafes": true,
    "startDate": "2025-01-01",
    "endDate": "2025-01-31"
  }'
```

## Matching Algorithm

The matching engine uses a weighted scoring system:

| Factor | Weight | Description |
|--------|--------|-------------|
| Location | 40% | Distance to target, suburb/postcode match |
| Volume | 30% | Foot traffic, packaging volume (impressions) |
| Demographics | 20% | Age range overlap, income level match |
| Relevance | 10% | Industry-to-cafe tag matching |

Each recommendation includes:
- **Final Score** (0-100)
- **Score Breakdown** by factor
- **Human-readable explanation**

## Scaling to ML

The system is designed to evolve:

1. **Data Collection**: Track accepted/rejected recommendations
2. **Feedback Loop**: Record campaign performance (impressions, engagement)
3. **Feature Engineering**: Add time-of-day, weather, events
4. **Model Training**: Replace rules with Learning-to-Rank (XGBoost, LightGBM)
5. **A/B Testing**: Compare rule-based vs ML recommendations

## Project Structure

```
feidup-location-backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Sample Brisbane data
├── src/
│   ├── config/            # Configuration
│   ├── lib/               # Prisma client
│   ├── middleware/        # Error handling
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   │   ├── matching.service.ts      # Core algorithm
│   │   ├── recommendation.service.ts
│   │   ├── advertiser.service.ts
│   │   ├── cafe.service.ts
│   │   └── campaign.service.ts
│   ├── types/             # TypeScript interfaces
│   └── index.ts           # Entry point
├── package.json
└── tsconfig.json
```

## License

Private - FeidUp Pty Ltd
