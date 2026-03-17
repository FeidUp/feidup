# FeidUp Platform — Technical Documentation

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────────────────┐     ┌────────────────────┐
│  feidup-website  │     │  feidup-location-backend     │     │    feidup-crm       │
│  (Next.js 16)    │     │  (Express + Prisma + SQLite) │     │  (React + Vite)     │
│                  │     │                              │     │                     │
│  Marketing site  │     │  API Server (port 3002)      │◄────│  3 Portal UIs       │
│  feidup.com      │     │                              │     │  (port 5174)        │
└─────────────────┘     └──────────┬───────────────────┘     └────────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              ┌─────▼─────┐ ┌─────▼────┐ ┌──────▼──────┐
              │ ABS Census │ │ Google   │ │ OpenStreet  │
              │ (free)     │ │ Places   │ │ Map/Overpass│
              │            │ │ ($0.017) │ │ (free)      │
              └────────────┘ └──────────┘ └─────────────┘
```

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | None | Login, returns JWT with role + entity IDs |
| POST | `/api/auth/refresh` | None | Refresh access token |
| GET | `/api/auth/me` | JWT | Current user profile |
| POST | `/api/auth/users` | Admin/Sales | Create user account |
| GET | `/api/auth/users` | Admin | List all users |
| PATCH | `/api/auth/users/:id` | Admin | Update user |
| POST | `/api/auth/forgot-password` | None | Send reset email |
| POST | `/api/auth/reset-password` | None | Reset password with token |

**Roles**: `admin`, `sales`, `operations`, `advertiser`, `restaurant`

**JWT Payload**: `{ userId, email, role, advertiserId?, restaurantId? }`

### Advertisers (`/api/advertisers`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/advertisers` | None | List all advertisers |
| GET | `/api/advertisers/:id` | None | Get advertiser |
| GET | `/api/advertisers/me` | Advertiser | Own advertiser + campaigns + scans |
| POST | `/api/advertisers` | None | Create advertiser |
| PUT | `/api/advertisers/:id` | None | Update advertiser |
| DELETE | `/api/advertisers/:id` | None | Delete advertiser |

### Cafes (`/api/cafes`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cafes` | None | List all cafes (filterable) |
| GET | `/api/cafes/:id` | None | Get cafe |
| GET | `/api/cafes/me` | Restaurant | Own cafe + inventory + placements |
| GET | `/api/cafes/stats/suburbs` | None | Suburb aggregates |
| POST | `/api/cafes` | None | Create cafe |
| PUT | `/api/cafes/:id` | None | Update cafe |
| PATCH | `/api/cafes/:id/metrics` | None | Update traffic metrics |
| DELETE | `/api/cafes/:id` | None | Delete cafe |

### Campaigns (`/api/campaigns`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/campaigns` | None | List campaigns (requires `advertiser_id`) |
| GET | `/api/campaigns/:id` | None | Get campaign with placements |
| POST | `/api/campaigns` | None | Create campaign (auto-selects cafes if `autoSelectCafes: true`) |
| PATCH | `/api/campaigns/:id/status` | None | Update campaign status |
| POST | `/api/campaigns/:id/placements` | None | Add cafe to campaign |
| DELETE | `/api/campaigns/:id` | None | Delete campaign |

### Recommendations (`/api/recommendations`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/recommendations` | None | AI recommendations (`advertiser_id` required) |
| GET | `/api/recommendations/area` | None | Recommendations filtered by suburb/postcode |
| GET | `/api/recommendations/explain` | None | Detailed scoring breakdown for one cafe |

