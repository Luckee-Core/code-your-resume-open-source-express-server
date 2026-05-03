# Express Server Rules

BEFORE implementing ANY feature, you MUST:
1. Read `.cursor/architecture/README.md`.
2. Search `.cursor/architecture/` for relevant Express ADRs.
3. Follow documented patterns EXACTLY.

## Domain Architecture
- ALWAYS organize code in `src/domains/{domain}/` with `router.ts`, `routes/`, `config.ts`, and `types.ts`.
- MUST keep each domain self-contained; NEVER mix domain internals across unrelated domains.
- MUST use `type` and NEVER use `interface`.
- MUST use router factory pattern: export `createXRouter(): Router`; NEVER export a router instance directly.
- ALWAYS keep routers thin: route definitions only, no business logic.
- ALWAYS keep handlers in `src/domains/{domain}/routes/` with one handler per file.

## Handlers
- MUST follow this order: (1) get managed client, (2) validate request, (3) call business logic, (4) try/catch, (5) return response.
- ALWAYS delegate business logic to `processX()` functions; NEVER inline business logic in handlers.
- MUST add JSDoc to every router factory, handler, and business logic function.
- MUST handle errors in handlers (not routers), log errors, and return `{ success: false, error }` with `500`.
- MUST use status codes consistently: `200` success, `400` client error, `500` server error.

## Data Layer
- MUST place database CRUD in `src/data/{entity}/`; NEVER inline queries in domain logic or handlers.
- MUST keep one CRUD function per file in `src/data/{entity}/` with JSDoc on every function.
- ALWAYS extract logic used 2+ times into `src/utils/{domain}/`.
- Utilities in `src/utils/{domain}/` MUST be pure and MUST NOT have side effects.

## Services
- MUST use `getManagedSupabaseClient()` and `getManagedAnthropicClient()` for managed services.
- NEVER call `createClient()` (or equivalent constructors) in domain code.
- ALWAYS check managed clients for `null` before use; MUST return `500` if null/unavailable.
- MUST initialize managed service clients once at server startup; NEVER initialize per request.
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

## Quick Reference (Architecture + Express ADRs)
- Architecture entrypoint → `.cursor/architecture/README.md`
- Domain architecture & file organization → `.cursor/architecture/001-file-and-domain-organization.md`
- Router factory & handler pattern → `.cursor/architecture/002-router-factory-and-handler-pattern.md`
- Handler flow, errors, and status codes → `.cursor/architecture/003-handler-structure-and-error-standards.md`
- Data layer boundaries & CRUD rules → `.cursor/architecture/004-data-layer-crud-boundaries.md`
- Managed clients & startup initialization → `.cursor/architecture/005-managed-clients-and-startup-init.md`
- Edge functions Railway-only boundary → `.cursor/architecture/006-edge-functions-railway-only.md`
- Logging and response standards → `.cursor/architecture/007-logging-and-observability-standards.md`
- Utility extraction and purity rules → `.cursor/architecture/008-utils-extraction-and-purity.md`
