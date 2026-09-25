import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type TechnicalSkillSuggestionRow = {
  id: string;
  exchange_id: string;
  response_id: string;
  title: string;
  body: string | null;
  op: string;
  target_skill_id: string | null;
  status: string;
  created_at: string;
};

/**
 * List technical skill suggestions for the given coach response ids.
 */
export const listTechnicalSkillsSuggestionsByResponseIds = async (
  pool: Pool,
  responseIds: string[],
): Promise<TechnicalSkillSuggestionRow[]> => {
  if (responseIds.length === 0) return [];

  try {
    return await selectRowsFrom<TechnicalSkillSuggestionRow>(pool, 'technical_skills_suggestions', {
      columns: 'id, exchange_id, response_id, title, body, op, target_skill_id, status, created_at',
      in: { response_id: responseIds },
      order: [{ column: 'created_at', ascending: true }],
    });
  } catch (error) {
    console.error('❌ listTechnicalSkillsSuggestionsByResponseIds:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
