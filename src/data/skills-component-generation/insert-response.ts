import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

export type InsertSkillsComponentResponseInput = {
  id: string;
  tsxCode: string;
  agentSummary: string | null;
};

/**
 * Insert a skills component generation response record containing extracted TSX.
 *
 * @param pool - Supabase service-role client
 * @param input - Response fields
 */
export const insertSkillsComponentResponse = async (
  pool: Pool,
  input: InsertSkillsComponentResponseInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'skills_component_generation_responses', {
      id: input.id,
      tsx_code: input.tsxCode,
      agent_summary: input.agentSummary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ insertSkillsComponentResponse:', message);
    throw new Error(`Failed to insert skills component response record: ${message}`);
  }
};
