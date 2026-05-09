import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import {
  PROFESSIONAL_BACKGROUND_SEGMENT_KEYS,
  getProfessionalBackground,
  normalizeSegmentsFromJson,
  upsertProfessionalBackground,
  type SegmentsRecord,
} from '../../../data/professional-background';

const parseSegmentsPayload = (raw: unknown): SegmentsRecord | null => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const o = raw as Record<string, unknown>;
  const base = normalizeSegmentsFromJson({});
  for (const key of PROFESSIONAL_BACKGROUND_SEGMENT_KEYS) {
    const v = o[key];
    if (typeof v !== 'string') {
      return null;
    }
    base[key] = v;
  }
  return base;
};

/**
 * PATCH /api/professional-background
 * Body: `{ segments: SegmentsRecord }` — full replace of allowed keys.
 */
export const patchProfessionalBackgroundHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body as Record<string, unknown>;
    const hasSegments = Object.prototype.hasOwnProperty.call(body, 'segments');
    if (!hasSegments) {
      return res.status(400).json({ success: false, error: 'segments is required' });
    }

    const segments = parseSegmentsPayload(body.segments);
    if (segments === null) {
      return res.status(400).json({ success: false, error: 'Invalid segments payload' });
    }

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    await upsertProfessionalBackground(supabase, segments);
    const fresh = await getProfessionalBackground(supabase);
    return res.json({
      success: true,
      segments: fresh.segments,
      updatedAt: fresh.updatedAt,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ patchProfessionalBackgroundHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
