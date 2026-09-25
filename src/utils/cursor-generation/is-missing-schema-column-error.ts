/**
 * Detect missing-column errors from Postgres (and leftover PostgREST schema-cache messages).
 *
 * @param message - Error message from Postgres or a client
 */
export const isMissingSchemaColumnError = (message: string): boolean =>
  message.includes('schema cache') ||
  (message.includes('Could not find') && message.includes('column')) ||
  (message.toLowerCase().includes('column') && message.includes('does not exist'));
