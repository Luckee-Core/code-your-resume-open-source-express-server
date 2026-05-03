import { SupabaseClient } from '@supabase/supabase-js';
import { getUserBackgroundProfileForUser } from './get-icp-for-user';
import { listUserBackgroundVersions } from './list-icp-versions';
import { mergeUbSectionDraftsToInputs, type UserBackgroundSectionDraftInput } from './save-icp-sections-as-new-version';

/**
 * Overwrite section rows for the ICP's current_version snapshot without creating a new version row.
 */
export const saveUserBackgroundSectionsToCurrentVersion = async (
  supabase: SupabaseClient,
  profileId: string,
  userId: string,
  drafts: UserBackgroundSectionDraftInput[],
): Promise<void> => {
  const icp = await getUserBackgroundProfileForUser(supabase, profileId, userId);
  if (!icp) {
    throw new Error('ICP not found');
  }

  const versionRows = await listUserBackgroundVersions(supabase, profileId);
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

  const { error: upsertError } = await supabase.from('user_background_version_sections').upsert(rows, {
    onConflict: 'profile_version_id,section_key',
  });

  if (upsertError) {
    console.error('❌ saveUserBackgroundSectionsToCurrentVersion upsert:', upsertError);
    throw new Error(upsertError.message);
  }

  const now = new Date().toISOString();

  const { error: verErr } = await supabase
    .from('user_background_versions')
    .update({ snapshot_at: now })
    .eq('id', currentRow.id);

  if (verErr) {
    console.error('❌ saveUserBackgroundSectionsToCurrentVersion user_background_versions:', verErr);
    throw new Error(verErr.message);
  }

  const { error: icpErr } = await supabase.from('user_background_profiles').update({ updated_at: now }).eq('id', profileId);

  if (icpErr) {
    console.error('❌ saveUserBackgroundSectionsToCurrentVersion icps:', icpErr);
    throw new Error(icpErr.message);
  }
};
