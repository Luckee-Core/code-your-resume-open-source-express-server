import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
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

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    const linkedUserBackgroundProfileId = await getUserBlogLinkedBackgroundProfileId(supabase, userId);
    return res.json({ success: true, linkedUserBackgroundProfileId });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ getWriterSettingsHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
