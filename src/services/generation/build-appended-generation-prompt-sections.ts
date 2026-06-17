/**
 * Join mandatory override sections appended after the DB prompt template.
 */
export const buildAppendedGenerationPromptSections = (
  sections: Array<string | undefined>,
): string => sections.map((section) => section?.trim()).filter(Boolean).join('\n\n');
