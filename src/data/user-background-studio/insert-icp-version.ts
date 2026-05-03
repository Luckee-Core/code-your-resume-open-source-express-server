import { SupabaseClient } from '@supabase/supabase-js';
import { insertUserBackgroundVersionSectionsBulk, type SectionInput } from './insert-icp-version-sections-bulk';

/**
 * Append an immutable version snapshot (metadata row + normalized section rows).
 */
export const insertUserBackgroundVersionWithSections = async (
  supabase: SupabaseClient,
  profileId: string,
  version: number,
  label: string,
  sections: SectionInput[],
): Promise<string> => {
  const { data, error } = await supabase
    .from('user_background_versions')
    .insert({
      profile_id: profileId,
      version,
      label,
      snapshot_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error || !data?.id) {
    console.error('❌ insertUserBackgroundVersionWithSections:', error);
    throw new Error(error?.message ?? 'Failed to insert user_background_versions row');
  }

  const versionId = data.id as string;
  await insertUserBackgroundVersionSectionsBulk(supabase, versionId, sections);
  return versionId;
};
