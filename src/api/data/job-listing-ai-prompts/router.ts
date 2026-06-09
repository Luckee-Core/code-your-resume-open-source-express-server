import { Router } from 'express';
import { handleJobListingAiPromptsList } from './list';

/**
 * Job listing AI prompt routes.
 */
export const createJobListingAiPromptsRouter = (): Router => {
  const router = Router();
  router.get('/list', handleJobListingAiPromptsList);
  return router;
};
