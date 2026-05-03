import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Update technical skill suggestion workflow status.
 */
export const updateTechnicalSkillSuggestionStatus = async (
  supabase: SupabaseClient,
  suggestionId: string,
  status: 'accepted' | 'rejected',
): Promise<void> => {
  const { error } = await supabase
    .from('technical_skills_suggestions')
    .update({ status })
    .eq('id', suggestionId);

  if (error) {
    console.error('❌ updateTechnicalSkillSuggestionStatus:', error);
    throw new Error(error.message);
  }
};
