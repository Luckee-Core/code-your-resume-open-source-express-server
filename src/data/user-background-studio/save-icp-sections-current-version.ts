import type { Pool } from 'pg';
import { updateRows, upsertRows } from '../../utils/postgres';
import { getUserBackgroundProfileForUser } from './get-icp-for-user';
import { listUserBackgroundVersions } from './list-icp-versions';
import { mergeUbSectionDraftsToInputs, type UserBackgroundSectionDraftInput } from './save-icp-sections-as-new-version';

/**
 * Overwrite section rows for the ICP's current_version snapshot without creating a new version row.
 */
export const saveUserBackgroundSectionsToCurrentVersion = async (
  pool: Pool,
  profileId: string,
  userId: string,
  drafts: UserBackgroundSectionDraftInput[],
): Promise<void> => {
  const icp = await getUserBackgroundProfileForUser(pool, profileId, userId);
  if (!icp) {
    throw new Error('ICP not found');
  }

  const versionRows = await listUserBackgroundVersions(pool, profileId);
  const currentRow = versionRows.find((v) => v.version === icp.current_version);
  if (!currentRow) {
    throw new Error('Current version snapshot not found');
  }

  const sections = mergeUbSectionDraftsToInputs(drafts);
  const rows = sections.map((s) => ({
    profile_version_id: currentRow.id,
    section_key: s.key,
    title: s.title,
    body: s.body,
    last_version: s.lastVersion ?? null,
    sort_order: s.sortOrder,
  }));

  try {
    await upsertRows(pool, 'user_background_version_sections', rows, ['profile_version_id', 'section_key']);
  } catch (error) {
    console.error('❌ saveUserBackgroundSectionsToCurrentVersion upsert:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  const now = new Date().toISOString();

  try {
    await updateRows(pool, 'user_background_versions', { snapshot_at: now }, { id: currentRow.id });
  } catch (error) {
    console.error('❌ saveUserBackgroundSectionsToCurrentVersion user_background_versions:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  try {
    await updateRows(pool, 'user_background_profiles', { updated_at: now }, { id: profileId });
  } catch (error) {
    console.error('❌ saveUserBackgroundSectionsToCurrentVersion icps:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
