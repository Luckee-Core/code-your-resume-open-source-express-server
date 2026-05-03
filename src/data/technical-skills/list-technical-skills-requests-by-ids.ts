import { SupabaseClient } from '@supabase/supabase-js';

export type TechnicalSkillsRequestListRow = {
  id: string;
  content: string;
  created_at: string;
};

/**
 * Fetch technical skills request rows by ids.
 */
export const listTechnicalSkillsRequestsByIds = async (
  supabase: SupabaseClient,
  ids: string[],
): Promise<TechnicalSkillsRequestListRow[]> => {
  if (ids.length === 0) return [];

  const { data, error } = await supabase
    .from('technical_skills_requests')
    .select('id, content, created_at')
    .in('id', ids);

  if (error) {
    console.error('❌ listTechnicalSkillsRequestsByIds:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as TechnicalSkillsRequestListRow[];
};
