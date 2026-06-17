import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { getVoiceStyle } from '../../../data/voice-style';

/**
 * GET /api/voice-style
 * Returns `{ success, body, updatedAt }`.
 */
export const getVoiceStyleHandler = async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    const { body, updatedAt } = await getVoiceStyle(supabase);
    return res.json({ success: true, body, updatedAt });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ getVoiceStyleHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
