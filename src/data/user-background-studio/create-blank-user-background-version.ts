import { SupabaseClient } from '@supabase/supabase-js';
import { getUserBackgroundProfileForUser } from './get-icp-for-user';
import { listUserBackgroundVersions } from './list-icp-versions';
import { insertUserBackgroundVersionWithSections } from './insert-icp-version';
import { setUserBackgroundProfileCurrentVersion } from './set-icp-current-version';
import { relabelUserBackgroundVersionsForCurrent } from './relabel-icp-versions-for-current';
import { initialUserBackgroundSectionsAsInputs } from './initial-sections';

/**
 * Appends a new highest-numbered snapshot with empty canonical sections and sets it as current.
 */
export const createBlankUserBackgroundVersion = async (
  supabase: SupabaseClient,
  profileId: string,
  userId: string,
): Promise<void> => {
  const icp = await getUserBackgroundProfileForUser(supabase, profileId, userId);
  if (!icp) {
    throw new Error('Profile not found');
  }

  const versions = await listUserBackgroundVersions(supabase, profileId);
  const maxV = Math.max(0, ...versions.map((v) => v.version));
  const nextVersion = maxV + 1;

  const sections = initialUserBackgroundSectionsAsInputs();
  const label = `v${nextVersion} (current)`;
  await insertUserBackgroundVersionWithSections(supabase, profileId, nextVersion, label, sections);
  await setUserBackgroundProfileCurrentVersion(supabase, profileId, userId, nextVersion);
  await relabelUserBackgroundVersionsForCurrent(supabase, profileId, nextVersion);
};
