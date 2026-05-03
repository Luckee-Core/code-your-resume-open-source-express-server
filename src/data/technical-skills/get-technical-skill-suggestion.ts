import { SupabaseClient } from '@supabase/supabase-js';
import type { TechnicalSkillSuggestionRow } from './list-technical-skills-suggestions-by-response-ids';

/**
 * Load a single technical skill suggestion row by id.
 */
export const getTechnicalSkillSuggestion = async (
  supabase: SupabaseClient,
  suggestionId: string,
): Promise<TechnicalSkillSuggestionRow | null> => {
  const { data, error } = await supabase
    .from('technical_skills_suggestions')
    .select('id, exchange_id, response_id, title, body, op, target_skill_id, status, created_at')
    .eq('id', suggestionId)
    .maybeSingle();

  if (error) {
    console.error('❌ getTechnicalSkillSuggestion:', error);
    throw new Error(error.message);
  }

  return (data as TechnicalSkillSuggestionRow | null) ?? null;
};
