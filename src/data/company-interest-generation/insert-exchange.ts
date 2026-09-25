import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

export type InsertCompanyInterestExchangeInput = {
  id: string;
  jobId: string;
  requestId: string;
  agentId: string;
};

/**
 * Insert a new company interest generation exchange record (status: running).
 *
 * @param pool - Supabase service-role client
 * @param input - Exchange fields
 */
export const insertCompanyInterestExchange = async (
  pool: Pool,
  input: InsertCompanyInterestExchangeInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'company_interest_generation_exchanges', {
      id: input.id,
      job_id: input.jobId,
      request_id: input.requestId,
      agent_id: input.agentId,
      status: 'running',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ insertCompanyInterestExchange:', message);
    throw new Error(`Failed to insert company interest exchange record: ${message}`);
  }
};
