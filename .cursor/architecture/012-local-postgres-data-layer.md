# ADR 012: Local Postgres data layer

## Status

Accepted — 2026-09-24 (`local-database` branch)

## Context

Template ADRs 003–004 and 009 describe a Supabase JS client (`getSupabaseCrmMirrorClient()`). This branch uses **local/on-device Postgres** via the `pg` pool and `DATABASE_URL`, matching My Health Express.

HTTP paths and JSON envelopes are unchanged. The Next.js app still talks only to Express.

## Decision

| Concern | This branch |
|---------|-------------|
| Database | Local Postgres (`code_your_resume`) |
| Client | `getManagedPgPool()` / `requireCrmPgPool()` in `src/services/postgres/` and `src/data/crm/require-crm-pg-pool.ts` |
| Env | `DATABASE_URL` (server only) |
| Schema | `migrations/*.sql` applied with `psql` (`migrations/setup.sql`) |
| CRUD | Still only in `src/data/{entity}/` — one function per file |
| Queries | Parameterized SQL via `src/utils/postgres/` (`queryRows`, `selectRowsFrom`, `insertRow`, `updateRows`, `deleteRows`, `upsertRows`) |

Do not add `@supabase/supabase-js` on this branch. There is no Supabase fallback client.

## Consequences

- Startup exits if `DATABASE_URL` is missing.
- When copying ADRs from `main`, read this addendum first.
- Operator setup: Homebrew Postgres, `createdb code_your_resume`, `psql "$DATABASE_URL" -f migrations/setup.sql`.
