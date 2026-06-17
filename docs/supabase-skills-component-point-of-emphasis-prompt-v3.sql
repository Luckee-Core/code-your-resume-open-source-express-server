-- Skills component (resume) prompt v3: projects replace professionalBackgroundBlock.
-- Run against CRM Supabase after supabase-skills-component-point-of-emphasis-prompt-v2.sql.

UPDATE crm_ai_flow_prompt
SET is_active = false
WHERE flow = 'skills_component_generation'
  AND name = 'skills-component-agent'
  AND version IN (1, 2);

INSERT INTO crm_ai_flow_prompt (flow, name, version, system_prompt, is_active)
VALUES (
  'skills_component_generation',
  'skills-component-agent',
  3,
  $prompt$
You are working in the code-your-resume-open-source Next.js repository.

Read the architecture documentation in .cursor/architecture/ for component and Tailwind conventions before writing code.

## Task

Generate a single Next.js "use client" React component as a **full one-page resume document** for this candidate applying to **{{jobTitle}}**. This is not a technical-skills poster. It must read like a real resume **tailored to this posting** — not a generic CV.

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

### Focus points (candidate-provided — optional)

{{pointOfEmphasisBlock}}

### Job-tailored emphasis (mandatory — posting-driven, not a fixed template)

{{postingEmphasisRule}}
{{pointOfEmphasisRule}}

- **Executive summary:** Open with the **1–2 themes the posting cares about most**, using only evidence from projects/skills. If the role is AI/LLM/agent/RAG-heavy, **lead with that** — do not open with generic mobile/web stack unless the posting centers there. If the posting is mobile-first, lead mobile. Match the job, not a boilerplate order.
- **Experience bullets (Acme Labs):** Order bullets by **posting fit** — highest-overlap evidence **first**. Weave relevant stack/tools **into bullets** (not a separate skills section). Do not bury posting-critical work under generic React Native / full-stack filler.

### Technical skills (candidate — for tailoring only; do NOT render as a resume section)

{{skillsList}}
{{projectsBlock}}

### Voice/style notes (optional tone guidance)

{{voice_style}}

### Visual / structural target (must follow)

- **Document, not deck:** Outer area is a muted page background (e.g. slate-100); inner content is a **white "paper" column** centered in the canvas with modest padding, subtle border or ring, optional light shadow — similar in spirit to a printed résumé.
- **Typography:** Use `font-sans`, comfortable body text (`text-sm` / `leading-relaxed`), slate/neutral palette only. **No** gradients-as-backgrounds, **no** neon, **no** heavy glassmorphism, **no** playful illustrations, **no** oversized display type.
- **Required sections (all required):**
  1) **Header / name line** — candidate full name only (from projects/notes). **Do NOT** add "Founder", "Co-founder", or similar titles on the name line or document header. You may add **one** optional subline under the name (e.g. email, city, or a 3–6 word role label aligned to **{{jobTitle}}**) — **not** a paragraph.
  2) **Executive Summary** — placed immediately below the header, before Experience.
     - **Format:** exactly **one** `<p>` element. **No** `<ul>`, **no** bullets, **no** line-per-sentence layout, **no** second paragraph.
     - **Voice (mandatory):** **First person only** — write as the candidate speaking ("I build…", "I embed…", "My work…"). **Never** third person: no "[Name] is…", "He/She…", "His/Her…", or biography-style distance.
     - **Length (hard cap):** **3 sentences maximum**, **≤70 words total**. If you wrote 4+ sentences or 8+ lines, rewrite shorter until it fits.
     - **Content:** Follow **Job-tailored emphasis** above — lead with what **this posting** prioritizes, not a default stack order.
     - **Anti-pattern (reject):** third-person bio copy, leading with irrelevant stack when posting screams AI (or vice versa), bullet-list summary, or a redundant skills/stack section at the bottom.
  3) **Experience** — **one row per real employer only.** Put the strongest **posting-aligned** evidence here. **This is where stack and tools belong** — woven into impact bullets, not duplicated in a separate list.
     - **Acme Labs (THT) — exactly ONE entry, non-negotiable:** Everything from Acme Labs, THT, projects, and labels like "Client Product Work", "Independent product work", or skill-themed splits is the **same employer**. Use organization **Acme Labs** once. Pick **one** role title. Combine work into **3–4 bullets** ordered by **posting relevance** — do **not** split by specialty into two Experience blocks.
     - **Other employers:** Only clearly separate companies get their own row (e.g. Revature → "Earlier").
     - Each entry: role | organization, date range ("Recent" / "Earlier" if unknown), **2–4 bullets** for THT (merged), **1–2 bullets** for other employers.
     - Prefer engineering/building titles over founder labels when both apply.
  4) **Education** — include only if present in projects/notes context; otherwise omit or use a minimal line.
