import type { SupabaseClient } from "@supabase/supabase-js";
import type { Employment } from "../types";
import { mapEmploymentRow } from "./map-employment-row";

/**
 * Loads one employment by id from Supabase.
 */
export const getEmploymentFromSupabase = async (
  supabase: SupabaseClient,
  id: string,
): Promise<Employment | null> => {
  const { data, error } = await supabase
    .from("employments")
    .select("id, company_id, job_id, start_date, end_date, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("❌ getEmploymentFromSupabase:", error.message);
    throw new Error(error.message);
  }

  return data ? mapEmploymentRow(data) : null;
};
