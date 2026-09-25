import type { Pool } from 'pg';
import { assertSafeIdent, updateRows } from '../postgres';
import { isMissingSchemaColumnError } from './is-missing-schema-column-error';

export type CompleteCursorGenerationExchangeInput = {
  tableName: string;
  id: string;
  responseId: string;
  inputTokens: number;
  outputTokens: number;
  modelUsed: string;
  logLabel: string;
};

const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

/**
 * Mark a Cursor generation exchange completed. Writes token usage when columns exist;
 * falls back to status + response_id when `input_tokens` migration has not been applied.
 *
 * @param pool - Postgres pool
 * @param input - Exchange table and completion fields
 */
export const completeCursorGenerationExchange = async (
  pool: Pool,
  input: CompleteCursorGenerationExchangeInput,
): Promise<void> => {
  const tableName = assertSafeIdent(input.tableName);
  const updatedAt = new Date().toISOString();

  try {
    await updateRows(
      pool,
      tableName,
      {
        response_id: input.responseId,
        input_tokens: input.inputTokens,
        output_tokens: input.outputTokens,
        model_used: input.modelUsed,
        status: 'completed',
        updated_at: updatedAt,
      },
      { id: input.id },
    );
    return;
  } catch (error: unknown) {
    const message = errorMessage(error);
    if (!isMissingSchemaColumnError(message)) {
      console.error(`❌ ${input.logLabel}:`, message);
      throw new Error(`Failed to update exchange record: ${message}`);
    }
  }

  try {
    await updateRows(
      pool,
      tableName,
      {
        response_id: input.responseId,
        status: 'completed',
        updated_at: updatedAt,
      },
      { id: input.id },
    );
  } catch (retryError: unknown) {
    const retryMessage = errorMessage(retryError);
    console.error(`❌ ${input.logLabel}:`, retryMessage);
    throw new Error(`Failed to update exchange record: ${retryMessage}`);
  }

  console.warn(
    `⚠️ ${input.logLabel}: token columns missing on ${tableName} — run docs/supabase-exchange-registry-update.sql`,
  );
};
