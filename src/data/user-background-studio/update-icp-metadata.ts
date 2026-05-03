import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Update ICP display fields (caller must verify ownership).
 * Only keys present in `fields` are written.
 */
export const updateUserBackgroundProfileMetadata = async (
  supabase: SupabaseClient,
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

  const { error } = await supabase.from('user_background_profiles').update(payload).eq('id', profileId).eq('user_id', userId);

  if (error) {
    console.error('❌ updateUserBackgroundProfileMetadata:', error);
    throw new Error(error.message);
  }
};
