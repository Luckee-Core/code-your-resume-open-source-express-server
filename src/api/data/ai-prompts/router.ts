import { Router } from 'express';
import { handleAiPromptsList } from './list';

/**
 * Aggregated AI prompts routes across CRM AI flows.
 */
export const createAiPromptsRouter = (): Router => {
  const router = Router();
  router.get('/list', handleAiPromptsList);
  return router;
};
