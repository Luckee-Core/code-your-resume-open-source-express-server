import type { Request, Response } from "express";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseCrmMirrorClient } from "../../../services/supabase/get-supabase-crm-mirror-client";
import { runCompanyInterestGeneration } from "../../../services/company-interest-generation";
import {
  assertHasNarrativeContext,
  JobGenerationContextError,
  loadJobGenerationContext,
  type JobGenerationContext,
} from "../../../services/generation";
import {
  persistGeneratedJobGraphic,
  scheduleBackgroundJobGraphicGeneration,
} from "../../../services/job-graphic-generation";

/**
 * Runs Cursor company-interest generation and persists the graphic on Express (client-independent).
 */
const runCompanyInterestGenerationInBackground = (
  supabase: SupabaseClient,
  context: JobGenerationContext,
): void => {
  const label = `company-interest job ${context.jobId}`;

  scheduleBackgroundJobGraphicGeneration(label, async () => {
    console.log(`🚀 Background ${label} — starting Cursor agent`);

    const result = await runCompanyInterestGeneration(supabase, {
      jobId: context.jobId,
      jobTitle: context.jobTitle,
      companyName: context.companyName,
      responsibilities: context.responsibilities,
      requirements: context.requirements,
      niceToHaves: context.niceToHaves,
      skills: context.skillPromptLines.length > 0 ? context.skillPromptLines : undefined,
      voiceStyle: context.voiceStyle,
      projectsBlock: context.projectsBlock,
    });

    const graphic = await persistGeneratedJobGraphic(supabase, {
      kind: "companyInterest",
      jobId: context.jobId,
      jobTitle: context.jobTitle,
      tsx: result.tsx,
      requestId: result.requestId,
      exchangeId: result.exchangeId,
    });

    console.log(
      `✅ Background ${label} — graphic ${graphic.id} persisted (${graphic.title})`,
    );
  });
};

/**
 * POST /api/data/company-interest/generate — queue company-interest TSX generation for a job.
 * Returns 202 immediately; Cursor agent + Supabase graphic write run on Express.
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
    assertHasNarrativeContext(context);

    console.log(
      `📥 POST /api/data/company-interest/generate — job: ${context.jobTitle} (${context.jobId})`,
    );

    runCompanyInterestGenerationInBackground(supabase, context);

    console.log(`📤 202 POST /api/data/company-interest/generate — queued job ${context.jobId}`);
    return res.status(202).json({ success: true, accepted: true, jobId: context.jobId });
  } catch (error: unknown) {
    if (error instanceof JobGenerationContextError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ POST /api/data/company-interest/generate:", msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
