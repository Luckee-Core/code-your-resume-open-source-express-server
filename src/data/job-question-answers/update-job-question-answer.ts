import type { Pool } from "pg";
import type { JobQuestionAnswer } from "./types";
import { getJobQuestionAnswer } from "./get-job-question-answer";
import { updateRows } from "../../utils/postgres";

/**
 * Updates a job question answer row.
 */
export const updateJobQuestionAnswer = async (
  pool: Pool,
  id: string,
  patch: Partial<Pick<JobQuestionAnswer, "answer" | "sortOrder">>,
): Promise<JobQuestionAnswer | null> => {
  const prev = await getJobQuestionAnswer(pool, id);
  if (!prev) {
    return null;
  }

  const answer = patch.answer !== undefined ? patch.answer.trim() : prev.answer;
  const sortOrder = patch.sortOrder !== undefined ? patch.sortOrder : prev.sortOrder;
  const updatedAt = new Date().toISOString();

  await updateRows(
    pool,
    "job_question_answers",
    {
      answer,
      sort_order: sortOrder,
      updated_at: updatedAt,
    },
    { id },
  );

  return getJobQuestionAnswer(pool, id);
};
