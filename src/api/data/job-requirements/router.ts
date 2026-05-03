import { Router } from "express";
import { handleJobRequirementsList } from "./list";

/**
 * Factory for the `/api/data/job-requirements` sub-router.
 */
export const createJobRequirementsApiRouter = (): Router => {
  const router = Router();
  router.get("/list", handleJobRequirementsList);
  return router;
};
