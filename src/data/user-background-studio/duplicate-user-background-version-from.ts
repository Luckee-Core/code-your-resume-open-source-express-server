import type { Pool } from 'pg';
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
  pool: Pool,
  profileId: string,
  userId: string,
  fromVersionNumber: number,
): Promise<void> => {
  const icp = await getUserBackgroundProfileForUser(pool, profileId, userId);
  if (!icp) {
    throw new Error('Profile not found');
  }

  const versions = await listUserBackgroundVersions(pool, profileId);
  const maxV = Math.max(0, ...versions.map((v) => v.version));
  const nextVersion = maxV + 1;

  const fromId = await getUserBackgroundVersionIdForProfileVersion(pool, profileId, fromVersionNumber);
  if (!fromId) {
    throw new Error('Source version not found');
  }

  const rows = await listUserBackgroundVersionSections(pool, fromId);
  const sections: SectionInput[] = rows.map((r) => ({
    key: r.section_key,
    title: r.title,
    body: r.body,
    ...(r.last_version && String(r.last_version).trim() ? { lastVersion: String(r.last_version).trim() } : {}),
    sortOrder: r.sort_order,
  }));

  const label = `v${nextVersion} (current)`;
  await insertUserBackgroundVersionWithSections(pool, profileId, nextVersion, label, sections);
  await setUserBackgroundProfileCurrentVersion(pool, profileId, userId, nextVersion);
  await relabelUserBackgroundVersionsForCurrent(pool, profileId, nextVersion);
};
