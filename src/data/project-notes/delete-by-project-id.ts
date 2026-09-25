import type { Pool } from "pg";
import { deleteRows } from "../../utils/postgres";

/**
 * Delete all project notes for a project id.
 */
export const deleteProjectNotesByProjectId = async (
  pool: Pool,
  projectId: string,
): Promise<void> => {
  await deleteRows(pool, "project_notes", { project_id: projectId.trim() });
};
