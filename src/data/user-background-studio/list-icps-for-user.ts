import { SupabaseClient } from '@supabase/supabase-js';

export type UserBackgroundProfileRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  current_version: number;
  created_at: string;
  updated_at: string;
};

const isMissingDescriptionColumnError = (error: {
  code?: string;
  message?: string;
}): boolean => {
  const msg = error.message ?? '';
  return msg.includes('column user_background_profiles.description does not exist');
};

/**
 * List ICP profile rows for a user, newest first.
 */
export const listUserBackgroundProfilesForUser = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<UserBackgroundProfileRow[]> => {
  const baseSelect = 'id, user_id, name, current_version, created_at, updated_at';
  console.log('[icp-studio:data] listUserBackgroundProfilesForUser query start (tenant-wide)', { userId });

  const { data, error } = await supabase
    .from('user_background_profiles')
    .select(`${baseSelect}, description`)
    .order('updated_at', { ascending: false });

  if (error) {
    if (isMissingDescriptionColumnError(error)) {
      console.warn('[icp-studio:data] description column missing, using fallback query', { userId });
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('user_background_profiles')
        .select(baseSelect)
        .order('updated_at', { ascending: false });

      if (fallbackError) {
        console.error('❌ listUserBackgroundProfilesForUser fallback:', fallbackError);
        throw new Error(fallbackError.message);
      }

      const rows = ((fallbackData ?? []) as Omit<UserBackgroundProfileRow, 'description'>[]).map((row) => ({
        ...row,
        description: null,
      }));
      console.log('[icp-studio:data] fallback query success', { userId, rowCount: rows.length });
      return rows;
    }
    console.error('❌ listUserBackgroundProfilesForUser:', error);
    throw new Error(error.message);
  }

  console.log('[icp-studio:data] listUserBackgroundProfilesForUser query success', {
    userId,
    rowCount: data?.length ?? 0,
  });
  return (data ?? []) as UserBackgroundProfileRow[];
};
