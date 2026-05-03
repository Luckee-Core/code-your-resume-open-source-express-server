import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Resolves `user_background_versions.id` for a profile's numbered snapshot.
 */
export const getUserBackgroundVersionIdForProfileVersion = async (
  supabase: SupabaseClient,
  profileId: string,
  version: number,
): Promise<string | null> => {
  const { data, error } = await supabase
    .from('user_background_versions')
    .select('id')
    .eq('profile_id', profileId)
    .eq('version', version)
    .maybeSingle();

  if (error) {
    console.error('❌ getUserBackgroundVersionIdForProfileVersion:', error);
    throw new Error(error.message);
  }

  return data?.id ?? null;
};
