import { SupabaseClient } from '@supabase/supabase-js';

export type UserBackgroundStudioExchangeRow = {
  id: string;
  user_id: string;
  profile_id: string;
  request_id: string;
  response_id: string | null;
  created_at: string;
};

/**
 * Exchanges for an ICP, oldest first (chat order).
 */
export const listUserBackgroundStudioExchangesForProfile = async (
  supabase: SupabaseClient,
  profileId: string,
): Promise<UserBackgroundStudioExchangeRow[]> => {
  const { data, error } = await supabase
    .from('user_background_studio_exchanges')
    .select('id, user_id, profile_id, request_id, response_id, created_at')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ listUserBackgroundStudioExchangesForProfile:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as UserBackgroundStudioExchangeRow[];
};
