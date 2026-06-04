import type { SupabaseClient } from "@supabase/supabase-js";
import { JOB_QUESTION_SELECT_COLUMNS, type JobQuestion, type JobQuestionRow } from "./types";
import { mapJobQuestionRow } from "./map-job-question-row";

/**
 * Fetches one job question by id.
 */
export const getJobQuestion = async (
  supabase: SupabaseClient,
  id: string,
): Promise<JobQuestion | null> => {
  const { data, error } = await supabase
    .from("job_questions")
    .select(JOB_QUESTION_SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("❌ getJobQuestion:", error.message);
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapJobQuestionRow(data as JobQuestionRow);
};
