import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Insert a single technical skill row.
 */
export const insertTechnicalSkill = async (
  supabase: SupabaseClient,
  params: {
    id: string;
    sortOrder: number;
    title: string;
    body: string | null;
    status: 'active' | 'archived';
    sourceExchangeId?: string | null;
  },
): Promise<void> => {
  const now = new Date().toISOString();
  const { error } = await supabase.from('technical_skills').insert({
    id: params.id,
    sort_order: params.sortOrder,
    title: params.title,
    body: params.body,
    status: params.status,
    source_exchange_id: params.sourceExchangeId ?? null,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error('❌ insertTechnicalSkill:', error);
    throw new Error(error.message);
  }
};
