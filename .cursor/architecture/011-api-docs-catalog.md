# 011 – API docs catalog (`/api-docs.json`)

## Status
Accepted

## Context
**code-your-resume-open-source-express-server** exposes many `/api/data` action routes (ADR 009) and studio routers. The Next.js app renders human-readable docs at `/docs/api` by fetching a machine-readable catalog from this server. No OpenAPI or third-party doc tools.

## Decision

### 1) Service location
- Catalog and router live in `src/services/api-docs/`.
- Pure helpers for action-route doc templates live in `src/utils/api-docs/` (`buildActionEntityDocs`).
- Do **not** place catalog code in `src/data/` (no database access).

### 2) Endpoint
- `GET /api-docs.json` returns `{ success: true, data: ApiDocsCatalog }` per ADR 006.
- Mount `createApiDocsRouter()` in `index.ts` after health and studio routes, **before** error middleware.
- Mount **outside** `requireCrmApiSecretWhenConfigured` — metadata-only, no shared secret.

### 3) Handler rules (fork exception)
- **No Supabase** or managed clients — metadata-only route (exception to ADR 002 step 1).
- Handler: `📥` log → `buildApiDocsCatalog()` → `res.status(200).json({ success: true, data })` → `📤` log; `try/catch` → `500` with `{ success: false, error }`.
- JSDoc on router factory, handler, and `buildApiDocsCatalog`.

### 4) Catalog maintenance
- Update `api-docs-catalog.ts` in the **same PR** when routes change.
- Paths must match `src/api/data/*/router.ts` and studio routers exactly.
- Use `buildActionEntityDocs` for standard CRM actions (`/list`, `/get`, `/create`, `/update`, `/delete`); hand-write generation, import, studio, and error-report routes.

### 5) Catalog content
- First group: **Overview** (name exactly `Overview`, empty `endpoints`, multi-paragraph `description`).
- Second group: **Health** (separate from Overview).
- Every entity group includes a usage `description` (product purpose, not just CRUD mechanics).
- Root fields: `version`, `baseUrl`, `responseEnvelope`, `groups` — **no** top-level `title`.

### 6) Types
- Use `type` (not `interface`) in `src/services/api-docs/types.ts`.

## Consequences
- Web app fetches catalog through `src/api/api-docs/client.ts` (see web ADR 020).
- Catalog drift is manual — treat updates like README edits.

## Related
- [002 – Router factory & handler pattern](./002-router-factory-and-handler-pattern.md)
- [006 – Logging & error response standards](./006-logging-and-error-response-standards.md)
- [009 – `/api/data` entity routers](./009-api-data-entity-routers.md)
- Web repo [020 – Documentation site API reference](https://github.com/Luckee-Core/code-your-resume-open-source/blob/main/.cursor/architecture/020-api-docs-page.md)
