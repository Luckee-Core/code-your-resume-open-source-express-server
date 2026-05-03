import { SupabaseClient } from '@supabase/supabase-js';

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
  supabase: SupabaseClient,
  icpVersionId: string,
): Promise<UserBackgroundVersionSectionRow[]> => {
  const { data, error } = await supabase
    .from('user_background_version_sections')
    .select('id, profile_version_id, section_key, title, body, last_version, sort_order')
    .eq('profile_version_id', icpVersionId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('❌ listUserBackgroundVersionSections:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as UserBackgroundVersionSectionRow[];
};

/**
 * Batch-load sections for many version ids (one query).
 */
export const listUserBackgroundVersionSectionsForVersionIds = async (
  supabase: SupabaseClient,
  icpVersionIds: string[],
): Promise<UserBackgroundVersionSectionRow[]> => {
  if (icpVersionIds.length === 0) return [];

  const { data, error } = await supabase
    .from('user_background_version_sections')
    .select('id, profile_version_id, section_key, title, body, last_version, sort_order')
    .in('profile_version_id', icpVersionIds)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('❌ listUserBackgroundVersionSectionsForVersionIds:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as UserBackgroundVersionSectionRow[];
};
