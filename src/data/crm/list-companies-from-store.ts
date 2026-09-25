import type { Company } from "./types";
import { requireCrmPgPool } from "./require-crm-pg-pool";
import { listCompaniesFromSupabase } from "./supabase/list-companies-from-supabase";

/**
 * Lists all companies from Supabase CRM.
 */
export const listCompaniesFromStore = async (): Promise<Company[]> => {
  return listCompaniesFromSupabase(requireCrmPgPool());
};
