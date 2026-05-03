import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { getUserBackgroundProfileForUser, updateUserBackgroundVersionLabel } from '../../../data/user-background-studio';
import { buildUserBackgroundProfilePayload } from '../mapUserBackgroundProfile';

/**
 * PATCH /api/user-background-studio/profiles/:profileId/versions/:versionNumber/label
 * Body: { userId, label }
 */
export const patchVersionLabelHandler = async (req: Request, res: Response) => {
  try {
    const { profileId, versionNumber: rawVer } = req.params as Record<string, string>;
    const body = req.body as Record<string, unknown>;
    const { userId, label } = body;
    const versionNumber = Number.parseInt(String(rawVer), 10);

    if (!profileId || !userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    if (typeof label !== 'string' || !label.trim()) {
      return res.status(400).json({ success: false, error: 'label is required' });
    }
    if (!Number.isFinite(versionNumber)) {
      return res.status(400).json({ success: false, error: 'Invalid version number' });
    }

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    await updateUserBackgroundVersionLabel(supabase, profileId, userId, versionNumber, label);
    const row = await getUserBackgroundProfileForUser(supabase, profileId, userId);
    if (!row) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    const profile = await buildUserBackgroundProfilePayload(supabase, row);

    return res.status(200).json({ success: true, profile });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ patchVersionLabelHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
