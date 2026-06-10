/**
 * Detect PostgREST errors when a column is absent from the Supabase schema cache.
 *
 * @param message - Error message from Supabase client
 */
export const isMissingSchemaColumnError = (message: string): boolean =>
  message.includes('schema cache') ||
  (message.includes('Could not find') && message.includes('column'));
