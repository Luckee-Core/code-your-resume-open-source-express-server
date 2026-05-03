import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import {
  INITIAL_USER_BACKGROUND_SECTIONS_JSON,
  getUserBackgroundProfileForUser,
  updateUserBackgroundProfileMetadata,
  saveUserBackgroundSectionsAsNewVersion,
  saveUserBackgroundSectionsToCurrentVersion,
  replaceUserBackgroundSegmentItemsForProfile,
  syncUserBackgroundVersionSectionsFromSegmentItems,
  type UserBackgroundSectionDraftInput,
  type UserBackgroundSegmentItemInsert,
} from '../../../data/user-background-studio';
import { buildUserBackgroundProfilePayload } from '../mapUserBackgroundProfile';

const parseSectionsPayload = (raw: unknown): UserBackgroundSectionDraftInput[] | null => {
  if (!Array.isArray(raw) || raw.length === 0) {
    return null;
  }
  const out: UserBackgroundSectionDraftInput[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') {
      return null;
    }
    const o = item as Record<string, unknown>;
    if (typeof o.key !== 'string' || typeof o.title !== 'string') {
      return null;
    }
    if (o.body !== null && o.body !== undefined && typeof o.body !== 'string') {
      return null;
    }
    if (o.lastVersion !== undefined && o.lastVersion !== null && typeof o.lastVersion !== 'string') {
      return null;
    }
    const lastVersion =
      typeof o.lastVersion === 'string' && o.lastVersion.trim() ? o.lastVersion.trim() : undefined;
    out.push({
      key: o.key,
      title: o.title,
      body: o.body === undefined || o.body === null ? null : o.body,
      ...(lastVersion ? { lastVersion } : {}),
    });
  }
  return out;
};

const VALID_SEGMENT_KEYS = new Set<string>(INITIAL_USER_BACKGROUND_SECTIONS_JSON.map((s) => s.key));

const parseSegmentItemsPayload = (raw: unknown): UserBackgroundSegmentItemInsert[] | null => {
  if (!Array.isArray(raw)) {
    return null;
  }
  const out: UserBackgroundSegmentItemInsert[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') {
      return null;
    }
    const o = item as Record<string, unknown>;
    if (typeof o.id !== 'string' || !o.id.trim()) {
      return null;
    }
    const segmentKey = typeof o.segmentKey === 'string' ? o.segmentKey : (o.segment_key as string);
    if (typeof segmentKey !== 'string' || !VALID_SEGMENT_KEYS.has(segmentKey)) {
      return null;
    }
    if (typeof o.sortOrder !== 'number' || !Number.isFinite(o.sortOrder)) {
      return null;
    }
    if (typeof o.title !== 'string') {
      return null;
    }
    if (o.body !== null && o.body !== undefined && typeof o.body !== 'string') {
      return null;
    }
    const statusRaw = o.status === 'archived' ? 'archived' : 'active';
    const sourceExchangeId =
      o.sourceExchangeId === null || o.sourceExchangeId === undefined
        ? null
        : typeof o.sourceExchangeId === 'string'
          ? o.sourceExchangeId.trim() || null
          : null;
    const metadata =
      o.metadata && typeof o.metadata === 'object' && !Array.isArray(o.metadata)
        ? (o.metadata as Record<string, unknown>)
        : undefined;
    out.push({
      id: o.id.trim(),
      segmentKey,
      sortOrder: o.sortOrder,
      title: o.title,
      body: o.body === undefined ? null : (o.body as string | null),
      status: statusRaw,
      ...(metadata ? { metadata } : {}),
      ...(sourceExchangeId ? { sourceExchangeId } : {}),
    });
  }
  return out;
};

/**
 * PATCH /api/user-background-studio/profiles/:profileId
 * Body: { userId, name?, description?, sections?, segmentItems?, saveSectionsAsNewVersion? }
 */
export const patchProfileHandler = async (req: Request, res: Response) => {
  try {
    const { profileId } = req.params as Record<string, string>;
    const body = req.body as Record<string, unknown>;
    const { userId, sections, segmentItems, saveSectionsAsNewVersion } = body;
    if (!profileId || !userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }

    const nameInBody = Object.prototype.hasOwnProperty.call(body, 'name');
    const nameRaw = nameInBody ? body.name : undefined;
    if (nameInBody && typeof nameRaw !== 'string') {
      return res.status(400).json({ success: false, error: 'name must be a string when provided' });
    }
    const nameTrimmed = typeof nameRaw === 'string' ? nameRaw.trim() : '';
    if (nameInBody && nameTrimmed.length === 0) {
      return res.status(400).json({ success: false, error: 'name cannot be empty' });
    }
    const hasNameUpdate = nameInBody && nameTrimmed.length > 0;

    const descriptionInBody = Object.prototype.hasOwnProperty.call(body, 'description');
    const descriptionRaw = descriptionInBody ? body.description : undefined;
    if (descriptionInBody && typeof descriptionRaw !== 'string') {
      return res.status(400).json({ success: false, error: 'description must be a string when provided' });
    }
    const descriptionForDb =
      descriptionInBody && typeof descriptionRaw === 'string'
        ? descriptionRaw.trim().length > 0
          ? descriptionRaw.trim()
          : null
        : undefined;

    const parsedSections = parseSectionsPayload(sections);
    const hasSections = parsedSections !== null;

    const hasSegmentItemsKey = Object.prototype.hasOwnProperty.call(body, 'segmentItems');
    const parsedSegmentItems = hasSegmentItemsKey ? parseSegmentItemsPayload(segmentItems) : null;
    const hasSegmentItems = parsedSegmentItems !== null;

    if (!hasNameUpdate && !descriptionInBody && !hasSections && !hasSegmentItems) {
      return res.status(400).json({
        success: false,
        error: 'Provide name, description, a non-empty sections array, and/or segmentItems',
      });
    }

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    const profile = await getUserBackgroundProfileForUser(supabase, profileId, userId);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    if (hasSegmentItems && parsedSegmentItems) {
      await replaceUserBackgroundSegmentItemsForProfile(supabase, profileId, parsedSegmentItems);
      await syncUserBackgroundVersionSectionsFromSegmentItems(supabase, profileId, userId);
    }

    if (hasSections && parsedSections) {
      const asNewVersion = saveSectionsAsNewVersion === true;
      if (asNewVersion) {
        await saveUserBackgroundSectionsAsNewVersion(supabase, profileId, userId, parsedSections);
      } else {
        await saveUserBackgroundSectionsToCurrentVersion(supabase, profileId, userId, parsedSections);
      }
    }

    if (hasNameUpdate || descriptionInBody) {
      await updateUserBackgroundProfileMetadata(supabase, profileId, userId, {
        ...(hasNameUpdate ? { name: nameTrimmed } : {}),
        ...(descriptionInBody ? { description: descriptionForDb ?? null } : {}),
      });
    }

    const updated = await getUserBackgroundProfileForUser(supabase, profileId, userId);
    if (!updated) {
      return res.status(500).json({ success: false, error: 'Failed to reload profile' });
    }

    const profilePayload = await buildUserBackgroundProfilePayload(supabase, updated);
    return res.json({ success: true, profile: profilePayload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ patchProfileHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
