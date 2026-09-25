import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

/**
 * Create exchange row linking request + response + token usage.
 */
export const insertUserBackgroundStudioExchange = async (
  pool: Pool,
  params: {
    id: string;
    userId: string;
    profileId: string;
    requestId: string;
    responseId: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    creditsUsed: number;
    modelUsed: string;
    status: 'completed' | 'failed';
  },
): Promise<void> => {
  const now = new Date().toISOString();
  try {
    await insertRow(pool, 'user_background_studio_exchanges', {
      id: params.id,
      user_id: params.userId,
      profile_id: params.profileId,
      request_id: params.requestId,
      response_id: params.responseId,
      input_tokens: params.inputTokens,
      output_tokens: params.outputTokens,
      total_tokens: params.totalTokens,
      credits_used: params.creditsUsed,
      model_used: params.modelUsed,
      status: params.status,
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    console.error('❌ insertUserBackgroundStudioExchange:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
