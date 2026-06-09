import type { Request, Response } from 'express';
import { requireCrmSupabaseClient } from '../../../data/crm/require-crm-supabase-client';
import { listJobNewsletterIngestAiPrompts } from '../../../data/job-newsletter-ingest-ai-prompt';

/**
 * GET /api/data/job-newsletter-ingest-ai-prompts/list
 */
export const handleJobNewsletterIngestAiPromptsList = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/job-newsletter-ingest-ai-prompts/list');
  try {
    const data = await listJobNewsletterIngestAiPrompts(requireCrmSupabaseClient());
    console.log('📤 200 GET /api/data/job-newsletter-ingest-ai-prompts/list');
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to list AI prompts';
    console.error('❌ handleJobNewsletterIngestAiPromptsList:', msg);
    res.status(500).json({ success: false, error: msg });
  }
};
