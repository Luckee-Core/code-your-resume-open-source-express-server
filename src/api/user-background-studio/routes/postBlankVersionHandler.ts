import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { createBlankUserBackgroundVersion, getUserBackgroundProfileForUser } from '../../../data/user-background-studio';
import { buildUserBackgroundProfilePayload } from '../mapUserBackgroundProfile';

/**
 * POST /api/user-background-studio/profiles/:profileId/versions/blank
 * Body: { userId }
 */
export const postBlankVersionHandler = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params as Record<string, string>;
    const body = req.body as Record<string, unknown>;
    const { userId } = body;

    if (!profileId || !userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    await createBlankUserBackgroundVersion(supabase, profileId, userId);
    const row = await getUserBackgroundProfileForUser(supabase, profileId, userId);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    const profile = await buildUserBackgroundProfilePayload(supabase, row);

    return res.status(200).json({ success: true, profile });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ postBlankVersionHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
