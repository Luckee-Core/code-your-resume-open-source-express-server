import { Router } from 'express';
import * as handlers from './routes';

/**
 * Voice Style Studio — singleton tone/voice notes.
 * Mount at /api/voice-style.
 */
export const createVoiceStyleRouter = (): Router => {
  const router = Router();

  router.get('/', handlers.getVoiceStyleHandler);
  router.patch('/', handlers.patchVoiceStyleHandler);

  return router;
};
