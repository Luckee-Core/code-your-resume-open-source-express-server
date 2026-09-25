import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';

/**
 * Read persisted Blog Studio writer link for a user.
 */
export const getUserBlogLinkedBackgroundProfileId = async (
  pool: Pool,
  userId: string,
): Promise<string | null> => {
  let data: { blog_linked_user_background_profile_id: string | null } | null;
  try {
    data = await selectOneFrom<{ blog_linked_user_background_profile_id: string | null }>(pool, 'users', {
      columns: 'blog_linked_user_background_profile_id',
      eq: { id: userId },
    });
  } catch (error) {
    console.error('❌ getUserBlogLinkedBackgroundProfileId:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }

  const raw = data?.blog_linked_user_background_profile_id;
  if (raw == null || typeof raw !== 'string') return null;
  const t = raw.trim();
  return t.length ? t : null;
};
