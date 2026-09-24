import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProjectNotesSynthesisExchange } from "./types";

/**
 * Inserts one `project_notes_synthesis_exchanges` row. Throws on PostgREST error.
 */
export const insertProjectNotesSynthesisExchange = async (
  supabase: SupabaseClient,
  row: ProjectNotesSynthesisExchange,
): Promise<void> => {
  const { error } = await supabase.from("project_notes_synthesis_exchanges").insert({
    id: row.id,
    project_id: row.projectId,
    request_id: row.requestId,
    response_id: row.responseId,
    created_at: row.createdAt,
  });
  if (error) {
    console.error("❌ insertProjectNotesSynthesisExchange", error.message);
    throw new Error(`project_notes_synthesis_exchanges insert failed: ${error.message}`);
  }
  console.log("💾 insertProjectNotesSynthesisExchange", { id: row.id, projectId: row.projectId });
};
