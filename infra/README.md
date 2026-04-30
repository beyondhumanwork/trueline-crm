# Infrastructure

## ElectricSQL Sync Service

ElectricSQL provides local-first sync between Supabase (PostgreSQL) and client applications via PGlite. It watches your Postgres database for changes and streams them to connected clients, while also accepting client-side writes and applying them back to the database.

### Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Supabase    │────▶│  ElectricSQL │◀────│  Client App  │
│  (Postgres)  │     │  (Sync Svc)  │     │  (PGlite)    │
└──────────────┘     └──────────────┘     └──────────────┘
                          │
                    ┌─────▼──────┐
                    │  Fly.io    │
                    │  (Proxy)   │
                    └────────────┘
```

## Local Development

Run ElectricSQL + Postgres locally:

```bash
docker compose -f infra/electric/docker-compose.yml up
```

This starts:
- **Postgres 16** on port 5432
- **ElectricSQL** on port 3000

Electric will be available at `http://localhost:3000`.

## Deploy Shape Proxy to Fly.io

1. Install the Fly CLI: `brew install flyctl`
2. Authenticate: `fly auth login`
3. Deploy:

```bash
fly deploy -c infra/proxy/fly.toml \
  --build-target infra/electric \
  --secret ELECTRIC_JWT_SECRET=your-secret
```

4. Set the database URL secret:

```bash
fly secrets set ELECTRIC_DATABASE_URL=postgresql://user:pass@host:5432/dbname -a trueline-proxy
```

## Required Environment Variables

| Variable | Description | Example |
|---|---|---|
| `ELECTRIC_DATABASE_URL` | PostgreSQL connection string for Supabase or local PG | `postgresql://postgres:postgres@localhost:5432/postgres` |
| `ELECTRIC_JWT_SECRET` | Secret for signing JWT tokens used in auth | `your-random-secret-here` |

## Notes

- The ElectricSQL service reads from Postgres logical replication, so `wal_level = logical` must be set on the database (Supabase enables this by default).
- The Fly.io proxy handles HTTPS termination and auto-scaling.
- For production, use a strong `ELECTRIC_JWT_SECRET` (generate with `openssl rand -hex 32`).
