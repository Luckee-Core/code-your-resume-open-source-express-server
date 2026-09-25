import { Request, Response } from 'express';
import { getManagedPgPool } from '../../../services/postgres';
import { deleteUserBackgroundVersionByNumber, getUserBackgroundProfileForUser } from '../../../data/user-background-studio';
import { buildUserBackgroundProfilePayload } from '../mapUserBackgroundProfile';

/**
 * DELETE /api/user-background-studio/profiles/:profileId/versions/:versionNumber?userId=
 */
export const deleteVersionHandler = async (req: Request, res: Response) => {
  try {
    const { profileId, versionNumber: rawVer } = req.params as Record<string, string>;
    const userId = req.query.userId as string;
    const versionNumber = Number.parseInt(String(rawVer), 10);

    if (!profileId || !userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'profileId and userId are required' });
    }
    if (!Number.isFinite(versionNumber)) {
      return res.status(400).json({ success: false, error: 'Invalid version number' });
    }

    const pool = getManagedPgPool();
    if (!pool) {
      return res.status(500).json({ success: false, error: 'Postgres not configured — set DATABASE_URL' });
    }

    await deleteUserBackgroundVersionByNumber(pool, profileId, userId, versionNumber);
    const row = await getUserBackgroundProfileForUser(pool, profileId, userId);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    const profile = await buildUserBackgroundProfilePayload(pool, row);

    return res.status(200).json({ success: true, profile });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ deleteVersionHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
