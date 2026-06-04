import type { Company } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { listCompaniesFromSupabase } from "./supabase/list-companies-from-supabase";

/**
 * Lists all companies from Supabase CRM.
 */
export const listCompaniesFromStore = async (): Promise<Company[]> => {
  return listCompaniesFromSupabase(requireCrmSupabaseClient());
};
