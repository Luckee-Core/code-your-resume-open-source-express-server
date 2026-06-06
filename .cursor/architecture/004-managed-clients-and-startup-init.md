# Managed Clients & Startup Init

## Goal

Initialize the Supabase CRM mirror client once at server startup, then reuse it through `getSupabaseCrmMirrorClient()` and `requireCrmSupabaseClient()`.

## Managed service clients

Use these accessors in handlers, services, and data functions:

- `getSupabaseCrmMirrorClient()` — returns client or `null` (check before optional paths)
- `requireCrmSupabaseClient()` — throws if unset (use in CRM handlers after startup guard)

Do **not** call `createClient()` outside `src/services/supabase/get-supabase-crm-mirror-client.ts`.

Optional AI features use `@anthropic-ai/sdk` directly in service modules when `ANTHROPIC_API_KEY` is set — not a global managed singleton.

## Startup initialization

`index.ts` loads env, ensures data dirs, then verifies Supabase before `startServer()`:

```typescript
const supabase = getSupabaseCrmMirrorClient();
if (!supabase) {
  console.error("❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  process.exit(1);
}
startServer(app, { port: PORT, ... });
```

CRM operations require Supabase — the server exits if credentials are missing.

## Handler structure

1. Get client (`requireCrmSupabaseClient()` or null-check)
2. Validate request input
3. Call data layer or service orchestration
4. try/catch with emoji logging
5. Return JSON with proper status code

## Status codes

- `200` — success
- `400` — client/validation error
- `500` — server error (including unavailable Supabase)

## Edge function rule

Supabase edge functions call Railway HTTP endpoints only — no CRUD in edge (see ADR 005).

## Related

- [002 – Router factory & handler pattern](./002-router-factory-and-handler-pattern.md)
- [009 – `/api/data` entity routers](./009-api-data-entity-routers.md)
