import type { Pool } from "pg";
import { insertRow } from "../../utils/postgres";
import type { ProjectNotesSynthesisExchange } from "./types";

/**
 * Inserts one `project_notes_synthesis_exchanges` row. Throws on Postgres error.
 */
export const insertProjectNotesSynthesisExchange = async (
  pool: Pool,
  row: ProjectNotesSynthesisExchange,
): Promise<void> => {
  try {
    await insertRow(pool, "project_notes_synthesis_exchanges", {
      id: row.id,
      project_id: row.projectId,
      request_id: row.requestId,
      response_id: row.responseId,
      created_at: row.createdAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ insertProjectNotesSynthesisExchange", message);
    throw new Error(`project_notes_synthesis_exchanges insert failed: ${message}`);
  }
  console.log("💾 insertProjectNotesSynthesisExchange", { id: row.id, projectId: row.projectId });
};
