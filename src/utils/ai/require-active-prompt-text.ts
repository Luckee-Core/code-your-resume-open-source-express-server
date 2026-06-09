/**
 * Returns trimmed prompt text or throws when no active prompt is configured.
 */
export const requireActivePromptText = (
  prompt: { system_prompt: string } | null,
  label: string,
): string => {
  const text = prompt?.system_prompt?.trim();
  if (!text) {
    throw new Error(
      `No active AI prompt configured for ${label}. Run docs/supabase-crm-ai-prompts-migration.sql in Supabase.`,
    );
  }
  return text;
};
