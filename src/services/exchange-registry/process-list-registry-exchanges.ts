import type { SupabaseClient } from '@supabase/supabase-js';
import { CRM_AI_FLOW_PROMPT_FLOW_LABELS } from '../../constants/crm-ai-flow-prompt-flows';
import {
  enrichRegistryExchangeContextLabels,
  listEnabledExchangeRegistryRows,
  listExchangeRowsFromRegistryEntry,
} from '../../data/exchange-table-registry';
import { estimateAnthropicCostUsd } from '../../utils/ai/estimate-anthropic-cost-usd';
import type { ListRegistryExchangesInput, ListRegistryExchangesResult, ListedExchangeRow } from './types';

const FLOW_LABELS: Record<string, string> = {
  job_newsletter_ingest: 'Job newsletter ingest',
  job_listing: 'Job listing import',
  ...CRM_AI_FLOW_PROMPT_FLOW_LABELS,
};

/**
 * Lists exchanges from all enabled `exchange_table_registry` rows (tokens + model on exchange tables).
 */
export const processListRegistryExchanges = async (
  supabase: SupabaseClient,
  input: ListRegistryExchangesInput = {},
): Promise<ListRegistryExchangesResult | { error: string }> => {
  const limitRaw = typeof input.limit === 'number' ? input.limit : 100;
  const perSourceLimit = Math.min(Math.max(limitRaw, 1), 200);

  const registryResult = await listEnabledExchangeRegistryRows(supabase);
  if ('error' in registryResult) return { error: registryResult.error };

  if (registryResult.rows.length === 0) {
    console.warn('⚠️ exchange_table_registry has no enabled rows');
  }

  const merged: ListedExchangeRow[] = [];

  for (const entry of registryResult.rows) {
    const result = await listExchangeRowsFromRegistryEntry(supabase, entry, perSourceLimit, {
      sourceId: input.sourceId,
      jobId: input.jobId,
    });

    if ('error' in result) {
      console.warn(`⚠️ Registry source "${entry.logical_key}" skipped: ${result.error}`);
      continue;
    }

    if (result.rows.length === 0) continue;

    const contextLabels = await enrichRegistryExchangeContextLabels(supabase, result.rows);
    const flowLabel = FLOW_LABELS[entry.logical_key] ?? entry.logical_key;

    for (const row of result.rows) {
      merged.push({
        exchangeId: row.exchange_id,
        logicalKey: entry.logical_key,
        flowLabel,
        status: row.status,
        modelUsed: row.model_used,
        inputTokens: row.input_tokens,
        outputTokens: row.output_tokens,
        estimatedCostUsd: estimateAnthropicCostUsd(
          row.input_tokens,
          row.output_tokens,
          row.model_used,
        ),
        occurredAt: row.occurred_at,
        contextLabel: contextLabels.get(row.exchange_id) ?? flowLabel,
        sourceId: row.source_id,
        jobId: row.job_id,
      });
    }
  }

  merged.sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  const rows = merged.slice(0, perSourceLimit);
  const totalEstimatedCostUsd = rows.reduce((sum, row) => sum + row.estimatedCostUsd, 0);

  return {
    rows,
    summary: { count: rows.length, totalEstimatedCostUsd },
  };
};
