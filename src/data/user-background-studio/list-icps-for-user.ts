import type { Pool } from 'pg';
import { selectRowsFrom } from '../../utils/postgres';

export type UserBackgroundProfileRow = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  current_version: number;
  created_at: string;
  updated_at: string;
};

const PROFILE_COLUMNS = 'id, user_id, name, current_version, created_at, updated_at';

const isMissingDescriptionColumnError = (error: unknown): boolean => {
  const err = error as { code?: string; message?: string };
  const msg = err.message ?? '';
  return (
    err.code === '42703' ||
    (msg.includes('does not exist') && msg.toLowerCase().includes('description'))
  );
};

/**
 * List ICP profile rows for a user, newest first.
 */
export const listUserBackgroundProfilesForUser = async (
  pool: Pool,
  userId: string,
): Promise<UserBackgroundProfileRow[]> => {
  console.log('[icp-studio:data] listUserBackgroundProfilesForUser query start (tenant-wide)', { userId });

  try {
    const rows = await selectRowsFrom<UserBackgroundProfileRow>(pool, 'user_background_profiles', {
      columns: `${PROFILE_COLUMNS}, description`,
      order: [{ column: 'updated_at', ascending: false }],
    });
    console.log('[icp-studio:data] listUserBackgroundProfilesForUser query success', {
      userId,
      rowCount: rows.length,
    });
    return rows;
  } catch (error) {
    if (isMissingDescriptionColumnError(error)) {
      console.warn('[icp-studio:data] description column missing, using fallback query', { userId });
      try {
        const fallbackData = await selectRowsFrom<Omit<UserBackgroundProfileRow, 'description'>>(
          pool,
          'user_background_profiles',
          {
            columns: PROFILE_COLUMNS,
            order: [{ column: 'updated_at', ascending: false }],
          },
        );
        const rows = fallbackData.map((row) => ({
          ...row,
          description: null,
        }));
        console.log('[icp-studio:data] fallback query success', { userId, rowCount: rows.length });
        return rows;
      } catch (fallbackError) {
        console.error('❌ listUserBackgroundProfilesForUser fallback:', fallbackError);
        throw fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError));
      }
    }
    console.error('❌ listUserBackgroundProfilesForUser:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
