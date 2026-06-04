import type { Employment } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getEmploymentFromSupabase } from "./supabase/get-employment-from-supabase";

/**
 * Updates an existing employment row in Supabase CRM.
 */
export const updateEmploymentInStore = async (
  id: string,
  patch: Partial<Pick<Employment, "companyId" | "jobId" | "startDate" | "endDate">>,
): Promise<Employment | null> => {
  const supabase = requireCrmSupabaseClient();
  const prev = await getEmploymentFromSupabase(supabase, id);
  if (!prev) {
    return null;
  }

  const endDate = patch.endDate !== undefined ? patch.endDate.trim() : prev.endDate;
  const next: Employment = {
    ...prev,
    companyId: patch.companyId !== undefined ? patch.companyId.trim() : prev.companyId,
    jobId: patch.jobId !== undefined ? patch.jobId.trim() : prev.jobId,
    startDate: patch.startDate !== undefined ? patch.startDate.trim() : prev.startDate,
    endDate,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("employments")
    .update({
      company_id: next.companyId,
      job_id: next.jobId,
      start_date: next.startDate,
      end_date: next.endDate.trim() ? next.endDate : null,
      updated_at: next.updatedAt,
    })
    .eq("id", id);

  if (error) {
    console.error("❌ updateEmploymentInStore:", error.message);
    throw new Error(error.message);
  }

  return next;
};
