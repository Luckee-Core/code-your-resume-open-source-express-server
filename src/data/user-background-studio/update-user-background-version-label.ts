import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';
import { getUserBackgroundProfileForUser } from './get-icp-for-user';
import { getUserBackgroundVersionIdForProfileVersion } from './get-user-background-version-id-for-profile-version';

/**
 * Updates the display label for one numbered snapshot (`user_background_versions.label`).
 */
export const updateUserBackgroundVersionLabel = async (
  pool: Pool,
  profileId: string,
  userId: string,
  versionNumber: number,
  label: string,
): Promise<void> => {
  const icp = await getUserBackgroundProfileForUser(pool, profileId, userId);
  if (!icp) {
    throw new Error('Profile not found');
  }

  const trimmed = label.trim();
  if (!trimmed) {
    throw new Error('Label is required');
  }

  const versionId = await getUserBackgroundVersionIdForProfileVersion(pool, profileId, versionNumber);
  if (!versionId) {
    throw new Error('Version not found');
  }

  try {
    await updateRows(pool, 'user_background_versions', { label: trimmed }, { id: versionId });
  } catch (error) {
    console.error('❌ updateUserBackgroundVersionLabel:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
