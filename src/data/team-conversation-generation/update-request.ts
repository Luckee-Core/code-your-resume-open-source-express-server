import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Mark a team conversation generation request as completed.
 *
 * @param supabase - Supabase service-role client
 * @param id - Request ID
 */
export const updateTeamConversationRequestCompleted = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('team_conversation_generation_requests')
    .update({ status: 'completed', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('❌ updateTeamConversationRequestCompleted:', error.message);
    throw new Error(`Failed to update team conversation request record: ${error.message}`);
  }
};

/**
 * Mark a team conversation generation request as failed.
 *
 * @param supabase - Supabase service-role client
 * @param id - Request ID
 */
export const updateTeamConversationRequestFailed = async (
  supabase: SupabaseClient,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('team_conversation_generation_requests')
    .update({ status: 'failed', updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('❌ updateTeamConversationRequestFailed:', error.message);
  }
};
