import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

export type InsertCoverLetterExchangeInput = {
  id: string;
  jobId: string;
  requestId: string;
  agentId: string;
};

/**
 * Insert a new cover letter generation exchange record (status: running).
 *
 * @param pool - Supabase service-role client
 * @param input - Exchange fields
 */
export const insertCoverLetterExchange = async (
  pool: Pool,
  input: InsertCoverLetterExchangeInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'cover_letter_generation_exchanges', {
      id: input.id,
      job_id: input.jobId,
      request_id: input.requestId,
      agent_id: input.agentId,
      status: 'running',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ insertCoverLetterExchange:', message);
    throw new Error(`Failed to insert cover letter exchange record: ${message}`);
  }
};
