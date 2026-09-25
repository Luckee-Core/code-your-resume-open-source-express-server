/**
 * Returns true when a pg error is a unique constraint violation.
 */
export const isUniqueViolation = (error: unknown, indexName?: string): boolean => {
  if (!error || typeof error !== "object") return false;
  const pgError = error as { code?: string; message?: string };
  if (pgError.code !== "23505") return false;
  if (!indexName) return true;
  return pgError.message?.includes(indexName) ?? false;
};
