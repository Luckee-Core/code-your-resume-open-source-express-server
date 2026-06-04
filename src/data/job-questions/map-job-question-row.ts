import { toIsoTimestampString } from "../../utils/crm/to-iso-timestamp-string";
import type { JobQuestion, JobQuestionRow } from "./types";

/**
 * Maps a Supabase `job_questions` row to `JobQuestion`.
 */
export const mapJobQuestionRow = (row: JobQuestionRow): JobQuestion => {
  return {
    id: row.id,
    prompt: row.prompt,
    createdAt: toIsoTimestampString(row.created_at),
    updatedAt: toIsoTimestampString(row.updated_at),
  };
};
