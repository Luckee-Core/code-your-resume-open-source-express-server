# Code Your Resume — Express API

Supabase-backed CRM API, graphics studio, technical skills studio, voice style, projects, job studio, and job listing import for the [Code Your Resume](https://github.com/Luckee-Core/code-your-resume-open-source) Next.js app.

**Companion web:** [code-your-resume-open-source](https://github.com/Luckee-Core/code-your-resume-open-source)  
**Studio map:** [Luckee-Core/getting-started](https://github.com/Luckee-Core/getting-started)  
**Wire contract:** [web repo `docs/wire-contract.md`](https://github.com/Luckee-Core/code-your-resume-open-source/blob/main/docs/wire-contract.md)  
**Release scorecard:** [`docs/oss/release-readiness-score.md`](docs/oss/release-readiness-score.md)  
**Code audit:** [`docs/oss/code-audit.md`](docs/oss/code-audit.md)  
**OSS governance:** [mentorai-server `data/open-source/`](https://github.com/luckee/mentorai-server/tree/main/data/open-source)

## Quick start

```bash
cp .env.example .env
# Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
npm install
npm run dev
```

Default URL **http://127.0.0.1:3053**. Apply Supabase SQL from `docs/` before CRM smoke tests (see runbook below).

```bash
curl http://127.0.0.1:3053/api/health
curl -s http://127.0.0.1:3053/api-docs.json | head -c 200
CRM_BASE=http://127.0.0.1:3053 npm run verify:crm
```

Human-readable API reference: start this server and open **http://localhost:3000/docs/api** in the web app (catalog fetched from `GET /api-docs.json`).

## Supabase runbook

Apply **required DDL** in this order on a fresh Supabase project. Each file’s header comment is the source of “run after” order. Files use `IF NOT EXISTS` / `ADD COLUMN IF NOT EXISTS` where they overlap (for example `image_graphics` is in the CRM schema and in the graphics sidecar).

### Required DDL

1. `docs/crm-postgres-schema.sql` — companies, jobs, questions, listing ledger, section bullets, `image_graphics`
2. `docs/supabase-image-graphics-schema.sql` — graphics studio sidecar (safe if CRM schema already created the table)
3. `docs/supabase-error-log-schema.sql` — `thunk_errors`, `ui_errors`, `api_errors`
4. `docs/supabase-job-studio-schema.sql` — Job Studio chat ledger
5. `docs/supabase-technical-skills-schema.sql` — Technical Skills Studio
6. `docs/supabase-projects-schema.sql` — projects + project notes
7. `docs/supabase-project-website-research.sql` — after projects schema
8. `docs/supabase-project-notes-synthesis.sql` — after projects schema
9. `docs/supabase-voice-style-schema.sql` — Voice Style Studio singleton
10. `docs/supabase-linkedin-profile-schema.sql` — after core CRM tables
11. `docs/supabase-job-newsletter-ingest.sql` — after CRM schema (`job_newsletter_sources`)
12. `docs/supabase-crm-ai-prompts-migration.sql` — after newsletter ingest (`crm_ai_flow_prompt`, exchange registry, ingest ledger)
13. `docs/supabase-exchange-registry-update.sql` — after CRM AI prompts (cover letter / company interest / skills-component ledgers)
14. `docs/supabase-ideal-candidate-generation.sql` — after exchange registry
15. `docs/supabase-team-conversation-generation.sql` — after exchange registry

### Optional DDL

- `docs/supabase-job-listing-ai-ledger-mirror.sql` — listing AI tables if you skipped them in the CRM schema
- `docs/supabase-job-listing-sections-mirror.sql` — section bullets if you skipped them in the CRM schema
- `docs/supabase-user-background-studio-schema.sql` — ICP / user-background studio
- `docs/supabase-drop-professional-background.sql` — after voice style, if migrating off the legacy table

### Optional prompt version updates

These `UPDATE`/`INSERT` files are **not** schema. Run them after the ledger that creates `crm_ai_flow_prompt` (step 12) and after the generation DDL for that flow.

- Ideal candidate: `docs/supabase-ideal-candidate-prompt-v2.sql` (after `supabase-ideal-candidate-generation.sql`)
- Cover letter: `docs/supabase-cover-letter-point-of-emphasis-prompt-v2.sql`, then `…-prompt-v4.sql`
- Company interest: `docs/supabase-company-interest-prompt-v2.sql`, then `v3`, then `v4`
- Team conversation: `docs/supabase-team-conversation-prompt-v2.sql` (after `supabase-team-conversation-generation.sql`), then `v3`, then `v4`
- Skills component: `docs/supabase-skills-component-point-of-emphasis-prompt-v2.sql`, then `v3`, then `v4`

Optional demo seed: `npm run seed:sql` (reads synthetic fixtures from `.data/`). Seed SQL files (`docs/supabase-seed-*.sql`) are data, not DDL.

## Threat model

- **No user authentication** on `/api/data/*` by default — local/trusted operator model.
- **Bind:** `127.0.0.1` by default. Set `HOST=0.0.0.0` for Docker/Railway.
- **`CRM_API_SECRET`:** Optional; clients send `X-CRM-API-Key` or `Authorization: Bearer`.
- **CORS:** Production ignores `CORS_ORIGINS=*`; use explicit allowlist.
- Server-only secrets: `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `CURSOR_API_KEY`.

See [`SECURITY.md`](SECURITY.md).

## Project structure

```text
index.ts                     # App wiring
src/
  api/
    data/                      # CRM entity HTTP (/api/data/company/list, …)
    job-studio/                # Per-job coach chat
    technical-skills/          # Skills studio
    voice-style/               # Tone/voice notes singleton
    user-background-studio/    # ICP / background coach
  data/                        # Supabase CRUD (one function per file)
  services/                    # Orchestration, middleware, Supabase client
docs/                          # SQL schemas and migrations
```

Architecture: `.cursor/architecture/` — especially [009-api-data-entity-routers.md](.cursor/architecture/009-api-data-entity-routers.md).

## Key endpoints

- `GET /api/health` — health check
- `/api/data/**` — CRM actions (companies, jobs, employees, applications, …)
- `/api/technical-skills/**` — technical skills studio
- `/api/voice-style/**` — voice style studio
- `/api/job-studio/**` — job studio coach
- `/api/user-background-studio/**` — user background / ICP coach
- `POST /api/data/job/import-listing` — fetch job URL, optional AI extract

## Environment

See `.env.example`. Required for core CRM:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
PORT=3053
HOST=127.0.0.1
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Development with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled `dist/index.js` |
| `npm run verify:crm` | CRM route smoke matrix |
| `npm run seed:sql` | Generate seed SQL from demo JSON |

## Deployment

Node.js **22+** required. Railway: `nixpacks.toml` pins major version 22.

```bash
npm run build
NODE_ENV=production node dist/index.js
```

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Follow `.cursor/rules/AGENTS.md` and ADRs.

## License

MIT — see [`LICENSE`](LICENSE).
