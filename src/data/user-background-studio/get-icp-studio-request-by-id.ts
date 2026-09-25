import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';

export type UserBackgroundStudioRequestRow = {
  id: string;
  user_id: string;
  profile_id: string;
  content: string;
  created_at: string;
};

export const getUserBackgroundStudioRequestById = async (
  pool: Pool,
  requestId: string,
): Promise<UserBackgroundStudioRequestRow | null> => {
  try {
    return await selectOneFrom<UserBackgroundStudioRequestRow>(pool, 'user_background_studio_requests', {
      columns: 'id, user_id, profile_id, content, created_at',
      eq: { id: requestId },
    });
  } catch (error) {
    console.error('❌ getUserBackgroundStudioRequestById:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
