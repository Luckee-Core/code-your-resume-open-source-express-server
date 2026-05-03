import { SupabaseClient } from '@supabase/supabase-js';

export type TechnicalSkillSuggestionInsert = {
  id: string;
  title: string;
  body: string | null;
  op: 'add' | 'update';
  targetSkillId?: string | null;
};

/**
 * Insert pending technical skill suggestions tied to a coach exchange/response.
 */
export const insertTechnicalSkillsSuggestionsBulk = async (
  supabase: SupabaseClient,
  params: {
    exchangeId: string;
    responseId: string;
    suggestions: TechnicalSkillSuggestionInsert[];
  },
): Promise<void> => {
  if (params.suggestions.length === 0) return;

  const now = new Date().toISOString();
  const rows = params.suggestions.map((s) => ({
    id: s.id,
    exchange_id: params.exchangeId,
    response_id: params.responseId,
    title: s.title,
    body: s.body,
    op: s.op,
    target_skill_id: s.targetSkillId ?? null,
    status: 'pending',
    created_at: now,
  }));

  const { error } = await supabase.from('technical_skills_suggestions').insert(rows);
  if (error) {
    console.error('❌ insertTechnicalSkillsSuggestionsBulk:', error);
    throw new Error(error.message);
  }
};
