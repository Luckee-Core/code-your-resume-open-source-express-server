import { SupabaseClient } from '@supabase/supabase-js';

export type TechnicalSkillSuggestionRow = {
  id: string;
  exchange_id: string;
  response_id: string;
  title: string;
  body: string | null;
  op: string;
  target_skill_id: string | null;
  status: string;
  created_at: string;
};

/**
 * List technical skill suggestions for the given coach response ids.
 */
export const listTechnicalSkillsSuggestionsByResponseIds = async (
  supabase: SupabaseClient,
  responseIds: string[],
): Promise<TechnicalSkillSuggestionRow[]> => {
  if (responseIds.length === 0) return [];

  const { data, error } = await supabase
    .from('technical_skills_suggestions')
    .select('id, exchange_id, response_id, title, body, op, target_skill_id, status, created_at')
    .in('response_id', responseIds)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ listTechnicalSkillsSuggestionsByResponseIds:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as TechnicalSkillSuggestionRow[];
};
