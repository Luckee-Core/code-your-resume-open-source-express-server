-- =============================================================================
-- Team conversation generation — ledger tables, exchange registry, AI prompt
-- =============================================================================
-- Run after supabase-exchange-registry-update.sql (exchange_table_registry exists).
-- =============================================================================

CREATE TABLE IF NOT EXISTS team_conversation_generation_requests (
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

CREATE TABLE IF NOT EXISTS team_conversation_generation_responses (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  tsx_code      TEXT        NOT NULL,
  agent_summary TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_conversation_generation_exchanges (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id            UUID        NOT NULL,
  request_id        UUID        NOT NULL REFERENCES team_conversation_generation_requests (id) ON DELETE CASCADE,
  agent_id          TEXT        NOT NULL,
  response_id       UUID        REFERENCES team_conversation_generation_responses (id) ON DELETE SET NULL,
  input_tokens      INTEGER     NOT NULL DEFAULT 0,
  output_tokens     INTEGER     NOT NULL DEFAULT 0,
  model_used        TEXT        NOT NULL DEFAULT '',
  status            TEXT        NOT NULL DEFAULT 'running'
    CHECK (status IN ('running', 'completed', 'failed')),
  error_message     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_conversation_generation_requests_job_id
  ON team_conversation_generation_requests (job_id);

CREATE INDEX IF NOT EXISTS idx_team_conversation_generation_exchanges_job_id
  ON team_conversation_generation_exchanges (job_id);

CREATE INDEX IF NOT EXISTS idx_team_conversation_generation_exchanges_created_at
  ON team_conversation_generation_exchanges (created_at DESC);

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
  'team_conversation_generation',
  'team_conversation_generation_exchanges',
  'created_at',
  'input_tokens',
  'output_tokens',
  'model_used',
  true,
  45,
  'Cursor team conversation TSX generation (YC-style opener)'
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
  'team_conversation_generation',
  'team-conversation-agent',
  1,
  $prompt$
You are working in the code-your-resume-open-source Next.js repository.

Read the architecture documentation in .cursor/architecture/ for component and Tailwind conventions before writing code.

## Task

Generate a single Next.js "use client" React component that answers **one YC-style application prompt** in a **warm, human, conversational** tone — like a real person starting a chat with the hiring team, **not** a formal cover letter or stiff form answer.

**Prompt to answer (display this exact text in the UI):**
"{{teamConversationQuestion}}"

The message must feel **personally written** — mix something about the candidate, what they're looking for next, and (when possible) a specific reason this company/role caught their eye.

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

### Technical skills context (weave in only when natural)

{{skillsBlock}}

### Professional background (factual source — do not invent beyond this)

Education:
{{education}}

Credibility bio:
{{credibility_bio}}

Voice/style notes (match this tone):
{{voice_style}}

Portfolio/GitHub narrative (same Acme Labs work as credibility_bio — mention at most once if relevant):
{{projects}}

### Visual / structural target (must follow)

- **Conversation opener, not a letter:** Outer muted page background; inner white "paper" column with modest padding. **No** "Dear …", **no** formal sign-off, **no** date line, **no** recipient block.
- **Layout:**
  1) **Prompt line** — show the exact prompt above in `text-xs` / muted slate (can wrap across lines)
  2) **Message** — **1 short paragraph** (3–6 sentences) OR **2 very short paragraphs** max. Target **90–160 words total**. Plain language; contractions OK; occasional first-person warmth.
- **Typography:** `font-sans`, `text-sm` / `leading-relaxed`, slate/neutral palette. No gradients, neon, illustrations, or badge clouds.
- **Density:** Fit {{canvasWidthPx}}×{{canvasHeightPx}}px without scroll — half-page or less.

### Content rules

- **Human-written feel:** Avoid buzzword stacks, "I am excited to apply", or AI-polished corporate tone. Sound like a thoughtful engineer writing in a text box before hitting submit.
- **Three beats (blend naturally):** (1) a brief personal hook from background, (2) what you're looking for in your next role, (3) why this company/role is interesting — use posting details when available.
- **Be specific:** Reference **at least one** concrete detail from responsibilities or requirements when provided.
- **Job applicant, not vendor:** You want to **join** the team, not sell services.
- **No founder identity:** Do not lead with "founder" or Acme Labs as a pitch. Past building experience may appear in **one clause** if it supports fit.
- **Truthfulness:** Do not invent facts unsupported by the background or posting.

## Requirements

- The component MUST start with `"use client";`
- The component MUST `export default` a function named `GeneratedTeamConversationPreview`
- Use only `react` imports — do NOT import external packages
- Use Tailwind CSS utility classes for ALL styling — no inline style objects except truly dynamic values
- The component must NOT import anything from Next.js (no next/image, no next/link, no next/navigation)

## Output

Write the complete component file content. Include it verbatim in your final message inside a TypeScript code block:

```tsx
"use client";

import React from "react";

export default function GeneratedTeamConversationPreview() {
  // your implementation here
}
```

Make sure the code block appears in your final message so it can be extracted programmatically.
$prompt$,
  true
)
ON CONFLICT (flow, name, version) DO UPDATE
SET system_prompt = EXCLUDED.system_prompt, is_active = EXCLUDED.is_active;
