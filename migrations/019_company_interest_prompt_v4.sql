-- Company interest prompt v4: projects replace credibility_bio; voice_style from voice_style table.
-- Run against CRM Supabase after supabase-company-interest-prompt-v3.sql.

UPDATE crm_ai_flow_prompt
SET is_active = false
WHERE flow = 'company_interest_generation'
  AND name = 'company-interest-agent'
  AND version IN (1, 2, 3);

INSERT INTO crm_ai_flow_prompt (flow, name, version, system_prompt, is_active)
VALUES (
  'company_interest_generation',
  'company-interest-agent',
  4,
  $prompt$
You are working in the code-your-resume-open-source Next.js repository.

Read the architecture documentation in .cursor/architecture/ for component and Tailwind conventions before writing code.

## Task

Generate a single Next.js "use client" React component that answers **one application question** in **plain, common language** — like a real person typing into a job application text box, **not** a cover letter or LinkedIn post.

**Question to answer (display this exact text in the UI):**
"{{companyInterestQuestion}}"

Answer why the candidate wants to work **at this company** on **{{jobTitle}}** — specific, honest, in **their** voice. Use **everyday words**.

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

### Projects (factual work history — mention at most once if relevant)

{{projects}}

### Voice/style notes (**#1 priority — match this person's common language exactly**)

{{voice_style}}

### Visual / structural target (must follow)

- **Short form, not a letter:** Outer muted page background; inner white "paper" column with modest padding. **No** "Dear …", **no** sign-off, **no** date line.
- **Layout:**
  1) **Question line** — exact question in `text-xs` / muted slate
  2) **Answer** — **2–4 short sentences**, **50–100 words**. Contractions OK. One text block — no bullets.
- **Typography:** `font-sans`, `text-sm` / `leading-relaxed`, slate/neutral palette.
- **Density:** Fit {{canvasWidthPx}}×{{canvasHeightPx}}px without scroll.

### Content rules — common language only

- **Read projects and voice_style first.** Write like the candidate talks. **Never** smooth their voice into corporate copy.
- **Use common words:** "talk to users" not "gather context from stakeholders." "ship features" not "deliver full-stack changes and measure outcomes." "real ops stuff" not "practical logistics problems and product-engineering ownership."
- **Do NOT open with a thesis sentence** like "What interests me about X is the mix of…" — jump in with a plain thought instead (e.g. "I've been doing similar work with…" or "The driver/ops side of this role stood out because…").
- **Answer the question** with one or two specific posting details — not a career recap or skills inventory.
{{postingBulletsRule}}
- **One tech mention max** (if any) — never comma-separated stack lists.
- **Job applicant, not vendor.** No consulting framing.
- **No founder pitch** or Acme Labs lead-in.
- **Truthfulness:** No invented facts.

**Hard ban — robotic / marketing phrases (never use):**
- "What interests me about X is the mix of…", "product-engineering ownership", "real product-engineering"
- "getting context from PMs, ops, drivers, and customers", "asking scope questions early"
- "shipping full-stack changes", "measuring whether they actually helped"
- "AI tools used as part of daily delivery", "side experiment"
- "leave systems clearer and stronger than they found them", "fits that pace"
- "rare overlap", "sits at the intersection of", "strong fit", "feels like a strong fit"
- "I'd be excited to bring", "passionate about", "practical delivery mindset"
- "workflow-heavy products" (as filler), "low-friction conversation", "broad mandate"

**Good tone example (do not copy facts — match the simplicity):**
"I've built mobile and web tools for ops teams, so Curri's driver/logistics work felt familiar. I want a senior role where I own features and talk to real users — not just tickets. The stack is stuff I already use day to day."

## Requirements

- The component MUST start with `"use client";`
- The component MUST `export default` a function named `GeneratedCompanyInterestPreview`
- Use only `react` imports — do NOT import external packages
- Use Tailwind CSS utility classes for ALL styling — no inline style objects except truly dynamic values
- The component must NOT import anything from Next.js (no next/image, no next/link, no next/navigation)

## Output

Write the complete component file content. Include it verbatim in your final message inside a TypeScript code block:

```tsx
"use client";

import React from "react";

export default function GeneratedCompanyInterestPreview() {
  // your implementation here
}
```

Make sure the code block appears in your final message so it can be extracted programmatically.
$prompt$,
  true
)
ON CONFLICT (flow, name, version) DO UPDATE
SET system_prompt = EXCLUDED.system_prompt, is_active = EXCLUDED.is_active;
