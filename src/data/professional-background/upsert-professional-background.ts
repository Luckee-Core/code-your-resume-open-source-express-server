import type { SupabaseClient } from '@supabase/supabase-js';
import type { SegmentsRecord } from './normalize-segments-from-json';

/**
 * Upsert the singleton row with full segments payload.
 */
export const upsertProfessionalBackground = async (
  supabase: SupabaseClient,
  segments: SegmentsRecord,
): Promise<void> => {
  const now = new Date().toISOString();
  const { error } = await supabase.from('professional_background').upsert(
    {
      id: 'default',
      segments,
      updated_at: now,
    },
    { onConflict: 'id' },
  );

  if (error) {
    throw error;
  }
};
