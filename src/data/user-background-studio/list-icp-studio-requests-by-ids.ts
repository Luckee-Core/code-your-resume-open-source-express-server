import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type UserBackgroundStudioRequestListRow = {
  id: string;
  content: string;
  created_at: string;
};

export const listUserBackgroundStudioRequestsByIds = async (
  pool: Pool,
  ids: string[],
): Promise<UserBackgroundStudioRequestListRow[]> => {
  if (ids.length === 0) return [];

  try {
    return await selectRowsFrom<UserBackgroundStudioRequestListRow>(pool, 'user_background_studio_requests', {
      columns: 'id, content, created_at',
      in: { id: ids },
    });
  } catch (error) {
    console.error('❌ listUserBackgroundStudioRequestsByIds:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
