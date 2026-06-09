import { Router } from 'express';
import { handleJobNewsletterIngestAiCostsList } from './list';

/**
 * Job newsletter ingest AI costs under `/api/data/job-newsletter-ingest-ai-costs`.
 */
export const createJobNewsletterIngestAiCostsRouter = (): Router => {
  const router = Router();
  router.get('/list', handleJobNewsletterIngestAiCostsList);
  return router;
};
