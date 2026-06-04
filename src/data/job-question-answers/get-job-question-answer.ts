import type { SupabaseClient } from "@supabase/supabase-js";
import {
  JOB_QUESTION_ANSWER_SELECT_COLUMNS,
  type JobQuestionAnswer,
  type JobQuestionAnswerRow,
} from "./types";
import { mapJobQuestionAnswerRow } from "./map-job-question-answer-row";

/**
 * Fetches one job question answer by id.
 */
export const getJobQuestionAnswer = async (
  supabase: SupabaseClient,
  id: string,
): Promise<JobQuestionAnswer | null> => {
  const { data, error } = await supabase
    .from("job_question_answers")
    .select(JOB_QUESTION_ANSWER_SELECT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("❌ getJobQuestionAnswer:", error.message);
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  return mapJobQuestionAnswerRow(data as JobQuestionAnswerRow);
};
