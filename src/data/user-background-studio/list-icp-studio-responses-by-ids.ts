import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type UserBackgroundStudioResponseListRow = {
  id: string;
  structured: unknown;
  created_at: string;
};

export const listUserBackgroundStudioResponsesByIds = async (
  pool: Pool,
  ids: string[],
): Promise<UserBackgroundStudioResponseListRow[]> => {
  if (ids.length === 0) return [];

  try {
    return await selectRowsFrom<UserBackgroundStudioResponseListRow>(pool, 'user_background_studio_responses', {
      columns: 'id, structured, created_at',
      in: { id: ids },
    });
  } catch (error) {
    console.error('❌ listUserBackgroundStudioResponsesByIds:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
