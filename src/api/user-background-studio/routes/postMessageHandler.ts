import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { getAnthropicClient } from '../../../services/ai/get-anthropic-client';
import { getUserBackgroundProfileForUser } from '../../../data/user-background-studio';
import { buildUserBackgroundProfilePayload } from '../mapUserBackgroundProfile';
import { processUserBackgroundChat } from '../processUserBackgroundChat';

/**
 * POST /api/user-background-studio/profiles/:profileId/messages
 * Body: { userId, content }
 */
export const postMessageHandler = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params as Record<string, string>;
    const { userId, content } = req.body;
    if (!profileId || !userId || !content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ success: false, error: 'userId and content are required' });
    }

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    const row = await getUserBackgroundProfileForUser(supabase, profileId, userId);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const anthropic = getAnthropicClient();
    if (!anthropic) {
      console.warn('⚠️ Anthropic client unavailable for User Background chat');
    }

    await processUserBackgroundChat(supabase, anthropic, userId, profileId, content.trim());

    const refreshed = await getUserBackgroundProfileForUser(supabase, profileId, userId);
    if (!refreshed) {
      return res.status(500).json({ success: false, error: 'Failed to reload profile' });
    }

    const profile = await buildUserBackgroundProfilePayload(supabase, refreshed);
    return res.json({ success: true, profile });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ postMessageHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
