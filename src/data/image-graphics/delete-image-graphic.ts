import type { Pool } from "pg";
import { deleteRows } from "../../utils/postgres";

/**
 * Deletes one image graphic by id. Returns false when no row matched.
 */
export const deleteImageGraphic = async (
  pool: Pool,
  graphicId: string,
): Promise<boolean> => {
  const count = await deleteRows(pool, "image_graphics", { id: graphicId });
  return count > 0;
};
