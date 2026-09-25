import type { Pool } from 'pg';
import { isMissingTableError, selectRowsFrom } from '../../utils/postgres';
import type { ExchangeTableRegistryRow } from './types';

/**
 * Lists enabled exchange_table_registry rows for AI cost listing.
 */
export const listEnabledExchangeRegistryRows = async (
  pool: Pool,
): Promise<{ rows: ExchangeTableRegistryRow[] } | { error: string }> => {
  try {
    const data = await selectRowsFrom(pool, 'exchange_table_registry', {
      columns:
        'id, logical_key, table_name, occurred_at_column, input_tokens_column, output_tokens_column, model_column, enabled, sort_order, notes',
      eq: { enabled: true },
      order: [{ column: 'sort_order', ascending: true }],
    });

    return {
      rows: data.map((row) => ({
        id: String(row.id),
        logical_key: String(row.logical_key ?? ''),
        table_name: String(row.table_name ?? ''),
        occurred_at_column: String(row.occurred_at_column ?? 'created_at'),
        input_tokens_column: String(row.input_tokens_column ?? 'input_tokens'),
        output_tokens_column: String(row.output_tokens_column ?? 'output_tokens'),
        model_column: row.model_column == null ? null : String(row.model_column),
        enabled: Boolean(row.enabled),
        sort_order: typeof row.sort_order === 'number' ? row.sort_order : 0,
        notes: row.notes == null ? null : String(row.notes),
      })),
    };
  } catch (error) {
    const err = error as { code?: string; message?: string };
    if (isMissingTableError(err)) {
      console.warn('⚠️ exchange_table_registry table unavailable; returning [].');
      return { rows: [] };
    }
    return { error: err.message ?? String(error) };
  }
};
