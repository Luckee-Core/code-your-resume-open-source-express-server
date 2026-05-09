import { Request, Response } from "express";
import { getSupabaseCrmMirrorClient } from "../../../services/supabase/get-supabase-crm-mirror-client";
import { getAnthropicClient } from "../../../services/ai/get-anthropic-client";
import { getJobFromStore } from "../../../data/crm/read-write-jobs";
import { getCompanyFromStore } from "../../../data/crm/read-write-companies";
import { listJobApplicationsFromStore } from "../../../data/crm/read-write-job-applications";
import { loadJobStudioCoachContext } from "../loadJobStudioCoachContext";
import { processJobStudioChat } from "../processJobStudioChat";
import { loadJobStudioPayload } from "../loadJobStudioPayload";

/**
 * POST /api/job-studio/messages
 * Body: { jobId: string, userId: string, content: string }
 */
export const postJobStudioMessageHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId, userId, content } = req.body as {
      jobId?: string;
      userId?: string;
      content?: string;
    };

    const jid = typeof jobId === "string" ? jobId.trim() : "";
    const uid = typeof userId === "string" && userId.trim() ? userId.trim() : "local-user";
    const text = typeof content === "string" ? content.trim() : "";

    if (!jid) {
      res.status(400).json({ success: false, error: "jobId is required" });
      return;
    }
    if (!text) {
      res.status(400).json({ success: false, error: "content is required" });
      return;
    }

    const job = await getJobFromStore(jid);
    if (!job) {
      res.status(404).json({ success: false, error: "Job not found" });
      return;
    }

    const supabase = getSupabaseCrmMirrorClient();
    if (!supabase) {
      res.status(500).json({ success: false, error: "Supabase client not configured" });
      return;
    }

    const anthropic = getAnthropicClient();
    if (!anthropic) {
      console.warn("⚠️ Anthropic client unavailable for Job Studio chat");
    }

    const company = job.companyId ? await getCompanyFromStore(job.companyId) : null;
    const applications = await listJobApplicationsFromStore();
    const coachContext = await loadJobStudioCoachContext(supabase, job, company?.name ?? null, applications);

    await processJobStudioChat(supabase, anthropic, {
      jobId: jid,
      userId: uid,
      userMessageContent: text,
      job,
      coachContext,
    });

    const payload = await loadJobStudioPayload(supabase, jid);
    res.json({ success: true, ...payload });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ postJobStudioMessageHandler:", msg);
    res.status(500).json({ success: false, error: msg });
  }
};
