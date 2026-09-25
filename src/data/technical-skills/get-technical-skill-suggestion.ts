import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';
import type { TechnicalSkillSuggestionRow } from './list-technical-skills-suggestions-by-response-ids';

/**
 * Load a single technical skill suggestion row by id.
 */
export const getTechnicalSkillSuggestion = async (
  pool: Pool,
  suggestionId: string,
): Promise<TechnicalSkillSuggestionRow | null> => {
  try {
    return await selectOneFrom<TechnicalSkillSuggestionRow>(pool, 'technical_skills_suggestions', {
      columns: 'id, exchange_id, response_id, title, body, op, target_skill_id, status, created_at',
      eq: { id: suggestionId },
    });
  } catch (error) {
    console.error('❌ getTechnicalSkillSuggestion:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
