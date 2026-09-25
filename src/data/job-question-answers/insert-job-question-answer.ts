import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import type { JobQuestionAnswer } from "./types";
import { getJobQuestionAnswer } from "./get-job-question-answer";
import { insertRow, isUniqueViolation } from "../../utils/postgres";

/**
 * Links a job to a question with an answer row.
 */
export const insertJobQuestionAnswer = async (
  pool: Pool,
  input: {
    jobId: string;
    jobQuestionId: string;
    answer: string;
    sortOrder?: number;
  },
): Promise<JobQuestionAnswer> => {
  const jobId = input.jobId.trim();
  const jobQuestionId = input.jobQuestionId.trim();
  if (!jobId || !jobQuestionId) {
    throw new Error("jobId and jobQuestionId are required");
  }

  const id = randomUUID();
  const now = new Date().toISOString();

  try {
    await insertRow(pool, "job_question_answers", {
      id,
      job_id: jobId,
      job_question_id: jobQuestionId,
      answer: input.answer.trim(),
      sort_order: input.sortOrder ?? 0,
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    console.error("❌ insertJobQuestionAnswer:", error);
    if (isUniqueViolation(error)) {
      throw new Error("This question is already linked to this job");
    }
    throw error;
  }

  const row = await getJobQuestionAnswer(pool, id);
  if (!row) {
    throw new Error("Failed to load job question answer after insert");
  }
  return row;
};
