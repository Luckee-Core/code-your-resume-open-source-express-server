import { Router } from 'express';
import * as handlers from './routes';

/**
 * Professional Background API — education, credibility bio, voice/style notes, portfolio narrative.
 * Mount at /api/professional-background.
 */
export const createProfessionalBackgroundRouter = (): Router => {
  const router = Router();

  router.get('/', handlers.getProfessionalBackgroundHandler);
  router.patch('/', handlers.patchProfessionalBackgroundHandler);

  return router;
};
