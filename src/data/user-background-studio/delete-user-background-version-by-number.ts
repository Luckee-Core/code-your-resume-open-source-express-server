import { SupabaseClient } from '@supabase/supabase-js';
import { getUserBackgroundProfileForUser } from './get-icp-for-user';
import { listUserBackgroundVersions } from './list-icp-versions';
import { relabelUserBackgroundVersionsForCurrent } from './relabel-icp-versions-for-current';
import { insertUserBackgroundVersionWithSections } from './insert-icp-version';
import { setUserBackgroundProfileCurrentVersion } from './set-icp-current-version';
import { initialUserBackgroundSectionsAsInputs } from './initial-sections';

/**
 * Deletes a numbered snapshot and its section rows. If the deleted row was current, promotes the
 * highest remaining version number to current. If it was the only snapshot, recreates a single blank v1.
 */
export const deleteUserBackgroundVersionByNumber = async (
  supabase: SupabaseClient,
  profileId: string,
  userId: string,
  versionNumber: number,
): Promise<void> => {
  const icp = await getUserBackgroundProfileForUser(supabase, profileId, userId);
  if (!icp) {
    throw new Error('Profile not found');
  }

  const versions = await listUserBackgroundVersions(supabase, profileId);
  const row = versions.find((v) => v.version === versionNumber);
  if (!row) {
    throw new Error('Version not found');
  }

  const onlyOne = versions.length === 1;
  const wasCurrent = versionNumber === icp.current_version;
  const remainingBefore = versions.filter((v) => v.version !== versionNumber);

  const { error: secErr } = await supabase
    .from('user_background_version_sections')
    .delete()
    .eq('profile_version_id', row.id);
  if (secErr) {
    console.error('❌ deleteUserBackgroundVersionByNumber sections:', secErr);
    throw new Error(secErr.message);
  }

  const { error: verErr } = await supabase.from('user_background_versions').delete().eq('id', row.id);
  if (verErr) {
    console.error('❌ deleteUserBackgroundVersionByNumber version:', verErr);
    throw new Error(verErr.message);
  }

  if (onlyOne) {
    const sections = initialUserBackgroundSectionsAsInputs();
    await insertUserBackgroundVersionWithSections(supabase, profileId, 1, 'v1 (current)', sections);
    await setUserBackgroundProfileCurrentVersion(supabase, profileId, userId, 1);
    await relabelUserBackgroundVersionsForCurrent(supabase, profileId, 1);

    const { error: segErr } = await supabase.from('user_background_segment_items').delete().eq('profile_id', profileId);
    if (segErr) {
      console.error('❌ deleteUserBackgroundVersionByNumber segment_items:', segErr);
      throw new Error(segErr.message);
    }
    const { error: sugErr } = await supabase.from('user_background_segment_suggestions').delete().eq('profile_id', profileId);
    if (sugErr) {
      console.error('❌ deleteUserBackgroundVersionByNumber suggestions:', sugErr);
      throw new Error(sugErr.message);
    }
    return;
  }

  const nextCurrent =
    wasCurrent && remainingBefore.length > 0 ? Math.max(...remainingBefore.map((v) => v.version)) : icp.current_version;

  if (wasCurrent) {
    await setUserBackgroundProfileCurrentVersion(supabase, profileId, userId, nextCurrent);
  }

  await relabelUserBackgroundVersionsForCurrent(supabase, profileId, nextCurrent);
};
