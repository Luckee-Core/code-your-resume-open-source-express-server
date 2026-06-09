import type { Request, Response } from 'express';
import { requireCrmSupabaseClient } from '../../../data/crm/require-crm-supabase-client';
import { processListRegistryExchanges } from '../../../services/exchange-registry';

/**
 * GET /api/data/job-newsletter-ingest-ai-costs/list?sourceId=
 * Newsletter-scoped view of registry-backed AI exchange costs.
 */
export const handleJobNewsletterIngestAiCostsList = async (
  req: Request,
  res: Response,
): Promise<void> => {
  console.log('📥 GET /api/data/job-newsletter-ingest-ai-costs/list');
  try {
    const sourceId = typeof req.query.sourceId === 'string' ? req.query.sourceId.trim() : '';
    if (!sourceId) {
      res.status(400).json({ success: false, error: 'sourceId is required' });
      return;
    }

    const limitRaw = typeof req.query.limit === 'string' ? Number(req.query.limit) : 100;
    const limit = Number.isFinite(limitRaw) ? limitRaw : 100;

    const result = await processListRegistryExchanges(requireCrmSupabaseClient(), {
      limit,
      sourceId,
    });

    if ('error' in result) {
      res.status(500).json({ success: false, error: result.error });
      return;
    }

    const rows = result.rows
      .filter((row) => row.logicalKey === 'job_newsletter_ingest')
      .map((row) => ({
        exchangeId: row.exchangeId,
        status: row.status,
        modelUsed: row.modelUsed,
        inputTokens: row.inputTokens,
        outputTokens: row.outputTokens,
        estimatedCostUsd: row.estimatedCostUsd,
        occurredAt: row.occurredAt,
        contextLabel: row.contextLabel,
        gmailMessageId: row.contextLabel,
        errorMessage: null,
      }));

    const totalEstimatedCostUsd = rows.reduce((sum, row) => sum + row.estimatedCostUsd, 0);

    console.log('📤 200 GET /api/data/job-newsletter-ingest-ai-costs/list');
    res.status(200).json({
      success: true,
      data: {
        rows,
        summary: { count: rows.length, totalEstimatedCostUsd },
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to list AI costs';
    console.error('❌ handleJobNewsletterIngestAiCostsList:', msg);
    res.status(500).json({ success: false, error: msg });
  }
};
