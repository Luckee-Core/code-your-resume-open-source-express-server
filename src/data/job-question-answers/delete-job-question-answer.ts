import type { Pool } from "pg";
import { deleteRows } from "../../utils/postgres";

/**
 * Deletes a job question answer (unlink question from job).
 */
export const deleteJobQuestionAnswer = async (
  pool: Pool,
  id: string,
): Promise<boolean> => {
  const count = await deleteRows(pool, "job_question_answers", { id });
  return count > 0;
};
