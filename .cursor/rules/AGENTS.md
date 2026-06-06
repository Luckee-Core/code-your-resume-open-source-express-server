# Express Server Rules

BEFORE implementing ANY feature, you MUST:
1. Read `.cursor/architecture/README.md`.
2. Search `.cursor/architecture/` for relevant Express ADRs.
3. Follow documented patterns EXACTLY.

## CRM and `/api/data` (canonical — see ADR 009)

- **HTTP:** `src/api/data/{entity}/` — thin `createXRouter(): Router` factories; one handler per file (`list.ts`, `create.ts`, …).
- **CRUD:** `src/data/{entity}/` — one Supabase CRUD function per file; handlers call data functions, never inline `.from(...)`.
- **Orchestration:** `src/services/{domain}/` for multi-step flows (job import, AI generation, website research).
- Do **not** add `src/domains/` for CRM; action paths live under `/api/data/company/list`, `/api/data/job-questions/create`, etc.

## Studio / feature routers (non-CRM)

- **HTTP:** `src/api/{feature}/` with `router.ts` + `routes/` (e.g. `job-studio`, `technical-skills`, `professional-background`).
- Same handler contract as CRM: validate → delegate to `src/data/` or `src/services/` → try/catch → `{ success, data?, error? }`.

## Handlers

- MUST follow this order: (1) get Supabase client (`requireCrmSupabaseClient()` for CRM, or `getSupabaseCrmMirrorClient()` with null check), (2) validate request, (3) call data/service layer, (4) try/catch, (5) return response.
- MUST add JSDoc to every router factory, handler, and business logic function.
- MUST handle errors in handlers (not routers), log errors, and return `{ success: false, error }` with `500`.
- MUST use status codes consistently: `200` success, `400` client error, `500` server error.
- MUST log with emoji prefixes per ADR 006: `📥` on request, `📤` on success response, `❌` on failure.

## Data Layer

- MUST place database CRUD in `src/data/{entity}/`; NEVER inline queries in handlers or services when a data function fits.
- MUST keep one CRUD function per file in `src/data/{entity}/` with JSDoc on every function.
- ALWAYS extract logic used 2+ times into `src/utils/{domain}/`.
- Utilities in `src/utils/{domain}/` MUST be pure and MUST NOT have side effects.

## Services

- CRM Supabase: `requireCrmSupabaseClient()` / `getSupabaseCrmMirrorClient()` from `src/services/supabase/` (initialized at startup).
- NEVER call `createClient()` in handlers or data functions except inside the managed wrapper.
- Supabase edge functions MUST ONLY call Railway endpoints and NEVER include CRUD or business logic.

## Logging

- MUST use these emoji prefixes consistently:
  - `🚀` start
  - `✅` success
  - `❌` error
  - `📥` request
  - `📤` response
  - `🤖` AI
  - `💾` DB

## Quick Reference (Express ADRs)

- Architecture entrypoint → `.cursor/architecture/README.md`
- File & API layout → `.cursor/architecture/001-file-and-domain-organization.md`
- Router factory & handler pattern → `.cursor/architecture/002-router-factory-and-handler-pattern.md`
- Data layer & CRUD boundaries → `.cursor/architecture/003-data-layer-crud-boundaries.md`
- Managed clients & startup init → `.cursor/architecture/004-managed-clients-and-startup-init.md`
- Edge functions Railway-only → `.cursor/architecture/005-edge-functions-railway-only.md`
- Logging & error response standards → `.cursor/architecture/006-logging-and-error-response-standards.md`
- **`/api/data` entity routers (CRM + Supabase)** → `.cursor/architecture/009-api-data-entity-routers.md`
- Error log persistence → `.cursor/architecture/010-error-log-persistence.md`
