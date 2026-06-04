import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { JobQuestionAnswer } from "./types";
import { getJobQuestionAnswer } from "./get-job-question-answer";

/**
 * Links a job to a question with an answer row.
 */
export const insertJobQuestionAnswer = async (
  supabase: SupabaseClient,
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

  const { error } = await supabase.from("job_question_answers").insert({
    id,
    job_id: jobId,
    job_question_id: jobQuestionId,
    answer: input.answer.trim(),
    sort_order: input.sortOrder ?? 0,
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error("❌ insertJobQuestionAnswer:", error.message);
    if (error.code === "23505") {
      throw new Error("This question is already linked to this job");
    }
    throw new Error(error.message);
  }

  const row = await getJobQuestionAnswer(supabase, id);
  if (!row) {
    throw new Error("Failed to load job question answer after insert");
  }
  return row;
};
