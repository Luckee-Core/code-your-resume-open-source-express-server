import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Set current_version on icps row (caller verifies ownership).
 */
export const setUserBackgroundProfileCurrentVersion = async (
  supabase: SupabaseClient,
  profileId: string,
  userId: string,
  currentVersion: number,
): Promise<void> => {
  const { error } = await supabase
    .from('user_background_profiles')
    .update({ current_version: currentVersion, updated_at: new Date().toISOString() })
    .eq('id', profileId)
    .eq('user_id', userId);

  if (error) {
    console.error('❌ setUserBackgroundProfileCurrentVersion:', error);
    throw new Error(error.message);
  }
};
