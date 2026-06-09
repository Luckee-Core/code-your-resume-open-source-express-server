import { randomUUID } from "node:crypto";
import type {
  JobListingAiExchange,
  JobListingAiRequest,
  JobListingAiResponse,
  JobListingStructuredBulletRow,
} from "../../data/job-listing/types";
import { getActiveJobListingAiPrompt } from "../../data/job-listing-ai-prompt";
import { getSupabaseCrmMirrorClient } from "../supabase/get-supabase-crm-mirror-client";
import { requireActivePromptText } from "../../utils/ai/require-active-prompt-text";
import {
  extractJobListingWithAnthropic,
  getAnthropicJobListingModel,
} from "./extract-job-listing-with-anthropic";
import type { ExtractJobListingHints } from "./extract-job-listing-types";
import {
  syncJobListingAiExchangeToSupabase,
  syncJobListingAiRequestToSupabase,
  syncJobListingAiResponseToSupabase,
} from "./sync-job-listing-ai-ledger-to-supabase";
import { syncJobListingSectionRowsToSupabase } from "./sync-job-listing-section-rows-to-supabase";

export type PersistJobListingAiLedgerResult =
  | {
      ok: true;
      exchangeId: string;
      title: string | null;
      description: string;
      responsibilities: string[];
      requirements: string[];
      niceToHaves: string[];
    }
  | { ok: false; error: string };

const mapPlainStringsToBulletRows = (params: {
  jobId: string;
  scrapeRunId: string;
  exchangeId: string;
  bodies: string[];
  createdAt: string;
}): JobListingStructuredBulletRow[] =>
  params.bodies.map((body, sortOrder) => ({
    id: randomUUID(),
    jobId: params.jobId,
    scrapeRunId: params.scrapeRunId,
    exchangeId: params.exchangeId,
    body,
    sortOrder,
    createdAt: params.createdAt,
  }));

/**
 * Calls Anthropic with scraped job listing plain text, persists the request / response /
 * exchange ledger rows to Supabase, syncs structured bullet rows, and returns the
 * exchange ID along with the extracted title and description.
 */
