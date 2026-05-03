import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Create a pending technical skills chat request (user message).
 */
export const insertTechnicalSkillsRequest = async (
  supabase: SupabaseClient,
  params: {
    id: string;
    content: string;
  },
): Promise<void> => {
  const now = new Date().toISOString();
  const { error } = await supabase.from('technical_skills_requests').insert({
    id: params.id,
    content: params.content,
    status: 'pending',
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error('❌ insertTechnicalSkillsRequest:', error);
    throw new Error(error.message);
  }
};
