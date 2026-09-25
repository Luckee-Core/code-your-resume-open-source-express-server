import type { Pool } from 'pg';
import { updateRows } from '../../utils/postgres';

/**
 * Link request to exchange/response after AI completes.
 */
export const updateUserBackgroundStudioRequestCompletion = async (
  pool: Pool,
  requestId: string,
  params: {
    exchangeId: string;
    responseId: string;
    status: 'completed' | 'failed';
  },
): Promise<void> => {
  try {
    await updateRows(
      pool,
      'user_background_studio_requests',
      {
        exchange_id: params.exchangeId,
        response_id: params.responseId,
        status: params.status,
        updated_at: new Date().toISOString(),
      },
      { id: requestId },
    );
  } catch (error) {
    console.error('❌ updateUserBackgroundStudioRequestCompletion:', error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
