import { toIsoTimestampString } from "../../utils/crm/to-iso-timestamp-string";
import type { JobQuestionAnswer, JobQuestionAnswerRow } from "./types";

/**
 * Maps a Supabase `job_question_answers` row to `JobQuestionAnswer`.
 */
export const mapJobQuestionAnswerRow = (row: JobQuestionAnswerRow): JobQuestionAnswer => {
  return {
    id: row.id,
    jobId: row.job_id,
    jobQuestionId: row.job_question_id,
    answer: row.answer ?? "",
    sortOrder: row.sort_order,
    createdAt: toIsoTimestampString(row.created_at),
    updatedAt: toIsoTimestampString(row.updated_at),
  };
};