### QR Tracking

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/qr/:code` | **None (public)** | Scan redirect — logs scan, 302 to target URL with UTM params |

### Analytics (`/api/analytics`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/overview` | Admin/Sales/Ops | System-wide stats |
| GET | `/api/analytics/campaign/:id` | Admin/Sales/Ops/Advertiser | Campaign analytics |
| GET | `/api/analytics/region` | Admin/Sales/Ops | Suburb-level analytics |
| GET | `/api/analytics/performance` | Admin/Sales | Top campaigns |
| GET | `/api/analytics/revenue` | Admin | Revenue data |
| GET | `/api/analytics/qr/overview` | Admin/Sales/Ops | QR system stats |
| GET | `/api/analytics/qr/live` | Admin/Sales/Ops | Last 50 scans |
| GET | `/api/analytics/qr/geography` | Admin/Sales/Ops | Scans by suburb |
| GET | `/api/analytics/qr/trends` | Admin/Sales/Ops | 90-day weekly trends |
| GET | `/api/analytics/qr/campaign/:id` | Admin/Sales/Ops/Advertiser | Campaign QR stats (scoped) |
| GET | `/api/analytics/qr/cafe/:id` | Admin/Sales/Ops/Restaurant | Cafe QR stats (scoped) |
| GET | `/api/analytics/conversions` | Admin/Sales/Ops | Funnel: codes → scans → redirects |

### Data Enrichment (`/api/enrichment`) — Admin/Ops only

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enrichment/health` | Check all 3 external API statuses |
| POST | `/api/enrichment/abs/suburbs` | Enrich suburbs with ABS Census data (`?fallback=true` for cached data) |
| GET | `/api/enrichment/abs/profiles` | Get enriched suburb demographic profiles |
| GET | `/api/enrichment/abs/sa2-codes` | ABS geographic code mapping |
| POST | `/api/enrichment/google/discover/:suburb` | Discover real cafes in a suburb via Google Places |
| POST | `/api/enrichment/google/discover-all` | Discover cafes across all Brisbane suburbs |
| POST | `/api/enrichment/google/import` | Import discovered cafes into database |
| POST | `/api/enrichment/google/enrich/:cafeId` | Refresh a cafe with Google data (rating, hours) |
| GET | `/api/enrichment/osm/cafes` | All Brisbane cafes from OpenStreetMap |
| GET | `/api/enrichment/osm/context/:cafeId` | POI context for a cafe (universities, offices, transit nearby) |
| POST | `/api/enrichment/osm/analyze-suburbs` | Analyze all suburbs for POI density |
| POST | `/api/enrichment/osm/enrich-cafes` | Add OSM-derived context tags to cafes |
| GET | `/api/enrichment/osm/competition-map` | Cafe density per suburb (our cafes vs OSM total) |

### Inventory (`/api/inventory`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/inventory` | JWT | List inventory allocations |
| GET | `/api/inventory/batches` | JWT | List packaging batches |
| POST | `/api/inventory/batches` | JWT | Create batch |
| PATCH | `/api/inventory/batches/:id` | JWT | Update batch status |
| POST | `/api/inventory/allocate` | JWT | Allocate inventory to cafe |
| POST | `/api/inventory/usage` | JWT | Report usage (cafe submits) |

---

## Matching Engine

The core algorithm scores cafes for advertisers across 4 weighted dimensions:

### Scoring Breakdown

| Dimension | Weight | What it measures | Data source |
|-----------|--------|------------------|-------------|
| **Location** | 40% | Distance to target, suburb/postcode match | Cafe coordinates, advertiser targeting |
| **Volume** | 30% | Foot traffic + packaging volume | Cafe metrics |
| **Demographic** | 20% | Age range + income level match | **ABS Census real data** per suburb |
| **Relevance** | 10% | Industry-tag + interest alignment | Cafe tags, OSM context tags |

### How ABS Census Data Feeds In

When scoring demographics, the engine:
1. Checks if the suburb has real ABS data (median age, median income)
2. Compares suburb median age against advertiser's target age range
3. Classifies suburb income ($31K=low, $62K=medium, $89K=high) and compares to target
4. Adds population density bonus for high-population suburbs
5. Cross-references suburb demographic type (students, professionals, families) with target age

Example: FitLife Brisbane targets ages 22-40, medium-high income:
- **New Farm** (age=35, income=$68,900) → GOOD MATCH (age in range, income=medium-high)
- **St Lucia** (age=24, income=$31,200) → WEAK MATCH (age near range, income=low)

### Industry Tag Mapping

| Industry | Relevant cafe tags |
|----------|-------------------|
| fitness | fitness, health, wellness, organic, active |
| education | student, university, study-friendly, academic |
| fintech | business, professional, cbd, premium |
| food | organic, vegan-friendly, brunch, specialty |
| arts_culture | cultural, museum, arts, creative |

