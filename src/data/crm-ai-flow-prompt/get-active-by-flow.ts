import type { Pool } from 'pg';
import { selectOneFrom } from '../../utils/postgres';
import type { CrmAiFlowPrompt } from './types';

/**
 * Returns the active prompt for a CRM AI flow, or null.
 */
export const getActiveCrmAiFlowPromptByFlow = async (
  pool: Pool,
  flow: string,
): Promise<CrmAiFlowPrompt | null> => {
  try {
    return await selectOneFrom<CrmAiFlowPrompt>(pool, 'crm_ai_flow_prompt', {
      eq: { flow, is_active: true },
      order: [{ column: 'version', ascending: false }],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
};
