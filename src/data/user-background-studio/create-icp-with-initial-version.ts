import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';
import { initialUserBackgroundSectionsAsInputs } from './initial-sections';
import { insertUserBackgroundVersionSectionsBulk } from './insert-icp-version-sections-bulk';
import type { UserBackgroundProfileRow } from './list-icps-for-user';

/**
 * Create an ICP and version 1 with empty section scaffolding (normalized rows).
 */
export const createUserBackgroundProfileWithInitialVersion = async (
  pool: Pool,
  userId: string,
  name: string,
): Promise<UserBackgroundProfileRow> => {
  let icp: UserBackgroundProfileRow;
  try {
    icp = await insertRow<UserBackgroundProfileRow>(pool, 'user_background_profiles', {
      user_id: userId,
      name: name.trim(),
      current_version: 1,
    });
  } catch (error) {
    console.error('❌ createIcp insert:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  let versionId: string;
  try {
    const ver = await insertRow<{ id: string }>(pool, 'user_background_versions', {
      profile_id: icp.id,
      version: 1,
      label: 'v1 (current)',
      snapshot_at: new Date().toISOString(),
    });
    versionId = ver.id;
  } catch (error) {
    console.error('❌ createIcp version:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  await insertUserBackgroundVersionSectionsBulk(pool, versionId, initialUserBackgroundSectionsAsInputs());

  return icp;
};
