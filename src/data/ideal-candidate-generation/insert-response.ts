import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

export type InsertIdealCandidateResponseInput = {
  id: string;
  tsxCode: string;
  agentSummary: string | null;
};

/**
 * Insert an ideal candidate generation response record containing extracted TSX.
 *
 * @param pool - Supabase service-role client
 * @param input - Response fields
 */
export const insertIdealCandidateResponse = async (
  pool: Pool,
  input: InsertIdealCandidateResponseInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'ideal_candidate_generation_responses', {
      id: input.id,
      tsx_code: input.tsxCode,
      agent_summary: input.agentSummary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ insertIdealCandidateResponse:', message);
    throw new Error(`Failed to insert ideal candidate response record: ${message}`);
  }
};
