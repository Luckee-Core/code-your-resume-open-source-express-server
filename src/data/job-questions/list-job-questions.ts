import type { SupabaseClient } from "@supabase/supabase-js";
import { JOB_QUESTION_SELECT_COLUMNS, type JobQuestion, type JobQuestionRow } from "./types";
import { mapJobQuestionRow } from "./map-job-question-row";

/**
 * Lists all job questions (newest `updated_at` first).
 */
export const listJobQuestions = async (supabase: SupabaseClient): Promise<JobQuestion[]> => {
  const { data, error } = await supabase
    .from("job_questions")
    .select(JOB_QUESTION_SELECT_COLUMNS)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("❌ listJobQuestions:", error.message);
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapJobQuestionRow(row as JobQuestionRow));
};
