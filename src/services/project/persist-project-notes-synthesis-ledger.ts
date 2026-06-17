import { randomUUID } from "node:crypto";
import type { Project } from "../../data/projects/types";
import type {
  ProjectNotesSynthesisExchange,
  ProjectNotesSynthesisRequest,
  ProjectNotesSynthesisResponse,
} from "../../data/project-notes-synthesis/types";
import { CRM_AI_FLOW_PROMPT_FLOWS } from "../../constants/crm-ai-flow-prompt-flows";
import { getActiveCrmAiFlowPromptByFlow } from "../../data/crm-ai-flow-prompt";
import { requireCrmSupabaseClient } from "../../data/crm/require-crm-supabase-client";
import { requireActivePromptText } from "../../utils/ai/require-active-prompt-text";
import {
  extractProjectNotesWithAnthropic,
  getAnthropicProjectNotesSynthesisModel,
} from "./extract-project-notes-with-anthropic";
import {
  syncProjectNotesSynthesisExchangeToSupabase,
  syncProjectNotesSynthesisRequestToSupabase,
  syncProjectNotesSynthesisResponseToSupabase,
} from "./sync-project-notes-synthesis-ledger-to-supabase";

export type PersistProjectNotesSynthesisLedgerResult =
  | { ok: true; exchangeId: string; notes: string[] }
  | { ok: false; error: string };

/**
 * Calls Anthropic with pasted project narrative, persists request / response / exchange
 * ledger rows to Supabase, and returns extracted note strings.
 */
export const persistProjectNotesSynthesisLedger = async (params: {
  project: Project;
  synthesisText: string;
}): Promise<PersistProjectNotesSynthesisLedgerResult> => {
  const { project, synthesisText } = params;
  const nowIso = () => new Date().toISOString();
  const model = getAnthropicProjectNotesSynthesisModel();

  console.log("🤖 persistProjectNotesSynthesisLedger: calling Anthropic", {
    projectId: project.id,
    model,
    synthesisChars: synthesisText.length,
  });

  const supabase = requireCrmSupabaseClient();

  let systemPrompt: string;
  try {
    const activePrompt = await getActiveCrmAiFlowPromptByFlow(
      supabase,
      CRM_AI_FLOW_PROMPT_FLOWS.PROJECT_NOTES_SYNTHESIS,
    );
    systemPrompt = requireActivePromptText(
      activePrompt,
      `crm_ai_flow_prompt (${CRM_AI_FLOW_PROMPT_FLOWS.PROJECT_NOTES_SYNTHESIS})`,
    );
  } catch (promptErr: unknown) {
    const msg = promptErr instanceof Error ? promptErr.message : String(promptErr);
    return { ok: false, error: msg };
  }

  const outcome = await extractProjectNotesWithAnthropic(project, synthesisText, { systemPrompt });

  console.log("🤖 persistProjectNotesSynthesisLedger: Anthropic outcome", {
    projectId: project.id,
    kind: outcome.kind,
    ...(outcome.kind === "ok" ? { notesCount: outcome.notes.length } : {}),
    ...(outcome.kind === "error" ? { error: outcome.message } : {}),
  });

  const requestId = randomUUID();
  const createdAtReq = nowIso();

  const systemPromptForLedger =
    outcome.kind === "ok" || outcome.kind === "error" ? outcome.systemPrompt : systemPrompt;
  const userMessageForLedger =
    outcome.kind === "ok" || outcome.kind === "error"
      ? outcome.userMessage
      : synthesisText.slice(0, 100_000);

  const requestRow: ProjectNotesSynthesisRequest = {
    id: requestId,
    projectId: project.id,
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
    await syncProjectNotesSynthesisRequestToSupabase(requestRow);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ persistProjectNotesSynthesisLedger: failed to persist AI request", err);
    return { ok: false, error: `Failed to persist AI request: ${msg}` };
  }

  const responseId = randomUUID();
  const createdAtRes = nowIso();

  let responseRow: ProjectNotesSynthesisResponse;
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
      parsedResponseJson: { notes: outcome.notes },
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
    await syncProjectNotesSynthesisResponseToSupabase(responseRow);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ persistProjectNotesSynthesisLedger: failed to persist AI response", err);
    return { ok: false, error: `Failed to persist AI response: ${msg}` };
  }

  const exchangeId = randomUUID();
  const exchangeRow: ProjectNotesSynthesisExchange = {
    id: exchangeId,
    projectId: project.id,
    requestId,
    responseId,
    createdAt: createdAtRes,
  };

  try {
    await syncProjectNotesSynthesisExchangeToSupabase(exchangeRow);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ persistProjectNotesSynthesisLedger: failed to persist AI exchange", err);
    return { ok: false, error: `Failed to persist AI exchange: ${msg}` };
  }

  console.log("💾 persistProjectNotesSynthesisLedger: AI ledger persisted", {
    projectId: project.id,
    requestId,
    exchangeId,
    responseStatus: responseRow.status,
  });

  if (outcome.kind === "error") {
    return { ok: false, error: outcome.message };
  }

  if (outcome.kind === "skipped") {
    return { ok: false, error: "Anthropic API key is not configured on the server" };
  }

  return { ok: true, exchangeId, notes: outcome.notes };
};
