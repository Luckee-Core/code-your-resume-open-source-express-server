/**
 * True when PostgREST reports a table missing from the schema cache.
 */
export const isMissingTableError = (error: { code?: string; message?: string }): boolean => {
  if (error.code === 'PGRST205') return true;
  const msg = error.message ?? '';
  return msg.includes('schema cache') || msg.includes('Could not find the table');
};
