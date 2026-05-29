import type { SupabaseClient } from "@supabase/supabase-js";
import type { Employee } from "../types";
import { mapEmployeeRow } from "./map-employee-row";

/**
 * Lists all employees from Supabase `employees`.
 */
export const listEmployeesFromSupabase = async (supabase: SupabaseClient): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from("employees")
    .select("id, company_id, name, role, email, linkedin_url, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("❌ listEmployeesFromSupabase:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapEmployeeRow(row));
};
