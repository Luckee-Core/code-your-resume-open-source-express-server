import type { SupabaseClient } from '@supabase/supabase-js';
import { completeCursorGenerationExchange } from '../../utils/cursor-generation';

export type UpdateIdealCandidateExchangeCompletedInput = {
  id: string;
  responseId: string;
  inputTokens: number;
  outputTokens: number;
  modelUsed: string;
};

/**
 * Mark an ideal candidate exchange as completed with token usage.
 *
 * @param supabase - Supabase service-role client
 * @param input - Completion data
 */
export const updateIdealCandidateExchangeCompleted = async (
  supabase: SupabaseClient,
  input: UpdateIdealCandidateExchangeCompletedInput,
): Promise<void> => {
  await completeCursorGenerationExchange(supabase, {
    tableName: 'ideal_candidate_generation_exchanges',
    id: input.id,
    responseId: input.responseId,
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
    modelUsed: input.modelUsed,
    logLabel: 'updateIdealCandidateExchangeCompleted',
  });
};

/**
 * Mark an ideal candidate exchange as failed with an error message.
 *
 * @param supabase - Supabase service-role client
 * @param id - Exchange ID
 * @param errorMessage - Failure reason
 */
export const updateIdealCandidateExchangeFailed = async (
  supabase: SupabaseClient,
  id: string,
  errorMessage: string,
): Promise<void> => {
  const { error } = await supabase
    .from('ideal_candidate_generation_exchanges')
    .update({
      status: 'failed',
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('❌ updateIdealCandidateExchangeFailed:', error.message);
  }
};
