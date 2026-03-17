# FeidUp - Location-Based Advertising Platform

## What is FeidUp?

FeidUp connects **small local businesses** (real estate agents, schools, barbers, trades — businesses that rely on word-of-mouth and would typically buy a bus ad or bus stop ad) with **cafes** by placing **co-branded packaging** (cups, containers) that targets the right demographic in the right suburb.

**The product**: A coffee cup with the cafe's branding prominently displayed + a sponsor's branding integrated tastefully. Each cup has **two QR codes** — one linking to the cafe's website, one to the advertiser's. QR scans = trackable impressions and conversions.

**Target market**: South East Queensland (Brisbane, Gold Coast, Sunshine Coast, Logan, Ipswich).

**Live site**: https://feidup.com

## Monorepo Structure

```
feidup/
├── feidup-website/          # Marketing site (Next.js 16, Tailwind v4, Framer Motion)
│                             # Deployed on Vercel (Shubh's account) → feidup.com
├── feidup-location-backend/  # Core API (Express + TypeScript + Prisma + PostgreSQL)
│                             # Deployed on Render → https://feidup.onrender.com
├── feidup-crm/              # CRM dashboard (React + Vite + Leaflet + Framer Motion)
│                             # Deployed on Vercel (Kunwar's account) → feidup-crm.vercel.app
├── CLAUDE.md                # This file
└── PLATFORM.md              # Full technical documentation
```

## Deployment Architecture

```
┌──────────────┐     ┌──────────────────────┐     ┌──────────────┐
│ feidup.com   │     │ feidup.onrender.com  │     │ feidup-crm   │
│ (Vercel)     │     │ (Render, Singapore)  │     │ .vercel.app  │
│              │     │                      │     │              │
│ Marketing    │     │ Express API          │◄────│ React CRM    │
│ website      │     │ PostgreSQL (Render)  │     │ 3 portals    │
└──────────────┘     │ 48 cafes seeded      │     └──────────────┘
                     │ 967 cafes discovered │
                     └──────┬───────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
        ABS Census    Google Places   Overpass/OSM
        (free)        (API key set)   (free)
```

### Deployment Details

| Component | Platform | URL | Branch | Root Dir |
|-----------|----------|-----|--------|----------|
| Website | Vercel (Shubh) | feidup.com | main | feidup-website |
| Backend | Render (free) | feidup.onrender.com | client-side-interface | feidup-location-backend |
| CRM | Vercel (Kunwar) | feidup-crm.vercel.app | main | feidup-crm |
| Database | Render PostgreSQL | Singapore region | — | — |

### Environment Variables

**Render (backend)**:
- `DATABASE_URL` — Render PostgreSQL connection string
- `JWT_SECRET` — set on Render
- `NODE_ENV=production`
- `PORT=3001`
- `FRONTEND_URL=https://feidup-crm.vercel.app`
- `GOOGLE_MAPS_API_KEY` — set on Render

**Vercel (CRM)**:
- `VITE_API_URL=https://feidup.onrender.com` — set in Vercel project settings

### Known Deployment Issues
- Vercel free tier doesn't support **private org repos**. Repo must be public OR moved to a personal GitHub account
- Render free tier spins down after 15min idle — first request takes ~30s cold start
- The `client-side-interface` branch has been merged to `main` but Render is still pointing at `client-side-interface`. Can be switched to `main` in Render settings

## Current State (as of March 2026)

### feidup-website ✅ Complete
- Dark/light theme with toggle
- Storytelling scroll-driven home page with Framer Motion animations
- Pages: Home, About, For Advertisers, For Businesses, Contact (Resend email)
- Deployed at feidup.com

### feidup-location-backend ✅ Production ready
- **Database**: PostgreSQL on Render (was SQLite for local dev)
- **Auth**: JWT with 5 roles (admin, sales, operations, advertiser, restaurant)
- **Matching engine**: Scores cafes across 4 dimensions (location 40%, volume 30%, demographic 20%, relevance 10%) using real ABS Census data
- **QR tracking**: Public `/qr/:code` redirect with UTM params, device/OS/browser logging
- **Data enrichment**: ABS Census (68 suburbs), Google Places (967 cafes discovered), OSM Overpass (cafe density, POI context)
- **Advertiser discovery**: Search Google Places for potential advertisers by keyword (gyms, dentists, padel, etc.)
- **Seed data**: 48 cafes, 5 advertisers, 3 campaigns, 8 placements, 16 QR codes, 80 scans, 68 suburbs
- **All 37 backend tests passing**, 32 enrichment stress tests passing
- Live at https://feidup.onrender.com