---

## QR Code Tracking

### How It Works

1. **Generation**: When a campaign with QR format is created, paired QR codes are generated per placement (one cafe QR, one advertiser QR)
2. **Printing**: Each cup gets 2 QR codes — 8-character hex codes (e.g., `b5fe3900`)
3. **Scanning**: Customer scans → `GET /qr/b5fe3900` (no auth, public endpoint)
4. **Logging**: Server captures device type, OS, browser, IP, timestamp, and creates a QRScan record
5. **Redirect**: 302 redirect to target URL with UTM params appended:
   ```
   https://fitlife.com.au?utm_source=feidup_cup&utm_medium=print&utm_campaign={id}&utm_content={cafeId}
   ```
6. **Analytics**: Scans aggregate into daily trends, device breakdowns, suburb distributions, conversion funnels

### Data Captured Per Scan

| Field | How it's determined |
|-------|-------------------|
| Device type | User-Agent parsing (mobile/tablet/desktop) |
| OS | User-Agent parsing (iOS/Android/macOS/Windows) |
| Browser | User-Agent parsing (Safari/Chrome/Firefox/Edge) |
| IP address | Request IP |
| Suburb | From scan location or IP geolocation |
| Session ID | Random 16-char hex per scan |
| Redirected | Whether 302 redirect completed |

### Scope Security

- Restaurant users can only see QR analytics for their own cafe
- Advertiser users can only see QR analytics for their own campaigns
- Attempting to access another entity's data returns `403 Access denied`

---

## External API Integrations

### ABS Census API (Australian Bureau of Statistics)

- **URL**: `https://data.api.abs.gov.au/rest/data/`
- **Cost**: Free, no API key
- **Rate limit**: 2 requests/second (self-imposed)
- **Data**: Population, median age, median income per suburb (SA2 level)
- **Fallback**: Pre-compiled 2021 Census data for 12 Brisbane suburbs when API unavailable
- **Usage**: Feeds into matching engine demographic scoring

### Google Maps Places API (New)

- **URL**: `https://places.googleapis.com/v1/places:searchNearby`
- **Cost**: ~$0.017 per request
- **Key**: Set via `GOOGLE_MAPS_API_KEY` in `.env`
- **Data**: Cafe names, ratings, review counts, price level, opening hours, coordinates
- **Usage**: Discover new potential partner cafes, enrich existing cafe data
- **Foot traffic estimation**: `reviewCount × (rating >= 4.5 ? 2.0 : 1.0) / 365 × 10`

### OpenStreetMap Overpass API

- **URL**: `https://overpass-api.de/api/interpreter`
- **Cost**: Free, no key
- **Rate limit**: 1 request/second (self-imposed, Overpass is strict)
- **Data**: All cafes in Brisbane (977 found), nearby POIs (universities, offices, transit, parks, shops)
- **Usage**: Competition density mapping, POI context tags for matching, suburb analysis
- **Context tags derived**: `near-university`, `business-district`, `transit-hub`, `low-competition`, `shopping-area`

### Retry & Rate Limiting

All external API calls use shared infrastructure (`src/services/enrichment/http-client.ts`):
- Exponential backoff retry (max 3 retries, 1s → 10s delay)
- Per-service rate limiting (ABS: 2/s, Google: 5/s, Overpass: 1/s)
- 30-second request timeout
- 429 (rate limited) responses auto-retry after `Retry-After` header
- Batch processing with configurable concurrency

---

## CRM Portal Experiences

