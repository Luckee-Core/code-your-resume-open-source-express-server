import { Router, type Request, type Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { runSkillsComponentGeneration } from '../../../services/skills-component-generation';

type ProfessionalBackgroundSegments = {
  education: string;
  credibility_bio: string;
  voice_style: string;
  portfolio_github: string;
};

const parseProfessionalBackgroundSegments = (
  raw: unknown,
): ProfessionalBackgroundSegments | undefined | null => {
  if (raw === undefined || raw === null) {
    return undefined;
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }
  const o = raw as Record<string, unknown>;
  const education = o.education;
  const credibilityBio = o.credibility_bio;
  const voiceStyle = o.voice_style;
  const portfolioGithub = o.portfolio_github;
  if (
    typeof education !== 'string' ||
    typeof credibilityBio !== 'string' ||
    typeof voiceStyle !== 'string' ||
    typeof portfolioGithub !== 'string'
  ) {
    return null;
  }
  return {
    education,
    credibility_bio: credibilityBio,
    voice_style: voiceStyle,
    portfolio_github: portfolioGithub,
  };
};

/**
 * Router factory for the skills component generation API.
 *
 * Mounts under /api/data/skills-component.
 */
export const createSkillsComponentRouter = (): Router => {
  const router = Router();

  /**
   * POST /api/data/skills-component/generate
   *
   * Launches a Cursor agent to generate a TSX skills showcase component.
   * Body: { skills: string[], canvasWidthPx?: number, canvasHeightPx?: number }
   * Returns: { tsx: string }
   */
  router.post('/generate', async (req: Request, res: Response) => {
    try {
      const supabase = getSupabaseCrmMirrorClient();
      if (!supabase) {
        return res
          .status(500)
          .json({ success: false, error: 'Supabase client not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY' });
      }

      const { skills, canvasWidthPx, canvasHeightPx, professionalBackgroundSegments } = req.body as {
        skills?: unknown;
        canvasWidthPx?: unknown;
        canvasHeightPx?: unknown;
        professionalBackgroundSegments?: unknown;
      };

      if (
        !Array.isArray(skills) ||
        skills.length === 0 ||
        skills.some((s) => typeof s !== 'string' || !s.trim())
      ) {
        return res.status(400).json({
          success: false,
          error: 'skills must be a non-empty array of non-empty strings',
        });
      }

      const sanitizedSkills = (skills as string[]).map((s) => s.trim());

      const parsedWidth = typeof canvasWidthPx === 'number' ? canvasWidthPx : undefined;
      const parsedHeight = typeof canvasHeightPx === 'number' ? canvasHeightPx : undefined;
      const parsedProfessionalBackgroundSegments =
        parseProfessionalBackgroundSegments(professionalBackgroundSegments);
      if (parsedProfessionalBackgroundSegments === null) {
        return res.status(400).json({
          success: false,
          error:
            'professionalBackgroundSegments must contain string values for education, credibility_bio, voice_style, portfolio_github',
        });
      }

      console.log(`📥 POST /api/data/skills-component/generate — skills: ${sanitizedSkills.join(', ')}`);

      const result = await runSkillsComponentGeneration(supabase, {
        skills: sanitizedSkills,
        canvasWidthPx: parsedWidth,
        canvasHeightPx: parsedHeight,
        professionalBackgroundSegments: parsedProfessionalBackgroundSegments,
      });

      return res.status(200).json({ success: true, tsx: result.tsx });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ POST /api/data/skills-component/generate:', msg);
      return res.status(500).json({ success: false, error: msg });
    }
  });

  return router;
};
