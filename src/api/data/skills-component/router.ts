import { Router, type Request, type Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { runSkillsComponentGeneration } from '../../../services/skills-component-generation';

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

      const { skills, canvasWidthPx, canvasHeightPx } = req.body as {
        skills?: unknown;
        canvasWidthPx?: unknown;
        canvasHeightPx?: unknown;
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

      console.log(`📥 POST /api/data/skills-component/generate — skills: ${sanitizedSkills.join(', ')}`);

      const result = await runSkillsComponentGeneration(supabase, {
        skills: sanitizedSkills,
        canvasWidthPx: parsedWidth,
        canvasHeightPx: parsedHeight,
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
