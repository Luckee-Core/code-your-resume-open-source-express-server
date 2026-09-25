import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type TechnicalSkillsExchangeRow = {
  id: string;
  request_id: string;
  response_id: string | null;
  created_at: string;
};

/**
 * List all technical skills chat exchanges, oldest first (chat order).
 */
export const listTechnicalSkillsExchanges = async (
  pool: Pool,
): Promise<TechnicalSkillsExchangeRow[]> => {
  try {
    return await selectRowsFrom<TechnicalSkillsExchangeRow>(pool, 'technical_skills_exchanges', {
      columns: 'id, request_id, response_id, created_at',
      order: [{ column: 'created_at', ascending: true }],
    });
  } catch (error) {
    console.error('❌ listTechnicalSkillsExchanges:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
