import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Read persisted Blog Studio writer link for a user.
 */
export const getUserBlogLinkedBackgroundProfileId = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<string | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('blog_linked_user_background_profile_id')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('❌ getUserBlogLinkedBackgroundProfileId:', error);
    throw new Error(error.message);
  }

  const raw = data?.blog_linked_user_background_profile_id;
  if (raw == null || typeof raw !== 'string') return null;
  const t = raw.trim();
  return t.length ? t : null;
};
