import { SupabaseClient } from '@supabase/supabase-js';
import { initialUserBackgroundSectionsAsInputs } from './initial-sections';
import { insertUserBackgroundVersionSectionsBulk } from './insert-icp-version-sections-bulk';
import type { UserBackgroundProfileRow } from './list-icps-for-user';

/**
 * Create an ICP and version 1 with empty section scaffolding (normalized rows).
 */
export const createUserBackgroundProfileWithInitialVersion = async (
  supabase: SupabaseClient,
  userId: string,
  name: string,
): Promise<UserBackgroundProfileRow> => {
  const { data: icp, error: icpError } = await supabase
    .from('user_background_profiles')
    .insert({
      user_id: userId,
      name: name.trim(),
      current_version: 1,
    })
    .select('id, user_id, name, description, current_version, created_at, updated_at')
    .single();

  if (icpError || !icp) {
    console.error('❌ createIcp insert:', icpError);
    throw new Error(icpError?.message ?? 'Failed to create ICP');
  }

  const { data: ver, error: verError } = await supabase
    .from('user_background_versions')
    .insert({
      profile_id: icp.id,
      version: 1,
      label: 'v1 (current)',
      snapshot_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (verError || !ver?.id) {
    console.error('❌ createIcp version:', verError);
    throw new Error(verError?.message ?? 'Failed to create initial version');
  }

  await insertUserBackgroundVersionSectionsBulk(supabase, ver.id as string, initialUserBackgroundSectionsAsInputs());

  return icp as UserBackgroundProfileRow;
};
