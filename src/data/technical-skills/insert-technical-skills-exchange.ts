import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Create exchange row linking request + response + token usage.
 */
export const insertTechnicalSkillsExchange = async (
  supabase: SupabaseClient,
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
  const { error } = await supabase.from('technical_skills_exchanges').insert({
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

  if (error) {
    console.error('❌ insertTechnicalSkillsExchange:', error);
    throw new Error(error.message);
  }
};
