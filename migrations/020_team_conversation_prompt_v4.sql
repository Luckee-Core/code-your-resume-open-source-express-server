-- Team conversation prompt v4: projects replace credibility_bio; voice_style from voice_style table.
-- Run against CRM Supabase after supabase-team-conversation-prompt-v3.sql.

UPDATE crm_ai_flow_prompt
SET is_active = false
WHERE flow = 'team_conversation_generation'
  AND name = 'team-conversation-agent'
  AND version IN (1, 2, 3);

INSERT INTO crm_ai_flow_prompt (flow, name, version, system_prompt, is_active)
VALUES (
  'team_conversation_generation',
  'team-conversation-agent',
  4,
  $prompt$
You are working in the code-your-resume-open-source Next.js repository.

Read the architecture documentation in .cursor/architecture/ for component and Tailwind conventions before writing code.

## Task

Generate a single Next.js "use client" React component that answers **one YC-style application prompt** in **plain, common language** — a short note to the hiring team. **This is NOT a cover letter.** Different format, different rules.

**Prompt to answer (display this exact text in the UI):**
"{{teamConversationQuestion}}"

Write **only the reply message** — not a letter. Casual, direct, 3–4 short sentences max.

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

### Technical skills context (optional — one plain phrase max, no list)

{{skillsBlock}}

### Projects (software work only — mention at most once if relevant)

{{projects}}

### Voice/style notes (match tone — **not** catchphrase openers; see bans below)

{{voice_style}}

{{backgroundScopeRule}}

### Visual / structural target (must follow)

- **Application text box, not a letter:** Muted outer background; inner white column. **No** "Dear …", **no** "Hola hola", **no** sign-off, **no** date, **no** name/location intro line ("I'm Matt from Philly").
- **Layout:**
  1) **Prompt line** — exact prompt in `text-xs` / muted slate
  2) **Reply** — one text block, **3–4 sentences**, **40–80 words**. Short sentences. Contractions OK.
- **Typography:** `font-sans`, `text-sm` / `leading-relaxed`, slate/neutral. No badges or illustrations.
- **Density:** Fit {{canvasWidthPx}}×{{canvasHeightPx}}px without scroll.

### Content rules

- **Software career only:** Talk about building software/products from projects. Do not draw parallels to non-software history. That reads weird on a YC application.
- **No cover-letter habits:** Never use `Hola hola`, never open with name + city, never "My name is…". Start with the point (e.g. "Curri's driver/ops side stood out because…" or "I've been building…").
- **Plain words:** Write like a normal engineer in a text field. No recruiter polish.
- **Three beats:** what you do (software) → what you want next → one real detail about this job/company.
{{postingBulletsRule}}
- **One tech mention max** — never stack frameworks.
- **No founder pitch**, no Acme Labs lead-in, no resume inventory.
- **Truthfulness:** Only facts from projects and skills context.

**Hard ban (never use):**
- `Hola hola` or any greeting catchphrase from voice_style
- Family business, contracting, electrical, field-ops, "before software", weekends/summers childhood jobs
- "I'm [Name] from [City]" openers
- "own ambiguous problems end-to-end", "get context from the people closest to the work"
- "ask scope questions early", "ship in tight loops", "measure whether the change actually helped"
- "product engineering", "mix of real-world operations and product engineering"
- "AI tools as a practical accelerator", "human judgment before anything ships"
- "What interests me about…", "caught my eye" + thesis paragraph, stack dumps

**Good example (match length and plainness — do not copy facts):**
"Curri's driver and dispatch problems are the kind of messy ops work I've been doing in software for a while. I want a senior role where I own features and talk to users, not just close tickets. Your stack looks like what I use daily. Happy to chat."

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
