import { Request, Response } from 'express';
import { getManagedPgPool } from '../../../services/postgres';
import { getUserBlogLinkedBackgroundProfileId } from '../../../data/user-background-studio';

/**
 * GET /api/user-background-studio/writer-settings?userId=
 */
export const getWriterSettingsHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const pool = getManagedPgPool();
    if (!pool) {
      return res.status(500).json({ success: false, error: 'Postgres not configured — set DATABASE_URL' });
    }

    const linkedUserBackgroundProfileId = await getUserBlogLinkedBackgroundProfileId(pool, userId);
    return res.json({ success: true, linkedUserBackgroundProfileId });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ getWriterSettingsHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