### Admin/Internal (admin, sales, operations)

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/` | Overview stats, pipeline, quick actions |
| Leads | `/leads` | Sales lead management with search/filter |
| Lead Detail | `/leads/:id` | Pipeline stage, activities, contact info |
| Pipeline | `/pipeline` | Kanban board view of lead stages |
| Advertisers | `/advertisers` | Advertiser grid with create/edit |
| Restaurants | `/restaurants` | Cafe partner grid with create/edit |
| Campaigns | `/campaigns` | Campaign management with AI recommendations |
| **Map View** | `/map` | Interactive Brisbane map with 3 layers (cafes/traffic/regions) |
| Inventory | `/inventory` | Packaging batches + cafe allocations |
| Analytics | `/analytics` | Overview tab + QR Analytics tab (funnel, geography, live feed) |
| Users | `/users` | Team + client account management |

### Cafe Portal (restaurant role)

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/` | Scan trends, inventory alerts, active campaigns |
| My Inventory | `/cafe/inventory` | Stock levels, report daily usage |
| QR Analytics | `/cafe/qr-analytics` | Daily scans, peak hours, device breakdown, cup travel map |
| My Cafe | `/cafe/profile` | Read-only profile, traffic metrics, demographics, hours |

### Advertiser Portal (advertiser role)

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/` | Scan count, campaign performance chart, campaign list |
| QR Analytics | `/advertiser/analytics` | Per-campaign drill-down, device/suburb breakdown, funnel |
| Recommended Cafes | `/advertiser/recommendations` | AI-matched cafes with scores and reasoning |

---

## Database Schema (Key Models)

| Model | Records | Purpose |
|-------|---------|---------|
| User | 5 | Auth + RBAC (linked to Advertiser or Cafe) |
| Advertiser | 5 | Businesses that want to advertise |
| Cafe | 16 | Physical cafe partners |
| Campaign | 3 | Advertising campaigns |
| Placement | 8 | Campaign → Cafe links with match scores |
| QRCode | 16 | Trackable QR codes (paired per placement) |
| QRScan | 80+ | Individual scan events |
| SuburbData | 12 | Brisbane suburb demographics (ABS enriched) |
| PackagingBatch | 2 | Production batches |
| PackagingInventory | 3 | Per-cafe stock allocations |
| Lead | 6 | Sales pipeline leads |

---

## UI Design System

### Theme

- **Dark mode** (default): Charcoal background (#0f0f0f), glass-effect cards, red accent (#dc2626)
- **Light mode**: Cream/white background, same glass cards with solid borders
- Toggle via sun/moon icon in sidebar footer
- All colors use CSS variables for theme switching

### Key CSS Classes

| Class | Effect |
|-------|--------|
| `glass-card` | Translucent card with subtle border |
| `animate-fade-in` | Fade up entrance animation |
| `animate-shimmer` | Loading skeleton shimmer |
| `text-gradient` | Red gradient text |
| `glow-red` | Ambient red box shadow |

### Map

- **Library**: React-Leaflet + Leaflet.js
- **Tiles**: CartoDB Dark Matter (dark mode) / CartoDB Light (light mode)
- **3 layers**: Cafe markers, traffic heatmap, region overlay
- **Custom markers**: Color-coded dots with glow shadow

---

## Development

```bash
# Backend
cd feidup-location-backend
npm run dev                    # Start API server (port 3002)
npx prisma studio             # Database browser
npx prisma db push             # Apply schema changes
npx tsx prisma/seed.ts         # Seed test data

# CRM
cd feidup-crm
npm run dev                    # Start CRM (port 5174, proxies to 3002)

# Enrichment
# Trigger via API as admin:
curl -X POST localhost:3002/api/enrichment/abs/suburbs?fallback=true -H "Authorization: Bearer $TOKEN"
curl -X POST localhost:3002/api/enrichment/google/discover/Brisbane%20City -H "Authorization: Bearer $TOKEN"

# Stress Tests
cd feidup-location-backend
npx tsx tests/enrichment-stress-test.ts  # 32 tests covering all external APIs
```

### Test Accounts

| Email | Password | Role | Linked to |
|-------|----------|------|-----------|
| admin@feidup.com | password123 | admin | — |
| sales@feidup.com | password123 | sales | — |
| ops@feidup.com | password123 | operations | — |
| advertiser@feidup.com | password123 | advertiser | FitLife Brisbane |
| restaurant@feidup.com | password123 | restaurant | Central Perk Coffee |

---

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret"
PORT=3002
FRONTEND_URL="http://localhost:5174"
RESEND_API_KEY=""              # For password reset emails
GOOGLE_MAPS_API_KEY=""         # For cafe discovery
```
