import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

export type InsertTeamConversationResponseInput = {
  id: string;
  tsxCode: string;
  agentSummary: string | null;
};

/**
 * Insert a team conversation generation response record containing extracted TSX.
 *
 * @param pool - Supabase service-role client
 * @param input - Response fields
 */
export const insertTeamConversationResponse = async (
  pool: Pool,
  input: InsertTeamConversationResponseInput,
): Promise<void> => {
  try {
    await insertRow(pool, 'team_conversation_generation_responses', {
      id: input.id,
      tsx_code: input.tsxCode,
      agent_summary: input.agentSummary,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ insertTeamConversationResponse:', message);
    throw new Error(`Failed to insert team conversation response record: ${message}`);
  }
};
