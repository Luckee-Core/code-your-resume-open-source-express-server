import type { SupabaseClient } from '@supabase/supabase-js';

export type UpdateCompanyInterestExchangeCompletedInput = {
  id: string;
  responseId: string;
  inputTokens: number;
  outputTokens: number;
  modelUsed: string;
};

/**
 * Mark a company interest exchange as completed with token usage.
 *
 * @param supabase - Supabase service-role client
 * @param input - Completion data
 */
export const updateCompanyInterestExchangeCompleted = async (
  supabase: SupabaseClient,
  input: UpdateCompanyInterestExchangeCompletedInput,
): Promise<void> => {
  const { error } = await supabase
    .from('company_interest_generation_exchanges')
    .update({
      response_id: input.responseId,
      input_tokens: input.inputTokens,
      output_tokens: input.outputTokens,
      model_used: input.modelUsed,
      status: 'completed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', input.id);

  if (error) {
    console.error('❌ updateCompanyInterestExchangeCompleted:', error.message);
    throw new Error(`Failed to update company interest exchange record: ${error.message}`);
  }
};

/**
 * Mark a company interest exchange as failed with an error message.
 *
 * @param supabase - Supabase service-role client
 * @param id - Exchange ID
 * @param errorMessage - Failure reason
 */
export const updateCompanyInterestExchangeFailed = async (
  supabase: SupabaseClient,
  id: string,
  errorMessage: string,
): Promise<void> => {
  const { error } = await supabase
    .from('company_interest_generation_exchanges')
    .update({
      status: 'failed',
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('❌ updateCompanyInterestExchangeFailed:', error.message);
  }
};
