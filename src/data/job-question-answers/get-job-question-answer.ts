import type { Pool } from "pg";
import {
  JOB_QUESTION_ANSWER_SELECT_COLUMNS,
  type JobQuestionAnswer,
  type JobQuestionAnswerRow,
} from "./types";
import { mapJobQuestionAnswerRow } from "./map-job-question-answer-row";
import { selectOneFrom } from "../../utils/postgres";

/**
 * Fetches one job question answer by id.
 */
export const getJobQuestionAnswer = async (
  pool: Pool,
  id: string,
): Promise<JobQuestionAnswer | null> => {
  const data = await selectOneFrom<JobQuestionAnswerRow>(pool, "job_question_answers", {
    columns: JOB_QUESTION_ANSWER_SELECT_COLUMNS,
    eq: { id },
  });

  return data ? mapJobQuestionAnswerRow(data) : null;
};
