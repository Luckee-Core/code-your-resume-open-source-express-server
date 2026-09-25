import { Request, Response } from 'express';
import { getManagedPgPool } from '../../../services/postgres';
import { duplicateUserBackgroundVersionFrom, getUserBackgroundProfileForUser } from '../../../data/user-background-studio';
import { buildUserBackgroundProfilePayload } from '../mapUserBackgroundProfile';

/**
 * POST /api/user-background-studio/profiles/:profileId/versions/duplicate
 * Body: { userId, fromVersionNumber }
 */
export const duplicateVersionHandler = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params as Record<string, string>;
    const body = req.body as Record<string, unknown>;
    const { userId, fromVersionNumber: rawFrom } = body;
    const fromVersionNumber = typeof rawFrom === 'number' ? rawFrom : Number(rawFrom);

    if (!profileId || !userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    if (!Number.isFinite(fromVersionNumber)) {
      return res.status(400).json({ success: false, error: 'fromVersionNumber is required' });
    }

    const pool = getManagedPgPool();
    if (!pool) {
      return res.status(500).json({ success: false, error: 'Postgres not configured — set DATABASE_URL' });
    }

    await duplicateUserBackgroundVersionFrom(pool, profileId, userId, fromVersionNumber);
    const row = await getUserBackgroundProfileForUser(pool, profileId, userId);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    const profile = await buildUserBackgroundProfilePayload(pool, row);

    return res.status(200).json({ success: true, profile });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ duplicateVersionHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
