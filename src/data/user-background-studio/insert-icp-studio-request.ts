import type { Pool } from 'pg';
import { insertRow } from '../../utils/postgres';

/**
 * Create a pending ICP Studio chat request (user message).
 */
export const insertUserBackgroundStudioRequest = async (
  pool: Pool,
  params: {
    id: string;
    userId: string;
    profileId: string;
    content: string;
  },
): Promise<void> => {
  const now = new Date().toISOString();
  try {
    await insertRow(pool, 'user_background_studio_requests', {
      id: params.id,
      user_id: params.userId,
      profile_id: params.profileId,
      content: params.content,
      status: 'pending',
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    console.error('❌ insertUserBackgroundStudioRequest:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
