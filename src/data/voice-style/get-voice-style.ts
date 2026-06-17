import type { SupabaseClient } from '@supabase/supabase-js';

type Row = {
  body: string;
  updated_at: string;
};

/**
 * Load the singleton voice_style row; returns empty body if missing.
 */
export const getVoiceStyle = async (
  supabase: SupabaseClient,
): Promise<{ body: string; updatedAt: string | null }> => {
  const { data, error } = await supabase
    .from('voice_style')
    .select('body, updated_at')
    .eq('id', 'default')
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return { body: '', updatedAt: null };
  }

  const row = data as Row;
  return {
    body: typeof row.body === 'string' ? row.body : '',
    updatedAt: row.updated_at,
  };
};
