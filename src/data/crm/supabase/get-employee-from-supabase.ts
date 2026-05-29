import type { SupabaseClient } from "@supabase/supabase-js";
import type { Employee } from "../types";
import { mapEmployeeRow } from "./map-employee-row";

/**
 * Loads one employee by id from Supabase.
 */
export const getEmployeeFromSupabase = async (
  supabase: SupabaseClient,
  id: string,
): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from("employees")
    .select("id, company_id, name, role, email, linkedin_url, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("❌ getEmployeeFromSupabase:", error.message);
    throw new Error(error.message);
  }

  return data ? mapEmployeeRow(data) : null;
};
