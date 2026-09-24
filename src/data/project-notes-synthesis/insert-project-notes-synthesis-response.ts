import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProjectNotesSynthesisResponse } from "./types";

/**
 * Inserts one `project_notes_synthesis_responses` row. Throws on PostgREST error.
 */
export const insertProjectNotesSynthesisResponse = async (
  supabase: SupabaseClient,
  row: ProjectNotesSynthesisResponse,
): Promise<void> => {
  const { error } = await supabase.from("project_notes_synthesis_responses").insert({
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
    console.error("❌ insertProjectNotesSynthesisResponse", error.message);
    throw new Error(`project_notes_synthesis_responses insert failed: ${error.message}`);
  }
  console.log("💾 insertProjectNotesSynthesisResponse", { id: row.id, requestId: row.requestId });
};
