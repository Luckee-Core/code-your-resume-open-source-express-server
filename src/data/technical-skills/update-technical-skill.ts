import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Update title/body for an existing technical skill row.
 */
export const updateTechnicalSkill = async (
  supabase: SupabaseClient,
  skillId: string,
  patch: { title?: string; body?: string | null; sourceExchangeId?: string | null },
): Promise<void> => {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.body !== undefined) row.body = patch.body;
  if (patch.sourceExchangeId !== undefined) row.source_exchange_id = patch.sourceExchangeId;

  const { error } = await supabase.from('technical_skills').update(row).eq('id', skillId);

  if (error) {
    console.error('❌ updateTechnicalSkill:', error);
    throw new Error(error.message);
  }
};
