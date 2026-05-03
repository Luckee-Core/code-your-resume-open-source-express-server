import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { listUserBackgroundProfilesForUser } from '../../../data/user-background-studio';
import { buildUserBackgroundProfilePayload } from '../mapUserBackgroundProfile';

/**
 * GET /api/user-background-studio/profiles?userId=
 * Returns full profile bundles (ICP + versions + messages) for the user.
 */
export const listProfilesHandler = async (req: Request, res: Response) => {
  const requestId = `icp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      console.warn('[icp-studio:api] listProfiles missing userId', { requestId });
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    console.log('[icp-studio:api] listProfiles start', { requestId, userId });
    const rows = await listUserBackgroundProfilesForUser(supabase, userId);
    console.log('[icp-studio:api] profile rows fetched', { requestId, userId, rowCount: rows.length });
    const profileResults = await Promise.allSettled(
      rows.map(async (profile) => {
        return await buildUserBackgroundProfilePayload(supabase, profile);
      })
    );
    const profiles = profileResults.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }

      const profile = rows[index];
      console.error('[icp-studio:api] profile build failed, returning minimal payload', {
        requestId,
        userId,
        profileId: profile.id,
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      });

      return {
        id: profile.id,
        name: profile.name,
        description: profile.description ?? null,
        currentVersion: profile.current_version,
        updatedAt: profile.updated_at,
        segmentItems: [],
        versions: [],
        messages: [],
      };
    });
    console.log('[icp-studio:api] profile payloads built', {
      requestId,
      userId,
      profileCount: profiles.length,
    });

    return res.json({ success: true, profiles });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ listProfilesHandler:', { requestId, error: msg });
    return res.status(500).json({ success: false, error: msg });
  }
};
