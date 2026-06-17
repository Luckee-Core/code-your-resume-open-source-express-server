import type { Request, Response } from "express";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseCrmMirrorClient } from "../../../services/supabase/get-supabase-crm-mirror-client";
import { runCoverLetterGeneration } from "../../../services/cover-letter-generation";
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

const MAX_POINT_OF_EMPHASIS_CHARS = 2000;

/**
 * Runs Cursor cover letter generation and persists the graphic on Express (client-independent).
 */
const runCoverLetterGenerationInBackground = (
  supabase: SupabaseClient,
  context: JobGenerationContext,
  pointOfEmphasis?: string,
): void => {
  const label = `cover-letter job ${context.jobId}`;

  scheduleBackgroundJobGraphicGeneration(label, async () => {
    console.log(`🚀 Background ${label} — starting Cursor agent`);

    const result = await runCoverLetterGeneration(supabase, {
      jobId: context.jobId,
      jobTitle: context.jobTitle,
      companyName: context.companyName,
      responsibilities: context.responsibilities,
      requirements: context.requirements,
      niceToHaves: context.niceToHaves,
      skills: context.skillPromptLines.length > 0 ? context.skillPromptLines : undefined,
      voiceStyle: context.voiceStyle,
      projectsBlock: context.projectsBlock,
      pointOfEmphasis,
    });

    const graphic = await persistGeneratedJobGraphic(supabase, {
      kind: "coverLetter",
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
 * POST /api/data/cover-letter/generate — queue cover letter TSX generation for a job.
 * Returns 202 immediately; Cursor agent + Supabase graphic write run on Express.
 */
export const handleCoverLetterGenerate = async (
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

    const rawEmphasis =
      typeof req.body?.pointOfEmphasis === "string" ? req.body.pointOfEmphasis.trim() : "";
    if (rawEmphasis.length > MAX_POINT_OF_EMPHASIS_CHARS) {
      return res.status(400).json({
        success: false,
        error: `pointOfEmphasis must be at most ${MAX_POINT_OF_EMPHASIS_CHARS} characters`,
      });
    }
    const pointOfEmphasis = rawEmphasis || undefined;

    const context = await loadJobGenerationContext(supabase, jobId);
    assertHasNarrativeContext(context);

    console.log(
      `📥 POST /api/data/cover-letter/generate — job: ${context.jobTitle} (${context.jobId})${
        pointOfEmphasis ? " — with point of emphasis" : ""
      }`,
    );

    runCoverLetterGenerationInBackground(supabase, context, pointOfEmphasis);

    console.log(`📤 202 POST /api/data/cover-letter/generate — queued job ${context.jobId}`);
    return res.status(202).json({ success: true, accepted: true, jobId: context.jobId });
  } catch (error: unknown) {
    if (error instanceof JobGenerationContextError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ POST /api/data/cover-letter/generate:", msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
