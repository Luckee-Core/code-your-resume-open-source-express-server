import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { getAnthropicClient } from '../../../services/ai/get-anthropic-client';
import { processTechnicalSkillsChat } from '../processTechnicalSkillsChat';
import { loadTechnicalSkillsPayload } from '../loadTechnicalSkillsPayload';

/**
 * POST /api/technical-skills/messages
 * Body: { content }
 */
export const postMessageHandler = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ success: false, error: 'content is required' });
    }

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    const anthropic = getAnthropicClient();
    if (!anthropic) {
      console.warn('⚠️ Anthropic client unavailable for Technical Skills chat');
    }

    await processTechnicalSkillsChat(supabase, anthropic, content.trim());

    const payload = await loadTechnicalSkillsPayload(supabase);
    return res.json({ success: true, ...payload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ postMessageHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
