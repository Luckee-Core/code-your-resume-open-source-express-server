import { SupabaseClient } from '@supabase/supabase-js';
import { getUserBackgroundProfileForUser } from './get-icp-for-user';
import { getUserBackgroundVersionIdForProfileVersion } from './get-user-background-version-id-for-profile-version';
import { listUserBackgroundVersions } from './list-icp-versions';
import { listUserBackgroundVersionSections } from './list-icp-version-sections';
import { insertUserBackgroundVersionWithSections } from './insert-icp-version';
import { setUserBackgroundProfileCurrentVersion } from './set-icp-current-version';
import { relabelUserBackgroundVersionsForCurrent } from './relabel-icp-versions-for-current';
import type { SectionInput } from './insert-icp-version-sections-bulk';

/**
 * Creates a new highest-numbered snapshot by copying section rows from `fromVersionNumber`, then sets it as current.
 */
export const duplicateUserBackgroundVersionFrom = async (
  supabase: SupabaseClient,
  profileId: string,
  userId: string,
  fromVersionNumber: number,
): Promise<void> => {
  const icp = await getUserBackgroundProfileForUser(supabase, profileId, userId);
  if (!icp) {
    throw new Error('Profile not found');
  }

  const versions = await listUserBackgroundVersions(supabase, profileId);
  const maxV = Math.max(0, ...versions.map((v) => v.version));
  const nextVersion = maxV + 1;

  const fromId = await getUserBackgroundVersionIdForProfileVersion(supabase, profileId, fromVersionNumber);
  if (!fromId) {
    throw new Error('Source version not found');
  }

  const rows = await listUserBackgroundVersionSections(supabase, fromId);
  const sections: SectionInput[] = rows.map((r) => ({
    key: r.section_key,
    title: r.title,
    body: r.body,
    ...(r.last_version && String(r.last_version).trim() ? { lastVersion: String(r.last_version).trim() } : {}),
    sortOrder: r.sort_order,
  }));

  const label = `v${nextVersion} (current)`;
  await insertUserBackgroundVersionWithSections(supabase, profileId, nextVersion, label, sections);
  await setUserBackgroundProfileCurrentVersion(supabase, profileId, userId, nextVersion);
  await relabelUserBackgroundVersionsForCurrent(supabase, profileId, nextVersion);
};
