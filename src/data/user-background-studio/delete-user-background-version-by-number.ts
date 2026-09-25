import type { Pool } from 'pg';
import { deleteRows } from '../../utils/postgres';
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
  pool: Pool,
  profileId: string,
  userId: string,
  versionNumber: number,
): Promise<void> => {
  const icp = await getUserBackgroundProfileForUser(pool, profileId, userId);
  if (!icp) {
    throw new Error('Profile not found');
  }

  const versions = await listUserBackgroundVersions(pool, profileId);
  const row = versions.find((v) => v.version === versionNumber);
  if (!row) {
    throw new Error('Version not found');
  }

  const onlyOne = versions.length === 1;
  const wasCurrent = versionNumber === icp.current_version;
  const remainingBefore = versions.filter((v) => v.version !== versionNumber);

  try {
    await deleteRows(pool, 'user_background_version_sections', { profile_version_id: row.id });
  } catch (error) {
    console.error('❌ deleteUserBackgroundVersionByNumber sections:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  try {
    await deleteRows(pool, 'user_background_versions', { id: row.id });
  } catch (error) {
    console.error('❌ deleteUserBackgroundVersionByNumber version:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  if (onlyOne) {
    const sections = initialUserBackgroundSectionsAsInputs();
    await insertUserBackgroundVersionWithSections(pool, profileId, 1, 'v1 (current)', sections);
    await setUserBackgroundProfileCurrentVersion(pool, profileId, userId, 1);
    await relabelUserBackgroundVersionsForCurrent(pool, profileId, 1);

    try {
      await deleteRows(pool, 'user_background_segment_items', { profile_id: profileId });
    } catch (error) {
      console.error('❌ deleteUserBackgroundVersionByNumber segment_items:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
    try {
      await deleteRows(pool, 'user_background_segment_suggestions', { profile_id: profileId });
    } catch (error) {
      console.error('❌ deleteUserBackgroundVersionByNumber suggestions:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
    return;
  }

  const nextCurrent =
    wasCurrent && remainingBefore.length > 0 ? Math.max(...remainingBefore.map((v) => v.version)) : icp.current_version;

  if (wasCurrent) {
    await setUserBackgroundProfileCurrentVersion(pool, profileId, userId, nextCurrent);
  }

  await relabelUserBackgroundVersionsForCurrent(pool, profileId, nextCurrent);
};
