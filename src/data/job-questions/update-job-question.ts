import type { Pool } from "pg";
import type { JobQuestion } from "./types";
import { getJobQuestion } from "./get-job-question";
import { updateRows } from "../../utils/postgres";

/**
 * Updates a job question prompt.
 */
export const updateJobQuestion = async (
  pool: Pool,
  id: string,
  patch: Partial<Pick<JobQuestion, "prompt">>,
): Promise<JobQuestion | null> => {
  const prev = await getJobQuestion(pool, id);
  if (!prev) {
    return null;
  }

  const prompt = patch.prompt !== undefined ? patch.prompt.trim() : prev.prompt;
  if (!prompt) {
    throw new Error("prompt is required");
  }

  const updatedAt = new Date().toISOString();
  await updateRows(pool, "job_questions", { prompt, updated_at: updatedAt }, { id });

  return getJobQuestion(pool, id);
};
