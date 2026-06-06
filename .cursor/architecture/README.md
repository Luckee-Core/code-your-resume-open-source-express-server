# Architecture Documentation

This folder contains Architecture Decision Records (ADRs) for Express server conventions and implementation patterns.

## Why ADRs?

ADRs document:
- **What** standards we follow
- **Why** we chose them
- **How** to apply them consistently

## ADR index (on-disk)

### Shared conventions (001–006, 009–010)

1. [001 – File & API organization](./001-file-and-domain-organization.md) — `src/api/data/` HTTP, `src/data/` CRUD, one function per file.
2. [002 – Router factory & handler pattern](./002-router-factory-and-handler-pattern.md) — Thin routers, handlers own request flow.
3. [003 – Data layer & CRUD boundaries](./003-data-layer-crud-boundaries.md) — Isolate database CRUD in `src/data/`.
4. [004 – Managed clients & startup init](./004-managed-clients-and-startup-init.md) — Initialize shared clients at startup.
5. [005 – Edge functions & Railway boundaries](./005-edge-functions-railway-only.md) — Edge functions call Railway only.
6. [006 – Logging & error response standards](./006-logging-and-error-response-standards.md) — Emoji logging and `{ success, error }` responses.
9. [009 – `/api/data` entity routers](./009-api-data-entity-routers.md) — Supabase CRM, action routes under `src/api/data/`, job-listing JSON sidecar.
10. [010 – Error log persistence](./010-error-log-persistence.md) — `thunk_errors`, `ui_errors`, `api_errors` tables.
11. [011 – API docs catalog](./011-api-docs-catalog.md) — `GET /api-docs.json`, hand-maintained catalog for web `/docs/api`.

## How to use

1. Open the ADR most relevant to your feature.
2. Follow the approved patterns in implementation.
3. Add new ADRs here whenever architectural decisions change—and **update this index** when you do.
