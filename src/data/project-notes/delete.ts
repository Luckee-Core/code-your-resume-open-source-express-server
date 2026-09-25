import type { Pool } from "pg";
import { deleteRows } from "../../utils/postgres";

/**
 * Delete a project note by id.
 */
export const deleteProjectNote = async (pool: Pool, id: string): Promise<void> => {
  await deleteRows(pool, "project_notes", { id });
};
