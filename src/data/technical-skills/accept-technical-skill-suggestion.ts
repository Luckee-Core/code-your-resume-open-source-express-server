import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { getMaxSortOrderForTechnicalSkills } from './max-sort-order';
import { insertTechnicalSkill } from './insert-technical-skill';
import { updateTechnicalSkill } from './update-technical-skill';
import { updateTechnicalSkillSuggestionStatus } from './update-technical-skill-suggestion-status';

/**
 * Apply a pending coach suggestion: mutate technical skill rows and mark suggestion accepted.
 */
export const acceptTechnicalSkillSuggestion = async (
  supabase: SupabaseClient,
  params: {
    suggestionId: string;
    title: string;
    body: string | null;
    op: 'add' | 'update';
    targetSkillId: string | null;
    exchangeId: string;
  },
): Promise<void> => {
  if (params.op === 'add') {
    const max = await getMaxSortOrderForTechnicalSkills(supabase);
    await insertTechnicalSkill(supabase, {
      id: uuidv4(),
      sortOrder: max + 1,
      title: params.title.trim() || 'Skill',
      body: params.body,
      status: 'active',
      sourceExchangeId: params.exchangeId,
    });
  } else if (params.op === 'update') {
    if (!params.targetSkillId) {
      throw new Error('targetSkillId required for update');
    }
    await updateTechnicalSkill(supabase, params.targetSkillId, {
      title: params.title.trim() || undefined,
      body: params.body,
      sourceExchangeId: params.exchangeId,
    });
  }

  await updateTechnicalSkillSuggestionStatus(supabase, params.suggestionId, 'accepted');
};
