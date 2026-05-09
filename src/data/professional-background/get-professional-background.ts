import type { SupabaseClient } from '@supabase/supabase-js';
import { normalizeSegmentsFromJson, type SegmentsRecord } from './normalize-segments-from-json';

type Row = {
  segments: unknown;
  updated_at: string;
};

/**
 * Load the singleton professional_background row; returns empty segments if missing.
 */
export const getProfessionalBackground = async (
  supabase: SupabaseClient,
): Promise<{ segments: SegmentsRecord; updatedAt: string | null }> => {
  const { data, error } = await supabase
    .from('professional_background')
    .select('segments, updated_at')
    .eq('id', 'default')
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return { segments: normalizeSegmentsFromJson({}), updatedAt: null };
  }

  const row = data as Row;
  return {
    segments: normalizeSegmentsFromJson(row.segments),
    updatedAt: row.updated_at,
  };
};
