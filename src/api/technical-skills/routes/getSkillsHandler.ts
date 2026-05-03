import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { loadTechnicalSkillsPayload } from '../loadTechnicalSkillsPayload';

/**
 * GET /api/technical-skills
 * Returns all technical skills and chat history.
 */
export const getSkillsHandler = async (_req: Request, res: Response) => {
  try {
    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    const payload = await loadTechnicalSkillsPayload(supabase);
    return res.json({ success: true, ...payload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ getSkillsHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
