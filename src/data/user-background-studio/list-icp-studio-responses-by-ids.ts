import { SupabaseClient } from '@supabase/supabase-js';

export type UserBackgroundStudioResponseListRow = {
  id: string;
  structured: unknown;
  created_at: string;
};

export const listUserBackgroundStudioResponsesByIds = async (
  supabase: SupabaseClient,
  ids: string[],
): Promise<UserBackgroundStudioResponseListRow[]> => {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from('user_background_studio_responses')
    .select('id, structured, created_at')
    .in('id', ids);

  if (error) {
    console.error('❌ listUserBackgroundStudioResponsesByIds:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as UserBackgroundStudioResponseListRow[];
};
