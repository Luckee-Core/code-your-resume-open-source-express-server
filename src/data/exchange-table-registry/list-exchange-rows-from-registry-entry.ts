import type { SupabaseClient } from '@supabase/supabase-js';
import type { ExchangeTableRegistryRow } from './types';
import { listJobListingRegistryExchangeRows } from './list-job-listing-registry-exchange-rows';

export type RegistryExchangeSourceRow = {
  exchange_id: string;
  status: string;
  input_tokens: number | null;
  output_tokens: number | null;
  model_used: string | null;
  occurred_at: string;
  job_id: string | null;
  source_id: string | null;
  context_label: string | null;
  profile_id: string | null;
};

export type ListRegistryExchangeRowsFilters = {
  sourceId?: string;
  jobId?: string;
};

const OPTIONAL_COLUMNS: Partial<Record<string, string[]>> = {
  job_newsletter_ingest: ['source_id', 'context_label'],
  job_studio: ['job_id'],
  cover_letter_generation: ['job_id'],
  company_interest_generation: ['job_id'],
  team_conversation_generation: ['job_id'],
  skills_component_generation: ['job_id'],
  user_background_studio: ['profile_id'],
};

const isSafeColumnName = (name: string): boolean => /^[a-z_][a-z0-9_]*$/i.test(name);

const asInt = (value: unknown): number | null =>
  typeof value === 'number' && Number.isFinite(value) ? value : null;

const asString = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

/**
 * Reads exchange rows for one registry entry using registry column metadata (tokens + model on exchange).
 */
export const listExchangeRowsFromRegistryEntry = async (
  supabase: SupabaseClient,
  entry: ExchangeTableRegistryRow,
  limit: number,
  filters: ListRegistryExchangeRowsFilters = {},
): Promise<{ rows: RegistryExchangeSourceRow[] } | { error: string }> => {
  const lim = Math.min(Math.max(limit, 1), 200);

  if (entry.logical_key === 'job_listing') {
    return listJobListingRegistryExchangeRows(supabase, lim, filters.jobId);
  }

  const columnSet = new Set<string>(['id', 'status']);
  const registryColumns = [
    entry.occurred_at_column,
    entry.input_tokens_column,
    entry.output_tokens_column,
    entry.model_column,
    ...(OPTIONAL_COLUMNS[entry.logical_key] ?? []),
  ];

  for (const column of registryColumns) {
    if (column && isSafeColumnName(column)) {
      columnSet.add(column);
    }
  }

  let query = supabase
    .from(entry.table_name)
    .select([...columnSet].join(', '))
    .order(entry.occurred_at_column, { ascending: false })
    .limit(lim);

  if (filters.jobId?.trim() && columnSet.has('job_id')) {
    query = query.eq('job_id', filters.jobId.trim());
  }
  if (filters.sourceId?.trim() && columnSet.has('source_id')) {
    query = query.eq('source_id', filters.sourceId.trim());
  }

  const { data, error } = await query;
  if (error) return { error: error.message };

  const rows = (data ?? []).map((raw) => {
    const row = raw as unknown as Record<string, unknown>;

    return {
      exchange_id: String(row.id),
      status: String(row.status ?? ''),
      input_tokens: asInt(row[entry.input_tokens_column]),
      output_tokens: asInt(row[entry.output_tokens_column]),
      model_used: entry.model_column ? asString(row[entry.model_column]) : null,
      occurred_at: String(row[entry.occurred_at_column] ?? ''),
      job_id: columnSet.has('job_id') ? asString(row.job_id) : null,
      source_id: columnSet.has('source_id') ? asString(row.source_id) : null,
      context_label: columnSet.has('context_label') ? asString(row.context_label) : null,
      profile_id: columnSet.has('profile_id') ? asString(row.profile_id) : null,
    };
  });

  return { rows };
};
