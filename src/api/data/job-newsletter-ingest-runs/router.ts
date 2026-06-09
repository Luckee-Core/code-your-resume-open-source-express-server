import { Router } from 'express';
import { handleJobNewsletterIngestRunsList } from './list';

/**
 * Job newsletter ingest run history under `/api/data/job-newsletter-ingest-runs`.
 */
export const createJobNewsletterIngestRunsRouter = (): Router => {
  const router = Router();
  router.get('/list', handleJobNewsletterIngestRunsList);
  return router;
};
