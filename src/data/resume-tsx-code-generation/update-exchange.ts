import type { SupabaseClient } from '@supabase/supabase-js';

export type UpdateResumeTsxExchangeCompletedInput = {
  id: string;
  responseId: string;
  durationSeconds: number;
  apiCallsCount: number;
  costEstimate: number;
};

/**
 * Mark a resume TSX exchange as completed, linking the response and recording runtime metrics.
 *
 * @param supabase - Supabase service-role client
 * @param input - Completion data
 */
export const updateResumeTsxExchangeCompleted = async (
  supabase: SupabaseClient,
  input: UpdateResumeTsxExchangeCompletedInput,
): Promise<void> => {
  const { error } = await supabase
    .from('resume_tsx_code_generation_exchanges')
    .update({
      response_id: input.responseId,
      duration_seconds: input.durationSeconds,
      api_calls_count: input.apiCallsCount,
      cost_estimate: input.costEstimate,
      status: 'completed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.id);

  if (error) {
    console.error('❌ updateResumeTsxExchangeCompleted:', error.message);
    throw new Error(`Failed to update exchange record: ${error.message}`);
  }
};

/**
 * Mark a resume TSX exchange as failed with an error message.
 *
 * @param supabase - Supabase service-role client
 * @param id - Exchange ID
 * @param errorMessage - Failure reason
 */
export const updateResumeTsxExchangeFailed = async (
  supabase: SupabaseClient,
  id: string,
  errorMessage: string,
): Promise<void> => {
  const { error } = await supabase
    .from('resume_tsx_code_generation_exchanges')
    .update({
      status: 'failed',
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('❌ updateResumeTsxExchangeFailed:', error.message);
  }
};
