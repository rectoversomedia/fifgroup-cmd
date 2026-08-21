# FIFGROUP Digital Command Center

AI-Powered ASO + Insider CDP Dashboard for FIFGROUP Digital

## Stack
- **Next.js 16** with App Router
- **Tailwind CSS v4**
- **Phosphor Icons**
- **Supabase** (Postgres + Realtime)
- **Vercel** deployment

## Features
- **Portfolio Overview** — Health status for FIFGO & FIFADA
- **AI Alerts** — Prioritized action items with root cause analysis
- **KPI Metrics** — Applications, disbursement, digital channel mix
- **LoB Performance** — 5 LoBs inside FIFGO: FIFASTRA, SPEKTRA, DANASTRA, FINATRA, AMITRA
- **Insider CDP** — User segments, session quality, hybrid channel bridge
- **AI Executive Summary** — Plain-language summary for BOD
- **Recommendations** — Actionable prioritized recommendations
- **Competitors** — Finance category ranking tracking

## Setup

### 1. Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `sql/schema.sql`
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials

### 2. Install & Run
```bash
npm install
npm run dev
```

### 3. Deploy to Vercel
```bash
vercel deploy --prod
```

## Architecture

```
src/
├── app/
│   ├── (dashboard)/        # Dashboard pages
│   │   ├── page.tsx       # Overview
│   │   ├── fifgo/         # FIFGO detail
│   │   ├── fifada/        # FIFADA detail
│   │   ├── lob/           # LoB performance
│   │   ├── insider/       # Insider CDP
│   │   ├── ai-insights/   # AI analysis
│   │   ├── recommendations/
│   │   └── competitors/
│   └── api/               # API routes (dummy data)
├── lib/
│   ├── utils.ts
│   └── supabase.ts
└── types/
    └── index.ts
```

## Data Sources

| Data | Source | Status |
|------|--------|--------|
| App Health (rating, downloads) | AppTweak API | Dummy |
| LoB Funnel | Insider CDP | Dummy |
| User Segments | Insider CDP | Dummy |
| AI Alerts | Claude API | Dummy |
| Loan Data | Core Loan System | Dummy |
| Competitors | AppTweak API | Dummy |

## Insider CDP Event Architecture

Configured in `sql/schema.sql` — events table includes:
- User lifecycle events (app_opened, registered, kyc)
- LoB discovery & engagement events
- Hybrid attribution (digital ↔ branch)
- Cross-sell events

## Team

FIFGROUP Digital Team
Fri Aug 21 15:17:33 WIB 2026
