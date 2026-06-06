# Code Your Resume — Express API

Supabase-backed CRM API, graphics studio, technical skills studio, professional background, job studio, and job listing import for the [Code Your Resume](https://github.com/Luckee-Core/code-your-resume-open-source) Next.js app.

**Companion web:** [code-your-resume-open-source](https://github.com/Luckee-Core/code-your-resume-open-source)  
**Studio map:** [Luckee-Core/getting-started](https://github.com/Luckee-Core/getting-started)  
**Wire contract:** [web repo `docs/wire-contract.md`](https://github.com/Luckee-Core/code-your-resume-open-source/blob/main/docs/wire-contract.md)  
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
CRM_BASE=http://127.0.0.1:3053 npm run verify:crm
```

## Supabase runbook

Apply in order on a fresh Supabase project:

1. `docs/crm-postgres-schema.sql`
2. `docs/supabase-image-graphics-schema.sql`
3. `docs/supabase-error-log-schema.sql`
4. `docs/supabase-job-listing-ai-ledger-mirror.sql` (optional)
5. `docs/supabase-job-listing-sections-mirror.sql` (optional)
6. `docs/supabase-job-studio-schema.sql`
7. `docs/supabase-user-background-studio-schema.sql` (optional)

Optional demo seed: `npm run seed:sql` (reads synthetic fixtures from `.data/`).

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
    professional-background/   # Background narrative
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
- `/api/professional-background/**` — professional background
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
