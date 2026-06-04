import { randomUUID } from "node:crypto";
import type { JobApplication } from "./types";
import { requireCrmSupabaseClient } from "./require-crm-supabase-client";
import { getJobApplicationFromSupabase } from "./supabase/get-job-application-from-supabase";

/**
 * Inserts a new job application row in Supabase CRM.
 */
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
