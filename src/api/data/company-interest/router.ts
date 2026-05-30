import { Router, type Request, type Response } from 'express';
import { getSupabaseCrmMirrorClient } from '../../../services/supabase/get-supabase-crm-mirror-client';
import { runCompanyInterestGeneration } from '../../../services/company-interest-generation';
import {
  assertHasBackgroundVoice,
  JobGenerationContextError,
  loadJobGenerationContext,
} from '../../../services/generation';

/**
 * Router factory for company-interest generation API.
 *
 * Mounts under /api/data/company-interest.
 */
export const createCompanyInterestRouter = (): Router => {
  const router = Router();

  /**
   * POST /api/data/company-interest/generate
   *
   * Body: { jobId: string }
   * Loads job context server-side and launches a Cursor agent to generate TSX.
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

      const jobId = typeof req.body?.jobId === 'string' ? req.body.jobId.trim() : '';
      if (!jobId) {
        return res.status(400).json({ success: false, error: 'jobId is required' });
      }

      const context = await loadJobGenerationContext(supabase, jobId);
      assertHasBackgroundVoice(context);

      console.log(`📥 POST /api/data/company-interest/generate — job: ${context.jobTitle} (${context.jobId})`);

      const result = await runCompanyInterestGeneration(supabase, {
        jobId: context.jobId,
        jobTitle: context.jobTitle,
        companyName: context.companyName,
        responsibilities: context.responsibilities,
        requirements: context.requirements,
        niceToHaves: context.niceToHaves,
        skills: context.skillPromptLines.length > 0 ? context.skillPromptLines : undefined,
        professionalBackgroundSegments: context.professionalBackgroundSegments,
      });

      return res.status(200).json({ success: true, tsx: result.tsx });
    } catch (error: unknown) {
      if (error instanceof JobGenerationContextError) {
        return res.status(error.statusCode).json({ success: false, error: error.message });
      }
      const msg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ POST /api/data/company-interest/generate:', msg);
      return res.status(500).json({ success: false, error: msg });
    }
  });

  return router;
};
