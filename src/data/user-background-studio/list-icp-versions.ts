import { SupabaseClient } from '@supabase/supabase-js';

export type UserBackgroundVersionRow = {
  id: string;
  profile_id: string;
  version: number;
  label: string | null;
  snapshot_at: string;
  created_at: string;
};

/**
 * All version snapshots for an ICP, highest version first.
 */
export const listUserBackgroundVersions = async (
  supabase: SupabaseClient,
  profileId: string,
): Promise<UserBackgroundVersionRow[]> => {
  const { data, error } = await supabase
    .from('user_background_versions')
    .select('id, profile_id, version, label, snapshot_at, created_at')
    .eq('profile_id', profileId)
    .order('version', { ascending: false });

  if (error) {
    console.error('❌ listUserBackgroundVersions:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as UserBackgroundVersionRow[];
};
