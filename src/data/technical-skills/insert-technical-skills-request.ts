import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

/**
 * Create a pending technical skills chat request (user message).
 */
export const insertTechnicalSkillsRequest = async (
  pool: Pool,
  params: {
    id: string;
    content: string;
  },
): Promise<void> => {
  const now = new Date().toISOString();
  try {
    await insertRow(pool, 'technical_skills_requests', {
      id: params.id,
      content: params.content,
      status: 'pending',
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    console.error('❌ insertTechnicalSkillsRequest:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