### feidup-crm ✅ Fully functional
- **21 pages** across 3 portal experiences
- **Dark/light theme** toggle matching website design (Framer Motion animations)
- **Interactive map** (Leaflet) with 967 cafes across 126 SEQ suburbs
- **Advertiser discovery** — search "padel brisbane" etc., results on map with "Add to Leads" button
- Builds clean with zero TypeScript errors

#### Three Portal Experiences

**Admin/Internal** (admin, sales, operations):
- Dashboard with stats, pipeline, quick actions
- Leads management + Kanban pipeline
- Advertisers/Restaurants CRUD
- Campaigns with AI cafe recommendations
- Map View (venues tab + advertisers discovery tab)
- Inventory tracking (batches + allocations)
- Analytics (overview + QR analytics with live feed, geography, conversion funnel)
- User management

**Cafe Portal** (restaurant role → restaurant@feidup.com):
- Dashboard: scan trends, inventory alerts, active campaigns
- My Inventory: stock levels, report daily usage
- QR Analytics: daily scans, peak hours, device breakdown, where cups traveled
- Cafe Profile: read-only details, traffic metrics, operating hours

**Advertiser Portal** (advertiser role → advertiser@feidup.com):
- Dashboard: impressions, scan rate, campaign performance chart
- QR Analytics: per-campaign drill-down, device/suburb breakdown, conversion funnel
- Recommended Cafes: AI-matched with scores and reasoning

### Test Accounts (password: `password123`)

| Email | Role | Linked to |
|-------|------|-----------|
| admin@feidup.com | admin | — |
| sales@feidup.com | sales | — |
| ops@feidup.com | operations | — |
| advertiser@feidup.com | advertiser | FitLife Brisbane |
| restaurant@feidup.com | restaurant | Central Perk Coffee |

## Development Commands

```bash
# Website
cd feidup-website && npm run dev       # Next.js dev (port 3000)

# Backend (local dev with SQLite)
# NOTE: Change prisma schema provider back to "sqlite" for local dev
cd feidup-location-backend && npm run dev        # Express dev (port 3002)
cd feidup-location-backend && npx prisma studio   # DB browser
cd feidup-location-backend && npx prisma db push  # Apply schema
cd feidup-location-backend && npx tsx prisma/seed.ts  # Seed data

# CRM
cd feidup-crm && npm run dev           # Vite dev (port 5174, proxies /api → localhost:3002)

# Stress tests
cd feidup-location-backend && npx tsx tests/enrichment-stress-test.ts

# Deploy
cd feidup-crm && vercel --yes --scope kunw4rs-projects --prod  # CRM to Vercel
# Backend auto-deploys on Render when pushing to branch
```

### Local dev note
The Prisma schema is currently set to `postgresql` for production. For local dev with SQLite, change `prisma/schema.prisma`:
```
provider = "sqlite"  // change from "postgresql"
```
And use `DATABASE_URL="file:./dev.db"` in `.env`.

## Git Workflow

- `main` — stable, deployed. Both website (Vercel) and CRM (Vercel) deploy from here
- `client-side-interface` — development branch, merged to main. Render backend deploys from here
- GitHub: https://github.com/FeidUp/feidup (org) / https://github.com/shubhgupta2510/feidup (redirects)

## Key Design Decisions

- **Co-branding, not takeover**: Cafe branding is always primary
- **Two QR codes per cup**: One for cafe, one for advertiser. Both trackable
- **Matching is the moat**: AI engine using real ABS Census demographics + Google Places data
- **SEQ first**: Brisbane, Gold Coast, Sunshine Coast, Logan, Ipswich, Redlands
- **Dark theme default**: Website and CRM use dark charcoal with red accent (#dc2626)
- **Three portals, one app**: Admin, cafe, and advertiser experiences in a single React app with role-based routing
- **PostgreSQL in prod**: SQLite for local dev, PostgreSQL on Render for production
- **967 real cafes**: Discovered via Google Places API, stored with ratings and foot traffic estimates

## What's Next

- [ ] Get repo visibility sorted (public org or personal account) so Vercel auto-deploys work
- [ ] Set up `app.feidup.com` → CRM and `api.feidup.com` → Render backend
- [ ] Import more cafes from Google Places across all SEQ suburbs
- [ ] Build out NFC cup support (premium tier)
- [ ] A/B testing cup designs
- [ ] PDF report exports for advertisers
- [ ] Loyalty rewards for scanners
