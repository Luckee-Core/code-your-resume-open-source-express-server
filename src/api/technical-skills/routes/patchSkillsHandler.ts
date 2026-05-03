import { Request, Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import {
  replaceTechnicalSkills,
  type TechnicalSkillInsert,
} from '../../../data/technical-skills';
import { loadTechnicalSkillsPayload } from '../loadTechnicalSkillsPayload';

const parseTechnicalSkillsPayload = (raw: unknown): TechnicalSkillInsert[] | null => {
  if (!Array.isArray(raw)) {
    return null;
  }
  const out: TechnicalSkillInsert[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') {
      return null;
    }
    const o = item as Record<string, unknown>;
    if (typeof o.id !== 'string' || !o.id.trim()) {
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
    out.push({
      id: o.id.trim(),
      sortOrder: o.sortOrder as number,
      title: o.title as string,
      body: o.body === undefined ? null : (o.body as string | null),
      status: statusRaw,
      ...(sourceExchangeId ? { sourceExchangeId } : {}),
    });
  }
  return out;
};

/**
 * PATCH /api/technical-skills/skills
 * Body: { technicalSkills: TechnicalSkillInsert[] }
 * Full replace of technical skill rows.
 */
export const patchSkillsHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body as Record<string, unknown>;
    const { technicalSkills } = body;

    const hasTechnicalSkillsKey = Object.prototype.hasOwnProperty.call(body, 'technicalSkills');
    if (!hasTechnicalSkillsKey) {
      return res.status(400).json({ success: false, error: 'technicalSkills is required' });
    }

    const parsedSkills = parseTechnicalSkillsPayload(technicalSkills);
    if (parsedSkills === null) {
      return res.status(400).json({ success: false, error: 'Invalid technicalSkills payload' });
    }

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({ success: false, error: 'Supabase client not configured' });
    }

    await replaceTechnicalSkills(supabase, parsedSkills);

    const payload = await loadTechnicalSkillsPayload(supabase);
    return res.json({ success: true, ...payload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ patchSkillsHandler:', msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
