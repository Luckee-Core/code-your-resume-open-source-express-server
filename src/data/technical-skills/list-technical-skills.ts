import { SupabaseClient } from '@supabase/supabase-js';

export type TechnicalSkillRow = {
  id: string;
  sort_order: number;
  title: string;
  body: string | null;
  status: string;
  source_exchange_id: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * List all technical skill rows ordered by sort_order ascending.
 */
export const listTechnicalSkills = async (
  supabase: SupabaseClient,
): Promise<TechnicalSkillRow[]> => {
  const { data, error } = await supabase
    .from('technical_skills')
    .select('id, sort_order, title, body, status, source_exchange_id, created_at, updated_at')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('❌ listTechnicalSkills:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as TechnicalSkillRow[];
};
