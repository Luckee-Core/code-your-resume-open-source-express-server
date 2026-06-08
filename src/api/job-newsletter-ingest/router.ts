import { Router } from 'express';
import { handleJobNewsletterIngest } from './routes/ingest';

/**
 * Job newsletter ingest routes (forwarded from email-manager).
 */
export const createJobNewsletterIngestRouter = (): Router => {
  const router = Router();
  router.post('/ingest', handleJobNewsletterIngest);
  return router;
};
