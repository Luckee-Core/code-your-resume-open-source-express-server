import { SupabaseClient } from '@supabase/supabase-js';
import { AI_PROMPT_TYPES } from '../../constants/ai-prompt-types';
import { getActiveAiPromptByUserAndType } from '../../data/ai-prompts/get-active-ai-prompt-by-user-and-type';
import type { AiPromptRow } from '../../data/ai-prompts/types';

const readSystemPromptFromRow = (row: AiPromptRow | null): string | null => {
  if (!row?.content || typeof row.content !== 'object' || Array.isArray(row.content)) {
    return null;
  }
  const raw = (row.content as Record<string, unknown>).systemPrompt;
  if (typeof raw !== 'string') {
    return null;
  }
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * Uses the active `ai_prompts` row for `user_background_studio` when present; otherwise falls back to `builtIn`.
 *
 * @param supabase - Supabase client
 * @param userId - User ID
 * @param builtIn - Function returning the built-in system prompt string
 */
export const resolveUserBackgroundStudioSystemPrompt = async (
  supabase: SupabaseClient,
  userId: string,
  builtIn: () => string,
): Promise<string> => {
  try {
    const row = await getActiveAiPromptByUserAndType(
      supabase,
      userId,
      AI_PROMPT_TYPES.USER_BACKGROUND_STUDIO,
    );
    const fromDb = readSystemPromptFromRow(row);
    if (fromDb) {
      return fromDb;
    }
  } catch {
    // ai_prompts table may not exist in this deployment; fall back to built-in
  }
  return builtIn();
};
