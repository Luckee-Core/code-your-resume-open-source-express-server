import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';

export type UserBackgroundStudioResponseRow = {
  id: string;
  structured: unknown;
  created_at: string;
};

export const getUserBackgroundStudioResponseById = async (
  pool: Pool,
  responseId: string,
): Promise<UserBackgroundStudioResponseRow | null> => {
  try {
    return await selectOneFrom<UserBackgroundStudioResponseRow>(pool, 'user_background_studio_responses', {
      columns: 'id, structured, created_at',
      eq: { id: responseId },
    });
  } catch (error) {
    console.error('❌ getUserBackgroundStudioResponseById:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
