import type { Employee } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getEmployeeFromSupabase } from "./supabase/get-employee-from-supabase";

/**
 * Fetches one employee by id from Supabase CRM.
 */
export const getEmployeeFromStore = async (id: string): Promise<Employee | null> => {
  return getEmployeeFromSupabase(requireCrmSupabaseClient(), id);
};
