import type { Request, Response } from "express";
import type { Pool } from "pg";
import { getManagedPgPool } from "../../../services/postgres";
import { runIdealCandidateGeneration } from "../../../services/ideal-candidate-generation";
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
 * Runs Cursor ideal-candidate generation and persists the graphic on Express (client-independent).
 */
const runIdealCandidateGenerationInBackground = (
  pool: Pool,
  context: JobGenerationContext,
): void => {
  const label = `ideal-candidate job ${context.jobId}`;

  scheduleBackgroundJobGraphicGeneration(label, async () => {
    console.log(`🚀 Background ${label} — starting Cursor agent`);

    const result = await runIdealCandidateGeneration(pool, {
      jobId: context.jobId,
      jobTitle: context.jobTitle,
      companyName: context.companyName,
      responsibilities: context.responsibilities,
      requirements: context.requirements,
      niceToHaves: context.niceToHaves,
      skills: context.skillPromptLines.length > 0 ? context.skillPromptLines : undefined,
      voiceStyle: context.voiceStyle,
      projectsBlock: context.projectsBlock,
      appendedPromptSections: context.appendedPromptSections,
    });

    const graphic = await persistGeneratedJobGraphic(pool, {
      kind: "idealCandidate",
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
 * POST /api/data/ideal-candidate/generate — queue ideal-candidate TSX generation for a job.
 * Returns 202 immediately; Cursor agent + Supabase graphic write run on Express.
 */
export const handleIdealCandidateGenerate = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const pool = getManagedPgPool();
    if (!pool) {
      return res.status(500).json({
        success: false,
        error: "Postgres not configured — set DATABASE_URL",
      });
    }

    const jobId = typeof req.body?.jobId === "string" ? req.body.jobId.trim() : "";
    if (!jobId) {
      return res.status(400).json({ success: false, error: "jobId is required" });
    }

    const context = await loadJobGenerationContext(pool, jobId);
    assertHasNarrativeContext(context);

    console.log(
      `📥 POST /api/data/ideal-candidate/generate — job: ${context.jobTitle} (${context.jobId})`,
    );

    runIdealCandidateGenerationInBackground(pool, context);

    console.log(`📤 202 POST /api/data/ideal-candidate/generate — queued job ${context.jobId}`);
    return res.status(202).json({ success: true, accepted: true, jobId: context.jobId });
  } catch (error: unknown) {
    if (error instanceof JobGenerationContextError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ POST /api/data/ideal-candidate/generate:", msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
