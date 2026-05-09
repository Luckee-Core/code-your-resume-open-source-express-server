/** Allowed segment keys — aligned with Next.js model. */
export const PROFESSIONAL_BACKGROUND_SEGMENT_KEYS = [
  'education',
  'credibility_bio',
  'voice_style',
  'portfolio_github',
] as const;

export type ProfessionalBackgroundSegmentKey =
  (typeof PROFESSIONAL_BACKGROUND_SEGMENT_KEYS)[number];
