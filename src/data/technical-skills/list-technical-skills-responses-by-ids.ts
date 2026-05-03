import { SupabaseClient } from '@supabase/supabase-js';

export type TechnicalSkillsResponseListRow = {
  id: string;
  structured: unknown;
  created_at: string;
};

/**
 * Fetch technical skills response rows by ids.
 */
export const listTechnicalSkillsResponsesByIds = async (
  supabase: SupabaseClient,
  ids: string[],
): Promise<TechnicalSkillsResponseListRow[]> => {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from('technical_skills_responses')
    .select('id, structured, created_at')
    .in('id', ids);

  if (error) {
    console.error('❌ listTechnicalSkillsResponsesByIds:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as TechnicalSkillsResponseListRow[];
};
