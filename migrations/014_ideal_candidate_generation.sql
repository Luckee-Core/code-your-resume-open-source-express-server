-- =============================================================================
-- Ideal candidate generation — ledger tables, exchange registry, AI prompt
-- =============================================================================
-- Run after supabase-exchange-registry-update.sql (exchange_table_registry exists).
-- =============================================================================

CREATE TABLE IF NOT EXISTS ideal_candidate_generation_requests (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id           UUID        NOT NULL,
  skills           TEXT[]      NOT NULL DEFAULT '{}',
  canvas_width_px  INTEGER     NOT NULL,
  canvas_height_px INTEGER     NOT NULL,
  prompt_text      TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ideal_candidate_generation_responses (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tsx_code      TEXT        NOT NULL,
  agent_summary TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ideal_candidate_generation_exchanges (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id            UUID        NOT NULL,
  request_id        UUID        NOT NULL REFERENCES ideal_candidate_generation_requests (id) ON DELETE CASCADE,
  agent_id          TEXT        NOT NULL,
  response_id       UUID        REFERENCES ideal_candidate_generation_responses (id) ON DELETE SET NULL,
  input_tokens      INTEGER     NOT NULL DEFAULT 0,
  output_tokens     INTEGER     NOT NULL DEFAULT 0,
  model_used        TEXT        NOT NULL DEFAULT '',
  status            TEXT        NOT NULL DEFAULT 'running'
    CHECK (status IN ('running', 'completed', 'failed')),
  error_message     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ideal_candidate_generation_requests_job_id
  ON ideal_candidate_generation_requests (job_id);

CREATE INDEX IF NOT EXISTS idx_ideal_candidate_generation_exchanges_job_id
  ON ideal_candidate_generation_exchanges (job_id);

CREATE INDEX IF NOT EXISTS idx_ideal_candidate_generation_exchanges_created_at
  ON ideal_candidate_generation_exchanges (created_at DESC);

INSERT INTO public.exchange_table_registry (
  logical_key,
  table_name,
  occurred_at_column,
  input_tokens_column,
  output_tokens_column,
  model_column,
  enabled,
  sort_order,
  notes
)
VALUES (
  'ideal_candidate_generation',
  'ideal_candidate_generation_exchanges',
  'created_at',
  'input_tokens',
  'output_tokens',
  'model_used',
  true,
  46,
  'Cursor ideal-candidate TSX generation (why you are the ideal fit)'
)
ON CONFLICT (logical_key) DO UPDATE
SET
  table_name = EXCLUDED.table_name,
  occurred_at_column = EXCLUDED.occurred_at_column,
  input_tokens_column = EXCLUDED.input_tokens_column,
  output_tokens_column = EXCLUDED.output_tokens_column,
  model_column = EXCLUDED.model_column,
  enabled = EXCLUDED.enabled,
  sort_order = EXCLUDED.sort_order,
  notes = EXCLUDED.notes;

INSERT INTO crm_ai_flow_prompt (flow, name, version, system_prompt, is_active)
VALUES (
  'ideal_candidate_generation',
  'ideal-candidate-agent',
  1,
  $prompt$
You are working in the code-your-resume-open-source Next.js repository.

Read the architecture documentation in .cursor/architecture/ for component and Tailwind conventions before writing code.

## Task

Generate a single Next.js "use client" React component that answers **one application question** in **plain, common language** — like a real person typing into a job application text box, **not** a cover letter or LinkedIn post.

**Question to answer (display this exact text in the UI):**
"{{idealCandidateQuestion}}"

Explain why this candidate is a strong fit for **{{jobTitle}}** — specific, honest, in **their** voice. Use **everyday words**. Connect real project work to posting requirements.

### Job context

Job ID: {{jobId}}
Role: {{jobTitle}}
{{companyLine}}

### Responsibilities (from posting)

{{responsibilitiesBlock}}

### Requirements (from posting)

{{requirementsBlock}}

### Nice-to-haves (from posting)

{{niceToHavesBlock}}

### Technical skills context (at most one mention, plain words — no stack dump)

{{skillsBlock}}

### Projects (factual work history — cite at least one when relevant)

{{projects}}

### Voice/style notes (**#1 priority — match this person's common language exactly**)

{{voice_style}}

### Visual / structural target (must follow)

- **Short form, not a letter:** Outer muted page background; inner white "paper" column with modest padding. **No** "Dear …", **no** sign-off, **no** date line.
- **Layout:**
  1) **Question line** — exact question in `text-xs` / muted slate
  2) **Answer** — **3–5 short sentences**, **80–130 words**. Contractions OK. One text block — no bullets.
- **Typography:** `font-sans`, `text-sm` / `leading-relaxed`, slate/neutral palette.
- **Density:** Fit {{canvasWidthPx}}×{{canvasHeightPx}}px without scroll.

### Content rules — common language only

- **Read projects and voice_style first.** Write like the candidate talks. **Never** smooth their voice into corporate copy.
- **Answer the fit question:** Name **one or two** concrete ways their past work matches this role — tie to posting bullets when available.
{{postingBulletsRule}}
- **Use common words:** "ship features" not "deliver full-stack changes and measure outcomes." "talk to users" not "gather context from stakeholders."
- **Do NOT open with a thesis** like "I am the ideal candidate because…" — start with a plain, specific thought (e.g. "I've spent the last few years building…" or "Most of my recent work lines up with…").
- **One tech mention max** (if any) — never comma-separated stack lists.
- **Job applicant, not vendor.** No consulting framing.
- **Truthfulness:** No invented facts beyond projects and voice_style.

**Hard ban — robotic / marketing phrases (never use):**
- "ideal candidate", "strong fit", "feels like a strong fit", "rare overlap"
- "product-engineering ownership", "shipping full-stack changes", "measuring whether they actually helped"
- "I'd be excited to bring", "passionate about", "practical delivery mindset"
- "sits at the intersection of", "broad mandate", "workflow-heavy products" (as filler)

## Requirements

- The component MUST start with `"use client";`
- The component MUST `export default` a function named `GeneratedIdealCandidatePreview`
- Use only `react` imports — do NOT import external packages
- Use Tailwind CSS utility classes for ALL styling — no inline style objects except truly dynamic values
- The component must NOT import anything from Next.js (no next/image, no next/link, no next/navigation)

## Output

Write the complete component file content. Include it verbatim in your final message inside a TypeScript code block:

```tsx
"use client";

import React from "react";

export default function GeneratedIdealCandidatePreview() {
  // your implementation here
}
```

Make sure the code block appears in your final message so it can be extracted programmatically.
$prompt$,
  true
)
ON CONFLICT (flow, name, version) DO UPDATE
SET system_prompt = EXCLUDED.system_prompt, is_active = EXCLUDED.is_active;
