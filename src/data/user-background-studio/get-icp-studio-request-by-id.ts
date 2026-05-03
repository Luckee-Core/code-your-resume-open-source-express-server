import { SupabaseClient } from '@supabase/supabase-js';

export type UserBackgroundStudioRequestRow = {
  id: string;
  user_id: string;
  profile_id: string;
  content: string;
  created_at: string;
};

export const getUserBackgroundStudioRequestById = async (
  supabase: SupabaseClient,
  requestId: string,
): Promise<UserBackgroundStudioRequestRow | null> => {
  const { data, error } = await supabase
    .from('user_background_studio_requests')
    .select('id, user_id, profile_id, content, created_at')
    .eq('id', requestId)
    .maybeSingle();

  if (error) {
    console.error('❌ getUserBackgroundStudioRequestById:', error);
    throw new Error(error.message);
  }

  return data as UserBackgroundStudioRequestRow | null;
};
