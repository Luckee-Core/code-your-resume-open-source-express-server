import { randomUUID } from "node:crypto";
import type { Employment } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getEmploymentFromSupabase } from "./supabase/get-employment-from-supabase";

/**
 * Inserts a new employment row in Supabase CRM.
 */
export const createEmploymentInStore = async (input: {
  companyId: string;
  jobId: string;
  startDate: string;
  endDate: string;
}): Promise<Employment> => {
  const supabase = requireCrmSupabaseClient();
  const id = randomUUID();
  const now = new Date().toISOString();
  const endDate = input.endDate.trim();

  const { error } = await supabase.from("employments").insert({
    id,
    company_id: input.companyId.trim(),
    job_id: input.jobId.trim(),
    start_date: input.startDate.trim(),
    end_date: endDate ? endDate : null,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error("❌ createEmploymentInStore:", error.message);
    throw new Error(error.message);
  }

  const row = await getEmploymentFromSupabase(supabase, id);
  if (!row) {
    throw new Error("Failed to load employment after insert");
  }
  return row;
};
