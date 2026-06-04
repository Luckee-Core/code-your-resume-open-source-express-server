import type { Employee } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { listEmployeesFromSupabase } from "./supabase/list-employees-from-supabase";

/**
 * Lists all employees from Supabase CRM.
 */
export const listEmployeesFromStore = async (): Promise<Employee[]> => {
  return listEmployeesFromSupabase(requireCrmSupabaseClient());
};
