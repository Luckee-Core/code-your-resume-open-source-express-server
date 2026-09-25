import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

/**
 * Create exchange row linking request + response + token usage.
 */
export const insertTechnicalSkillsExchange = async (
  pool: Pool,
  params: {
    id: string;
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
    await insertRow(pool, 'technical_skills_exchanges', {
      id: params.id,
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
    console.error('❌ insertTechnicalSkillsExchange:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
