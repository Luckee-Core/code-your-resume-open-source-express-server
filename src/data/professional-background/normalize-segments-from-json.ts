import {
  PROFESSIONAL_BACKGROUND_SEGMENT_KEYS,
  type ProfessionalBackgroundSegmentKey,
} from './constants';

export type SegmentsRecord = Record<ProfessionalBackgroundSegmentKey, string>;

const emptySegments = (): SegmentsRecord => ({
  education: '',
  credibility_bio: '',
  voice_style: '',
  portfolio_github: '',
});

/**
 * Merge raw JSONB from DB with defaults and strip unknown keys.
 */
export const normalizeSegmentsFromJson = (raw: unknown): SegmentsRecord => {
  const base = emptySegments();
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return base;
  }
  const o = raw as Record<string, unknown>;
  for (const key of PROFESSIONAL_BACKGROUND_SEGMENT_KEYS) {
    const v = o[key];
    if (typeof v === 'string') {
      base[key] = v;
    }
  }
  return base;
};
