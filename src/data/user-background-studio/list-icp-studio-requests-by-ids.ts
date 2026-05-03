import { SupabaseClient } from '@supabase/supabase-js';

export type UserBackgroundStudioRequestListRow = {
  id: string;
  content: string;
  created_at: string;
};

export const listUserBackgroundStudioRequestsByIds = async (
  supabase: SupabaseClient,
  ids: string[],
): Promise<UserBackgroundStudioRequestListRow[]> => {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from('user_background_studio_requests')
    .select('id, content, created_at')
    .in('id', ids);

  if (error) {
    console.error('❌ listUserBackgroundStudioRequestsByIds:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as UserBackgroundStudioRequestListRow[];
};
