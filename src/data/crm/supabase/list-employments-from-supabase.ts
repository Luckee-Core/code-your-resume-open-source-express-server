import type { SupabaseClient } from "@supabase/supabase-js";
import type { Employment } from "../types";
import { mapEmploymentRow } from "./map-employment-row";

/**
 * Lists all employments from Supabase `employments`.
 */
export const listEmploymentsFromSupabase = async (supabase: SupabaseClient): Promise<Employment[]> => {
  const { data, error } = await supabase
    .from("employments")
    .select("id, company_id, job_id, start_date, end_date, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("❌ listEmploymentsFromSupabase:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapEmploymentRow(row));
};
