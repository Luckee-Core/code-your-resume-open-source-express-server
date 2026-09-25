import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';
import type { UserBackgroundProfileRow } from './list-icps-for-user';

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
 * Fetch one ICP row if it belongs to the user.
 */
export const getUserBackgroundProfileForUser = async (
  pool: Pool,
  profileId: string,
  userId: string,
): Promise<UserBackgroundProfileRow | null> => {
  try {
    return await selectOneFrom<UserBackgroundProfileRow>(pool, 'user_background_profiles', {
      columns: `${PROFILE_COLUMNS}, description`,
      eq: { id: profileId },
    });
  } catch (error) {
    if (isMissingDescriptionColumnError(error)) {
      try {
        const fallbackData = await selectOneFrom<Omit<UserBackgroundProfileRow, 'description'>>(
          pool,
          'user_background_profiles',
          {
            columns: PROFILE_COLUMNS,
            eq: { id: profileId },
          },
        );
        if (!fallbackData) {
          return null;
        }
        return { ...fallbackData, description: null };
      } catch (fallbackError) {
        console.error('❌ getUserBackgroundProfileForUser fallback:', fallbackError);
        throw fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError));
      }
    }
    console.error('❌ getUserBackgroundProfileForUser:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
