# Code audit — Code Your Resume pair

Date: 2026-09-24. Bars: nextjs-template ADRs 001/004/012, Express template ADRs 001/003, product ADRs 001/016.

**Verdict:** Web packages/Redux/API pass the **blocker** bar. Express handlers do not query Supabase. This pass moved listing/synthesis ledger writes from `src/services/` into `src/data/`.

## Web — packages

| Check | Score | Evidence |
|-------|-------|----------|
| Feature UI in `src/packages/` | pass | Thin `src/app` routes; no `[id]` detail segments |
| Components never call HTTP | pass | `fetch` in packages: only `router.prefetch` in `src/packages/graphics/header/index.tsx` |
| `@/api` from packages | pass | Type-only: `api-docs-content.tsx`, `endpoint-card.tsx`, `docs-catalog-context.tsx` |
| No CSS modules | pass | `src/app/globals.css` only |

## Web — Redux

| Check | Score | Evidence |
|-------|-------|----------|
| No `createAsyncThunk` / `createSelector` | pass | Zero matches in `src/` |
| Manual `AppThunk` | pass | `src/store/thunks/**` |
| Thunks do not throw | pass | No `throw` in `src/store/thunks/` |
| `bulkImportDraftJobListingsThunk` return | debt | Returns `BulkImportDraftJobListingsResult \| null`, not `200 \| 400 \| 500` — `src/store/thunks/crm/bulk-import-draft-job-listings-thunk.ts` |
| Whole-slice `useAppSelector` | debt | Product ADR 001 allows field reads; ~70 package files do `s.currentJob.id` etc. |

## Web — API

| Check | Score | Evidence |
|-------|-------|----------|
| `requestApi` transport | pass | Domain clients under `src/api/**`; wrapper `src/api/_shared/request-api.ts` |
| Envelope `{ success, httpStatus }` | pass | ADR 016 / `_shared/types.ts` |
| Bare `fetch` exceptions | pass | Error reporters (`thunk-errors`, `api-errors`, `ui-errors`); Next BFF `src/app/api/**`, `src/lib/crm-proxy/` |
| Secrets in `NEXT_PUBLIC_*` | pass | Landing GitHub URL, optional `NEXT_PUBLIC_MENTORAI_USER_ID`, unused `NEXT_PUBLIC_API_BASE_URL` |

## Express — HTTP

| Check | Score | Evidence |
|-------|-------|----------|
| Handlers have no `.from(` | pass | `src/api/**` |
| `createClient()` only at startup | pass | `src/services/supabase/get-supabase-crm-mirror-client.ts` |
| Router factories | pass | `createXRouter()` under `src/api/` |

## Express — data vs services

| Check | Score | Evidence |
|-------|-------|----------|
| Listing AI ledger inserts | **fixed** | `src/data/job-listing-ai-requests|responses|exchanges/` — was `services/job/sync-job-listing-ai-ledger-to-supabase.ts` |
| Section bullet delete/insert | **fixed** | `src/data/job-responsibilities|job-requirements|job-nice-to-haves/` — orchestration remains in `sync-job-listing-section-rows-to-supabase.ts` |
| Project notes synthesis inserts | **fixed** | `src/data/project-notes-synthesis/` — was `services/project/sync-project-notes-synthesis-ledger-to-supabase.ts` |
| Bullet body reads | **fixed** | Generation uses `listSectionBodiesByJobId` (`src/data/job-listing-sections/`) |
| Dynamic-table helpers | exception | `src/utils/cursor-generation/complete-cursor-generation-exchange.ts`, `src/utils/supabase/batch-fetch-rows-by-ids.ts` — table name is a parameter; not duplicated per entity |
| Row types in `src/model/` | debt | Types stay in `src/data/*/types.ts` (Express ADR 001 fork) |

## Blockers fixed this pass

- Extracted PostgREST inserts/deletes from job listing AI ledger, section-row sync, and project-notes-synthesis into one-function-per-file data modules.
- Replaced `src/utils/job/load-job-bullet-bodies-from-supabase.ts` with `listSectionBodiesByJobId`.

## Debt not fixed

- Field `useAppSelector` (template ADR 001 strict whole-slice)
- Package form `inputs/{field}` / zero-arg save thunks (template ADR 012)
- Express `src/model/` entity files (template ADR 008)
- `bulkImportDraftJobListingsThunk` result-object return type
