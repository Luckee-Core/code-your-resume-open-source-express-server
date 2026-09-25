import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

export type InsertSkillsComponentExchangeInput = {
  id: string;
  jobId: string;
  requestId: string;
  agentId: string;
};

/**
 * Insert a new skills component generation exchange record (status: running).
 *
 * @param pool - Supabase service-role client
 * @param input - Exchange fields
 */
export const insertSkillsComponentExchange = async (
  pool: Pool,
  input: InsertSkillsComponentExchangeInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'skills_component_generation_exchanges', {
      id: input.id,
      job_id: input.jobId,
      request_id: input.requestId,
      agent_id: input.agentId,
      status: 'running',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ insertSkillsComponentExchange:', message);
    throw new Error(`Failed to insert skills component exchange record: ${message}`);
  }
};
