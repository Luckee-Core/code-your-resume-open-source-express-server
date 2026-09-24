# OSS release readiness score — Code Your Resume pair

Scored against the [release readiness checklist](https://github.com/luckee/mentorai-server/blob/main/data/open-source/oss-release-readiness-checklist.md) (Pair column). Date: 2026-09-24.

**Verdict: Ship** — all Required (R) items pass.

## 1. Legal and community

| # | Item | Score |
|---|------|-------|
| 1.1 | LICENSE (MIT, both repos) | pass |
| 1.2 | CONTRIBUTING.md | pass |
| 1.3 | CODE_OF_CONDUCT | N/A (not added; Rec) |
| 1.4 | CHANGELOG | pass |
| 1.5 | No secrets in tracked files | pass (working tree; history not re-scanned this date) |

## 2. Product and documentation

| # | Item | Score |
|---|------|-------|
| 2.1 | README (what, run, architecture) | pass |
| 2.2 | Companion repo + governance links | pass |
| 2.3 | .env.example with comments | pass |
| 2.4 | SECURITY.md | pass |
| 2.5 | Threat model | pass |
| 2.6 | Wire contract filled | pass — web `docs/wire-contract.md` (Next rewrites, not `NEXT_PUBLIC_SERVER_URL`) |
| 2.7 | In-app OSS onboarding | pass (landing `#open-source`) |
| 2.8 | Database / Supabase runbook | pass — Express README required DDL + optional prompt updates |
| 2.9 | API docs | pass (Rec) — `GET /api-docs.json`, web `/docs/api` |

## 3. Frontend shape

| # | Item | Score |
|---|------|-------|
| 3.1 | src/packages + thin app | pass |
| 3.2 | Redux manual thunks | pass |
| 3.3 | Styles object pattern | pass |
| 3.4 | ADRs + AGENTS.md | pass |
| 3.5 | No dead exports | pass |

## 4. Express shape

| # | Item | Score |
|---|------|-------|
| 4.1 | Router factories + handlers | pass |
| 4.2 | /api/data aggregator | pass (exception: `src/api/data/` not `src/services/`) |
| 4.3 | CRUD in src/data/ | pass |
| 4.4 | Managed clients at startup | pass |
| 4.5 | Logging + error JSON | pass |
| 4.6 | ADR entity pattern | pass (documented fork) |
| 4.7 | Dev auth bypass | N/A (no bypass; open API documented; optional `CRM_API_SECRET`) |

## 5–6. Security

| # | Item | Score |
|---|------|-------|
| 5.1 | NEXT_PUBLIC_* hygiene | pass |
| 5.3 | Live code preview / iframe | documented (TSX preview, trusted operator) |
| 6.2 | Env split | pass |
| 6.4 | Auth or local-only threat model | pass (documented open API) |
| 6.5 | CORS documented | pass |
| 6.7 | npm audit in CI | partial (non-blocking step) |

## 7. Pair contract

| # | Item | Score |
|---|------|-------|
| 7.1 | API URL + port 3053 | pass (`EXPRESS_API_URL` / rewrite default) |
| 7.2 | Health endpoint documented | pass |
| 7.3 | Error JSON shape | pass (`{ success, error }`) |
| 7.4 | No service-role in browser | pass |

## 8. CI

| # | Item | Score |
|---|------|-------|
| 8.1 | CI build (+ lint web) | pass |
| 8.2 | npm audit | Rec — non-blocking |
| 8.3 | Lockfile committed | pass |

## Manual verification

- [ ] Express: `npm run dev` + `curl http://127.0.0.1:3053/api/health` (requires `SUPABASE_*` in `.env`)
- [ ] Web: `.env.local` + `npm run dev` + landing `/` and dashboard `/dashboard`

## Ship with debt (Rec items and documented forks)

- CODE_OF_CONDUCT.md
- Blocking `npm audit` in CI
- Production auth on API routes (optional `CRM_API_SECRET` only)
- Template nextjs ADR 001 whole-slice `useAppSelector` (this repo allows field reads)
- Template nextjs ADR 012 package form inputs (not adopted)
- Template express ADR 008 `src/model/` (row types remain in `src/data/*/types.ts`)
