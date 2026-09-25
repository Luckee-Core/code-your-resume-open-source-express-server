import { Request, Response } from 'express';
import { getManagedPgPool } from '../../../services/postgres';
import { getVoiceStyle } from '../../../data/voice-style';

/**
 * GET /api/voice-style
 * Returns `{ success, body, updatedAt }`.
 */
export const getVoiceStyleHandler = async (_req: Request, res: Response) => {
  try {
    const pool = getManagedPgPool();
    if (!pool) {
      return res.status(500).json({ success: false, error: 'Postgres not configured — set DATABASE_URL' });
    }

    const { body, updatedAt } = await getVoiceStyle(pool);
    return res.json({ success: true, body, updatedAt });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ getVoiceStyleHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
