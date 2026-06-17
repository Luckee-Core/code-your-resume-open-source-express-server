# File & API Organization

This document defines how to organize files in the **Code Your Resume** Express server. HTTP lives under `src/api/`; CRUD lives in `src/data/`; orchestration in `src/services/`.

## Fork exception (this repo)

Unlike the mentorai-server monolith (`src/domains/{domain}/`), this product uses:

- **`src/api/data/{entity}/`** — CRM entity HTTP (action routes: `/api/data/company/list`, …)
- **`src/api/{feature}/`** — Studio routers (job-studio, technical-skills, voice-style, user-background-studio)
- **Do not add `src/domains/` for CRM** — action paths stay under `/api/data/`

Reference OSS pattern: [lead-studio-express-server](https://github.com/lead-open-source/lead-studio-express-server) uses `createDataService()` in `src/data/`. This repo uses `createApiDataRouter()` in `src/api/data/router.ts` — same rules, different mount path (documented fork exception per ADR 009).

## Canonical folder structure

```text
src/
  api/
    data/
      router.ts              # createApiDataRouter() — mounts entity routers
      company/
        router.ts            # createCompanyRouter()
        list.ts              # handleCompanyList
        create.ts
      job-questions/
        router.ts
        list.ts
    job-studio/
      router.ts
      routes/
        postJobStudioMessageHandler.ts
    technical-skills/
      router.ts
      routes/
  data/
    crm/                     # Supabase CRM CRUD (legacy grouped; prefer entity folders)
    job-questions/
      list-job-questions.ts  # one function per file
    job-listing/             # JSON ledger sidecar (scrape runs, AI exchanges)
  services/
    supabase/
      get-supabase-crm-mirror-client.ts
      require-crm-supabase-client.ts
    job/                     # multi-step orchestration (import-listing, sync)
    middleware/
  utils/
    {domain}/
index.ts                     # app wiring: middleware, /api/data, studio routers
docs/                        # Supabase SQL schemas and runbooks
```

## HTTP layer (`src/api/`)

- Export **`createXRouter(): Router`** factory functions only.
- Routers wire routes; handlers live in the same entity folder (`list.ts`, `create.ts`) or in `routes/` for studio features.
- One handler per file for CRM entities under `src/api/data/{entity}/`.

## Data layer (`src/data/{entity}/`)

- One CRUD function per file with JSDoc.
- Handlers and services call data functions — never inline `.from('table')` in handlers when a data function fits.
- Orchestration services may coordinate multiple data calls; prefer extracting repeated queries to `src/data/`.

## Managed clients

- Initialize Supabase at startup via `getSupabaseCrmMirrorClient()` in `index.ts`.
- Handlers use `requireCrmSupabaseClient()` or null-check `getSupabaseCrmMirrorClient()`.
- Never call `createClient()` outside `src/services/supabase/get-supabase-crm-mirror-client.ts`.

## Utilities

- Extract pure helpers used 2+ times to `src/utils/{domain}/`.
- Utilities must not have side effects.

## Edge functions

- Supabase edge functions call Railway HTTP endpoints only — no CRUD or business logic in edge (see ADR 005).

## Related

- [002 – Router factory & handler pattern](./002-router-factory-and-handler-pattern.md)
- [003 – Data layer CRUD boundaries](./003-data-layer-crud-boundaries.md)
- [009 – `/api/data` entity routers](./009-api-data-entity-routers.md)
