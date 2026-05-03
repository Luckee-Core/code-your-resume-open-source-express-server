import { SupabaseClient } from '@supabase/supabase-js';

export type TechnicalSkillInsert = {
  id: string;
  sortOrder: number;
  title: string;
  body: string | null;
  status: 'active' | 'archived';
  sourceExchangeId?: string | null;
};

/**
 * Replace all technical skill rows with the provided set (full sync from client).
 */
export const replaceTechnicalSkills = async (
  supabase: SupabaseClient,
  items: TechnicalSkillInsert[],
): Promise<void> => {
  const { error: delErr } = await supabase.from('technical_skills').delete().neq('id', '');
  if (delErr) {
    console.error('❌ replaceTechnicalSkills delete:', delErr);
    throw new Error(delErr.message);
  }

  if (items.length === 0) {
    return;
  }

  const now = new Date().toISOString();
  const rows = items.map((i) => ({
    id: i.id,
    sort_order: i.sortOrder,
    title: i.title,
    body: i.body,
    status: i.status,
    source_exchange_id: i.sourceExchangeId ?? null,
    created_at: now,
    updated_at: now,
  }));

  const { error: insErr } = await supabase.from('technical_skills').insert(rows);
  if (insErr) {
    console.error('❌ replaceTechnicalSkills insert:', insErr);
    throw new Error(insErr.message);
  }
};
