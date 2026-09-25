import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import type { JobQuestion } from "./types";
import { getJobQuestion } from "./get-job-question";
import { insertRow } from "../../utils/postgres";

/**
 * Inserts a standalone job question row.
 */
export const insertJobQuestion = async (
  pool: Pool,
  input: { prompt: string },
): Promise<JobQuestion> => {
  const id = randomUUID();
  const now = new Date().toISOString();
  const prompt = input.prompt.trim();
  if (!prompt) {
    throw new Error("prompt is required");
  }

  await insertRow(pool, "job_questions", {
    id,
    prompt,
    created_at: now,
    updated_at: now,
  });

  const row = await getJobQuestion(pool, id);
  if (!row) {
    throw new Error("Failed to load job question after insert");
  }
  return row;
};
