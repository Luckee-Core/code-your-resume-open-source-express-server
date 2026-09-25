import { Request, Response } from 'express';
import { getManagedPgPool } from '../../../services/postgres';
import { loadTechnicalSkillsPayload } from '../loadTechnicalSkillsPayload';

/**
 * GET /api/technical-skills
 * Returns all technical skills and chat history.
 */
export const getSkillsHandler = async (_req: Request, res: Response) => {
  try {
    const pool = getManagedPgPool();
    if (!pool) {
      return res.status(500).json({ success: false, error: 'Postgres not configured — set DATABASE_URL' });
    }

    const payload = await loadTechnicalSkillsPayload(pool);
    return res.json({ success: true, ...payload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ getSkillsHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
