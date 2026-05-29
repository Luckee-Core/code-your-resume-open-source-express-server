# Code Your Resume — CRM Express server

Local JSON vault API for companies, jobs, applications, job listing import (fetch + optional AI), technical skills studio routes (Supabase-backed), and related services.

## Threat model (read before exposing this port)

- **No user authentication** on `/api/data/*` or `/api/technical-skills/*` by default.
- **Bind:** Listens on **`127.0.0.1`** by default so the CRM is not reachable from other machines on the LAN. For Docker / Railway / LAN testing, set **`HOST=0.0.0.0`** explicitly.
- **`CRM_API_SECRET`:** Optional. When set, clients must send **`X-CRM-API-Key`** or **`Authorization: Bearer`** matching the secret. Use the **same** value in the Next.js app as **`CRM_API_SECRET`** so rewrites keep working.
- **CORS:** In production, **`CORS_ORIGINS=*` is ignored** (unsafe); use a comma-separated allowlist. Dev may use `*` with Node not in production mode.
- Secrets: **`SUPABASE_SERVICE_ROLE_KEY`**, **`ANTHROPIC_API_KEY`**, **`CURSOR_API_KEY`** — server-only; never expose to the browser.

See **`SECURITY.md`** for disclosure and limitations.

## Features

- TypeScript, Express, CRM JSON under `CRM_DATA_DIR`
- Job listing URL fetch with **`validatePublicJobListingUrl`** (blocks loopback, RFC1918, metadata IP **169.254.169.254**)
- Optional Anthropic / Supabase integrations

## Quick Start

### Install

```bash
npm install
```

### Run (development)

```bash
npm run dev
```

Default URL **http://127.0.0.1:3053** (override with **`PORT`**).

### Smoke test

```bash
curl http://127.0.0.1:3053/api/health
```

With **`CRM_API_SECRET`** set on the server:

```bash
CRM_API_SECRET=your-secret curl -H "X-CRM-API-Key: your-secret" http://127.0.0.1:3053/api/data/company/list
```

## Available Endpoints

- `GET /` - Health check
- `GET /api/health` - Health check with detailed info
- **`/api/data/**`** — CRM JSON vault (companies, employees, jobs, job-applications). See [.cursor/architecture/009-crm-file-vault-api-data.md](.cursor/architecture/009-crm-file-vault-api-data.md). Default port **3053**; set `CRM_DATA_DIR` to your vault path.
- **`POST /api/data/job/import-listing`** — Fetches a job’s `url`, writes scrape + optional AI ledger JSON under `JOB_LISTING_DATA_DIR` (default `<CRM_DATA_DIR>/../job-listing`), then updates the job snapshot (`description`, `listingImportedAt`, pointers). Optional `ANTHROPIC_API_KEY` for structured extract. Many SPA-only boards return little or no HTML to a server `fetch`; users remain responsible for target-site terms of use.

### CRM smoke test

With the server running:

```bash
CRM_BASE=http://127.0.0.1:3053 npm run verify:crm
```

## Project Structure

```
express-server-template/
├── index.ts                 # Main entry point
├── src/
│   └── services/
│       ├── middleware/      # Express middleware
│       │   ├── setup-early-middleware.ts
│       │   ├── setup-error-handling.ts
│       │   └── index.ts
│       ├── health/          # Health check routes
│       │   ├── create-health-router.ts
│       │   └── index.ts
│       └── server/          # Server startup logic
│           ├── start-server.ts
│           └── index.ts
├── package.json
├── tsconfig.json
└── .gitignore
```

## Environment Variables

Create a `.env` file in the project root. See **`.env.example`** for all options. Highlights:

```env
PORT=3053
NODE_ENV=development
HOST=127.0.0.1
CRM_DATA_DIR=
JOB_LISTING_DATA_DIR=
CRM_API_SECRET=
ANTHROPIC_API_KEY=
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:watch` - Watch mode compilation

## Adding New Routes

1. Create a new router in `src/services/`:

```typescript
// src/services/my-feature/create-my-router.ts
import { Router, Request, Response } from 'express';

export const createMyRouter = (): Router => {
  const router = Router();
  
  router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'My feature works!' });
  });
  
  return router;
};
```

2. Export it in `src/services/my-feature/index.ts`:

```typescript
export { createMyRouter } from './create-my-router';
```

3. Mount it in `index.ts`:

```typescript
import { createMyRouter } from './src/services/my-feature';
app.use('/api/my-feature', createMyRouter());
```

## Deployment

Requires **Node.js 22+** (native `WebSocket`; Supabase client initializes Realtime at startup). Local: `nvm use` (see `.nvmrc`). Railway/Nixpacks: `nixpacks.toml` pins major version 22.

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
NODE_ENV=production node dist/index.js
```

## Architecture Principles

This template follows these conventions:
- **One function per file** - Each file contains a single, focused function
- **Factory pattern** - Routers are created via factory functions
- **Index exports** - Every folder has an `index.ts` for clean imports
- **Type safety** - Explicit types for all functions and routes
- **Middleware separation** - Early middleware vs error handling

## License

MIT

## Author

TroutHouseTech
