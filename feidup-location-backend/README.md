# FeidUp Location Backend

A location-based advertising backend that intelligently matches advertisers to the most suitable restaurants in Brisbane, Australia.

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
- **Database**: SQLite (dev) / PostgreSQL (prod) (with Prisma ORM)
- **Email**: Resend (transactional emails)
- **Distance Calculations**: geolib

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- (Optional) Resend API key for sending emails

### 1. Install Dependencies

```bash
cd feidup-location-backend
npm install
```

### 2. Set Up Environment

Create a `.env` file in the project root:

```env
# Database (SQLite for local dev)
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="feidup-dev-secret-change-in-production"

# Server
PORT=3002
NODE_ENV=development

# Frontend URL (used in password reset email links)
FRONTEND_URL="http://localhost:5174"

# Email (Resend) - leave empty for dev mode (reset links logged to console)
RESEND_API_KEY=""
FROM_EMAIL="FeidUp <noreply@feidup.com>"

# Google Maps (optional)
GOOGLE_MAPS_API_KEY=""
```

> **Note**: Without a `RESEND_API_KEY`, password reset links are logged to the backend console instead of being emailed. This is fine for local development.

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

The server will start at `http://localhost:3002`.

## API Endpoints

### Health Check
- `GET /health` - Service health status
- `GET /health/ready` - Database readiness

### Auth
- `POST /api/auth/login` - Login with email/password → returns JWT tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/users` - Create user (admin/sales only)
- `GET /api/auth/users` - List users (admin only)
- `PATCH /api/auth/users/:id` - Update user (admin only)

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
curl -X POST http://localhost:3002/api/advertisers \
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
curl "http://localhost:3002/api/recommendations?advertiser_id=YOUR_ADVERTISER_ID"
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
curl -X POST http://localhost:3002/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "advertiserId": "YOUR_ADVERTISER_ID",
    "name": "Summer Fitness Push",
    "autoSelectCafes": true,
    "startDate": "2025-01-01",
    "endDate": "2025-01-31"
  }'
```

## Password Reset Flow

The system supports a full self-service password reset:

1. User clicks "Forgot password?" on the login page
2. Backend generates a secure token (expires in 1 hour) and either:
   - **With `RESEND_API_KEY`**: Sends a branded HTML email via Resend with a reset link
   - **Without API key (dev mode)**: Logs the reset URL to the backend console
3. User clicks the link → enters new password (min 8 characters)
4. Backend validates token, hashes new password, marks token as used

Security features:
- Always returns success (prevents email enumeration)
- Tokens are single-use and expire after 1 hour
- Previous unused tokens are invalidated when a new one is requested
- All resets are recorded in the audit log

## Email Configuration

Transactional emails (password resets) are sent via [Resend](https://resend.com).

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | API key from Resend dashboard |
| `FROM_EMAIL` | Sender address (requires verified domain in Resend) |
| `FRONTEND_URL` | Base URL for reset links (e.g., `http://localhost:5174`) |

### Production Setup

1. Add your domain in Resend → Domains
2. Add the DNS records (DKIM TXT, SPF MX/TXT) to your DNS provider
3. Set `RESEND_API_KEY` and `FROM_EMAIL` in your production environment

**Current production config**: Domain `feidup.com` is verified with Resend. DNS is managed via Cloudflare. Incoming email (`info@feidup.com`) is routed via Cloudflare Email Routing to `feidup.2025@gmail.com`.

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
