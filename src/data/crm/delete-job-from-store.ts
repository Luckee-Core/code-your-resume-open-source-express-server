import { requireCrmPgPool } from "./require-crm-pg-pool";
import { deleteRows } from "../../utils/postgres";

/**
 * Deletes a job row from Supabase CRM.
 */
export const deleteJobFromStore = async (id: string): Promise<boolean> => {
  const pool = requireCrmPgPool();
  const count = await deleteRows(pool, "jobs", { id });
  return count > 0;
};
