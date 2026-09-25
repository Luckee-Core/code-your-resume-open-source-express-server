import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type UserBackgroundVersionSectionRow = {
  id: string;
  profile_version_id: string;
  section_key: string;
  title: string;
  body: string | null;
  last_version: string | null;
  sort_order: number;
};

/**
 * All section rows for one version snapshot, ordered for display.
 */
export const listUserBackgroundVersionSections = async (
  pool: Pool,
  icpVersionId: string,
): Promise<UserBackgroundVersionSectionRow[]> => {
  try {
    return await selectRowsFrom<UserBackgroundVersionSectionRow>(pool, 'user_background_version_sections', {
      columns: 'id, profile_version_id, section_key, title, body, last_version, sort_order',
      eq: { profile_version_id: icpVersionId },
      order: [{ column: 'sort_order', ascending: true }],
    });
  } catch (error) {
    console.error('❌ listUserBackgroundVersionSections:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Batch-load sections for many version ids (one query).
 */
export const listUserBackgroundVersionSectionsForVersionIds = async (
  pool: Pool,
  icpVersionIds: string[],
): Promise<UserBackgroundVersionSectionRow[]> => {
  if (icpVersionIds.length === 0) return [];

  try {
    return await selectRowsFrom<UserBackgroundVersionSectionRow>(pool, 'user_background_version_sections', {
      columns: 'id, profile_version_id, section_key, title, body, last_version, sort_order',
      in: { profile_version_id: icpVersionIds },
      order: [{ column: 'sort_order', ascending: true }],
    });
  } catch (error) {
    console.error('❌ listUserBackgroundVersionSectionsForVersionIds:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
