import type { Pool } from "pg";
import { insertRow } from "../../utils/postgres";
import type { ProjectNotesSynthesisRequest } from "./types";

/**
 * Inserts one `project_notes_synthesis_requests` row. Throws on Postgres error.
 */
export const insertProjectNotesSynthesisRequest = async (
  pool: Pool,
  row: ProjectNotesSynthesisRequest,
): Promise<void> => {
  try {
    await insertRow(pool, "project_notes_synthesis_requests", {
      id: row.id,
      project_id: row.projectId,
      provider: row.provider,
      model: row.model,
      system_prompt: row.systemPrompt,
      user_message: row.userMessage,
      request_payload_json: row.requestPayloadJson,
      created_at: row.createdAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ insertProjectNotesSynthesisRequest", message);
    throw new Error(`project_notes_synthesis_requests insert failed: ${message}`);
  }
  console.log("💾 insertProjectNotesSynthesisRequest", { id: row.id, projectId: row.projectId });
};
