import type { SupabaseClient } from '@supabase/supabase-js';
import { completeCursorGenerationExchange } from '../../utils/cursor-generation';

export type UpdateTeamConversationExchangeCompletedInput = {
  id: string;
  responseId: string;
  inputTokens: number;
  outputTokens: number;
  modelUsed: string;
};

/**
 * Mark a team conversation exchange as completed with token usage.
 *
 * @param supabase - Supabase service-role client
 * @param input - Completion data
 */
export const updateTeamConversationExchangeCompleted = async (
  supabase: SupabaseClient,
  input: UpdateTeamConversationExchangeCompletedInput,
): Promise<void> => {
  await completeCursorGenerationExchange(supabase, {
    tableName: 'team_conversation_generation_exchanges',
    id: input.id,
    responseId: input.responseId,
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
    modelUsed: input.modelUsed,
    logLabel: 'updateTeamConversationExchangeCompleted',
  });
};

/**
 * Mark a team conversation exchange as failed with an error message.
 *
 * @param supabase - Supabase service-role client
 * @param id - Exchange ID
 * @param errorMessage - Failure reason
 */
export const updateTeamConversationExchangeFailed = async (
  supabase: SupabaseClient,
  id: string,
  errorMessage: string,
): Promise<void> => {
  const { error } = await supabase
    .from('team_conversation_generation_exchanges')
    .update({
      status: 'failed',
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('❌ updateTeamConversationExchangeFailed:', error.message);
  }
};
