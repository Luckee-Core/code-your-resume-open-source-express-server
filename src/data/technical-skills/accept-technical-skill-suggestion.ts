import type { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { getMaxSortOrderForTechnicalSkills } from './max-sort-order';
import { insertTechnicalSkill } from './insert-technical-skill';
import { updateTechnicalSkill } from './update-technical-skill';
import { updateTechnicalSkillSuggestionStatus } from './update-technical-skill-suggestion-status';

/**
 * Apply a pending coach suggestion: mutate technical skill rows and mark suggestion accepted.
 */
export const acceptTechnicalSkillSuggestion = async (
  pool: Pool,
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
    const max = await getMaxSortOrderForTechnicalSkills(pool);
    await insertTechnicalSkill(pool, {
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
    await updateTechnicalSkill(pool, params.targetSkillId, {
      title: params.title.trim() || undefined,
      body: params.body,
      sourceExchangeId: params.exchangeId,
    });
  }

  await updateTechnicalSkillSuggestionStatus(pool, params.suggestionId, 'accepted');
};
