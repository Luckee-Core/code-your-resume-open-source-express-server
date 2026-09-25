import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';
import { getUserBackgroundProfileOwnedByUser } from './get-user-background-profile-owned-by-user';

/**
 * Persist the User Background profile used as the Blog Studio “writer’s voice” context.
 */
export const setUserBlogLinkedBackgroundProfileId = async (
  pool: Pool,
  userId: string,
  linkedProfileId: string | null,
): Promise<void> => {
  if (linkedProfileId) {
    const owned = await getUserBackgroundProfileOwnedByUser(pool, linkedProfileId.trim(), userId);
    if (!owned) {
      throw new Error('Linked profile not found or not owned by user');
    }
  }

  try {
    await updateRows(
      pool,
      'users',
      {
        blog_linked_user_background_profile_id: linkedProfileId?.trim() || null,
        updated_at: new Date().toISOString(),
      },
      { id: userId },
    );
  } catch (error) {
    console.error('❌ setUserBlogLinkedBackgroundProfileId:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
