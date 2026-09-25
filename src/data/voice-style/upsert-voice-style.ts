import type { Pool } from 'pg';
import { upsertRows } from '../../utils/postgres';

/**
 * Upsert the singleton voice_style row.
 */
export const upsertVoiceStyle = async (
  pool: Pool,
  body: string,
): Promise<void> => {
  const now = new Date().toISOString();
  await upsertRows(
    pool,
    'voice_style',
    [
      {
        id: 'default',
        body,
        updated_at: now,
      },
    ],
    ['id'],
  );
};
