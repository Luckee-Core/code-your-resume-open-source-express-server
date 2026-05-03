import { SupabaseClient } from '@supabase/supabase-js';

export type TechnicalSkillsExchangeRow = {
  id: string;
  request_id: string;
  response_id: string | null;
  created_at: string;
};

/**
 * List all technical skills chat exchanges, oldest first (chat order).
 */
export const listTechnicalSkillsExchanges = async (
  supabase: SupabaseClient,
): Promise<TechnicalSkillsExchangeRow[]> => {
  const { data, error } = await supabase
    .from('technical_skills_exchanges')
    .select('id, request_id, response_id, created_at')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ listTechnicalSkillsExchanges:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as TechnicalSkillsExchangeRow[];
};
