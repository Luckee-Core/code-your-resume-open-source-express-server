import type { Employment } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { listEmploymentsFromSupabase } from "./supabase/list-employments-from-supabase";

/**
 * Lists all employments from Supabase CRM.
 */
export const listEmploymentsFromStore = async (): Promise<Employment[]> => {
  return listEmploymentsFromSupabase(requireCrmSupabaseClient());
};
