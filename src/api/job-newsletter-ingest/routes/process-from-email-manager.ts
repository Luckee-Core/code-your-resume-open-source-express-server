import type { Request, Response } from 'express';
import { processJobNewslettersFromEmailManager } from '../../../services/job-newsletter-ingest/process-from-email-manager';

type Body = {
  syncTaskId?: unknown;
};

/**
 * POST /api/job-newsletter-ingest/process-from-email-manager
 * Pull fetched emails from email-manager, AI-parse, create CRM jobs.
 */
export const handleProcessFromEmailManager = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log('📥 POST /api/job-newsletter-ingest/process-from-email-manager');

    const body = (req.body ?? {}) as Body;
    const syncTaskId =
      typeof body.syncTaskId === 'string' && body.syncTaskId.trim()
        ? body.syncTaskId.trim()
        : undefined;

    const data = await processJobNewslettersFromEmailManager({ syncTaskId });

    console.log('📤 POST /api/job-newsletter-ingest/process-from-email-manager');
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('❌ POST /api/job-newsletter-ingest/process-from-email-manager:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process emails from email-manager',
    });
  }
};
