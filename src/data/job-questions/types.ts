export type JobQuestion = {
  id: string;
  prompt: string;
  createdAt: string;
  updatedAt: string;
};

export type JobQuestionRow = {
  id: string;
  prompt: string;
  created_at: string;
  updated_at: string;
};

export const JOB_QUESTION_SELECT_COLUMNS = "id, prompt, created_at, updated_at";
