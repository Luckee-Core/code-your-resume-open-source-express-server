# Code Your Resume — Express API

Local Postgres CRM API, graphics studio, technical skills studio, voice style, projects, job studio, and job listing import for the [Code Your Resume](https://github.com/Luckee-Core/code-your-resume-open-source) Next.js app.

**Companion web:** [code-your-resume-open-source](https://github.com/Luckee-Core/code-your-resume-open-source)  
**Studio map:** [Luckee-Core/getting-started](https://github.com/Luckee-Core/getting-started)  
**Wire contract:** [web repo `docs/wire-contract.md`](https://github.com/Luckee-Core/code-your-resume-open-source/blob/main/docs/wire-contract.md)  
**Release scorecard:** [`docs/oss/release-readiness-score.md`](docs/oss/release-readiness-score.md)  
**Code audit:** [`docs/oss/code-audit.md`](docs/oss/code-audit.md)  
**OSS governance:** [mentorai-server `data/open-source/`](https://github.com/luckee/mentorai-server/tree/main/data/open-source)

## Quick start

```bash
cp .env.example .env
# Required: DATABASE_URL pointing at local Postgres
createdb code_your_resume
export DATABASE_URL="postgresql://$(whoami)@127.0.0.1:5432/code_your_resume"
psql "$DATABASE_URL" -f migrations/setup.sql
npm install
npm run dev
```

Default URL **http://127.0.0.1:3053**.

```bash
curl http://127.0.0.1:3053/api/health
curl -s http://127.0.0.1:3053/api-docs.json | head -c 200
CRM_BASE=http://127.0.0.1:3053 npm run verify:crm
```

Human-readable API reference: start this server and open **http://localhost:3000/docs/api** in the web app (catalog fetched from `GET /api-docs.json`).

## Local Postgres runbook

Install Homebrew Postgres if needed (`brew install postgresql@16 && brew services start postgresql@16`). Then:

```bash
createdb code_your_resume
export DATABASE_URL="postgresql://$(whoami)@127.0.0.1:5432/code_your_resume"
psql "$DATABASE_URL" -f migrations/setup.sql
```

`migrations/setup.sql` applies numbered files in order (core CRM, studios, generation ledgers, prompts). Source DDL also remains under `docs/` for reference.

Set `DATABASE_URL` in `.env` (server only — never in the web app's `NEXT_PUBLIC_*`).

## Threat model

- **No user authentication** on `/api/data/*` by default — local/trusted operator model.
- **Bind:** `127.0.0.1` by default. Set `HOST=0.0.0.0` for Docker/Railway.
- **`CRM_API_SECRET`:** Optional; clients send `X-CRM-API-Key` or `Authorization: Bearer`.
- **CORS:** Production ignores `CORS_ORIGINS=*`; use explicit allowlist.
- Server-only secrets: `DATABASE_URL`, `ANTHROPIC_API_KEY`, `CURSOR_API_KEY`.

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
  data/                        # Postgres CRUD (one function per file)
  services/                    # Orchestration, middleware, Postgres pool
docs/                          # SQL schemas (source) and historical notes
migrations/                    # Apply with psql via setup.sql
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
DATABASE_URL=postgresql://YOUR_USER@127.0.0.1:5432/code_your_resume
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
