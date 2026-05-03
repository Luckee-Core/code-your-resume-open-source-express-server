import { Router } from 'express';
import * as handlers from './routes';

/**
 * Technical Skills Studio API — skill rows and coach chat.
 * Mount at /api/technical-skills in the Express app.
 */
export const createTechnicalSkillsRouter = (): Router => {
  const router = Router();

  router.get('/', handlers.getSkillsHandler);
  router.patch('/skills', handlers.patchSkillsHandler);
  router.post('/messages', handlers.postMessageHandler);
  router.post('/suggestions/:suggestionId/accept', handlers.acceptSkillSuggestionHandler);

  return router;
};
