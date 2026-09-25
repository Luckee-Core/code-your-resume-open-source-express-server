import type { Request, Response } from "express";
import type { Pool } from "pg";
import { getManagedPgPool } from "../../../services/postgres";
import { runSkillsComponentGeneration } from "../../../services/skills-component-generation";
import {
  assertHasActiveSkills,
  assertHasCandidateName,
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
 * Runs Cursor skills generation and persists the graphic on Express (client-independent).
 */
const runSkillsComponentGenerationInBackground = (
  pool: Pool,
  context: JobGenerationContext,
  pointOfEmphasis?: string,
): void => {
  const label = `skills-component job ${context.jobId}`;

  scheduleBackgroundJobGraphicGeneration(label, async () => {
    console.log(`🚀 Background ${label} — starting Cursor agent`);

    const result = await runSkillsComponentGeneration(pool, {
      jobId: context.jobId,
      jobTitle: context.jobTitle,
      companyName: context.companyName,
      responsibilities: context.responsibilities,
      requirements: context.requirements,
      niceToHaves: context.niceToHaves,
      skills: context.skillPromptLines,
      voiceStyle: context.voiceStyle,
      projectsBlock: context.projectsBlock,
      pointOfEmphasis,
      candidateFullName: context.candidateFullName,
      appendedPromptSections: context.appendedPromptSections,
    });

    const graphic = await persistGeneratedJobGraphic(pool, {
      kind: "resume",
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
 * POST /api/data/skills-component/generate — queue resume TSX generation for a job.
 * Returns 202 immediately; Cursor agent + Supabase graphic write run on Express.
 */
export const handleSkillsComponentGenerate = async (
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

    const rawEmphasis =
      typeof req.body?.pointOfEmphasis === "string" ? req.body.pointOfEmphasis.trim() : "";
    if (rawEmphasis.length > MAX_POINT_OF_EMPHASIS_CHARS) {
      return res.status(400).json({
        success: false,
        error: `pointOfEmphasis must be at most ${MAX_POINT_OF_EMPHASIS_CHARS} characters`,
      });
    }
    const pointOfEmphasis = rawEmphasis || undefined;

    const context = await loadJobGenerationContext(pool, jobId);
    assertHasActiveSkills(context);
    assertHasCandidateName(context);

    console.log(
      `📥 POST /api/data/skills-component/generate — job: ${context.jobTitle} (${context.jobId}), skills: ${context.skillPromptLines.length}${
        pointOfEmphasis ? " — with focus points" : ""
      }`,
    );

    runSkillsComponentGenerationInBackground(pool, context, pointOfEmphasis);

    console.log(`📤 202 POST /api/data/skills-component/generate — queued job ${context.jobId}`);
    return res.status(202).json({ success: true, accepted: true, jobId: context.jobId });
  } catch (error: unknown) {
    if (error instanceof JobGenerationContextError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ POST /api/data/skills-component/generate:", msg);
    return res.status(500).json({ success: false, error: msg });
  }
};
