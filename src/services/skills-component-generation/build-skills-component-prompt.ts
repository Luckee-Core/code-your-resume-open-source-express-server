export type BuildSkillsComponentPromptInput = {
  jobId: string;
  jobTitle: string;
  companyName?: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves?: string[];
  skills: string[];
  canvasWidthPx: number;
  canvasHeightPx: number;
  professionalBackgroundSegments?: {
    education: string;
    credibility_bio: string;
    voice_style: string;
    portfolio_github: string;
  };
};

const formatBulletList = (items: string[], emptyLabel: string): string => {
  if (!items.length) {
    return emptyLabel;
  }
  return items.map((item) => `- ${item}`).join('\n');
};

/**
 * Build the Cursor agent prompt for generating a one-page resume-style document
 * tailored to the target job posting.
 *
 * The agent targets the code-your-resume-open-source repo so it can read
 * .cursor/architecture/ ARDs and follow the project's styling + component conventions.
 *
 * @param input - Job posting context, skills, background, and canvas dimensions
 * @returns Fully assembled prompt string to send to the Cursor agent
 */
export const buildSkillsComponentPrompt = (input: BuildSkillsComponentPromptInput): string => {
  const {
    jobId,
    jobTitle,
    companyName,
    responsibilities,
    requirements,
    niceToHaves = [],
    skills,
    canvasWidthPx,
    canvasHeightPx,
    professionalBackgroundSegments,
  } = input;

  const companyLine = companyName?.trim()
    ? `Company: ${companyName.trim()}`
    : 'Company: (not provided)';

  const responsibilitiesBlock = formatBulletList(responsibilities, '(none provided)');
  const requirementsBlock = formatBulletList(requirements, '(none provided)');
  const niceToHavesBlock = formatBulletList(niceToHaves, '(none provided)');
  const skillsList = skills.map((s) => `- ${s}`).join('\n');

  const hasPostingBullets = responsibilities.length > 0 || requirements.length > 0;

  const postingEmphasisRule = hasPostingBullets
    ? `Read **Responsibilities** and **Requirements** below first. Infer what this **${jobTitle.trim()}** role weights most (e.g. AI/LLM/agents, mobile, full-stack product, infra, FDE/customer-facing delivery, etc.) from repetition and specificity — **do not assume a fixed lead theme**.`
    : `Posting bullets may be sparse — infer emphasis from **${jobTitle.trim()}**, company context, and skills; still prioritize relevance over a generic stack laundry list.`;

  const professionalBackgroundBlock = professionalBackgroundSegments
    ? `\n### Professional background (factual source — do not invent beyond this)\n\nEducation:\n${professionalBackgroundSegments.education || '(empty)'}\n\nCredibility bio:\n${professionalBackgroundSegments.credibility_bio || '(empty)'}\n\nVoice/style notes:\n${professionalBackgroundSegments.voice_style || '(empty)'}\n\nPortfolio/GitHub narrative (**same TroutHouseTech / THT body of work** as credibility_bio — NOT a second employer; merge every product and client build listed here into the **single** TroutHouseTech Experience entry):\n${professionalBackgroundSegments.portfolio_github || '(empty)'}\n`
    : '';

  return `You are working in the code-your-resume-open-source Next.js repository.

Read the architecture documentation in .cursor/architecture/ for component and Tailwind conventions before writing code.

## Task

Generate a single Next.js "use client" React component as a **full one-page resume document** for this candidate applying to **${jobTitle.trim()}**. This is not a technical-skills poster. It must read like a real resume **tailored to this posting** — not a generic CV.

### Job context

Job ID: ${jobId}
Role: ${jobTitle.trim()}
${companyLine}

### Responsibilities (from posting)

${responsibilitiesBlock}

### Requirements (from posting)

${requirementsBlock}

### Nice-to-haves (from posting)

${niceToHavesBlock}

### Job-tailored emphasis (mandatory — posting-driven, not a fixed template)

${postingEmphasisRule}

- **Executive summary:** Open with the **1–2 themes the posting cares about most**, using only evidence from background/skills. If the role is AI/LLM/agent/RAG-heavy, **lead with that** — do not open with generic mobile/web stack unless the posting centers there. If the posting is mobile-first, lead mobile. Match the job, not a boilerplate order.
- **Experience bullets (TroutHouseTech):** Order bullets by **posting fit** — highest-overlap evidence **first**. Weave relevant stack/tools **into bullets** (not a separate skills section). Do not bury posting-critical work under generic React Native / full-stack filler.

### Technical skills (candidate — for tailoring only; do NOT render as a resume section)

${skillsList}
${professionalBackgroundBlock}

### Visual / structural target (must follow)

- **Document, not deck:** Outer area is a muted page background (e.g. slate-100); inner content is a **white "paper" column** centered in the canvas with modest padding, subtle border or ring, optional light shadow — similar in spirit to a printed résumé.
- **Typography:** Use \`font-sans\`, comfortable body text (\`text-sm\` / \`leading-relaxed\`), slate/neutral palette only. **No** gradients-as-backgrounds, **no** neon, **no** heavy glassmorphism, **no** playful illustrations, **no** oversized display type.
- **Required sections (all required):**
  1) **Header / name line** — candidate full name only (from credibility_bio). **Do NOT** add "Founder", "Co-founder", or similar titles on the name line or document header. You may add **one** optional subline under the name (e.g. email, city, or a 3–6 word role label aligned to **${jobTitle.trim()}**) — **not** a paragraph.
  2) **Executive Summary** — placed immediately below the header, before Experience.
     - **Format:** exactly **one** \`<p>\` element. **No** \`<ul>\`, **no** bullets, **no** line-per-sentence layout, **no** second paragraph.
     - **Voice (mandatory):** **First person only** — write as the candidate speaking ("I build…", "I embed…", "My work…"). **Never** third person: no "[Name] is…", "He/She…", "His/Her…", or biography-style distance.
     - **Length (hard cap):** **3 sentences maximum**, **≤70 words total**. If you wrote 4+ sentences or 8+ lines, rewrite shorter until it fits.
     - **Content:** Follow **Job-tailored emphasis** above — lead with what **this posting** prioritizes, not a default stack order.
     - **Anti-pattern (reject):** third-person bio copy, leading with irrelevant stack when posting screams AI (or vice versa), bullet-list summary, or a redundant skills/stack section at the bottom.
  3) **Experience** — **one row per real employer only.** Put the strongest **posting-aligned** evidence here. **This is where stack and tools belong** — woven into impact bullets, not duplicated in a separate list.
     - **TroutHouseTech (THT) — exactly ONE entry, non-negotiable:** Everything from TroutHouseTech, THT, portfolio_github, credibility_bio client/product builds, and labels like "Client Product Work", "Independent product work", or skill-themed splits is the **same employer**. Use organization **TroutHouseTech** once. Pick **one** role title. Combine work into **3–4 bullets** ordered by **posting relevance** — do **not** split by specialty into two Experience blocks.
     - **Other employers:** Only clearly separate companies get their own row (e.g. Revature → "Earlier").
     - Each entry: role | organization, date range ("Recent" / "Earlier" if unknown), **2–4 bullets** for THT (merged), **1–2 bullets** for other employers.
     - Prefer engineering/building titles over founder labels when both apply.
  4) **Education** — use education context directly when available.
- **No skills / stack section:** Do **NOT** add "Technical Focus", "Skills", "Technologies", "Stack", "Tools", or similar sections. Skills from the list above must appear only inside the executive summary and Experience bullets — **never** as a grouped catalog at the bottom.
- **Summary placement:** The Executive Summary is the **only** summary/profile block. Do **NOT** add duplicate Summary, Profile, About, or Overview sections elsewhere.
- **No duplicate work sections:** Do **NOT** add extra sections such as "Selected Products", "Projects", "Portfolio", "Products", or "Selected Work".
- **TroutHouseTech deduplication (invalid if violated):** **Exactly one** Experience entry with organization TroutHouseTech. **Forbidden second entries:** "Client Product Work", "Independent product…", or any second **Recent** row that repeats the same products/apps.
- **Section cap:** Use only the four required sections above (header, executive summary, experience, education). No fifth section for skills, stack, or products.
- **Sections styling:** Use clear section structure with **small uppercase section labels** (e.g. border-b on the label row) and body copy below. Prefer bullets/short lines over dense paragraphs.
- **Compact page (no dead space):** Do **NOT** use \`min-h-screen\`, \`h-screen\`, \`min-h-svh\`, or any viewport-height Tailwind class anywhere. The outer wrapper must **hug content** — modest \`py-3\` or \`py-4\` only.
- **Density:** Use the full ${canvasWidthPx}px width. Height is content-driven (the preview canvas auto-sizes). Do **not** add fixed-height wrappers or internal scroll areas.
- **Restraint:** At most one subtle divider between sections. No animations. No charts. No fake logos.

## Requirements

- The component MUST start with \`"use client";\`
- The component MUST \`export default\` a function named \`GeneratedSkillsPreview\`
- Use only \`react\` imports — do NOT import external packages (no lucide-react, no framer-motion)
- Use Tailwind CSS utility classes for ALL styling — no inline style objects except for truly dynamic values
- The component must NOT import anything from Next.js (no next/image, no next/link, no next/navigation)
- **No placeholder text** like "your implementation here", "lorem ipsum", or generic fake content. Use only facts and reasonable inferences from provided inputs.
- **Truthfulness rule:** Do not invent employers, degrees, certifications, or metrics that are not supported by the provided skills/background context.
- **Title restraint:** Do not state or repeat "founder" / "co-founder" in the header or name line.
- **Posting-first ordering:** Summary opening sentence + first TroutHouseTech bullet must reflect the **posting's top theme** when background supports it — never a canned order independent of Responsibilities/Requirements.
- **Executive summary cap:** One \`<p>\`, max 3 sentences, max 70 words, **first person only**.
- **No viewport min-heights:** Never use \`min-h-screen\` / \`h-screen\` / \`min-h-*vh\` on any element.
- **No skills section:** Never render Technical Focus / Skills / Technologies / Stack blocks — tools belong in Experience bullets only.
- **Deduplication:** TroutHouseTech / THT / portfolio_github / client product work = **one** Experience entry.

## Output

Write the complete component file content. Include it verbatim in your final message inside a TypeScript code block:

\`\`\`tsx
"use client";

import React from "react";

export default function GeneratedSkillsPreview() {
  // your implementation here
}
\`\`\`

Make sure the code block appears in your final message so it can be extracted programmatically.`;
};
