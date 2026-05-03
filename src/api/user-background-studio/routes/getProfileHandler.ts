import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { getUserBackgroundProfileForUser } from '../../../data/user-background-studio';
import { buildUserBackgroundProfilePayload } from '../mapUserBackgroundProfile';

/**
 * GET /api/user-background-studio/profiles/:profileId?userId=
 */
export const getProfileHandler = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params as Record<string, string>;
    const userId = req.query.userId as string;
    if (!profileId || !userId) {
      return res.status(400).json({ success: false, error: 'profileId and userId are required' });
    }

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    const row = await getUserBackgroundProfileForUser(supabase, profileId, userId);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const profile = await buildUserBackgroundProfilePayload(supabase, row);
    return res.json({ success: true, profile });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ getProfileHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
