import { Router } from "express";
import * as handlers from "./routes";

/**
 * Job Studio API — per-job coach chat ledger (Supabase).
 * Mount at /api/job-studio in the Express app.
 */
export const createJobStudioRouter = (): Router => {
  const router = Router();

  router.get("/", handlers.getJobStudioHandler);
  router.post("/messages", handlers.postJobStudioMessageHandler);

  return router;
};
