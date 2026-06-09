import type { Request, Response } from 'express';
import { processJobNewslettersFromEmailManager } from '../../../services/job-newsletter-ingest/process-from-email-manager';

type Body = {
  syncTaskId?: unknown;
  senderFilter?: unknown;
  senderEmail?: unknown;
};

/**
 * POST /api/job-newsletter-ingest/process-from-email-manager
 * Sync Gmail via email-manager, pull fetched emails, AI-parse, create CRM jobs.
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
    const senderRaw =
      typeof body.senderFilter === 'string' && body.senderFilter.trim()
        ? body.senderFilter
        : typeof body.senderEmail === 'string' && body.senderEmail.trim()
          ? body.senderEmail
          : undefined;
    const senderFilter = senderRaw?.trim();

    const data = await processJobNewslettersFromEmailManager({ syncTaskId, senderFilter });

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
