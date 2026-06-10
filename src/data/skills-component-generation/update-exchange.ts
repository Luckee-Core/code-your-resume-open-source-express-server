import type { SupabaseClient } from '@supabase/supabase-js';
import { completeCursorGenerationExchange } from '../../utils/cursor-generation';

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
  await completeCursorGenerationExchange(supabase, {
    tableName: 'skills_component_generation_exchanges',
    id: input.id,
    responseId: input.responseId,
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
    modelUsed: input.modelUsed,
    logLabel: 'updateSkillsComponentExchangeCompleted',
  });
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
