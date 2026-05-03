import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Link request to exchange/response after AI completes.
 */
export const updateUserBackgroundStudioRequestCompletion = async (
  supabase: SupabaseClient,
  requestId: string,
  params: {
    exchangeId: string;
    responseId: string;
    status: 'completed' | 'failed';
  },
): Promise<void> => {
  const { error } = await supabase
    .from('user_background_studio_requests')
    .update({
      exchange_id: params.exchangeId,
      response_id: params.responseId,
      status: params.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId);

  if (error) {
    console.error('❌ updateUserBackgroundStudioRequestCompletion:', error);
    throw new Error(error.message);
  }
};
