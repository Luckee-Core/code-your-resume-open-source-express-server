import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type UserBackgroundStudioExchangeRow = {
  id: string;
  user_id: string;
  profile_id: string;
  request_id: string;
  response_id: string | null;
  created_at: string;
};

/**
 * Exchanges for an ICP, oldest first (chat order).
 */
export const listUserBackgroundStudioExchangesForProfile = async (
  pool: Pool,
  profileId: string,
): Promise<UserBackgroundStudioExchangeRow[]> => {
  try {
    return await selectRowsFrom<UserBackgroundStudioExchangeRow>(pool, 'user_background_studio_exchanges', {
      columns: 'id, user_id, profile_id, request_id, response_id, created_at',
      eq: { profile_id: profileId },
      order: [{ column: 'created_at', ascending: true }],
    });
  } catch (error) {
    console.error('❌ listUserBackgroundStudioExchangesForProfile:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
