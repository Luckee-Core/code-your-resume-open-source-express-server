import type { JobApplication } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getJobApplicationFromSupabase } from "./supabase/get-job-application-from-supabase";

/**
 * Updates an existing job application row in Supabase CRM.
 */
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
