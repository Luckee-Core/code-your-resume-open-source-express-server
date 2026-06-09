import { SupabaseClient } from '@supabase/supabase-js';
import { AI_PROMPT_TYPES } from '../../constants/ai-prompt-types';
import { CRM_AI_FLOW_PROMPT_FLOWS } from '../../constants/crm-ai-flow-prompt-flows';
import { getActiveAiPromptByUserAndType } from '../../data/ai-prompts/get-active-ai-prompt-by-user-and-type';
import type { AiPromptRow } from '../../data/ai-prompts/types';
import { loadCrmCoachSystemPrompt } from '../../utils/ai/load-crm-coach-system-prompt';

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
 * Uses per-user `ai_prompts` when present; otherwise the global `crm_ai_flow_prompt` row.
 */
export const resolveUserBackgroundStudioSystemPrompt = async (
  supabase: SupabaseClient,
  userId: string,
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
    // ai_prompts table may not exist in this deployment
  }

  return loadCrmCoachSystemPrompt(supabase, CRM_AI_FLOW_PROMPT_FLOWS.USER_BACKGROUND_STUDIO);
};
