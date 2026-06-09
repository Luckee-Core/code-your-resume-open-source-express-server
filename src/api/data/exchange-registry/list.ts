import type { Request, Response } from 'express';
import { requireCrmSupabaseClient } from '../../../data/crm/require-crm-supabase-client';
import { processListRegistryExchanges } from '../../../services/exchange-registry';

/**
 * GET /api/data/exchange-registry/list?limit=&sourceId=&jobId=
 */
export const handleExchangeRegistryList = async (req: Request, res: Response): Promise<void> => {
  console.log('📥 GET /api/data/exchange-registry/list');
  try {
    const limitRaw = typeof req.query.limit === 'string' ? Number(req.query.limit) : 100;
    const limit = Number.isFinite(limitRaw) ? limitRaw : 100;
    const sourceId = typeof req.query.sourceId === 'string' ? req.query.sourceId.trim() : undefined;
    const jobId = typeof req.query.jobId === 'string' ? req.query.jobId.trim() : undefined;

    const result = await processListRegistryExchanges(requireCrmSupabaseClient(), {
      limit,
      sourceId: sourceId || undefined,
      jobId: jobId || undefined,
    });

    if ('error' in result) {
      res.status(500).json({ success: false, error: result.error });
      return;
    }

    console.log('📤 200 GET /api/data/exchange-registry/list');
    res.status(200).json({ success: true, data: result });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to list registry exchanges';
    console.error('❌ handleExchangeRegistryList:', msg);
    res.status(500).json({ success: false, error: msg });
  }
};
