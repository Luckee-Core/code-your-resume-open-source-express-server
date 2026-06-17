import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Upsert the singleton voice_style row.
 */
export const upsertVoiceStyle = async (
  supabase: SupabaseClient,
  body: string,
): Promise<void> => {
  const now = new Date().toISOString();
  const { error } = await supabase.from('voice_style').upsert(
    {
      id: 'default',
      body,
      updated_at: now,
    },
    { onConflict: 'id' },
  );

  if (error) {
    throw error;
  }
};
