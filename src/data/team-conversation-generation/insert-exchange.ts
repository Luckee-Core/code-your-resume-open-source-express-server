import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertTeamConversationExchangeInput = {
  id: string;
  jobId: string;
  requestId: string;
  agentId: string;
};

/**
 * Insert a new team conversation generation exchange record (status: running).
 *
 * @param supabase - Supabase service-role client
 * @param input - Exchange fields
 */
export const insertTeamConversationExchange = async (
  supabase: SupabaseClient,
  input: InsertTeamConversationExchangeInput,
): Promise<void> => {
  const { error } = await supabase.from('team_conversation_generation_exchanges').insert({
    id: input.id,
    job_id: input.jobId,
    request_id: input.requestId,
    agent_id: input.agentId,
    status: 'running',
  });

  if (error) {
    console.error('❌ insertTeamConversationExchange:', error.message);
    throw new Error(`Failed to insert team conversation exchange record: ${error.message}`);
  }
};
