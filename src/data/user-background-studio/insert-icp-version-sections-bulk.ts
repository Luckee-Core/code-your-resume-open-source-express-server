import type { Pool } from 'pg';
import { insertRows } from '../../utils/postgres';

export type SectionInput = {
  key: string;
  title: string;
  body: string | null;
  lastVersion?: string;
  sortOrder: number;
};

/**
 * Insert section rows for a new user_background_versions row.
 */
export const insertUserBackgroundVersionSectionsBulk = async (
  pool: Pool,
  icpVersionId: string,
  sections: SectionInput[],
): Promise<void> => {
  if (sections.length === 0) return;

  const rows = sections.map((s) => ({
    profile_version_id: icpVersionId,
    section_key: s.key,
    title: s.title,
    body: s.body,
    last_version: s.lastVersion ?? null,
    sort_order: s.sortOrder,
  }));

  try {
    await insertRows(pool, 'user_background_version_sections', rows);
  } catch (error) {
    console.error('❌ insertUserBackgroundVersionSectionsBulk:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
