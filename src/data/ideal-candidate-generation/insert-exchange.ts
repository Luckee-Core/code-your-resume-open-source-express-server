import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

export type InsertIdealCandidateExchangeInput = {
  id: string;
  jobId: string;
  requestId: string;
  agentId: string;
};

/**
 * Insert a new ideal candidate generation exchange record (status: running).
 *
 * @param pool - Supabase service-role client
 * @param input - Exchange fields
 */
export const insertIdealCandidateExchange = async (
  pool: Pool,
  input: InsertIdealCandidateExchangeInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'ideal_candidate_generation_exchanges', {
      id: input.id,
      job_id: input.jobId,
      request_id: input.requestId,
      agent_id: input.agentId,
      status: 'running',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ insertIdealCandidateExchange:', message);
    throw new Error(`Failed to insert ideal candidate exchange record: ${message}`);
  }
};
