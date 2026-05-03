import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Persist parsed AI payload (content, coachSections, suggestedSections, etc.).
 */
export const insertUserBackgroundStudioResponse = async (
  supabase: SupabaseClient,
  id: string,
  structured: unknown,
): Promise<void> => {
  const { error } = await supabase.from('user_background_studio_responses').insert({
    id,
    structured,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('❌ insertUserBackgroundStudioResponse:', error);
    throw new Error(error.message);
  }
};
