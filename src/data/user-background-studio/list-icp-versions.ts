import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type UserBackgroundVersionRow = {
  id: string;
  profile_id: string;
  version: number;
  label: string | null;
  snapshot_at: string;
  created_at: string;
};

/**
 * All version snapshots for an ICP, highest version first.
 */
export const listUserBackgroundVersions = async (
  pool: Pool,
  profileId: string,
): Promise<UserBackgroundVersionRow[]> => {
  try {
    return await selectRowsFrom<UserBackgroundVersionRow>(pool, 'user_background_versions', {
      columns: 'id, profile_id, version, label, snapshot_at, created_at',
      eq: { profile_id: profileId },
      order: [{ column: 'version', ascending: false }],
    });
  } catch (error) {
    console.error('❌ listUserBackgroundVersions:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
