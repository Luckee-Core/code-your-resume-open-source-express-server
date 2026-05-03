import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import {
  getUserBackgroundSegmentSuggestionForUser,
  acceptUserBackgroundSegmentSuggestion,
  getUserBackgroundProfileForUser,
} from '../../../data/user-background-studio';
import { buildUserBackgroundProfilePayload } from '../mapUserBackgroundProfile';

/**
 * POST /api/user-background-studio/profiles/:profileId/segment-suggestions/:suggestionId/accept
 * Body: { userId }
 */
export const acceptSegmentSuggestionHandler = async (req: Request, res: Response) => {
  try {
    const { profileId, suggestionId } = req.params as Record<string, string>;
    const { userId } = req.body as { userId?: string };
    if (!profileId || !suggestionId || !userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'profileId, suggestionId, and userId are required' });
    }

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    const profile = await getUserBackgroundProfileForUser(supabase, profileId, userId);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    const suggestion = await getUserBackgroundSegmentSuggestionForUser(supabase, suggestionId, userId);
    if (!suggestion) {
      return res.status(404).json({ success: false, error: 'Suggestion not found' });
    }
    if (suggestion.profile_id !== profileId) {
      return res.status(400).json({ success: false, error: 'Suggestion does not belong to this profile' });
    }
    if (suggestion.status !== 'pending') {
      return res.status(400).json({ success: false, error: 'Suggestion is not pending' });
    }

    const op = suggestion.op === 'update' ? 'update' : 'add';
    if (op === 'update' && !suggestion.target_item_id) {
      return res.status(400).json({ success: false, error: 'Update suggestion missing target item' });
    }

    await acceptUserBackgroundSegmentSuggestion(supabase, {
      suggestionId: suggestion.id,
      userId,
      profileId: suggestion.profile_id,
      segmentKey: suggestion.segment_key,
      title: suggestion.title,
      body: suggestion.body,
      op,
      targetItemId: suggestion.target_item_id,
      exchangeId: suggestion.exchange_id,
    });

    const updated = await getUserBackgroundProfileForUser(supabase, profileId, userId);
    if (!updated) {
      return res.status(500).json({ success: false, error: 'Failed to reload profile' });
    }
    const payload = await buildUserBackgroundProfilePayload(supabase, updated);
    return res.json({ success: true, profile: payload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ acceptSegmentSuggestionHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
