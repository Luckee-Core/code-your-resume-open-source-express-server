import Anthropic from "@anthropic-ai/sdk";
import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import type { Job } from "../../data/crm/types";
import {
  insertJobStudioExchange,
  insertJobStudioRequest,
  insertJobStudioResponse,
  listJobStudioExchangesByJobId,
  listJobStudioRequestsByIds,
  listJobStudioResponsesByIds,
  updateJobStudioRequestCompletion,
} from "../../data/job-studio";
import { callAI } from "../technical-skills/call-ai";
import { buildJobStudioCoachSystemPrompt, buildJobStudioCoachUserPayload } from "./buildJobStudioCoachPrompt";
import { loadJobStudioCoachContext, type JobStudioCoachContext } from "./loadJobStudioCoachContext";
import { parseJobStudioCoachJson } from "./parseJobStudioCoachJson";

const MS_24H = 24 * 60 * 60 * 1000;
const TOKENS_PER_CREDIT = 11.11;

const buildStructuredPayload = (
  parsed: ReturnType<typeof parseJobStudioCoachJson>,
  fallbackContent: string,
): Record<string, unknown> => {
  return {
    content: parsed?.content ?? fallbackContent,
    coachSections: parsed?.coachSections?.length ? parsed.coachSections : [],
  };
};

const loadRecentChatLines = async (
  supabase: SupabaseClient,
  jobId: string,
  excludeRequestId: string,
): Promise<{ role: string; content: string }[]> => {
  const exchanges = await listJobStudioExchangesByJobId(supabase, jobId);
  const cutoff = Date.now() - MS_24H;
  const completed = exchanges.filter(
    (ex) =>
      ex.response_id &&
      new Date(ex.created_at).getTime() >= cutoff &&
      ex.request_id !== excludeRequestId,
  );
  if (completed.length === 0) return [];

  const requestIds = [...new Set(completed.map((ex) => ex.request_id))];
  const responseIds = completed.map((ex) => ex.response_id as string);
  const [reqRows, resRows] = await Promise.all([
    listJobStudioRequestsByIds(supabase, requestIds),
    listJobStudioResponsesByIds(supabase, responseIds),
  ]);
  const reqById = new Map(reqRows.map((r) => [r.id, r]));
  const resById = new Map(resRows.map((r) => [r.id, r]));

  const lines: { role: string; content: string }[] = [];
  for (const ex of completed) {
    const req = reqById.get(ex.request_id);
    if (req) lines.push({ role: "user", content: req.content });
    const resp = ex.response_id ? resById.get(ex.response_id) : undefined;
    const s = (resp?.structured ?? {}) as { content?: unknown };
    const coachText = typeof s.content === "string" ? s.content : "";
    lines.push({ role: "coach", content: coachText });
  }
  return lines;
};

const persistExchangeOutcome = async (
  supabase: SupabaseClient,
  params: {
    jobId: string;
    requestId: string;
    structured: Record<string, unknown>;
    ai: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
      modelUsed: string;
    } | null;
    status: "completed" | "failed";
  },
): Promise<{ exchangeId: string; responseId: string }> => {
  const responseId = uuidv4();
  await insertJobStudioResponse(supabase, responseId, params.structured);

  const exchangeId = uuidv4();
  const totalTokens = params.ai?.totalTokens ?? 0;
  const creditsUsed = params.ai && totalTokens > 0 ? Math.ceil(totalTokens / TOKENS_PER_CREDIT) : 0;

  await insertJobStudioExchange(supabase, {
    id: exchangeId,
    jobId: params.jobId,
    requestId: params.requestId,
    responseId,
    inputTokens: params.ai?.inputTokens ?? 0,
    outputTokens: params.ai?.outputTokens ?? 0,
    totalTokens,
    creditsUsed,
    modelUsed: params.ai?.modelUsed ?? "none",
    status: params.status,
  });

  await updateJobStudioRequestCompletion(supabase, params.requestId, {
    exchangeId,
    responseId,
    status: params.status === "completed" ? "completed" : "failed",
  });

  return { exchangeId, responseId };
};

/**
 * Persist user request, run Job Studio coach AI, store response + exchange.
 */
export const processJobStudioChat = async (
  supabase: SupabaseClient,
  anthropic: Anthropic | null,
  params: {
    jobId: string;
    userId: string;
    userMessageContent: string;
    job: Job;
    coachContext: JobStudioCoachContext;
  },
): Promise<void> => {
  const requestId = uuidv4();
  await insertJobStudioRequest(supabase, {
    id: requestId,
    jobId: params.jobId,
    userId: params.userId,
    content: params.userMessageContent,
  });

  const fallback =
    "I could not generate a detailed reply right now. Please try again in a moment.";

  try {
    const recentChat = await loadRecentChatLines(supabase, params.jobId, requestId);

    if (!anthropic) {
      await persistExchangeOutcome(supabase, {
        jobId: params.jobId,
        requestId,
        structured: buildStructuredPayload(
          null,
          "AI is not configured. Add ANTHROPIC_API_KEY to enable the coach.",
        ),
        ai: null,
        status: "completed",
      });
      return;
    }

    const systemPrompt = buildJobStudioCoachSystemPrompt();
    const userPayload = buildJobStudioCoachUserPayload({
      context: params.coachContext,
      recentChat,
      userMessage: params.userMessageContent,
    });
    const aiResult = await callAI(anthropic, "job_studio", systemPrompt, userPayload);
    const parsed = parseJobStudioCoachJson(aiResult.responseText);
    const structured = buildStructuredPayload(parsed, fallback);

    await persistExchangeOutcome(supabase, {
      jobId: params.jobId,
      requestId,
      structured,
      ai: {
        inputTokens: aiResult.inputTokens,
        outputTokens: aiResult.outputTokens,
        totalTokens: aiResult.totalTokens,
        modelUsed: aiResult.modelUsed,
      },
      status: "completed",
    });
  } catch (e: unknown) {
    console.error("❌ processJobStudioChat error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    try {
      await persistExchangeOutcome(supabase, {
        jobId: params.jobId,
        requestId,
        structured: buildStructuredPayload(null, `${fallback} (${msg})`),
        ai: null,
        status: "failed",
      });
    } catch (persistErr: unknown) {
      console.error("❌ processJobStudioChat failed to persist error outcome:", persistErr);
    }
  }
};
