import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { setUserBlogLinkedBackgroundProfileId } from '../../../data/user-background-studio';

/**
 * PATCH /api/user-background-studio/writer-settings
 * Body: { userId, linkedUserBackgroundProfileId: string | null }
 */
export const patchWriterSettingsHandler = async (req: Request, res: Response) => {
  try {
    const { userId, linkedUserBackgroundProfileId } = req.body as {
      userId?: string;
      linkedUserBackgroundProfileId?: string | null;
    };
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const raw = linkedUserBackgroundProfileId;
    const next =
      raw === null || raw === undefined
        ? null
        : typeof raw === 'string' && raw.trim()
          ? raw.trim()
          : null;

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    await setUserBlogLinkedBackgroundProfileId(supabase, userId, next);
    return res.json({ success: true, linkedUserBackgroundProfileId: next });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ patchWriterSettingsHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