export const persistJobListingAiLedger = async (params: {
  jobId: string;
  scrapeRunId: string;
  cappedPlain: string;
  hints: ExtractJobListingHints;
}): Promise<PersistJobListingAiLedgerResult> => {
  const { jobId, scrapeRunId, cappedPlain, hints } = params;
  const nowIso = () => new Date().toISOString();
  const model = getAnthropicJobListingModel();

  console.log("🤖 persistJobListingAiLedger: calling Anthropic", {
    jobId,
    scrapeRunId,
    model,
    cappedPlainChars: cappedPlain.length,
    hasCompanyHint: Boolean(hints.companyName?.trim()),
    hasTitleHint: Boolean(hints.titleHint?.trim()),
  });

  const mirror = getSupabaseCrmMirrorClient();
  if (!mirror) {
    return { ok: false, error: "Supabase CRM mirror client is not configured" };
  }

  let systemPrompt: string;
  try {
    const activePrompt = await getActiveJobListingAiPrompt(mirror);
    systemPrompt = requireActivePromptText(activePrompt, "job_listing_ai_prompt");
  } catch (promptErr: unknown) {
    const msg = promptErr instanceof Error ? promptErr.message : String(promptErr);
    return { ok: false, error: msg };
  }

  const outcome = await extractJobListingWithAnthropic(cappedPlain, hints, { systemPrompt });

  console.log("🤖 persistJobListingAiLedger: Anthropic outcome", {
    jobId,
    scrapeRunId,
    kind: outcome.kind,
    ...(outcome.kind === "ok"
      ? {
          extractedTitle: outcome.title,
          descriptionChars: outcome.description.length,
          responsibilities: outcome.responsibilities.length,
          requirements: outcome.requirements.length,
          niceToHaves: outcome.niceToHaves.length,
        }
      : {}),
    ...(outcome.kind === "error" ? { error: outcome.message } : {}),
  });

  const requestId = randomUUID();
  const createdAtReq = nowIso();

  const systemPromptForLedger =
    outcome.kind === "ok" || outcome.kind === "error" ? outcome.systemPrompt : systemPrompt;
  const userMessageForLedger =
    outcome.kind === "ok" || outcome.kind === "error"
      ? outcome.userMessage
      : cappedPlain.slice(0, 100_000);

  const requestRow: JobListingAiRequest = {
    id: requestId,
    jobId,
    scrapeRunId,
    provider: "anthropic",
    model,
    systemPrompt: systemPromptForLedger,
    userMessage: userMessageForLedger,
    requestPayloadJson: {
      model,
      max_tokens: 8192,
    },
    createdAt: createdAtReq,
  };

  try {
    await syncJobListingAiRequestToSupabase(requestRow);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ persistJobListingAiLedger: failed to persist AI request", err);
    return { ok: false, error: `Failed to persist AI request: ${msg}` };
  }

  const responseId = randomUUID();
  const createdAtRes = nowIso();

  let responseRow: JobListingAiResponse;
  if (outcome.kind === "skipped") {
    responseRow = {
      id: responseId,
      requestId,
      model,
      status: "error",
      rawResponse: "",
      parsedResponseJson: null,
      errorMessage: "Anthropic key unavailable",
      usageInputTokens: null,
      usageOutputTokens: null,
      createdAt: createdAtRes,
    };
  } else if (outcome.kind === "ok") {
    responseRow = {
      id: responseId,
      requestId,
      model,
      status: "success",
      rawResponse: outcome.rawResponse.slice(0, 200_000),
      parsedResponseJson: {
        title: outcome.title,
        description: outcome.description.slice(0, 50_000),
        responsibilities: outcome.responsibilities,
        requirements: outcome.requirements,
        niceToHaves: outcome.niceToHaves,
      },
      errorMessage: "",
      usageInputTokens: outcome.usageInputTokens,
      usageOutputTokens: outcome.usageOutputTokens,
      createdAt: createdAtRes,
    };
  } else {
    responseRow = {
      id: responseId,
      requestId,
      model,
      status: "error",
      rawResponse: outcome.rawResponse.slice(0, 50_000),
      parsedResponseJson: null,
      errorMessage: outcome.message.slice(0, 5000),
      usageInputTokens: null,
      usageOutputTokens: null,
      createdAt: createdAtRes,
    };
  }

  try {
    await syncJobListingAiResponseToSupabase(responseRow);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ persistJobListingAiLedger: failed to persist AI response", err);
    return { ok: false, error: `Failed to persist AI response: ${msg}` };
  }

  const exchangeId = randomUUID();
  const exchangeRow: JobListingAiExchange = {
    id: exchangeId,
    jobId,
    scrapeRunId,
    requestId,
    responseId,
    createdAt: createdAtRes,
  };

  try {
    await syncJobListingAiExchangeToSupabase(exchangeRow);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ persistJobListingAiLedger: failed to persist AI exchange", err);
    return { ok: false, error: `Failed to persist AI exchange: ${msg}` };
  }

  console.log("💾 persistJobListingAiLedger: AI ledger persisted", {
    jobId,
    scrapeRunId,
    requestId,
    exchangeId,
    responseStatus: responseRow.status,
  });

  if (outcome.kind === "ok") {
    const createdAt = createdAtRes;
    const responsibilityRows = mapPlainStringsToBulletRows({
      jobId,
      scrapeRunId,
      exchangeId,
      bodies: outcome.responsibilities,
      createdAt,
    });
    const requirementRows = mapPlainStringsToBulletRows({
      jobId,
      scrapeRunId,
      exchangeId,
      bodies: outcome.requirements,
      createdAt,
    });
    const niceToHaveRows = mapPlainStringsToBulletRows({
      jobId,
      scrapeRunId,
      exchangeId,
      bodies: outcome.niceToHaves,
      createdAt,
    });

    await syncJobListingSectionRowsToSupabase({
      responsibilities: responsibilityRows,
      requirements: requirementRows,
      niceToHaves: niceToHaveRows,
    });

    console.log("✅ persistJobListingAiLedger: section rows synced", {
      jobId,
      scrapeRunId,
      exchangeId,
      responsibilities: responsibilityRows.length,
      requirements: requirementRows.length,
      niceToHaves: niceToHaveRows.length,
    });

    return {
      ok: true,
      exchangeId,
      title: outcome.title,
      description: outcome.description,
      responsibilities: outcome.responsibilities,
      requirements: outcome.requirements,
      niceToHaves: outcome.niceToHaves,
    };
  }

  return {
    ok: true,
    exchangeId,
    title: null,
    description: "",
    responsibilities: [],
    requirements: [],
    niceToHaves: [],
  };
};
