import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type TechnicalSkillRow = {
  id: string;
  sort_order: number;
  title: string;
  body: string | null;
  status: string;
  source_exchange_id: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * List all technical skill rows ordered by sort_order ascending.
 */
export const listTechnicalSkills = async (
  pool: Pool,
): Promise<TechnicalSkillRow[]> => {
  try {
    return await selectRowsFrom<TechnicalSkillRow>(pool, 'technical_skills', {
      columns: 'id, sort_order, title, body, status, source_exchange_id, created_at, updated_at',
      order: [{ column: 'sort_order', ascending: true }],
    });
  } catch (error) {
    console.error('❌ listTechnicalSkills:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
