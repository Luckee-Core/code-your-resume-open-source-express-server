import type { SupabaseClient } from '@supabase/supabase-js';
import { isMissingTableError } from '../../utils/supabase/is-missing-table-error';
import type { CrmAiFlowPrompt } from './types';

/**
 * List all CRM AI flow prompt versions.
 */
export const listCrmAiFlowPrompts = async (
  supabase: SupabaseClient,
): Promise<CrmAiFlowPrompt[]> => {
  const { data, error } = await supabase
    .from('crm_ai_flow_prompt')
    .select('*')
    .order('flow', { ascending: true })
    .order('version', { ascending: false });

  if (error) {
    if (isMissingTableError(error)) {
      console.warn('⚠️ crm_ai_flow_prompt table missing; returning [].');
      return [];
    }
    throw new Error(error.message);
  }

  return (data ?? []) as CrmAiFlowPrompt[];
};
