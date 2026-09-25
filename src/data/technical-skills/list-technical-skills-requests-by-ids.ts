import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type TechnicalSkillsRequestListRow = {
  id: string;
  content: string;
  created_at: string;
};

/**
 * Fetch technical skills request rows by ids.
 */
export const listTechnicalSkillsRequestsByIds = async (
  pool: Pool,
  ids: string[],
): Promise<TechnicalSkillsRequestListRow[]> => {
  if (ids.length === 0) return [];

  try {
    return await selectRowsFrom<TechnicalSkillsRequestListRow>(pool, 'technical_skills_requests', {
      columns: 'id, content, created_at',
      in: { id: ids },
    });
  } catch (error) {
    console.error('❌ listTechnicalSkillsRequestsByIds:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
