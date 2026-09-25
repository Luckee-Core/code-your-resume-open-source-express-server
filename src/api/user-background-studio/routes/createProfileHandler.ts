import { Request, Response } from 'express';
import { getManagedPgPool } from '../../../services/postgres';
import { createUserBackgroundProfileWithInitialVersion } from '../../../data/user-background-studio';
import { buildUserBackgroundProfilePayload } from '../mapUserBackgroundProfile';

/**
 * POST /api/user-background-studio/profiles
 * Body: { userId, name }
 */
export const createProfileHandler = async (req: Request, res: Response) => {
  try {
    const { userId, name } = req.body;
    if (!userId || !name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'userId and name are required' });
    }

    const pool = getManagedPgPool();
    if (!pool) {
      return res.status(500).json({ success: false, error: 'Postgres not configured — set DATABASE_URL' });
    }

    const row = await createUserBackgroundProfileWithInitialVersion(pool, userId, name);
    const profile = await buildUserBackgroundProfilePayload(pool, row);

    return res.status(201).json({ success: true, profile });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ createProfileHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
