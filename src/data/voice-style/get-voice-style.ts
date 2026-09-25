import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';

type Row = {
  body: string;
  updated_at: string;
};

/**
 * Load the singleton voice_style row; returns empty body if missing.
 */
export const getVoiceStyle = async (
  pool: Pool,
): Promise<{ body: string; updatedAt: string | null }> => {
  const data = await selectOneFrom<Row>(pool, 'voice_style', {
    columns: 'body, updated_at',
    eq: { id: 'default' },
  });

  if (!data) {
    return { body: '', updatedAt: null };
  }

  return {
    body: typeof data.body === 'string' ? data.body : '',
    updatedAt: data.updated_at,
  };
};
