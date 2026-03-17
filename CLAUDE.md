# FeidUp - Location-Based Advertising Platform

## What is FeidUp?

FeidUp connects **small local businesses** (real estate agents, schools, barbers, trades — businesses that rely on word-of-mouth and would typically buy a bus ad or bus stop ad) with **cafes** by placing **co-branded packaging** (cups, containers) that targets the right demographic in the right suburb.

**The product**: A coffee cup with the cafe's branding prominently displayed + a sponsor's branding integrated tastefully. Each cup has **two QR codes** — one linking to the cafe's website, one to the advertiser's. QR scans = trackable impressions and conversions.

**Target market**: Brisbane, Australia (starting local, expanding later).

## Monorepo Structure

```
feidup/
├── feidup-website/          # Public marketing site (Next.js 16, Tailwind v4, Framer Motion)
│                             # Deployed at https://feidup-website.vercel.app
├── feidup-location-backend/  # Core API (Express + TypeScript + Prisma + SQLite)
│                             # Matching engine, campaigns, analytics, auth
├── feidup-crm/              # Internal CRM dashboard (React + TypeScript + Vite)
│                             # For FeidUp sales/ops team
├── feidup-admin/            # Admin panel (React + TypeScript + Vite)
└── CLAUDE.md                # This file
```

## Three CRM/Portal Experiences Needed

### 1. Cafe Portal (for cafe owners)
- View active campaigns running at their venue
- See which advertisers they're partnered with
- Track cup inventory (allocated, used, remaining)
- View QR scan analytics (cafe QR code traffic)
- Campaign calendar/schedule
- Accept/reject proposed placements

### 2. Advertiser Portal (for sponsors/brands)
- Run campaigns across multiple cafes simultaneously
- Track QR scan conversions (how many people visited their website via FeidUp)
- Campaign performance breakdown by cafe/location/suburb
- Impression counts, scan rates, conversion metrics
- Budget and billing management
- View recommended cafes for targeting

### 3. Internal CRM (for FeidUp team — sales, ops, admin)
- **Lead pipeline**: Track advertiser and cafe leads through stages
- **ML-powered matching**: When a new advertiser signs up, recommend optimal cafes
- **Full analytics dashboard**: All metrics across all campaigns
- **Inventory management**: Track packaging production, shipping, stock levels
- **User management**: RBAC (admin, sales, operations, advertiser, restaurant roles)

## ML Matching Engine — Data Sources

The core differentiator is an intelligent matching algorithm that recommends the best cafes for each advertiser based on:

- **Google Maps Platform**: Restaurant popularity, reviews, foot traffic estimates, cuisine, competition density
- **Google Trends**: Location-specific search trends (e.g., anime interest in Sunnybank vs broader Brisbane)
- **ABS (Australian Bureau of Statistics)**: Suburb demographics — income, population density, age, student population, household size, employment
- **OpenStreetMap**: Building density, business clusters, office density, universities nearby
- **Internal data**: QR scan rates, campaign performance history, cafe usage patterns

## Analytics — What We Track

Every metric must be meticulous. Track the full funnel:

| What | Why | Who sees it |
|------|-----|-------------|
| QR scans (cafe code) | Measure cafe website traffic from cups | Cafe portal |
| QR scans (advertiser code) | Measure advertiser conversions | Advertiser portal |
| Scan location (suburb/postcode) | Understand where cups travel | Internal + Advertiser |
| Scan time (hour/day) | Understand peak engagement | Internal |
| Cups produced per batch | Inventory tracking | Internal + Cafe |
| Cups used/remaining per cafe | Stock management | Internal + Cafe |
| Estimated daily impressions | Based on cafe foot traffic | All portals |
| Actual vs estimated impressions | Model accuracy feedback | Internal |
| Campaign spend vs conversions | ROI for advertisers | Advertiser portal |
| Match score accuracy | Did recommended cafes perform well? | Internal |

## Tech Stack

| Component | Stack |
|-----------|-------|
| Website | Next.js 16, Tailwind v4, Framer Motion, Vercel |
| Backend API | Express.js, TypeScript, Prisma ORM, SQLite (dev) → PostgreSQL (prod) |
| CRM/Admin | React, TypeScript, Vite, Tailwind |
| Auth | JWT with bcrypt, RBAC middleware |
| Email | Resend API |
| Future ML | Python service TBD, consuming Google Maps / ABS / OSM data |

## Current State of Each Component

### feidup-website ✅ Mostly complete
- Dark/light theme with toggle (cream light mode, charcoal dark mode)
- Storytelling scroll-driven home page
- Pages: Home, About, For Advertisers, For Businesses, Contact (with Resend email)
- Deployed on Vercel

### feidup-location-backend 🟡 Solid foundation
- Prisma schema covers: Users, Auth, Leads, Advertisers, Cafes, Campaigns, Placements, Packaging Inventory, Assets, Analytics Events, Suburb Data
- Services: matching, recommendation, campaign, advertiser, cafe
- Routes: auth, advertisers, cafes, campaigns, recommendations, analytics, inventory, leads, assets
- JWT auth with role-based middleware
- Seed data for test accounts

### feidup-crm 🟡 Early stage
- Has pages for: Dashboard, Leads, Pipeline, Advertisers, Restaurants, Campaigns, Inventory, Analytics, Users
- Auth flow with login/forgot/reset password
- Needs: actual data integration, polish, role-based views

### feidup-admin 🔴 Skeleton only

## Development Commands

```bash
# Website
cd feidup-website && npm run dev       # Next.js dev server
cd feidup-website && vercel --prod     # Deploy to production

# Backend
cd feidup-location-backend && npm run dev        # Express dev server (tsx)
cd feidup-location-backend && npx prisma studio   # DB browser
cd feidup-location-backend && npx prisma db push  # Apply schema changes
cd feidup-location-backend && npx prisma db seed  # Seed test data

# CRM
cd feidup-crm && npm run dev           # Vite dev server
```

## Git Workflow

- `main` — stable branch
- `client-side-interface` — current active development branch
- GitHub: https://github.com/shubhgupta2510/feidup

## Key Design Decisions

- **Co-branding, not takeover**: Cafe branding is always primary. Advertiser integration is subtle.
- **Two QR codes per cup**: One for cafe, one for advertiser. Both trackable.
- **Matching is the moat**: The ML engine that recommends cafes based on demographics, trends, and performance data is the core competitive advantage.
- **Brisbane first**: All suburb/demographic data is Brisbane-focused initially.
- **Dark theme default**: Website and CRM use dark charcoal with red accent, cream light mode available.
