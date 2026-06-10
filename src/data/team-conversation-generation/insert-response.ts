import type { SupabaseClient } from '@supabase/supabase-js';

export type InsertTeamConversationResponseInput = {
  id: string;
  tsxCode: string;
  agentSummary: string | null;
};

/**
 * Insert a team conversation generation response record containing extracted TSX.
 *
 * @param supabase - Supabase service-role client
 * @param input - Response fields
 */
export const insertTeamConversationResponse = async (
  supabase: SupabaseClient,
  input: InsertTeamConversationResponseInput,
): Promise<void> => {
  const { error } = await supabase.from('team_conversation_generation_responses').insert({
    id: input.id,
    tsx_code: input.tsxCode,
    agent_summary: input.agentSummary,
  });

  if (error) {
    console.error('❌ insertTeamConversationResponse:', error.message);
    throw new Error(`Failed to insert team conversation response record: ${error.message}`);
  }
};
