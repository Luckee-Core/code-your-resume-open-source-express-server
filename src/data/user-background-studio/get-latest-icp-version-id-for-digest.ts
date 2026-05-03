import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Picks the most recently updated user background profile and returns its current version row id.
 */
export const getLatestUserBackgroundVersionIdForDigest = async (
  supabase: SupabaseClient,
): Promise<string | null> => {
  const { data: profile, error: profileErr } = await supabase
    .from('user_background_profiles')
    .select('id, current_version')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (profileErr) {
    console.error('❌ getLatestUserBackgroundVersionIdForDigest profiles:', profileErr);
    throw new Error(profileErr.message);
  }

  if (!profile) {
    return null;
  }

  const { data: ver, error: verErr } = await supabase
    .from('user_background_versions')
    .select('id')
    .eq('profile_id', profile.id)
    .eq('version', profile.current_version)
    .maybeSingle();

  if (verErr) {
    console.error('❌ getLatestUserBackgroundVersionIdForDigest versions:', verErr);
    throw new Error(verErr.message);
  }

  return ver?.id ?? null;
};
