import { Router } from "express";
import { handleJobQuestionList } from "./list";
import { handleJobQuestionGet } from "./get";
import { handleJobQuestionCreate } from "./create";
import { handleJobQuestionUpdate } from "./update";
import { handleJobQuestionDelete } from "./delete";

/**
 * Job question catalog routes under `/api/data/job-questions`.
 */
export const createJobQuestionsRouter = (): Router => {
  const router = Router();
  router.get("/list", handleJobQuestionList);
  router.get("/get", handleJobQuestionGet);
  router.post("/create", handleJobQuestionCreate);
  router.patch("/update", handleJobQuestionUpdate);
  router.delete("/delete", handleJobQuestionDelete);
  return router;
};
