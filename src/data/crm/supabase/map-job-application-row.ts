import type { JobApplication } from "../types";
import { toIsoTimestampString } from "../../../utils/crm/to-iso-timestamp-string";

type JobApplicationRow = {
  id: string;
  job_id: string;
  submitted_at: string;
  image_graphic_id: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Maps a Supabase `job_applications` row to the CRM `JobApplication` type.
 */
export const mapJobApplicationRow = (row: JobApplicationRow): JobApplication => {
  return {
    id: row.id,
    jobId: row.job_id,
    submittedAt: toIsoTimestampString(row.submitted_at),
    imageGraphicId: row.image_graphic_id,
    notes: row.notes ?? "",
    createdAt: toIsoTimestampString(row.created_at),
    updatedAt: toIsoTimestampString(row.updated_at),
  };
};
