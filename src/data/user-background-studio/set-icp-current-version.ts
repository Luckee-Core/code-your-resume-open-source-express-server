import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';

/**
 * Set current_version on icps row (caller verifies ownership).
 */
export const setUserBackgroundProfileCurrentVersion = async (
  pool: Pool,
  profileId: string,
  userId: string,
  currentVersion: number,
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'user_background_profiles',
      { current_version: currentVersion, updated_at: new Date().toISOString() },
      { id: profileId, user_id: userId },
    );
  } catch (error) {
    console.error('❌ setUserBackgroundProfileCurrentVersion:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
