import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Link request to exchange/response after AI completes.
 */
export const updateTechnicalSkillsRequestCompletion = async (
  supabase: SupabaseClient,
  requestId: string,
  params: {
    exchangeId: string;
    responseId: string;
    status: 'completed' | 'failed';
  },
): Promise<void> => {
  const { error } = await supabase
    .from('technical_skills_requests')
    .update({
      exchange_id: params.exchangeId,
      response_id: params.responseId,
      status: params.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  if (error) {
    console.error('❌ updateTechnicalSkillsRequestCompletion:', error);
    throw new Error(error.message);
  }
};
