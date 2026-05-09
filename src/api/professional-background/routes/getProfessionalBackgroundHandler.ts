import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { getProfessionalBackground } from '../../../data/professional-background';

/**
 * GET /api/professional-background
 * Returns `{ success, segments, updatedAt }`.
 */
export const getProfessionalBackgroundHandler = async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    const { segments, updatedAt } = await getProfessionalBackground(supabase);
    return res.json({ success: true, segments, updatedAt });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ getProfessionalBackgroundHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
