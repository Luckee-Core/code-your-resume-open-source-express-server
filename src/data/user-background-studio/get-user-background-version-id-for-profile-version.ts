import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';

/**
 * Resolves `user_background_versions.id` for a profile's numbered snapshot.
 */
export const getUserBackgroundVersionIdForProfileVersion = async (
  pool: Pool,
  profileId: string,
  version: number,
): Promise<string | null> => {
  try {
    const data = await selectOneFrom<{ id: string }>(pool, 'user_background_versions', {
      columns: 'id',
      eq: { profile_id: profileId, version },
    });
    return data?.id ?? null;
  } catch (error) {
    console.error('❌ getUserBackgroundVersionIdForProfileVersion:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
