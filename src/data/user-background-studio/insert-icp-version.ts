import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';
import { insertUserBackgroundVersionSectionsBulk, type SectionInput } from './insert-icp-version-sections-bulk';

/**
 * Append an immutable version snapshot (metadata row + normalized section rows).
 */
export const insertUserBackgroundVersionWithSections = async (
  pool: Pool,
  profileId: string,
  version: number,
  label: string,
  sections: SectionInput[],
): Promise<string> => {
  try {
    const inserted = await insertRow<{ id: string }>(pool, 'user_background_versions', {
      profile_id: profileId,
      version,
      label,
      snapshot_at: new Date().toISOString(),
    });
    await insertUserBackgroundVersionSectionsBulk(pool, inserted.id, sections);
    return inserted.id;
  } catch (error) {
    console.error('❌ insertUserBackgroundVersionWithSections:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
