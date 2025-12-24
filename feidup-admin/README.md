# FeidUp Admin Dashboard

A user-friendly admin interface for managing the FeidUp location-based advertising platform. Designed for non-technical users to easily add and manage advertisers, cafes, and view matching recommendations.

## Features

- **Dashboard**: Overview of system statistics including advertiser, cafe, and suburb counts
- **Advertisers Management**: View, add, and delete advertisers with targeting preferences
- **Cafe Management**: View, add, and delete cafes with location and operating details
- **Recommendations**: View intelligent matching recommendations between advertisers and cafes

## Prerequisites

- Node.js 18+ and npm
- FeidUp Location Backend running on port 3001

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Backend

Make sure the FeidUp Location Backend is running:

```bash
cd ../feidup-location-backend
npm run dev
```

### 3. Start the Admin Dashboard

```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:5173`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

## Pages

### Dashboard (`/`)
- System health status
- Quick statistics (advertisers, cafes, suburbs)
- Navigation to other sections

### Advertisers (`/advertisers`)
- List all advertisers with business details
- Delete advertisers
- Link to add new advertiser

### Add Advertiser (`/advertisers/add`)
Multi-step form:
1. **Business Info**: Name, industry, budget, campaign goals
2. **Target Locations**: Select Brisbane suburbs
3. **Target Audience**: Age range, interests, income level

### Cafes (`/cafes`)
- List all cafes with location and metrics
- View foot traffic, Wi-Fi usage, average dwell time
- Delete cafes

### Add Cafe (`/cafes/add`)
Multi-step form:
1. **Basic Info**: Name, description
2. **Location**: Address, Brisbane suburb, coordinates
3. **Operations**: Hours, Wi-Fi, seating capacity, foot traffic

### Recommendations (`/recommendations`)
- Select an advertiser to view recommendations
- See matching scores with breakdown
- Scores include: Location, Volume, Demographics, Relevance

## Configuration

The frontend connects to the backend at `http://localhost:3001` by default. To change this, edit the `API_BASE_URL` in `src/api.ts`.

## Project Structure

```
feidup-admin/
├── src/
│   ├── main.tsx          # App entry point
│   ├── App.tsx           # Router and layout
│   ├── api.ts            # API client
│   ├── index.css         # Global styles
│   └── pages/
│       ├── Dashboard.tsx
│       ├── Advertisers.tsx
│       ├── AddAdvertiser.tsx
│       ├── Cafes.tsx
│       ├── AddCafe.tsx
│       └── Recommendations.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Brisbane Suburbs Supported

The system currently supports these Brisbane suburbs:
- Brisbane CBD
- South Bank
- Fortitude Valley
- West End
- New Farm
- Paddington
- Toowong
- Indooroopilly
- Chermside
- Carindale
- Sunnybank
- Mount Gravatt
