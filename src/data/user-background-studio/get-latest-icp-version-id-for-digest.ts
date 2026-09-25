import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';

/**
 * Picks the most recently updated user background profile and returns its current version row id.
 */
export const getLatestUserBackgroundVersionIdForDigest = async (
  pool: Pool,
): Promise<string | null> => {
  let profile: { id: string; current_version: number } | null;
  try {
    profile = await selectOneFrom<{ id: string; current_version: number }>(pool, 'user_background_profiles', {
      columns: 'id, current_version',
      order: [{ column: 'updated_at', ascending: false }],
    });
  } catch (error) {
    console.error('❌ getLatestUserBackgroundVersionIdForDigest profiles:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  if (!profile) {
    return null;
  }

  try {
    const ver = await selectOneFrom<{ id: string }>(pool, 'user_background_versions', {
      columns: 'id',
      eq: { profile_id: profile.id, version: profile.current_version },
    });
    return ver?.id ?? null;
  } catch (error) {
    console.error('❌ getLatestUserBackgroundVersionIdForDigest versions:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
