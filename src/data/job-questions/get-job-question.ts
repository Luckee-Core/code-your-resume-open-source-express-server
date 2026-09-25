import type { Pool } from "pg";
import { JOB_QUESTION_SELECT_COLUMNS, type JobQuestion, type JobQuestionRow } from "./types";
import { mapJobQuestionRow } from "./map-job-question-row";
import { selectOneFrom } from "../../utils/postgres";

/**
 * Fetches one job question by id.
 */
export const getJobQuestion = async (
  pool: Pool,
  id: string,
): Promise<JobQuestion | null> => {
  const data = await selectOneFrom<JobQuestionRow>(pool, "job_questions", {
    columns: JOB_QUESTION_SELECT_COLUMNS,
    eq: { id },
  });

  return data ? mapJobQuestionRow(data) : null;
};
