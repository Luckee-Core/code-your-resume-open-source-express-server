import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

export type InsertCoverLetterResponseInput = {
  id: string;
  tsxCode: string;
  agentSummary: string | null;
};

/**
 * Insert a cover letter generation response record containing extracted TSX.
 *
 * @param pool - Supabase service-role client
 * @param input - Response fields
 */
export const insertCoverLetterResponse = async (
  pool: Pool,
  input: InsertCoverLetterResponseInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'cover_letter_generation_responses', {
      id: input.id,
      tsx_code: input.tsxCode,
      agent_summary: input.agentSummary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ insertCoverLetterResponse:', message);
    throw new Error(`Failed to insert cover letter response record: ${message}`);
  }
};
