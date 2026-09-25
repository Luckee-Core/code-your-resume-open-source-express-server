import type { Pool } from 'pg';
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
  pool: Pool,
  profileId: string,
  userId: string,
): Promise<void> => {
  const icp = await getUserBackgroundProfileForUser(pool, profileId, userId);
  if (!icp) {
    throw new Error('Profile not found');
  }

  const versions = await listUserBackgroundVersions(pool, profileId);
  const maxV = Math.max(0, ...versions.map((v) => v.version));
  const nextVersion = maxV + 1;

  const sections = initialUserBackgroundSectionsAsInputs();
  const label = `v${nextVersion} (current)`;
  await insertUserBackgroundVersionWithSections(pool, profileId, nextVersion, label, sections);
  await setUserBackgroundProfileCurrentVersion(pool, profileId, userId, nextVersion);
  await relabelUserBackgroundVersionsForCurrent(pool, profileId, nextVersion);
};
