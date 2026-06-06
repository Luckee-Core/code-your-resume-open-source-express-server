import type { Request, Response } from "express";
import { getSupabaseCrmMirrorClient } from "../../../services/supabase/get-supabase-crm-mirror-client";
import { runCompanyInterestGeneration } from "../../../services/company-interest-generation";
import {
  assertHasBackgroundVoice,
  JobGenerationContextError,
  loadJobGenerationContext,
} from "../../../services/generation";

/**
 * POST /api/data/company-interest/generate — generate TSX company-interest section for a job.
 */
export const handleCompanyInterestGenerate = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      return res.status(500).json({
        success: false,
        error: "Supabase client not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY",
      });
    }

    const jobId = typeof req.body?.jobId === "string" ? req.body.jobId.trim() : "";
    if (!jobId) {
      return res.status(400).json({ success: false, error: "jobId is required" });
    }

    const context = await loadJobGenerationContext(supabase, jobId);
    assertHasBackgroundVoice(context);

    console.log(
      `📥 POST /api/data/company-interest/generate — job: ${context.jobTitle} (${context.jobId})`,
    );

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

    console.log("📤 200 POST /api/data/company-interest/generate");
    return res.status(200).json({ success: true, tsx: result.tsx });
  } catch (error: unknown) {
    if (error instanceof JobGenerationContextError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ POST /api/data/company-interest/generate:", msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
