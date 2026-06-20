import { Router } from "express";
import { handleIdealCandidateGenerate } from "./generate";

/**
 * Router factory for ideal-candidate generation API.
 *
 * Mounts under /api/data/ideal-candidate.
 */
export const createIdealCandidateRouter = (): Router => {
  const router = Router();
  router.post("/generate", handleIdealCandidateGenerate);
  return router;
};
