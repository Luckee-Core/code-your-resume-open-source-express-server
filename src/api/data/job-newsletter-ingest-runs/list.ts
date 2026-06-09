import type { Request, Response } from 'express';
import { requireCrmSupabaseClient } from '../../../data/crm/require-crm-supabase-client';
import { listJobNewsletterIngestRunsBySourceId } from '../../../data/job-newsletter-ingest-runs';

/**
 * GET /api/data/job-newsletter-ingest-runs/list?sourceId=
 */
export const handleJobNewsletterIngestRunsList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/job-newsletter-ingest-runs/list');
  try {
    const sourceId = typeof req.query.sourceId === 'string' ? req.query.sourceId.trim() : '';
    if (!sourceId) {
      res.status(400).json({ success: false, error: 'sourceId is required' });
      return;
    }

    const limitRaw = typeof req.query.limit === 'string' ? Number(req.query.limit) : 50;
    const limit = Number.isFinite(limitRaw) ? limitRaw : 50;
    const data = await listJobNewsletterIngestRunsBySourceId(
      requireCrmSupabaseClient(),
      sourceId,
      limit,
    );

    console.log('📤 200 GET /api/data/job-newsletter-ingest-runs/list');
    res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to list ingest runs';
    console.error('❌ handleJobNewsletterIngestRunsList:', msg);
    res.status(500).json({ success: false, error: msg });
  }
};
