import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';
import type { AiPromptRow } from './types';

/**
 * Returns the active `ai_prompts` row for a given user + type, or null if not found.
 *
 * @param pool - Supabase client
 * @param userId - User ID
 * @param type - Prompt type (see AI_PROMPT_TYPES constant)
 */
export const getActiveAiPromptByUserAndType = async (
  pool: Pool,
  userId: string,
  type: string,
): Promise<AiPromptRow | null> => {
  try {
    return await selectOneFrom<AiPromptRow>(pool, 'ai_prompts', {
      eq: { user_id: userId, type, is_active: true },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch active AI prompt: ${message}`);
  }
};
