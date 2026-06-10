import { Router } from "express";
import { handleTeamConversationGenerate } from "./generate";

/**
 * Router factory for team-conversation generation API.
 *
 * Mounts under /api/data/team-conversation.
 */
export const createTeamConversationRouter = (): Router => {
  const router = Router();
  router.post("/generate", handleTeamConversationGenerate);
  return router;
};
