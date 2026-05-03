import { SupabaseClient } from '@supabase/supabase-js';
import type { AiPromptRow } from './types';

/**
 * Returns the active `ai_prompts` row for a given user + type, or null if not found.
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param type - Prompt type (see AI_PROMPT_TYPES constant)
 */
export const getActiveAiPromptByUserAndType = async (
  supabase: SupabaseClient,
  userId: string,
  type: string,
): Promise<AiPromptRow | null> => {
  const { data, error } = await supabase
    .from('ai_prompts')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch active AI prompt: ${error.message}`);
  }

  return data as AiPromptRow | null;
};
