import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Persist parsed AI payload (content, coachSections, suggestedSkills, etc.).
 */
export const insertTechnicalSkillsResponse = async (
  supabase: SupabaseClient,
  id: string,
  structured: unknown,
): Promise<void> => {
  const { error } = await supabase.from('technical_skills_responses').insert({
    id,
    structured,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('❌ insertTechnicalSkillsResponse:', error);
    throw new Error(error.message);
  }
};
