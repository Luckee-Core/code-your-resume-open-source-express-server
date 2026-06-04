import type { Company } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getCompanyFromSupabase } from "./supabase/get-company-from-supabase";

/**
 * Fetches one company by id from Supabase CRM.
 */
export const getCompanyFromStore = async (id: string): Promise<Company | null> => {
  return getCompanyFromSupabase(requireCrmSupabaseClient(), id);
};
