import type { SupabaseClient } from '@supabase/supabase-js';

export type UpdateSkillsComponentExchangeCompletedInput = {
  id: string;
  responseId: string;
  inputTokens: number;
  outputTokens: number;
  modelUsed: string;
};

/**
 * Mark a skills component exchange as completed with token usage.
 *
 * @param supabase - Supabase service-role client
 * @param input - Completion data
 */
export const updateSkillsComponentExchangeCompleted = async (
  supabase: SupabaseClient,
  input: UpdateSkillsComponentExchangeCompletedInput,
): Promise<void> => {
  const { error } = await supabase
    .from('skills_component_generation_exchanges')
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
    console.error('❌ updateSkillsComponentExchangeCompleted:', error.message);
    throw new Error(`Failed to update skills component exchange record: ${error.message}`);
  }
};

/**
 * Mark a skills component exchange as failed with an error message.
 *
 * @param supabase - Supabase service-role client
 * @param id - Exchange ID
 * @param errorMessage - Failure reason
 */
export const updateSkillsComponentExchangeFailed = async (
  supabase: SupabaseClient,
  id: string,
  errorMessage: string,
): Promise<void> => {
  const { error } = await supabase
    .from('skills_component_generation_exchanges')
    .update({
      status: 'failed',
      error_message: errorMessage,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('❌ updateSkillsComponentExchangeFailed:', error.message);
  }
};
