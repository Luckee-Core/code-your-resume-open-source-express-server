import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Return max sort_order for active technical skill rows, or -1 if none.
 */
export const getMaxSortOrderForTechnicalSkills = async (
  supabase: SupabaseClient,
): Promise<number> => {
  const { data, error } = await supabase
    .from('technical_skills')
    .select('sort_order')
    .eq('status', 'active')
    .order('sort_order', { ascending: false })
    .limit(1);

  if (error) {
    console.error('❌ getMaxSortOrderForTechnicalSkills:', error);
    throw new Error(error.message);
  }

  const row = data?.[0] as { sort_order: number } | undefined;
  return row?.sort_order ?? -1;
};
