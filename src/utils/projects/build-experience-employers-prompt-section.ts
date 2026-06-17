import type { Project } from "../../data/projects/types";

/**
 * Build a mandatory Experience employer section from project business names.
 * Appended to resume prompts so the agent never substitutes placeholder names (e.g. Acme Labs).
 */
export const buildExperienceEmployersPromptSection = (projects: Project[]): string => {
  const names = [
    ...new Set(
      projects
        .map((p) => p.businessName.trim())
        .filter(Boolean),
    ),
  ];

  if (names.length === 0) {
    return `## Experience employer names (mandatory)

No project business names were recorded. Do **not** invent a placeholder employer (no "Acme Labs", "Client Co.", etc.). Use only employers clearly supported by project notes and skills. If work history is sparse, use fewer Experience rows rather than fabricating an organization.`;
  }

  const nameList = names.map((n) => `- **${n}**`).join("\n");

  return `## Experience employer names (mandatory — overrides any conflicting instruction)

Use **only** these organization names from the candidate's Projects data — **never** "Acme Labs", "THT", "Client Product Work", "Independent product work", or other placeholder labels:

${nameList}

**Grouping:** One Experience row per distinct name above. Projects sharing the same business name merge into **one** row with **2–4 bullets** ordered by posting relevance. Different names = separate Experience rows.

**Forbidden:** Renaming organizations, merging distinct employers into a single made-up label, or adding employers not listed above unless clearly separate (e.g. Revature from notes).`;
};
