import { randomUUID } from "node:crypto";
import type { Employment } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getEmploymentFromSupabase } from "./supabase/get-employment-from-supabase";
import { listEmploymentsFromSupabase } from "./supabase/list-employments-from-supabase";

export const listEmploymentsFromStore = async (): Promise<Employment[]> => {
  return listEmploymentsFromSupabase(requireCrmSupabaseClient());
};

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

export const getEmploymentFromStore = async (id: string): Promise<Employment | null> => {
  return getEmploymentFromSupabase(requireCrmSupabaseClient(), id);
};

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

export const deleteEmploymentFromStore = async (id: string): Promise<boolean> => {
  const supabase = requireCrmSupabaseClient();
  const { data, error } = await supabase.from("employments").delete().eq("id", id).select("id");

  if (error) {
    console.error("❌ deleteEmploymentFromStore:", error.message);
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
};
