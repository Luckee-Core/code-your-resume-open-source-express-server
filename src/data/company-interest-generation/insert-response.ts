import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

export type InsertCompanyInterestResponseInput = {
  id: string;
  tsxCode: string;
  agentSummary: string | null;
};

/**
 * Insert a company interest generation response record containing extracted TSX.
 *
 * @param pool - Supabase service-role client
 * @param input - Response fields
 */
export const insertCompanyInterestResponse = async (
  pool: Pool,
  input: InsertCompanyInterestResponseInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'company_interest_generation_responses', {
      id: input.id,
      tsx_code: input.tsxCode,
      agent_summary: input.agentSummary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ insertCompanyInterestResponse:', message);
    throw new Error(`Failed to insert company interest response record: ${message}`);
  }
};
