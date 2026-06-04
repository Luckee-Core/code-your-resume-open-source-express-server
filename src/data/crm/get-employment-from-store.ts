import type { Employment } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getEmploymentFromSupabase } from "./supabase/get-employment-from-supabase";

/**
 * Fetches one employment by id from Supabase CRM.
 */
export const getEmploymentFromStore = async (id: string): Promise<Employment | null> => {
  return getEmploymentFromSupabase(requireCrmSupabaseClient(), id);
};
