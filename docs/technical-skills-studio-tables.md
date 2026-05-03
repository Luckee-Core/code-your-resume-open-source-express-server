# Technical Skills Studio — Database Tables

This document maps every Supabase table touched by the Technical Skills Studio and explains what it stores, why it exists, and how the tables connect.

---

## Overview

The studio has two layers of data:

| Layer | What it stores |
|---|---|
| **Technical skills** | The live skill rows the user edits |
| **Chat ledger** | Every message exchange between the user and the AI coach |

The technical skills layer is where all the work happens day-to-day. The chat ledger is append-only and funds the AI suggestions flow.

---

## Table Reference

### 1. `technical_skills`

**The primary working table.** Each row is one skill entry — one technology, tool, framework, or platform.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `sort_order` | INTEGER | Display order |
| `title` | TEXT | Tool / technology name (e.g. "React Native") |
| `body` | TEXT | 1-2 sentence usage description |
| `status` | TEXT | `active` or `archived`; UI only shows `active` |
| `source_exchange_id` | UUID | FK → exchange that created this row (if AI-accepted) |
| `created_at / updated_at` | TIMESTAMPTZ | Timestamps |

**Write pattern:** The studio does a full replace — all technical_skills rows are replaced atomically via `replace-technical-skills` every time the user saves.

---

### 2. `technical_skills_requests`

One row per user chat message sent to the coach. Written before the AI call so a record exists even if the request fails.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `content` | TEXT | The user's message |
| `status` | TEXT | `pending` → `completed` or `failed` |
| `exchange_id` | UUID | Back-filled FK → exchange after completion |
| `response_id` | UUID | Back-filled FK → response after completion |

---

### 3. `technical_skills_responses`

One row per AI reply. Stores the full structured JSON payload returned by the coach.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `structured` | JSONB | `{ content, coachSections, suggestedSkills }` |

The `structured` JSONB shape the coach returns:
```json
{
  "content": "Plain-text reply shown in chat",
  "coachSections": [{ "heading": "...", "bullets": ["..."] }],
  "suggestedSkills": [
    {
      "title": "React Native",
      "body": "Used for cross-platform mobile apps.",
      "op": "add",
      "target_skill_id": null
    }
  ]
}
```

---

### 4. `technical_skills_exchanges`

The link table joining one request to one response, plus the token/credit ledger for that turn.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `request_id` | UUID | FK → request |
| `response_id` | UUID | FK → response |
| `input_tokens` | INTEGER | Tokens in the prompt |
| `output_tokens` | INTEGER | Tokens in the model reply |
| `total_tokens` | INTEGER | Sum |
| `credits_used` | INTEGER | Derived from total tokens |
| `model_used` | TEXT | Anthropic model slug |
| `status` | TEXT | `completed` or `failed` |

---

### 5. `technical_skills_suggestions`

When the AI suggests new technical skill rows, they land here as `pending` suggestions. The user sees them as "Accept" cards in the chat column. Accepting one writes a new row to `technical_skills`.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID | PK |
| `exchange_id` | UUID | FK → exchange that generated this suggestion |
| `response_id` | UUID | FK → response that generated this suggestion |
| `title` | TEXT | Suggested tool name |
| `body` | TEXT | Suggested usage description |
| `op` | TEXT | `add` or `update` |
| `target_skill_id` | UUID | FK → existing skill (for `update` ops only) |
| `status` | TEXT | `pending` → `accepted` or `rejected` |

---

## Data Flow for a Typical Session

```
User types a message
  └─ INSERT technical_skills_requests (status: pending)
       └─ AI call (Anthropic)
            └─ INSERT technical_skills_responses (structured JSONB)
                 └─ INSERT technical_skills_exchanges (token ledger)
                      └─ UPDATE technical_skills_requests (status: completed)
                           └─ INSERT technical_skills_suggestions (status: pending)

User accepts a suggestion
  └─ UPDATE technical_skills_suggestions (status: accepted)
       └─ UPSERT technical_skills (new skill row)

User edits / removes a row manually
  └─ Full REPLACE of technical_skills
     (all active rows sent in one PATCH → replace-technical-skills function)
```

---

## Setup

Run the full DDL from `docs/supabase-technical-skills-schema.sql` in your Supabase SQL editor to create all required tables and indexes.
