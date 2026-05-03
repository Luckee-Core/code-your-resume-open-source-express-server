import { SupabaseClient } from '@supabase/supabase-js';
import type { UserBackgroundProfileRow } from './list-icps-for-user';

const isMissingDescriptionColumnError = (error: {
  code?: string;
  message?: string;
}): boolean => {
  const msg = error.message ?? '';
  return msg.includes('column user_background_profiles.description does not exist');
};

/**
 * Fetch one ICP row if it belongs to the user.
 */
export const getUserBackgroundProfileForUser = async (
  supabase: SupabaseClient,
  profileId: string,
  userId: string,
): Promise<UserBackgroundProfileRow | null> => {
  const baseSelect = 'id, user_id, name, current_version, created_at, updated_at';

  const { data, error } = await supabase
    .from('user_background_profiles')
    .select(`${baseSelect}, description`)
    .eq('id', profileId)
    .maybeSingle();

  if (error) {
    if (isMissingDescriptionColumnError(error)) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('user_background_profiles')
        .select(baseSelect)
        .eq('id', profileId)
        .maybeSingle();

      if (fallbackError) {
        console.error('❌ getUserBackgroundProfileForUser fallback:', fallbackError);
        throw new Error(fallbackError.message);
      }

      if (!fallbackData) {
        return null;
      }

      return { ...(fallbackData as Omit<UserBackgroundProfileRow, 'description'>), description: null };
    }
    console.error('❌ getUserBackgroundProfileForUser:', error);
    throw new Error(error.message);
  }

  return data as UserBackgroundProfileRow | null;
};
