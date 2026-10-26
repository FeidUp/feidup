# NOTES.md

Shared working memory for Claude Code and ZCode. One line per entry, `YYYY-MM-DD — note`, newest first. Prune when stale.

## Decisions
2026-10-26 — All API routes except /health, /qr/:code and auth login/refresh/reset now require a JWT; advertisers/restaurants are scoped to their own records. Internal = admin/sales/operations; deletes are admin-only.
2026-10-26 — CORS allowlist: feidup-crm.vercel.app + app.feidup.com hardcoded in src/app.ts; FRONTEND_URL (comma-separated) adds more.
2026-10-26 — `password123` seed accounts are intentional demo logins — keep them.
2026-10-26 — Backend tests: `npm test` (vitest + supertest, Prisma mocked, no DB). App lives in src/app.ts; src/index.ts only listens.

## Gotchas
2026-10-26 — Server refuses to start with NODE_ENV=production and no JWT_SECRET.
2026-10-26 — Legacy feidup-admin calls the API without tokens, so it no longer works (it isn't deployed).
2026-10-26 — Prod check: Render API reports database "disconnected" (free Postgres likely expired); feidup-crm.vercel.app returns 402. Infra, not code.

## Don't touch

## In progress
