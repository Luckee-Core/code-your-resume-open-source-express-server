import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProjectNotesSynthesisRequest } from "./types";

/**
 * Inserts one `project_notes_synthesis_requests` row. Throws on PostgREST error.
 */
export const insertProjectNotesSynthesisRequest = async (
  supabase: SupabaseClient,
  row: ProjectNotesSynthesisRequest,
): Promise<void> => {
  const { error } = await supabase.from("project_notes_synthesis_requests").insert({
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
    console.error("❌ insertProjectNotesSynthesisRequest", error.message);
    throw new Error(`project_notes_synthesis_requests insert failed: ${error.message}`);
  }
  console.log("💾 insertProjectNotesSynthesisRequest", { id: row.id, projectId: row.projectId });
};
