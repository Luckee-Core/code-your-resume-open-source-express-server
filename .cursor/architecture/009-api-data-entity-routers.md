# 009 – `/api/data` Supabase Entity Routers

## Scope

- **HTTP:** Entity CRUD and actions mounted under `/api/data/...`.
- **Mount:** `app.use('/api/data', createApiDataRouter())` in `index.ts`.
- **CRM persistence (required):** Supabase tables (`companies`, `employees`, `jobs`, `job_applications`, `employments`, `job_questions`, …). DDL in `docs/crm-postgres-schema.sql`.
- **Graphics:** Supabase `image_graphics` — routes under `/api/data/image-graphic/*`.
- **Job-listing ledger (JSON sidecar):** Append-only files under `JOB_LISTING_DATA_DIR` for scrape runs and AI exchanges — see `src/data/job-listing/`. Supabase is the live CRM source of truth; JSON is for debugging.

## Fork exception (this repo)

Default OSS pattern (Lead Studio): `createDataService()` with routers in `src/data/{entity}/router.ts`.

**Code Your Resume** mounts entity HTTP in **`src/api/data/{entity}/`** with `createApiDataRouter()`. CRUD still lives in `src/data/{entity}/`. Same handler rules apply — only the HTTP folder differs.

## Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `SUPABASE_URL` | **Yes** | CRM, graphics, studios |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Server-side Supabase client |
| `CRM_DATA_DIR` | No | Job-listing JSON ledger paths |
| `JOB_LISTING_DATA_DIR` | No | Override job-listing JSON location |
| `ANTHROPIC_API_KEY` | No | Job import extract, website research, coach chat |
| `CRM_API_SECRET` | No | Optional shared secret for `/api/data/*` |
| `CORS_ORIGINS` | No | Browser → Express (when not using Next rewrites) |

## Entity router rules

1. **Factory:** `create{Entity}Router(): Router` — never export a bare router instance.
2. **Thin handlers:** validate → `src/data/` or `src/services/` → HTTP response.
3. **JSDoc** on factories and handlers.
4. **Logging:** `📥` on request, `📤` on success, `❌` on failure (ADR 006).
5. **No inline queries** in handlers — add or reuse a function under `src/data/{entity}/`.

## Action route examples

```text
GET  /api/data/company/list
POST /api/data/company/create
GET  /api/data/job-questions/list
POST /api/data/job/import-listing
POST /api/data/skills-component/generate
```

## Handler pattern

```typescript
// src/api/data/job-questions/list.ts
export const handleJobQuestionList = async (_req, res) => {
  console.log("📥 GET /api/data/job-questions/list");
  try {
    const data = await listJobQuestions(requireCrmSupabaseClient());
    console.log("📤 200 GET /api/data/job-questions/list");
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("❌ handleJobQuestionList:", err);
    res.status(500).json({ success: false, error: "Failed to list job questions" });
  }
};
```

## Job import-listing

- **Route:** `POST /api/data/job/import-listing` with `{ "id": "<jobUuid>" }`.
- **Orchestration:** `src/services/job/` — fetch, HTML→text, optional Anthropic extract, persist ledger JSON, update CRM job.
- **Mirror:** When Supabase is configured, AI ledger and section rows may mirror to `job_listing_ai_*` and `job_responsibilities` / `job_requirements` tables (see `docs/supabase-job-listing-*.sql`).

## Cross-reference

- OSS governance: [mentorai-server/data/open-source/oss-express-backend-benchmark.md](https://github.com/luckee/mentorai-server/blob/main/data/open-source/oss-express-backend-benchmark.md)
- Companion web repo wire contract: `code-your-resume-open-source/docs/wire-contract.md`
- Pair note: Next.js ADR **009** is CRM detail UI parity — different topic from this Express ADR 009.
