import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

export type InsertTeamConversationExchangeInput = {
  id: string;
  jobId: string;
  requestId: string;
  agentId: string;
};

/**
 * Insert a new team conversation generation exchange record (status: running).
 *
 * @param pool - Supabase service-role client
 * @param input - Exchange fields
 */
export const insertTeamConversationExchange = async (
  pool: Pool,
  input: InsertTeamConversationExchangeInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'team_conversation_generation_exchanges', {
      id: input.id,
      job_id: input.jobId,
      request_id: input.requestId,
      agent_id: input.agentId,
      status: 'running',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ insertTeamConversationExchange:', message);
    throw new Error(`Failed to insert team conversation exchange record: ${message}`);
  }
};
