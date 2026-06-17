import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { getVoiceStyle, upsertVoiceStyle } from '../../../data/voice-style';

/**
 * PATCH /api/voice-style
 * Body: `{ body: string }` — full replace of voice text.
 */
export const patchVoiceStyleHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body as Record<string, unknown>;
    if (!Object.prototype.hasOwnProperty.call(body, 'body')) {
      return res.status(400).json({ success: false, error: 'body is required' });
    }
    if (typeof body.body !== 'string') {
      return res.status(400).json({ success: false, error: 'body must be a string' });
    }

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    await upsertVoiceStyle(supabase, body.body);
    const fresh = await getVoiceStyle(supabase);
    return res.json({
      success: true,
      body: fresh.body,
      updatedAt: fresh.updatedAt,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ patchVoiceStyleHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
