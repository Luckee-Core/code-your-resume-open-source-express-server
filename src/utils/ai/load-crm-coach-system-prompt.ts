import type { Pool } from 'pg';
import { getActiveCrmAiFlowPromptByFlow } from '../../data/crm-ai-flow-prompt';
import { requireActivePromptText } from './require-active-prompt-text';

/**
 * Loads the active system prompt for a CRM coach flow from `crm_ai_flow_prompt`.
 */
export const loadCrmCoachSystemPrompt = async (
  pool: Pool,
  flow: string,
): Promise<string> => {
  const row = await getActiveCrmAiFlowPromptByFlow(pool, flow);
  return requireActivePromptText(row, `crm_ai_flow_prompt (${flow})`);
};
