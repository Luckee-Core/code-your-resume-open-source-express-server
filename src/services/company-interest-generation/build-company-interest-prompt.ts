export type BuildCompanyInterestPromptInput = {
  jobId: string;
  jobTitle: string;
  companyName?: string;
  responsibilities: string[];
  requirements: string[];
  niceToHaves?: string[];
  canvasWidthPx: number;
  canvasHeightPx: number;
  professionalBackgroundSegments: {
    education: string;
    credibility_bio: string;
    voice_style: string;
    portfolio_github: string;
  };
  skills?: string[];
};

const COMPANY_INTEREST_QUESTION =
  'What interests you about working for this company?';

const formatBulletList = (items: string[], emptyLabel: string): string => {
  if (!items.length) {
    return emptyLabel;
  }
  return items.map((item) => `- ${item}`).join('\n');
};

/**
 * Build the Cursor agent prompt for a short, casual company-interest answer TSX component.
 *
 * @param input - Job context, professional background, and canvas dimensions
 * @returns Fully assembled prompt string to send to the Cursor agent
 */
export const buildCompanyInterestPrompt = (input: BuildCompanyInterestPromptInput): string => {
  const {
    jobId,
    jobTitle,
    companyName,
    responsibilities,
    requirements,
    niceToHaves = [],
    canvasWidthPx,
    canvasHeightPx,
    professionalBackgroundSegments,
    skills = [],
  } = input;

  const companyLine = companyName?.trim()
    ? `Company: ${companyName.trim()}`
    : 'Company: (not provided — write about the role and what you can infer from the posting)';

  const responsibilitiesBlock = formatBulletList(responsibilities, '(none provided)');
  const requirementsBlock = formatBulletList(requirements, '(none provided)');
  const niceToHavesBlock = formatBulletList(niceToHaves, '(none provided)');
  const skillsBlock =
    skills.length > 0
      ? skills.map((s) => `- ${s}`).join('\n')
      : '(none provided)';

  const {
    education,
    credibility_bio,
    voice_style,
    portfolio_github,
  } = professionalBackgroundSegments;

  return `You are working in the code-your-resume-open-source Next.js repository.

Read the architecture documentation in .cursor/architecture/ for component and Tailwind conventions before writing code.

## Task

Generate a single Next.js "use client" React component that answers **one application question** in a **short, direct, conversational** tone — like a strong written response on a job application form, **not** a formal cover letter.

**Question to answer (display this exact text in the UI):**
"${COMPANY_INTEREST_QUESTION}"

The answer must explain why the candidate wants to work **at this company** on the **${jobTitle.trim()}** role — specific to the posting, honest, and human.

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

### Technical skills context (weave in only when relevant)

${skillsBlock}

### Professional background (factual source — do not invent beyond this)

Education:
${education || '(empty)'}

Credibility bio:
${credibility_bio || '(empty)'}

Voice/style notes (match this tone):
${voice_style || '(empty)'}

Portfolio/GitHub narrative (same TroutHouseTech work as credibility_bio — mention at most once if relevant):
${portfolio_github || '(empty)'}

### Visual / structural target (must follow)

- **Short form, not a letter:** Outer muted page background; inner white "paper" column with modest padding. **No** "Dear …", **no** "Hola hola," opener, **no** formal sign-off block, **no** date line, **no** recipient block.
- **Layout:**
  1) **Question line** — show the exact question above in \`text-xs\` / muted slate, semibold or uppercase tracking optional
  2) **Answer** — **1 short paragraph** (3–5 sentences) OR **2 very short paragraphs** max. Target **80–140 words total**. Plain language; contractions OK.
- **Typography:** \`font-sans\`, \`text-sm\` / \`leading-relaxed\`, slate/neutral palette. No gradients, neon, illustrations, or badge clouds.
- **Density:** Fit ${canvasWidthPx}×${canvasHeightPx}px without scroll — this is intentionally **half-page or less**, not a full letter.

### Content rules

- **Answer the question:** Focus on **why this company and role** — product, mission, problems in the posting, team fit, or tech stack — not a recap of your entire career.
- **Be specific:** Reference **at least one** concrete detail from responsibilities or requirements when provided.
- **Job applicant, not vendor:** You want to **join** the team, not sell services. No consulting/agency framing.
- **No founder identity:** Do not lead with "founder" or TroutHouseTech as a pitch. Past building experience may appear in **one clause** if it supports why you'd fit this role.
- **No duplicate product lists:** Do not enumerate a separate product portfolio; keep the answer tight.
- **Truthfulness:** Do not invent facts unsupported by the background or posting.

## Requirements

- The component MUST start with \`"use client";\`
- The component MUST \`export default\` a function named \`GeneratedCompanyInterestPreview\`
- Use only \`react\` imports — do NOT import external packages
- Use Tailwind CSS utility classes for ALL styling — no inline style objects except truly dynamic values
- The component must NOT import anything from Next.js (no next/image, no next/link, no next/navigation)

## Output

Write the complete component file content. Include it verbatim in your final message inside a TypeScript code block:

\`\`\`tsx
"use client";

import React from "react";

export default function GeneratedCompanyInterestPreview() {
  // your implementation here
}
\`\`\`

Make sure the code block appears in your final message so it can be extracted programmatically.`;
};
