import { Router } from "express";
import { handleCompanyInterestGenerate } from "./generate";

/**
 * Router factory for company-interest generation API.
 *
 * Mounts under /api/data/company-interest.
 */
export const createCompanyInterestRouter = (): Router => {
  const router = Router();
  router.post("/generate", handleCompanyInterestGenerate);
  return router;
};
