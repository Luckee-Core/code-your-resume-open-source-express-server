import { SupabaseClient } from '@supabase/supabase-js';

export type UserBackgroundStudioResponseRow = {
  id: string;
  structured: unknown;
  created_at: string;
};

export const getUserBackgroundStudioResponseById = async (
  supabase: SupabaseClient,
  responseId: string,
): Promise<UserBackgroundStudioResponseRow | null> => {
  const { data, error } = await supabase
    .from('user_background_studio_responses')
    .select('id, structured, created_at')
    .eq('id', responseId)
    .maybeSingle();

  if (error) {
    console.error('❌ getUserBackgroundStudioResponseById:', error);
    throw new Error(error.message);
  }

  return data as UserBackgroundStudioResponseRow | null;
};
