import type { Pool } from 'pg';
import { isMissingTableError, selectRowsFrom } from '../../utils/postgres';
import type { CrmAiFlowPrompt } from './types';

/**
 * List all CRM AI flow prompt versions.
 */
export const listCrmAiFlowPrompts = async (
  pool: Pool,
): Promise<CrmAiFlowPrompt[]> => {
  try {
    return await selectRowsFrom<CrmAiFlowPrompt>(pool, 'crm_ai_flow_prompt', {
      order: [
        { column: 'flow', ascending: true },
        { column: 'version', ascending: false },
      ],
    });
  } catch (error) {
    const err = error as { code?: string; message?: string };
    if (isMissingTableError(err)) {
      console.warn('⚠️ crm_ai_flow_prompt table missing; returning [].');
      return [];
    }
    throw new Error(err.message ?? String(error));
  }
};
