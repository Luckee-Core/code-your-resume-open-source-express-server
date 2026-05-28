export type BuildSkillsComponentPromptInput = {
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

/**
 * Build the Cursor agent prompt for generating a one-page resume-style document
 * that presents technical skills with restrained typography (not a flashy banner).
 *
 * The agent targets the code-your-resume-open-source repo so it can read
 * .cursor/architecture/ ARDs and follow the project's styling + component conventions.
 *
 * @param input - Skills list and canvas dimensions
 * @returns Fully assembled prompt string to send to the Cursor agent
 */
export const buildSkillsComponentPrompt = (input: BuildSkillsComponentPromptInput): string => {
  const {
    skills,
    canvasWidthPx,
    canvasHeightPx,
    professionalBackgroundSegments,
  } = input;

  const skillsList = skills.map((s) => `- ${s}`).join('\n');

  const professionalBackgroundBlock = professionalBackgroundSegments
    ? `\n### Professional background context (use as factual source)\n\nEducation:\n${professionalBackgroundSegments.education || '(empty)'}\n\nCredibility bio:\n${professionalBackgroundSegments.credibility_bio || '(empty)'}\n\nVoice/style notes:\n${professionalBackgroundSegments.voice_style || '(empty)'}\n\nPortfolio/GitHub narrative (same TroutHouseTech work as credibility_bio — merge into Experience; do not create a separate products section):\n${professionalBackgroundSegments.portfolio_github || '(empty)'}\n`
    : '';

  return `You are working in the code-your-resume-open-source Next.js repository.

Read the architecture documentation in .cursor/architecture/ for component and Tailwind conventions before writing code.

## Task

Generate a single Next.js "use client" React component as a **full one-page resume document** for this candidate. This is not a technical-skills poster. It must read like a real resume tailored to the current job context.

### Content to incorporate (source of truth)

${skillsList}
${professionalBackgroundBlock}

### Visual / structural target (must follow)

- **Document, not deck:** Outer area is a muted page background (e.g. slate-100); inner content is a **white "paper" column** centered in the canvas with modest padding, subtle border or ring, optional light shadow — similar in spirit to a printed résumé.
- **Typography:** Use \`font-sans\`, comfortable body text (\`text-sm\` / \`leading-relaxed\`), slate/neutral palette only. **No** gradients-as-backgrounds, **no** neon, **no** heavy glassmorphism, **no** playful illustrations, **no** oversized display type.
- **Required sections (all required):**
  1) **Header / name line** — candidate full name only (from credibility_bio). **Do NOT** add "Founder", "Co-founder", or similar titles on the name line or document header. You may add **one** optional subline under the name (e.g. email, city, or a 3–6 word role label like "Software engineer") — **not** a paragraph.
  2) **Experience** — at least 2 entries inferred from provided portfolio/background text. Each entry should include role/company-style label, date range (if unknown, use "Recent" / "Earlier"), and 1-2 impact bullets. Prefer engineering/building titles over founder labels when both apply. **This is the main body of the resume** — put the strongest fit-for-role evidence here.
  3) **Education** — use education context directly when available.
  4) **Technical Focus** — curated stack list grouped or line-broken for readability (not a giant badge cloud). Pull from the skills list; keep compact.
- **No summary block:** Do **NOT** include a Summary, Profile, About, Overview, or Professional Summary section. Do **NOT** write a multi-sentence narrative under the name. No "mega summary" — if anything appears below the name, it must be a single short subline (contact or role label), not prose.
- **No duplicate work sections:** Do **NOT** add extra sections such as "Selected Products", "Projects", "Portfolio", "Products", or "Selected Work". **TroutHouseTech** and anything in portfolio_github describe the **same work** — consolidate into **one TroutHouseTech Experience entry** with bullets. Never list the same products or apps twice under different section headings.
- **Section cap:** Use only the four required sections above (header, experience, education, technical focus). No fifth section for summary, projects, or products.
- **Sections styling:** Use clear section structure with **small uppercase section labels** (e.g. border-b on the label row) and body copy below. Prefer bullets/short lines over dense paragraphs.
- **Density:** Fit the ${canvasWidthPx}×${canvasHeightPx}px viewport without horizontal scroll; prioritize legibility over decoration.
- **Restraint:** At most one subtle divider between sections. No animations. No charts. No fake logos.

## Requirements

- The component MUST start with \`"use client";\`
- The component MUST \`export default\` a function named \`GeneratedSkillsPreview\`
- Use only \`react\` imports — do NOT import external packages (no lucide-react, no framer-motion)
- Use Tailwind CSS utility classes for ALL styling — no inline style objects except for truly dynamic values
- The component must NOT import anything from Next.js (no next/image, no next/link, no next/navigation)
- **No placeholder text** like "your implementation here", "lorem ipsum", or generic fake content. Use only facts and reasonable inferences from provided inputs.
- **Truthfulness rule:** Do not invent employers, degrees, certifications, or metrics that are not supported by the provided skills/background context.
- **Title restraint:** Do not state or repeat "founder" / "co-founder" in the header or name line. Mention company-building only inside Experience bullets when it supports a relevant skill — never as the headline identity.
- **Deduplication:** If credibility_bio and portfolio_github both mention TroutHouseTech, TeenPros, BoxBets, or similar — treat them as one employer/project cluster under Experience only. Do not also create a "Selected Products" block listing the same items.

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
