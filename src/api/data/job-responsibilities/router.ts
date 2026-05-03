import { Router } from "express";
import { handleJobResponsibilitiesList } from "./list";

/**
 * Factory for the `/api/data/job-responsibilities` sub-router.
 */
export const createJobResponsibilitiesApiRouter = (): Router => {
  const router = Router();
  router.get("/list", handleJobResponsibilitiesList);
  return router;
};
