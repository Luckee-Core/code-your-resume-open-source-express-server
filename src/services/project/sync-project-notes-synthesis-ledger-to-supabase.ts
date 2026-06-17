import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ProjectNotesSynthesisExchange,
  ProjectNotesSynthesisRequest,
  ProjectNotesSynthesisResponse,
} from "../../data/project-notes-synthesis/types";
import { getSupabaseCrmMirrorClient } from "../supabase/get-supabase-crm-mirror-client";

const requireProjectNotesSynthesisSupabaseClient = (): SupabaseClient => {
  const client = getSupabaseCrmMirrorClient();
  if (!client) {
    throw new Error(
      "Project notes synthesis ledger is stored only in Supabase. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return client;
};

/**
 * Inserts one `project_notes_synthesis_requests` row.
 */
export const syncProjectNotesSynthesisRequestToSupabase = async (
  row: ProjectNotesSynthesisRequest,
): Promise<void> => {
  const client = requireProjectNotesSynthesisSupabaseClient();
  const { error } = await client.from("project_notes_synthesis_requests").insert({
    id: row.id,
    project_id: row.projectId,
    provider: row.provider,
    model: row.model,
    system_prompt: row.systemPrompt,
    user_message: row.userMessage,
    request_payload_json: row.requestPayloadJson,
    created_at: row.createdAt,
  });
  if (error) {
    console.error("❌ Supabase project_notes_synthesis_requests insert", error.message);
    throw new Error(`project_notes_synthesis_requests insert failed: ${error.message}`);
  }
  console.log("📤 Supabase: project_notes_synthesis_requests", {
    id: row.id,
    projectId: row.projectId,
  });
};

/**
 * Inserts one `project_notes_synthesis_responses` row.
 */
export const syncProjectNotesSynthesisResponseToSupabase = async (
  row: ProjectNotesSynthesisResponse,
): Promise<void> => {
  const client = requireProjectNotesSynthesisSupabaseClient();
  const { error } = await client.from("project_notes_synthesis_responses").insert({
    id: row.id,
    request_id: row.requestId,
    model: row.model,
    status: row.status,
    raw_response: row.rawResponse,
    parsed_response_json: row.parsedResponseJson,
    error_message: row.errorMessage,
    usage_input_tokens: row.usageInputTokens,
    usage_output_tokens: row.usageOutputTokens,
    created_at: row.createdAt,
  });
  if (error) {
    console.error("❌ Supabase project_notes_synthesis_responses insert", error.message);
    throw new Error(`project_notes_synthesis_responses insert failed: ${error.message}`);
  }
  console.log("📤 Supabase: project_notes_synthesis_responses", {
    id: row.id,
    requestId: row.requestId,
  });
};

/**
 * Inserts one `project_notes_synthesis_exchanges` row.
 */
export const syncProjectNotesSynthesisExchangeToSupabase = async (
  row: ProjectNotesSynthesisExchange,
): Promise<void> => {
  const client = requireProjectNotesSynthesisSupabaseClient();
  const { error } = await client.from("project_notes_synthesis_exchanges").insert({
    id: row.id,
    project_id: row.projectId,
    request_id: row.requestId,
    response_id: row.responseId,
    created_at: row.createdAt,
  });
  if (error) {
    console.error("❌ Supabase project_notes_synthesis_exchanges insert", error.message);
    throw new Error(`project_notes_synthesis_exchanges insert failed: ${error.message}`);
  }
  console.log("📤 Supabase: project_notes_synthesis_exchanges", {
    id: row.id,
    projectId: row.projectId,
  });
};
