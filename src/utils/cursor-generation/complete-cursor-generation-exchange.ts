import type { SupabaseClient } from '@supabase/supabase-js';
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

/**
 * Mark a Cursor generation exchange completed. Writes token usage when columns exist;
 * falls back to status + response_id when `input_tokens` migration has not been applied.
 *
 * @param supabase - Supabase service-role client
 * @param input - Exchange table and completion fields
 */
export const completeCursorGenerationExchange = async (
  supabase: SupabaseClient,
  input: CompleteCursorGenerationExchangeInput,
): Promise<void> => {
  const updatedAt = new Date().toISOString();
  const { error } = await supabase
    .from(input.tableName)
    .update({
      response_id: input.responseId,
      input_tokens: input.inputTokens,
      output_tokens: input.outputTokens,
      model_used: input.modelUsed,
      status: 'completed',
      updated_at: updatedAt,
    })
    .eq('id', input.id);

  if (!error) {
    return;
  }

  if (isMissingSchemaColumnError(error.message)) {
    const { error: retryError } = await supabase
      .from(input.tableName)
      .update({
        response_id: input.responseId,
        status: 'completed',
        updated_at: updatedAt,
      })
      .eq('id', input.id);

    if (retryError) {
      console.error(`❌ ${input.logLabel}:`, retryError.message);
      throw new Error(`Failed to update exchange record: ${retryError.message}`);
    }

    console.warn(
      `⚠️ ${input.logLabel}: token columns missing on ${input.tableName} — run docs/supabase-exchange-registry-update.sql`,
    );
    return;
  }

  console.error(`❌ ${input.logLabel}:`, error.message);
  throw new Error(`Failed to update exchange record: ${error.message}`);
};
