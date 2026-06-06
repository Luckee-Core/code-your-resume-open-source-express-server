# 002 – Router Factory and Handler Pattern

## Status

Accepted

## Scope

Applies to all HTTP under `src/api/data/{entity}/` and `src/api/{feature}/`.

## Core rules

1. Use router factory functions only: `createXRouter(): Router`.
2. Routers are thin: route wiring only (no business logic, no try/catch, no DB calls).
3. CRM handlers live in `src/api/data/{entity}/` (one handler per file: `list.ts`, `create.ts`, …).
4. Studio handlers live in `src/api/{feature}/routes/` (one handler per file).
5. Handler flow is fixed:
   1. get Supabase client (`requireCrmSupabaseClient()` or null-check)
   2. validate request
   3. call data layer or `processX()` in services
   4. catch/log errors
   5. return `{ success, data?, error? }` with 200/400/500
6. Never call `createClient()` in handlers.
7. Use `type` (not `interface`) for shared types.
8. Add JSDoc on router factories, handlers, and business logic functions.
9. Emoji log prefixes per ADR 006: `📥` request, `📤` response, `❌` error, `🤖` AI, `💾` DB.

## Router factory example

```typescript
// src/api/data/company/router.ts
import { Router } from "express";
import { handleCompanyList } from "./list";
import { handleCompanyCreate } from "./create";

/**
 * Factory for company CRM routes under /api/data/company.
 */
export const createCompanyRouter = (): Router => {
  const router = Router();
  router.get("/list", handleCompanyList);
  router.post("/create", handleCompanyCreate);
  return router;
};
```

## Handler example

```typescript
// src/api/data/job-questions/list.ts
import type { Request, Response } from "express";
import { requireCrmSupabaseClient } from "../../../services/supabase/require-crm-supabase-client";
import { listJobQuestions } from "../../../data/job-questions/list-job-questions";

/**
 * GET /api/data/job-questions/list — list all job questions.
 */
export const handleJobQuestionList = async (_req: Request, res: Response): Promise<void> => {
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

## Anti-patterns

- Inline `router.post(..., async (req, res) => { ... })` with full logic in `router.ts`
- Per-request `createClient()` calls
- Inline `.from('table')` in handlers when a `src/data/` function exists
- Uncaught throws without try/catch in handlers

## Related

- [001 – File & API organization](./001-file-and-domain-organization.md)
- [003 – Data layer CRUD boundaries](./003-data-layer-crud-boundaries.md)
- [006 – Logging & error response standards](./006-logging-and-error-response-standards.md)
