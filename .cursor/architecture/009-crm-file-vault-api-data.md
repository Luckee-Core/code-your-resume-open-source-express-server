# 009 – CRM `/api/data` action API

## Scope

- **CRM persistence (required):** Supabase tables (`companies`, `employees`, `jobs`, `job_applications`, `employments`, `job_questions`, `job_question_answers`, …). DDL in `docs/crm-postgres-schema.sql`. Access via `requireCrmSupabaseClient()` in `src/data/crm/` and entity folders under `src/data/`.
- **Graphics:** Supabase `image_graphics` (`docs/supabase-image-graphics-schema.sql`); routes under `/api/data/image-graphic/*`.
- **Job-listing ledger (JSON):** Append-only files under `JOB_LISTING_DATA_DIR` (scrape runs, AI requests/responses/exchanges) — see `src/data/job-listing/`.
- **HTTP:** `app.use('/api/data', createApiDataRouter())`. Routes are **action paths** per entity: `/api/data/company/list`, `/api/data/job-questions/create`, etc.
- **Source layout:** HTTP in `src/api/data/{entity}/`; CRUD in `src/data/{entity}/` (one function per file). Legacy grouped CRM helpers in `src/data/crm/read-write-*.ts` are being split — prefer new one-file-per-action modules (see `src/data/job-questions/`).

## Environment

- **`SUPABASE_URL`** + **`SUPABASE_SERVICE_ROLE_KEY`** — required for CRM and graphics; server fails CRM operations if unset.
- `CRM_DATA_DIR` – optional; used only for job-listing JSON ledger paths when not overridden.
- `JOB_LISTING_DATA_DIR` – optional absolute path for job-listing ledger JSON. Default: `<CRM_DATA_DIR>/../job-listing`.
- `ANTHROPIC_API_KEY` – optional; when set, `POST /api/data/job/import-listing` runs a small JSON extract after HTML→text.
- `CORS_ORIGINS` – optional comma-separated browser origins (defaults allow common Next dev URLs).

## Job import-listing

- **Route:** `POST /api/data/job/import-listing` with JSON body `{ "id": "<jobUuid>" }`. Requires the job to have a non-empty `url`; validates `http`/`https` and basic SSRF guards.
- **Orchestration:** `src/services/job/scrape-job-listing.ts` (`runJobListingImport`) — `fetch` with timeout and byte cap, HTML→plain text, optional Anthropic extract, then **persist** ledger JSON, then CRM job update.
- **Ledger:** `src/data/job-listing/` — append-only JSON arrays. AI rows are written **after** the Anthropic round completes; failed scrapes finalize the run row with `status: "failed"`.

## Optional Supabase mirror (job listing AI + sections)

When Supabase is configured, AI ledger rows from extract/sections passes may **also** mirror into `job_listing_ai_*` tables (`docs/supabase-job-listing-ai-ledger-mirror.sql`). Successful **sections** extract may insert into `job_responsibilities`, `job_requirements`, and `job_nice_to_have` (`docs/supabase-job-listing-sections-mirror.sql`). JSON ledger remains useful for debugging; Supabase is the live CRM source of truth for entities and listing sections.

## Handler pattern

```typescript
// src/api/data/job-questions/list.ts
export const handleJobQuestionList = async (_req, res) => {
  console.log('📥 GET /api/data/job-questions/list');
  try {
    const data = await listJobQuestions(requireCrmSupabaseClient());
    console.log('📤 200 GET /api/data/job-questions/list');
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('❌ handleJobQuestionList:', err);
    res.status(500).json({ success: false, error: '...' });
  }
};
```

Do not inline `.from('table')` in handlers — add or reuse a function under `src/data/{entity}/`.
