import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Refresh version labels after bumping current (e.g. v2 (current) on latest, plain v1 on older).
 */
export const relabelUserBackgroundVersionsForCurrent = async (
  supabase: SupabaseClient,
  profileId: string,
  currentVersion: number,
): Promise<void> => {
  const { data: rows, error: fetchError } = await supabase
    .from('user_background_versions')
    .select('id, version')
    .eq('profile_id', profileId);

  if (fetchError) {
    console.error('❌ relabelIcpVersions fetch:', fetchError);
    throw new Error(fetchError.message);
  }

  for (const row of rows ?? []) {
    const v = row.version as number;
    const label = v === currentVersion ? `v${v} (current)` : `v${v}`;
    const { error } = await supabase.from('user_background_versions').update({ label }).eq('id', row.id);
    if (error) {
      console.error('❌ relabelIcpVersions update:', error);
      throw new Error(error.message);
    }
  }
};
