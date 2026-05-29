import { randomUUID } from "node:crypto";
import type { JobApplication } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getJobApplicationFromSupabase } from "./supabase/get-job-application-from-supabase";
import { listJobApplicationsFromSupabase } from "./supabase/list-job-applications-from-supabase";

export const listJobApplicationsFromStore = async (): Promise<JobApplication[]> => {
  return listJobApplicationsFromSupabase(requireCrmSupabaseClient());
};

export const createJobApplicationInStore = async (input: {
  jobId: string;
  submittedAt: string;
  imageGraphicId: string;
  notes: string;
}): Promise<JobApplication> => {
  const supabase = requireCrmSupabaseClient();
  const id = randomUUID();
  const now = new Date().toISOString();
  const submittedAt = input.submittedAt.trim() ? input.submittedAt : now;

  const { error } = await supabase.from("job_applications").insert({
    id,
    job_id: input.jobId,
    submitted_at: submittedAt,
    image_graphic_id: input.imageGraphicId.trim(),
    notes: input.notes.trim(),
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error("❌ createJobApplicationInStore:", error.message);
    throw new Error(error.message);
  }

  const row = await getJobApplicationFromSupabase(supabase, id);
  if (!row) {
    throw new Error("Failed to load job application after insert");
  }
  return row;
};

export const getJobApplicationFromStore = async (id: string): Promise<JobApplication | null> => {
  return getJobApplicationFromSupabase(requireCrmSupabaseClient(), id);
};

export const updateJobApplicationInStore = async (
  id: string,
  patch: Partial<Pick<JobApplication, "jobId" | "submittedAt" | "imageGraphicId" | "notes">>,
): Promise<JobApplication | null> => {
  const supabase = requireCrmSupabaseClient();
  const prev = await getJobApplicationFromSupabase(supabase, id);
  if (!prev) {
    return null;
  }

  const next: JobApplication = {
    ...prev,
    jobId: patch.jobId !== undefined ? patch.jobId : prev.jobId,
    submittedAt: patch.submittedAt !== undefined ? patch.submittedAt : prev.submittedAt,
    imageGraphicId: patch.imageGraphicId !== undefined ? patch.imageGraphicId.trim() : prev.imageGraphicId,
    notes: patch.notes !== undefined ? patch.notes.trim() : prev.notes,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("job_applications")
    .update({
      job_id: next.jobId,
      submitted_at: next.submittedAt,
      image_graphic_id: next.imageGraphicId,
      notes: next.notes,
      updated_at: next.updatedAt,
    })
    .eq("id", id);

  if (error) {
    console.error("❌ updateJobApplicationInStore:", error.message);
    throw new Error(error.message);
  }

  return next;
};

export const deleteJobApplicationFromStore = async (id: string): Promise<boolean> => {
  const supabase = requireCrmSupabaseClient();
  const { data, error } = await supabase.from("job_applications").delete().eq("id", id).select("id");

  if (error) {
    console.error("❌ deleteJobApplicationFromStore:", error.message);
    throw new Error(error.message);
  }

  return (data?.length ?? 0) > 0;
};
