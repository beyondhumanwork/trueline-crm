# TrueLine CRM

Local-first motorcycle training CRM.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: Supabase (Postgres + Auth)
- **Sync**: ElectricSQL (local-first offline sync via PGlite)
- **UI**: shadcn/ui, Tailwind CSS v4, Lucide icons
- **Charts**: Recharts
- **Email**: Resend
- **PWA**: @ducanh2912/next-pwa
- **Testing**: Vitest (unit), Playwright (E2E)
- **Validation**: Zod

## Features

- **Dashboard** — Today's overview with key metrics
- **Client CRUD** — Full lifecycle management per motorcycle training business
- **Session Scheduling** — Book and track training sessions
- **Revenue Tracking** — Income visualization and reporting
- **PWA Installability** — Works offline, installable on mobile/desktop
- **Theme Toggle** — Light/dark mode
- **Automated Reminders** — Email notifications via Resend
- **Multi-tenant** — org_id on every business table, profiles-based org lookup

## Prerequisites

- Node.js 20+
- A Supabase project (free tier works)

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

Open http://localhost:3000.

## Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_URL` | Supabase URL (server-side) |
| `SUPABASE_ANON_KEY` | Supabase anon key (server-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (admin operations) |
| `RESEND_API_KEY` | Resend API key for email reminders |

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run Playwright E2E with UI |

## Project Structure

```
src/
  app/              # Next.js App Router pages and layouts
    auth/           # Auth-related routes
    clients/        # Client management pages
    dashboard/      # Dashboard / today view
    login/          # Login page
    revenue/        # Revenue tracking pages
    schedule/       # Session scheduling pages
  actions/          # Server actions
  components/       # Shared UI components
  hooks/            # React hooks
  lib/
    supabase/       # Supabase client (browser + server)
supabase/           # Migrations and SQL files
```

## Deployment

### Vercel (Recommended)

1. Push this repo to GitHub.
2. Connect it on [Vercel](https://vercel.com/new).
3. Add the environment variables from `.env.example` in Vercel's project settings.
4. Deploy.

Vercel auto-detects Next.js 16 and handles the build. No extra config needed.

### Manual / Other Hosts

```bash
npm run build
npm run start
```

Set all environment variables from `.env.example` before building.

## Local-First Sync (ElectricSQL)

The app uses ElectricSQL for local-first sync. In development, Electric runs locally:

```bash
# Start Electric sync service (requires Docker)
docker compose up -d
```

The sync service is configured to fall back gracefully when unavailable, so the app works fine without it for basic development.
