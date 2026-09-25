import type { Pool } from 'pg';
import { completeCursorGenerationExchange } from '../../utils/cursor-generation';
import { updateRows } from '../../utils/postgres';

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
 * @param pool - Supabase service-role client
 * @param input - Completion data
 */
export const updateCompanyInterestExchangeCompleted = async (
  pool: Pool,
  input: UpdateCompanyInterestExchangeCompletedInput,
): Promise<void> => {
  await completeCursorGenerationExchange(pool, {
    tableName: 'company_interest_generation_exchanges',
    id: input.id,
    responseId: input.responseId,
    inputTokens: input.inputTokens,
    outputTokens: input.outputTokens,
    modelUsed: input.modelUsed,
    logLabel: 'updateCompanyInterestExchangeCompleted',
  });
};

/**
 * Mark a company interest exchange as failed with an error message.
 *
 * @param pool - Supabase service-role client
 * @param id - Exchange ID
 * @param errorMessage - Failure reason
 */
export const updateCompanyInterestExchangeFailed = async (
  pool: Pool,
  id: string,
  errorMessage: string,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'company_interest_generation_exchanges',
      {
        status: 'failed',
        error_message: errorMessage,
        updated_at: new Date().toISOString(),
      },
      { id },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ updateCompanyInterestExchangeFailed:', message);
  }
};
