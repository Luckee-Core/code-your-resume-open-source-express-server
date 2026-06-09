import { Router } from 'express';
import { handleJobNewsletterIngest } from './routes/ingest';
import { handleProcessFromEmailManager } from './routes/process-from-email-manager';

/**
 * Job newsletter ingest — AI parse emails into CRM jobs.
 */
export const createJobNewsletterIngestRouter = (): Router => {
  const router = Router();
  router.post('/process-from-email-manager', handleProcessFromEmailManager);
  router.post('/ingest', handleJobNewsletterIngest);
  return router;
};
