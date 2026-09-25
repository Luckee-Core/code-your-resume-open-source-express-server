import type { Pool } from "pg";
import {
  JOB_QUESTION_ANSWER_SELECT_COLUMNS,
  type JobQuestionAnswer,
  type JobQuestionAnswerRow,
} from "./types";
import { mapJobQuestionAnswerRow } from "./map-job-question-answer-row";
import { selectRowsFrom } from "../../utils/postgres";

/**
 * Lists job question answers for one job (by sort_order, then created_at).
 */
export const listJobQuestionAnswersByJobId = async (
  pool: Pool,
  jobId: string,
): Promise<JobQuestionAnswer[]> => {
  const rows = await selectRowsFrom<JobQuestionAnswerRow>(pool, "job_question_answers", {
    columns: JOB_QUESTION_ANSWER_SELECT_COLUMNS,
    eq: { job_id: jobId.trim() },
    order: [
      { column: "sort_order", ascending: true },
      { column: "created_at", ascending: true },
    ],
  });

  return rows.map((row) => mapJobQuestionAnswerRow(row));
};
