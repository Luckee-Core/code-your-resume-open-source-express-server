import { Router } from "express";
import { handleJobNiceToHavesList } from "./list";

/**
 * Factory for the `/api/data/job-nice-to-haves` sub-router.
 */
export const createJobNiceToHavesApiRouter = (): Router => {
  const router = Router();
  router.get("/list", handleJobNiceToHavesList);
  return router;
};