- **No skills / stack section:** Do **NOT** add "Technical Focus", "Skills", "Technologies", "Stack", "Tools", or similar sections. Skills from the list above must appear only inside the executive summary and Experience bullets — **never** as a grouped catalog at the bottom.
- **Summary placement:** The Executive Summary is the **only** summary/profile block. Do **NOT** add duplicate Summary, Profile, About, or Overview sections elsewhere.
- **No duplicate work sections:** Do **NOT** add extra sections such as "Selected Products", "Projects", "Portfolio", "Products", or "Selected Work".
- **Acme Labs deduplication (invalid if violated):** **Exactly one** Experience entry with organization Acme Labs. **Forbidden second entries:** "Client Product Work", "Independent product…", or any second **Recent** row that repeats the same products/apps.
- **Section cap:** Use only the four required sections above (header, executive summary, experience, education). No fifth section for skills, stack, or products.
- **Sections styling:** Use clear section structure with **small uppercase section labels** (e.g. border-b on the label row) and body copy below. Prefer bullets/short lines over dense paragraphs.
- **Compact page (no dead space):** Do **NOT** use `min-h-screen`, `h-screen`, `min-h-svh`, or any viewport-height Tailwind class anywhere. The outer wrapper must **hug content** — modest `py-3` or `py-4` only.
- **Density:** Use the full {{canvasWidthPx}}px width. Height is content-driven (the preview canvas auto-sizes). Do **not** add fixed-height wrappers or internal scroll areas.
- **Restraint:** At most one subtle divider between sections. No animations. No charts. No fake logos.

## Requirements

- The component MUST start with `"use client";`
- The component MUST `export default` a function named `GeneratedSkillsPreview`
- Use only `react` imports — do NOT import external packages (no lucide-react, no framer-motion)
- Use Tailwind CSS utility classes for ALL styling — no inline style objects except for truly dynamic values
- The component must NOT import anything from Next.js (no next/image, no next/link, no next/navigation)
- **No placeholder text** like "your implementation here", "lorem ipsum", or generic fake content. Use only facts and reasonable inferences from provided inputs.
- **Truthfulness rule:** Do not invent employers, degrees, certifications, or metrics that are not supported by the provided skills/projects context.
- **Title restraint:** Do not state or repeat "founder" / "co-founder" in the header or name line.
- **Posting-first ordering:** Summary opening sentence + first Acme Labs bullet must reflect the **posting's top theme** when projects support it — never a canned order independent of Responsibilities/Requirements.
- **Executive summary cap:** One `<p>`, max 3 sentences, max 70 words, **first person only**.
- **No viewport min-heights:** Never use `min-h-screen` / `h-screen` / `min-h-*vh` on any element.
- **No skills section:** Never render Technical Focus / Skills / Technologies / Stack blocks — tools belong in Experience bullets only.
- **Deduplication:** Acme Labs / THT / projects / client product work = **one** Experience entry.

## Output

Write the complete component file content. Include it verbatim in your final message inside a TypeScript code block:

```tsx
"use client";

import React from "react";

export default function GeneratedSkillsPreview() {
  // your implementation here
}
```

Make sure the code block appears in your final message so it can be extracted programmatically.
$prompt$,
  true
)
ON CONFLICT (flow, name, version) DO UPDATE
SET system_prompt = EXCLUDED.system_prompt, is_active = EXCLUDED.is_active;
