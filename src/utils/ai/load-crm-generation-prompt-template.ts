import type { SupabaseClient } from '@supabase/supabase-js';
import type { CrmAiFlowPromptFlow } from '../../constants/crm-ai-flow-prompt-flows';
import { getActiveCrmAiFlowPromptByFlow } from '../../data/crm-ai-flow-prompt';
import { requireActivePromptText } from './require-active-prompt-text';

/**
 * Loads an active Cursor agent prompt template from `crm_ai_flow_prompt`.
 */
export const loadCrmGenerationPromptTemplate = async (
  supabase: SupabaseClient,
  flow: CrmAiFlowPromptFlow,
): Promise<string> => {
  const row = await getActiveCrmAiFlowPromptByFlow(supabase, flow);
  return requireActivePromptText(row, `crm_ai_flow_prompt (${flow})`);
};
