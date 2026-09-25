import type { Pool } from "pg";
import { deleteRows } from "../../utils/postgres";

/**
 * Delete a project by id (cascades project_notes).
 */
export const deleteProject = async (pool: Pool, id: string): Promise<void> => {
  await deleteRows(pool, "projects", { id });
};
