import { Router } from 'express';
import { handleJobNewsletterIngestAiPromptsList } from './list';

/**
 * Job newsletter ingest AI prompts under `/api/data/job-newsletter-ingest-ai-prompts`.
 */
export const createJobNewsletterIngestAiPromptsRouter = (): Router => {
  const router = Router();
  router.get('/list', handleJobNewsletterIngestAiPromptsList);
  return router;
};
