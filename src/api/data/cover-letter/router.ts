import { Router } from "express";
import { handleCoverLetterGenerate } from "./generate";

/**
 * Router factory for cover letter generation API.
 *
 * Mounts under /api/data/cover-letter.
 */
export const createCoverLetterRouter = (): Router => {
  const router = Router();
  router.post("/generate", handleCoverLetterGenerate);
  return router;
};
