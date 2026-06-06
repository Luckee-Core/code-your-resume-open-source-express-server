import { Router } from "express";
import { handleSkillsComponentGenerate } from "./generate";

/**
 * Router factory for the skills component generation API.
 *
 * Mounts under /api/data/skills-component.
 */
export const createSkillsComponentRouter = (): Router => {
  const router = Router();
  router.post("/generate", handleSkillsComponentGenerate);
  return router;
};
