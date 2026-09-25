/**
 * True when a pg error is a foreign-key constraint violation (SQLSTATE 23503).
 */
export const isForeignKeyViolation = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;
  return (error as { code?: string }).code === "23503";
};
