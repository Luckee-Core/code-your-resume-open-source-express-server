# Managed Clients & Startup Init

## Goal

Initialize the Postgres pool once at server startup, then reuse it through `getManagedPgPool()` and `requireCrmPgPool()`.

## Managed service clients

Use these accessors in handlers, services, and data functions:

- `getManagedPgPool()` — returns `Pool` or `null` (check before optional paths)
- `requireCrmPgPool()` — throws if unset (use in CRM handlers after startup guard)

Do **not** call `new Pool()` outside `src/services/postgres/get-managed-pg-pool.ts`.

Optional AI features use `@anthropic-ai/sdk` directly in service modules when `ANTHROPIC_API_KEY` is set — not a global managed singleton.

## Startup initialization

`index.ts` loads env, ensures data dirs, then verifies Postgres before `startServer()`:

```typescript
initializeManagedPgPool();
const pool = getManagedPgPool();
if (!pool) {
  console.error("❌ DATABASE_URL is required");
  process.exit(1);
}
startServer(app, { port: PORT, ... });
```

CRM operations require Postgres — the server exits if `DATABASE_URL` is missing.

## Handler structure

1. Get pool (`requireCrmPgPool()` or null-check `getManagedPgPool()`)
2. Validate request input
3. Call data layer or service orchestration
4. try/catch with emoji logging
5. Return JSON with proper status code

## Status codes

- `200` — success
- `400` — client/validation error
- `500` — server error (including unavailable Postgres)

## Edge function rule

Edge functions call Railway HTTP endpoints only — no CRUD in edge (see ADR 005).

## Related

- [002 – Router factory & handler pattern](./002-router-factory-and-handler-pattern.md)
- [009 – `/api/data` entity routers](./009-api-data-entity-routers.md)
- [012 – Local Postgres data layer](./012-local-postgres-data-layer.md)
