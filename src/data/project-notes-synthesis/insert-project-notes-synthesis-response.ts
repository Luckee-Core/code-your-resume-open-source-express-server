import type { Pool } from "pg";
import { insertRow } from "../../utils/postgres";
import type { ProjectNotesSynthesisResponse } from "./types";

/**
 * Inserts one `project_notes_synthesis_responses` row. Throws on Postgres error.
 */
export const insertProjectNotesSynthesisResponse = async (
  pool: Pool,
  row: ProjectNotesSynthesisResponse,
): Promise<void> => {
  try {
    await insertRow(pool, "project_notes_synthesis_responses", {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ insertProjectNotesSynthesisResponse", message);
    throw new Error(`project_notes_synthesis_responses insert failed: ${message}`);
  }
  console.log("💾 insertProjectNotesSynthesisResponse", { id: row.id, requestId: row.requestId });
};
