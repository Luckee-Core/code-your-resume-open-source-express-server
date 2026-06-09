import type { SupabaseClient } from '@supabase/supabase-js';
import type { CrmAiFlowPrompt } from './types';

/**
 * Returns the active prompt for a CRM AI flow, or null.
 */
export const getActiveCrmAiFlowPromptByFlow = async (
  supabase: SupabaseClient,
  flow: string,
): Promise<CrmAiFlowPrompt | null> => {
  const { data, error } = await supabase
    .from('crm_ai_flow_prompt')
    .select('*')
    .eq('flow', flow)
    .eq('is_active', true)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as CrmAiFlowPrompt | null) ?? null;
};
