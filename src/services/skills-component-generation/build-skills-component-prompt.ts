export type BuildSkillsComponentPromptInput = {
  skills: string[];
  canvasWidthPx: number;
  canvasHeightPx: number;
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
  const { skills, canvasWidthPx, canvasHeightPx } = input;

  const skillsList = skills.map((s) => `- ${s}`).join('\n');

  return `You are working in the code-your-resume-open-source Next.js repository.

Read the architecture documentation in .cursor/architecture/ for component and Tailwind conventions before writing code.

## Task

Generate a single Next.js "use client" React component that lays out the following technical skills as a **one-page resume document** — calm, print-friendly, and readable. Think **letter-sized paper in a browser**, not a marketing banner, poster, or dashboard.

### Content to incorporate (source of truth)

${skillsList}

### Visual / structural target (must follow)

- **Document, not deck:** Outer area is a muted page background (e.g. slate-100); inner content is a **white "paper" column** centered in the canvas with modest padding, subtle border or ring, optional light shadow — similar in spirit to a printed résumé.
- **Typography:** Use \`font-sans\`, comfortable body text (\`text-sm\` / \`leading-relaxed\`), slate/neutral palette only. **No** gradients-as-backgrounds, **no** neon, **no** heavy glassmorphism, **no** playful illustrations, **no** oversized display type.
- **Sections:** Use clear section structure with **small uppercase section labels** (e.g. border-b on the label row) and body copy below — like "Summary" (1 short paragraph you infer from the skills, factual tone) and **"Areas of expertise"** or **"Technical skills"** where the listed skills appear as **readable prose**: either a single wrapped line with middots (·) between items, or a **tight bullet list** — **not** a wall of pill badges, chips, or icon grids.
- **Density:** Fit the ${canvasWidthPx}×${canvasHeightPx}px viewport without horizontal scroll; prioritize legibility over decoration.
- **Restraint:** At most one subtle divider between sections. No animations. No charts. No fake logos.

## Requirements

- The component MUST start with \`"use client";\`
- The component MUST \`export default\` a function named \`GeneratedSkillsPreview\`
- Use only \`react\` imports — do NOT import external packages (no lucide-react, no framer-motion)
- Use Tailwind CSS utility classes for ALL styling — no inline style objects except for truly dynamic values
- The component must NOT import anything from Next.js (no next/image, no next/link, no next/navigation)

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
