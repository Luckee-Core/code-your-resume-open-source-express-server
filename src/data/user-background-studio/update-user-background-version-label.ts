import { SupabaseClient } from '@supabase/supabase-js';
import { getUserBackgroundProfileForUser } from './get-icp-for-user';
import { getUserBackgroundVersionIdForProfileVersion } from './get-user-background-version-id-for-profile-version';

/**
 * Updates the display label for one numbered snapshot (`user_background_versions.label`).
 */
export const updateUserBackgroundVersionLabel = async (
  supabase: SupabaseClient,
  profileId: string,
  userId: string,
  versionNumber: number,
  label: string,
): Promise<void> => {
  const icp = await getUserBackgroundProfileForUser(supabase, profileId, userId);
  if (!icp) {
    throw new Error('Profile not found');
  }

  const trimmed = label.trim();
  if (!trimmed) {
    throw new Error('Label is required');
  }

  const versionId = await getUserBackgroundVersionIdForProfileVersion(supabase, profileId, versionNumber);
  if (!versionId) {
    throw new Error('Version not found');
  }

  const { error } = await supabase.from('user_background_versions').update({ label: trimmed }).eq('id', versionId);

  if (error) {
    console.error('❌ updateUserBackgroundVersionLabel:', error);
    throw new Error(error.message);
  }
};
