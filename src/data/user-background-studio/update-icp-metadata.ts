import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';

/**
 * Update ICP display fields (caller must verify ownership).
 * Only keys present in `fields` are written.
 */
export const updateUserBackgroundProfileMetadata = async (
  pool: Pool,
  profileId: string,
  userId: string,
  fields: { name?: string; description?: string | null },
): Promise<void> => {
  const payload: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };
  if (fields.name !== undefined) {
    payload.name = fields.name.trim();
  }
  if (fields.description !== undefined) {
    payload.description = fields.description;
  }

  try {
    await updateRows(pool, 'user_background_profiles', payload, { id: profileId, user_id: userId });
  } catch (error) {
    console.error('❌ updateUserBackgroundProfileMetadata:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
