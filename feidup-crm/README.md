# FeidUp CRM

A full-featured Customer Relationship Management system for FeidUp — a location-based advertising platform that turns café packaging (cups, bags, napkins) into hyper-local advertising for businesses in Brisbane.

Built with **React 19 + TypeScript + Vite + Tailwind CSS v4**, powered by an **Express + Prisma + SQLite** backend.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Authentication & Roles](#authentication--roles)
- [Pages & Features](#pages--features)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Key Workflows](#key-workflows)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)

---

## Overview

FeidUp connects **advertisers** (businesses wanting to reach local audiences) with **partner restaurants/cafés** that serve as ad placements through branded packaging. The CRM manages the full lifecycle:

1. **Lead Generation** — Track and nurture prospective advertisers and restaurant partners
2. **Campaign Management** — Create campaigns, match advertisers to cafés using AI scoring, manage placements
3. **Inventory & Operations** — Track packaging production batches, allocations, and usage at each venue
4. **Analytics & Reporting** — Real-time dashboards for impressions, revenue, regional performance, and campaign health

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend Framework** | React | 19.2 |
| **Build Tool** | Vite | 7.3 |
| **Language** | TypeScript | 5.9 |
| **Styling** | Tailwind CSS | 4.2 |
| **Routing** | React Router | 7.13 |
| **Charts** | Recharts | 3.7 |
| **Icons** | Lucide React | 0.577 |
| **Backend** | Express.js | 4.21 |
| **ORM** | Prisma | 5.22 |
| **Database** | SQLite (dev) / PostgreSQL (prod) | — |
| **Auth** | JWT (jsonwebtoken + bcryptjs) | — |
| **Validation** | Zod | 3.23 |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### 1. Install & Start the Backend

```bash
cd feidup-location-backend
npm install

# Set up the database
cp .env.example .env       # or create .env (see Environment Variables)
npx prisma generate
npx prisma db push

# Seed with sample data (3 staff users, 12 suburbs, 16 cafés, 5 advertisers, 6 leads)
npm run db:seed

# Start the dev server (port 3001)
npm run dev
```

### 2. Install & Start the CRM Frontend

```bash
cd feidup-crm
npm install

# Start the dev server (port 5174)
npm run dev
```

### 3. Log In

Open **http://localhost:5174** and use one of these seeded accounts:

| Email | Password | Role |
|-------|----------|------|
| `admin@feidup.com` | `password123` | Admin (full access) |
| `sales@feidup.com` | `password123` | Sales |
| `ops@feidup.com` | `password123` | Operations |
| `advertiser@feidup.com` | `password123` | Advertiser |
| `restaurant@feidup.com` | `password123` | Restaurant |

---

## Architecture

```
┌──────────────────────┐         ┌──────────────────────────┐
│   FeidUp CRM (SPA)   │         │    Location Backend      │
│   React + Vite       │   API   │    Express + Prisma      │
│   Port 5174          │────────▶│    Port 3001             │
│                      │  /api/* │                          │
│  ┌─────────────────┐ │         │  ┌────────────────────┐  │
│  │ AuthContext     │ │         │  │ JWT Auth + RBAC    │  │
│  │ (login/tokens)  │ │         │  │ middleware         │  │
│  ├─────────────────┤ │         │  ├────────────────────┤  │
│  │ api.ts          │ │         │  │ Routes             │  │
│  │ (HTTP client)   │ │         │  │ auth, leads, cafes │  │
│  ├─────────────────┤ │         │  │ advertisers, etc.  │  │
│  │ Pages (11)      │ │         │  ├────────────────────┤  │
│  │ Layout/Sidebar  │ │         │  │ Matching Engine    │  │
│  └─────────────────┘ │         │  │ (4-factor scoring) │  │
│                      │         │  ├────────────────────┤  │
│                      │         │  │ SQLite / Postgres  │  │
│                      │         │  └────────────────────┘  │
└──────────────────────┘         └──────────────────────────┘
```

The Vite dev server proxies `/api/*` and `/health` requests to `http://localhost:3001`, so the frontend and backend can be developed together without CORS issues.

---

## Authentication & Roles

### Token Flow

1. User submits email + password via the login form
2. Backend validates credentials, returns **access token** (24h) + **refresh token** (7d)
3. Tokens are stored in `localStorage`
4. The API client attaches `Authorization: Bearer <token>` to every request
5. On 401, the client automatically attempts a token refresh before logging out

### Role-Based Access Control (RBAC)

| Role | Description | Access |
|------|-------------|--------|
| **admin** | Platform administrator | Full access — all pages, user management, deletions |
| **sales** | Sales team member | Leads, pipeline, advertisers, restaurants, campaigns, analytics |
| **operations** | Operations team | Inventory, batches, usage, restaurants, campaigns, analytics |
| **advertiser** | External advertiser client | Own campaigns, analytics, recommendations |
| **restaurant** | External restaurant partner | Own inventory, usage reporting |

The sidebar navigation automatically filters links based on the logged-in user's role.

---

## Pages & Features

### Login Page
Split-screen layout with branded left panel and login form. Supports show/hide password toggle and error display. Redirects authenticated users to the dashboard.

### Dashboard
- **Internal users**: 5 stat cards (advertisers, restaurants, campaigns, open leads, impressions), pipeline overview by stage with dollar values, quick-action buttons
- **External users**: Welcome message with role-specific guidance

### Leads
Full lead management table with real-time filtering by search term, pipeline stage, and lead type (advertiser/restaurant). Includes a create modal with fields for company, contact, source, priority, and estimated value.

### Lead Detail
Three-column layout:
- **Left**: Contact info, priority, estimated value, notes
- **Center**: Interactive 6-stage pipeline — click any stage to advance/regress the lead (lead → contacted → negotiation → signed → active client / lost)
- **Right**: Activity timeline with form to add notes, calls, emails, and meetings. Stage changes are automatically logged.

### Pipeline (Kanban)
Visual kanban board with horizontal columns for each pipeline stage. Each column displays lead count and total dollar value. Lead cards show company, contact, type, priority, and value. Click any card to navigate to its detail page.

### Advertisers
Card grid of all advertiser partners. Each card shows business name, industry, target location, contact info, and campaign goal. Includes search filter and create modal with fields for target suburbs, postcodes, radius, and campaign objectives.

### Restaurants
Card grid of restaurant/café partners. Each card displays name, cuisine, address, and three key metrics: daily foot traffic, daily orders, and packaging volume. Includes search filter and create modal.

### Campaigns
Expandable list view — click a campaign to reveal its café placements with match scores. Two-step creation wizard:
1. **Step 1**: Select advertiser, define campaign name, packaging type/quantity, ad format, budget, and dates
2. **Step 2**: AI-recommended cafés are displayed ranked by match score — select which ones to include

### Inventory
Two-tab interface:
- **Inventory Tab**: Table of packaging allocations per restaurant with progress bars for usage, low-stock highlighting, and estimated runout dates
- **Batches Tab**: Production batch cards showing campaign, packaging type, quantity produced/shipped, and delivery status

Stats bar shows total allocated, used, remaining, and low-stock count. Allocate modal to distribute batches to specific cafés.

### Analytics
- 5 top-level stat cards (advertisers, restaurants, campaigns, impressions, revenue)
- **Suburb Performance**: Bar chart comparing foot traffic and orders across top suburbs
- **Industry Distribution**: Pie chart of advertiser industries
- **Campaign Performance Table**: Sortable with impressions (actual vs target), completion percentage (color-coded progress bars), and restaurant count

### Users (Admin Only)
Split view of internal team and client accounts. Admins can create new users, toggle active/inactive status, and assign roles. Users cannot disable their own account.

---

## API Reference

All endpoints are prefixed with `/api` and return `{ success: boolean, data?: T, error?: string }`.

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/login` | Public | Login → `{ user, accessToken, refreshToken }` |
| `POST` | `/auth/refresh` | Public | Refresh access token |
| `GET` | `/auth/me` | Required | Get current user |
| `POST` | `/auth/users` | Admin/Sales | Create user |
| `GET` | `/auth/users` | Admin | List all users |
| `PATCH` | `/auth/users/:id` | Admin | Update user (role, password, active) |

### Leads

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/leads` | Admin/Sales/Ops | List leads (query: `search`, `stage`, `type`) |
| `GET` | `/leads/pipeline` | Admin/Sales/Ops | Pipeline summary (count + value per stage) |
| `GET` | `/leads/:id` | Admin/Sales/Ops | Get lead with activities |
| `POST` | `/leads` | Admin/Sales | Create lead |
| `PATCH` | `/leads/:id` | Admin/Sales | Update lead (stage changes auto-log activity) |
| `DELETE` | `/leads/:id` | Admin | Delete lead |
| `POST` | `/leads/:id/activities` | Admin/Sales/Ops | Add note/call/email/meeting |

### Advertisers

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/advertisers` | Public | List with filters (`city`, `industry`, `isActive`) |
| `GET` | `/advertisers/:id` | Public | Get advertiser |
| `POST` | `/advertisers` | Public | Create advertiser |
| `PUT` | `/advertisers/:id` | Public | Update advertiser |
| `DELETE` | `/advertisers/:id` | Public | Delete advertiser |

### Restaurants (Cafés)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/cafes` | Public | List with filters (`suburb`, `postcode`, `minTraffic`, `tags`) |
| `GET` | `/cafes/:id` | Public | Get café |
| `POST` | `/cafes` | Public | Create café |
| `PUT` | `/cafes/:id` | Public | Update café |
| `PATCH` | `/cafes/:id/metrics` | Public | Update traffic/volume metrics |
| `GET` | `/cafes/stats/suburbs` | Public | Stats grouped by suburb |

### Campaigns

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/campaigns` | Public | List campaigns (`advertiser_id` query) |
| `GET` | `/campaigns/:id` | Public | Get campaign with placements |
| `POST` | `/campaigns` | Public | Create campaign (optional `cafeIds` for auto-placement) |
| `PATCH` | `/campaigns/:id/status` | Public | Update campaign status |
| `POST` | `/campaigns/:id/placements` | Public | Add café to campaign |
| `DELETE` | `/campaigns/:id` | Public | Delete campaign |

### Recommendations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/recommendations` | Public | AI-matched cafés (`advertiser_id`, `limit`, `min_score`) |
| `GET` | `/recommendations/area` | Public | Filter by suburb/postcode |
| `GET` | `/recommendations/explain` | Public | Explain match (`advertiser_id`, `cafe_id`) |

### Inventory

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/inventory` | Admin/Ops | List allocations |
| `GET` | `/inventory/restaurant/:cafeId` | Admin/Ops/Restaurant | Café-specific inventory |
| `POST` | `/inventory/batches` | Admin/Ops | Create packaging batch |
| `GET` | `/inventory/batches` | Admin/Ops | List batches |
| `PATCH` | `/inventory/batches/:id` | Admin/Ops | Update batch |
| `POST` | `/inventory/allocate` | Admin/Ops | Allocate batch → café |
| `POST` | `/inventory/usage` | Admin/Ops/Restaurant | Report packaging usage (auto-deducts FIFO) |

### Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/analytics/overview` | Admin/Sales/Ops | System-wide stats |
| `GET` | `/analytics/campaign/:id` | Admin/Sales/Ops/Advertiser | Campaign metrics + placements |
| `GET` | `/analytics/region` | Admin/Sales/Ops | Suburb-level aggregates |
| `GET` | `/analytics/performance` | Admin/Sales | Top 20 campaigns by impressions |
| `GET` | `/analytics/revenue` | Admin | Revenue totals + budget allocation |

### Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | Public | `{ status, service, version, timestamp, database }` |

---

## Data Models

### Entity Relationship Overview

```
User ─────────────┬── assignedLeads ──▶ Lead ◀── activities ── Activity
                  ├── createdLeads                    │
                  └── auditLogs ──▶ AuditLog          │
                                                      ▼
Advertiser ──── campaigns ──▶ Campaign ──── placements ──▶ Placement ◀── Cafe
    │                            │
    │                            ├── packagingBatches ──▶ PackagingBatch
    │                            │                              │
    └── assets ──▶ Asset ◀───── ┘                     inventory ▼
                                                   PackagingInventory ──▶ Cafe
                                                          ▲
                                                   UsageReport
```

### Core Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| **users** | All system users | `email`, `role`, `passwordHash`, `isActive`, `lastLoginAt` |
| **leads** | Sales pipeline entries | `companyName`, `contactEmail`, `type`, `stage`, `priority`, `estimatedValue` |
| **activities** | Timeline events | `type` (note/call/email/meeting/status_change), `title`, `description` |
| **advertisers** | Businesses buying ads | `businessName`, `industry`, `targetSuburbs`, `campaignGoal` |
| **cafes** | Partner restaurants | `name`, `suburb`, `lat/lng`, `avgDailyFootTraffic`, `packagingVolume` |
| **campaigns** | Advertising campaigns | `name`, `status`, `packagingType`, `budget`, `totalImpressions` |
| **placements** | Campaign × Café links | `matchScore`, `estimatedDailyImpressions`, `actualImpressions` |
| **packaging_batches** | Production runs | `packagingType`, `quantityProduced`, `quantityShipped`, `status` |
| **packaging_inventory** | Café stock levels | `quantityAllocated`, `quantityUsed`, `quantityRemaining` |
| **usage_reports** | Daily consumption | `packagingUsed`, `reportDate`, `notes` |
| **assets** | Files (contracts, designs) | `fileName`, `fileType`, `storagePath` |
| **analytics_events** | Event tracking | `eventType` (impression/qr_scan/click), `metadata` |
| **suburb_data** | Reference geography | `suburb`, `postcode`, `population`, `medianAge`, `demographics` |
| **audit_logs** | Action audit trail | `action`, `entity`, `entityId`, `details` |

### Lead Pipeline Stages

```
lead → contacted → negotiation → signed → active_client
                                        ↘ lost
```

### Campaign Statuses

```
draft → proposed → active → completed
                         ↘ paused
```

### Packaging Batch Lifecycle

```
ordered → in_production → ready → shipped → delivered
```

---

## Key Workflows

### 1. Lead-to-Client Conversion

```
Create Lead ──▶ Contact ──▶ Negotiate ──▶ Sign ──▶ Create Advertiser/Restaurant
     │              │             │           │
     └── Add notes, calls, emails, meetings throughout ──┘
```

Each stage transition is automatically recorded as a `status_change` activity in the timeline.

### 2. Campaign Creation & Matching

```
Select Advertiser
     │
     ▼
Define Campaign (name, packaging type, budget, dates)
     │
     ▼
AI Matching Engine scores all cafés:
  • Location (40%) — proximity to target suburbs
  • Volume (30%) — foot traffic & order volume
  • Demographic (20%) — audience alignment
  • Relevance (10%) — industry/category fit
     │
     ▼
Review recommendations, select cafés
     │
     ▼
Campaign created with placements
```

### 3. Inventory Lifecycle

```
Create Batch (production order)
     │
     ▼
Ship batch (update shipped quantity)
     │
     ▼
Allocate to specific cafés
     │
     ▼
Café reports daily usage ──▶ Auto-deducts from remaining stock (FIFO)
     │
     ▼
Monitor low-stock alerts on Inventory page
```

---

## Project Structure

```
feidup-crm/
├── index.html                    # Entry HTML
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite config (proxy, Tailwind plugin)
├── tsconfig.json                 # TypeScript config
├── tsconfig.app.json             # App-specific TS config
├── tsconfig.node.json            # Node-specific TS config
├── public/                       # Static assets
└── src/
    ├── main.tsx                  # React entry point
    ├── App.tsx                   # Router & route definitions
    ├── api.ts                    # API client + TypeScript interfaces
    ├── AuthContext.tsx            # Auth state provider (login/logout/tokens)
    ├── index.css                 # Tailwind imports + custom theme
    ├── components/
    │   └── Layout.tsx            # Sidebar navigation + main content wrapper
    └── pages/
        ├── LoginPage.tsx         # Authentication
        ├── DashboardPage.tsx     # KPIs, pipeline overview, quick actions
        ├── LeadsPage.tsx         # Lead table with filters + create modal
        ├── LeadDetailPage.tsx    # Lead info, stage pipeline, activity timeline
        ├── PipelinePage.tsx      # Kanban board view of pipeline
        ├── AdvertisersPage.tsx   # Advertiser card grid + create modal
        ├── RestaurantsPage.tsx   # Restaurant card grid + create modal
        ├── CampaignsPage.tsx     # Campaign list + 2-step creation wizard
        ├── InventoryPage.tsx     # Inventory table + batch cards + allocate
        ├── AnalyticsPage.tsx     # Charts + performance tables
        └── UsersPage.tsx         # User management (admin only)

feidup-location-backend/
├── .env                          # Environment variables
├── package.json                  # Backend dependencies
├── prisma/
│   ├── schema.prisma             # Database schema (14 models)
│   └── seed.ts                   # Sample data seeder
└── src/
    ├── index.ts                  # Express app entry point
    ├── config/
    │   └── index.ts              # Configuration (JWT, matching weights, etc.)
    ├── lib/
    │   └── prisma.ts             # Prisma client singleton
    ├── middleware/
    │   ├── auth.ts               # JWT authentication + RBAC authorization
    │   └── errorHandler.ts       # Global error handling
    ├── routes/
    │   ├── auth.routes.ts        # Login, token refresh, user management
    │   ├── lead.routes.ts        # Lead CRUD + pipeline + activities
    │   ├── advertiser.routes.ts  # Advertiser CRUD
    │   ├── cafe.routes.ts        # Restaurant/café CRUD
    │   ├── campaign.routes.ts    # Campaign CRUD + placements
    │   ├── inventory.routes.ts   # Batches, allocations, usage
    │   ├── recommendation.routes.ts  # AI matching endpoint
    │   ├── analytics.routes.ts   # Dashboards & reports
    │   ├── asset.routes.ts       # File upload/download
    │   └── health.routes.ts      # Health check
    ├── services/
    │   ├── advertiser.service.ts
    │   ├── cafe.service.ts
    │   ├── campaign.service.ts
    │   ├── matching.service.ts   # 4-factor scoring algorithm
    │   └── recommendation.service.ts
    └── types/
        └── index.ts              # Shared TypeScript type definitions
```

---

## Environment Variables

### Backend (`feidup-location-backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `file:./dev.db` | Prisma database connection string |
| `JWT_SECRET` | `feidup-dev-secret-change-in-production` | JWT signing secret |
| `JWT_EXPIRES_IN` | `24h` | Access token expiry |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token expiry |
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment |
| `UPLOAD_DIR` | `./uploads` | File upload directory |
| `MAX_FILE_SIZE` | `10485760` | Max upload size (10MB) |

### Frontend

The frontend uses Vite's proxy — no environment variables needed in development. API calls to `/api/*` are automatically forwarded to `http://localhost:3001`.

---

## Scripts

### Frontend (`feidup-crm`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite --port 5174` | Start dev server with HMR |
| `build` | `tsc -b && vite build` | Type-check + production build |
| `preview` | `vite preview` | Preview production build |
| `lint` | `eslint .` | Run ESLint |

### Backend (`feidup-location-backend`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `tsx watch src/index.ts` | Start dev server with auto-reload |
| `build` | `tsc` | Compile TypeScript |
| `start` | `node dist/index.js` | Run compiled production build |
| `db:generate` | `prisma generate` | Regenerate Prisma client |
| `db:push` | `prisma db push` | Push schema to database |
| `db:migrate` | `prisma migrate dev` | Run database migrations |
| `db:seed` | `tsx prisma/seed.ts` | Seed sample data |
| `db:studio` | `prisma studio` | Open Prisma Studio GUI |
