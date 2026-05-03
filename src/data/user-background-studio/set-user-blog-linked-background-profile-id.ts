import { SupabaseClient } from '@supabase/supabase-js';
import { getUserBackgroundProfileOwnedByUser } from './get-user-background-profile-owned-by-user';

/**
 * Persist the User Background profile used as the Blog Studio “writer’s voice” context.
 */
export const setUserBlogLinkedBackgroundProfileId = async (
  supabase: SupabaseClient,
  userId: string,
  linkedProfileId: string | null,
): Promise<void> => {
  if (linkedProfileId) {
    const owned = await getUserBackgroundProfileOwnedByUser(supabase, linkedProfileId.trim(), userId);
    if (!owned) {
      throw new Error('Linked profile not found or not owned by user');
    }
  }

  const { error } = await supabase
    .from('users')
    .update({
      blog_linked_user_background_profile_id: linkedProfileId?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('❌ setUserBlogLinkedBackgroundProfileId:', error);
    throw new Error(error.message);
  }
};
