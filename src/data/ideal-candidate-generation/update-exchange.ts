import type { Pool } from 'pg';
import { completeCursorGenerationExchange } from '../../utils/cursor-generation';
import { updateRows } from '../../utils/postgres';

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
 * @param pool - Supabase service-role client
 * @param input - Completion data
 */
export const updateIdealCandidateExchangeCompleted = async (
  pool: Pool,
  input: UpdateIdealCandidateExchangeCompletedInput,
): Promise<void> => {
  await completeCursorGenerationExchange(pool, {
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
 * @param pool - Supabase service-role client
 * @param id - Exchange ID
 * @param errorMessage - Failure reason
 */
export const updateIdealCandidateExchangeFailed = async (
  pool: Pool,
  id: string,
  errorMessage: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'ideal_candidate_generation_exchanges',
      {
        status: 'failed',
        error_message: errorMessage,
        updated_at: new Date().toISOString(),
      },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateIdealCandidateExchangeFailed:', message);
  }
};
