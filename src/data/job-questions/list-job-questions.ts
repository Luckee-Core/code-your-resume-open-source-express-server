import type { Pool } from "pg";
import { JOB_QUESTION_SELECT_COLUMNS, type JobQuestion, type JobQuestionRow } from "./types";
import { mapJobQuestionRow } from "./map-job-question-row";
import { selectRowsFrom } from "../../utils/postgres";

/**
 * Lists all job questions (newest `updated_at` first).
 */
export const listJobQuestions = async (pool: Pool): Promise<JobQuestion[]> => {
  const rows = await selectRowsFrom<JobQuestionRow>(pool, "job_questions", {
    columns: JOB_QUESTION_SELECT_COLUMNS,
    order: [{ column: "updated_at", ascending: false }],
  });

  return rows.map((row) => mapJobQuestionRow(row));
};
