import type { Pool } from 'pg';
import { selectRowsFrom, updateRows } from '../../utils/postgres';

/**
 * Refresh version labels after bumping current (e.g. v2 (current) on latest, plain v1 on older).
 */
export const relabelUserBackgroundVersionsForCurrent = async (
  pool: Pool,
  profileId: string,
  currentVersion: number,
): Promise<void> => {
  let rows: { id: string; version: number }[];
  try {
    rows = await selectRowsFrom<{ id: string; version: number }>(pool, 'user_background_versions', {
      columns: 'id, version',
      eq: { profile_id: profileId },
    });
  } catch (error) {
    console.error('❌ relabelIcpVersions fetch:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  for (const row of rows) {
    const label = row.version === currentVersion ? `v${row.version} (current)` : `v${row.version}`;
    try {
      await updateRows(pool, 'user_background_versions', { label }, { id: row.id });
    } catch (error) {
      console.error('❌ relabelIcpVersions update:', error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
};
