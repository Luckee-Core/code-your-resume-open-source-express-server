import type { Pool } from 'pg';
import { completeCursorGenerationExchange } from '../../utils/cursor-generation';
import { updateRows } from '../../utils/postgres';

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
 * @param pool - Supabase service-role client
 * @param input - Completion data
 */
export const updateSkillsComponentExchangeCompleted = async (
  pool: Pool,
  input: UpdateSkillsComponentExchangeCompletedInput,
): Promise<void> => {
  await completeCursorGenerationExchange(pool, {
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
 * @param pool - Supabase service-role client
 * @param id - Exchange ID
 * @param errorMessage - Failure reason
 */
export const updateSkillsComponentExchangeFailed = async (
  pool: Pool,
  id: string,
  errorMessage: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'skills_component_generation_exchanges',
      {
        status: 'failed',
        error_message: errorMessage,
        updated_at: new Date().toISOString(),
      },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateSkillsComponentExchangeFailed:', message);
  }
};
