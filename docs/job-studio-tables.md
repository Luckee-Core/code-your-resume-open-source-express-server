# Job Studio — Database Tables

Coach chat for a single CRM job. Separate from **`job_listing_ai_*`** (listing import / scrape).

## Overview

| Layer | Purpose |
|-------|---------|
| **Chat ledger** | Append-only requests / responses / exchanges per `job_id` |

The coach does **not** write responsibility/requirement/nice-to-have rows; users edit those in the builder via existing CRM APIs.

## Tables

### `job_studio_requests`

One row per user message.

| Column | Notes |
|--------|--------|
| `job_id` | CRM job UUID |
| `user_id` | e.g. `local-user` in OSS |
| `content` | Message text |
| `status` | `pending` → `completed` / `failed` |
| `exchange_id`, `response_id` | Back-filled after the turn |

### `job_studio_responses`

| Column | Notes |
|--------|--------|
| `structured` | JSONB: `{ content: string, coachSections?: { heading, bullets[] }[] }` |

### `job_studio_exchanges`

Links one request to one response; stores token usage.

| Column | Notes |
|--------|--------|
| `job_id` | Same as request’s job (for filtered listing) |

## Setup

Run `docs/supabase-job-studio-schema.sql` in Supabase.

## Typical flow

```
POST /api/job-studio/messages { jobId, userId, content }
  → INSERT job_studio_requests (pending)
  → AI → INSERT job_studio_responses
  → INSERT job_studio_exchanges
  → UPDATE job_studio_requests (completed)
```
