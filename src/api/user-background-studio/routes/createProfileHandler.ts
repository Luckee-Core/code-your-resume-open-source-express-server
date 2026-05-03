import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
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

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    const row = await createUserBackgroundProfileWithInitialVersion(supabase, userId, name);
    const profile = await buildUserBackgroundProfilePayload(supabase, row);

    return res.status(201).json({ success: true, profile });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ createProfileHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
