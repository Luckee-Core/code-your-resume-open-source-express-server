import type { Company } from "./types";
import { requireCrmPgPool } from "./require-crm-pg-pool";
import { getCompanyFromSupabase } from "./supabase/get-company-from-supabase";

/**
 * Fetches one company by id from Supabase CRM.
 */
export const getCompanyFromStore = async (id: string): Promise<Company | null> => {
  return getCompanyFromSupabase(requireCrmPgPool(), id);
};
