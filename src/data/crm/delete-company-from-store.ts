import { requireCrmPgPool } from "./require-crm-pg-pool";
import { deleteRows } from "../../utils/postgres";

/**
 * Deletes a company row from Supabase CRM.
 */
export const deleteCompanyFromStore = async (id: string): Promise<boolean> => {
  const pool = requireCrmPgPool();
  const count = await deleteRows(pool, "companies", { id });
  return count > 0;
};
