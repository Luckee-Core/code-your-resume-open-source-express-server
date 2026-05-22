import { Router, type Request, type Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { runCoverLetterGeneration } from '../../../services/cover-letter-generation';

type ProfessionalBackgroundSegments = {
  education: string;
  credibility_bio: string;
  voice_style: string;
  portfolio_github: string;
};

const parseStringArray = (raw: unknown): string[] | null => {
  if (raw === undefined || raw === null) {
    return [];
  }
  if (!Array.isArray(raw)) {
    return null;
  }
  if (raw.some((item) => typeof item !== 'string')) {
    return null;
  }
  return (raw as string[]).map((s) => s.trim()).filter(Boolean);
};

const parseProfessionalBackgroundSegments = (
  raw: unknown,
): ProfessionalBackgroundSegments | null => {
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
 * Router factory for cover letter generation API.
 *
 * Mounts under /api/data/cover-letter.
 */
export const createCoverLetterRouter = (): Router => {
  const router = Router();

  /**
   * POST /api/data/cover-letter/generate
   *
   * Launches a Cursor agent to generate a TSX cover letter component.
   */
  router.post('/generate', async (req: Request, res: Response) => {
    try {
      const supabase = getSupabaseCrmMirrorClient();
      if (!supabase) {
        return res
          .status(500)
          .json({
            success: false,
            error:
              'Supabase client not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY',
          });
      }

      const body = req.body as {
        jobId?: unknown;
        jobTitle?: unknown;
        companyName?: unknown;
        responsibilities?: unknown;
        requirements?: unknown;
        niceToHaves?: unknown;
        skills?: unknown;
        canvasWidthPx?: unknown;
        canvasHeightPx?: unknown;
        professionalBackgroundSegments?: unknown;
      };

      const jobId = typeof body.jobId === 'string' ? body.jobId.trim() : '';
      const jobTitle = typeof body.jobTitle === 'string' ? body.jobTitle.trim() : '';

      if (!jobId || !jobTitle) {
        return res.status(400).json({
          success: false,
          error: 'jobId and jobTitle are required non-empty strings',
        });
      }

      const parsedResponsibilities = parseStringArray(body.responsibilities);
      const parsedRequirements = parseStringArray(body.requirements);
      const parsedNiceToHaves = parseStringArray(body.niceToHaves);
      const parsedSkills = parseStringArray(body.skills);

      if (
        parsedResponsibilities === null ||
        parsedRequirements === null ||
        parsedNiceToHaves === null ||
        parsedSkills === null
      ) {
        return res.status(400).json({
          success: false,
          error:
            'responsibilities, requirements, niceToHaves, and skills must be arrays of strings when provided',
        });
      }

      const parsedProfessionalBackgroundSegments = parseProfessionalBackgroundSegments(
        body.professionalBackgroundSegments,
      );
      if (!parsedProfessionalBackgroundSegments) {
        return res.status(400).json({
          success: false,
          error:
            'professionalBackgroundSegments is required and must contain string values for education, credibility_bio, voice_style, portfolio_github',
        });
      }

      const credibility = parsedProfessionalBackgroundSegments.credibility_bio.trim();
      const voice = parsedProfessionalBackgroundSegments.voice_style.trim();
      if (!credibility && !voice) {
        return res.status(400).json({
          success: false,
          error:
            'professionalBackgroundSegments must include non-empty credibility_bio or voice_style',
        });
      }

      const companyName =
        typeof body.companyName === 'string' && body.companyName.trim()
          ? body.companyName.trim()
          : undefined;

      const parsedWidth = typeof body.canvasWidthPx === 'number' ? body.canvasWidthPx : undefined;
      const parsedHeight =
        typeof body.canvasHeightPx === 'number' ? body.canvasHeightPx : undefined;

      console.log(`📥 POST /api/data/cover-letter/generate — job: ${jobTitle} (${jobId})`);

      const result = await runCoverLetterGeneration(supabase, {
        jobId,
        jobTitle,
        companyName,
        responsibilities: parsedResponsibilities,
        requirements: parsedRequirements,
        niceToHaves: parsedNiceToHaves,
        skills: parsedSkills,
        canvasWidthPx: parsedWidth,
        canvasHeightPx: parsedHeight,
        professionalBackgroundSegments: parsedProfessionalBackgroundSegments,
      });

      return res.status(200).json({ success: true, tsx: result.tsx });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ POST /api/data/cover-letter/generate:', msg);
      return res.status(500).json({ success: false, error: msg });
    }
  });

  return router;
};
