/**
 * Discriminator for `ai_prompts.type` — values that match the mentorai-server Supabase table.
 */
export const AI_PROMPT_TYPES = {
  USER_BACKGROUND_STUDIO: 'user_background_studio',
} as const;

export type AiPromptType = (typeof AI_PROMPT_TYPES)[keyof typeof AI_PROMPT_TYPES];
