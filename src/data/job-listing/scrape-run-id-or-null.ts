/**
 * Returns a trimmed scrape-run id, or null when empty.
 */
export const scrapeRunIdOrNull = (id: string | null): string | null =>
  id && id.trim() ? id.trim() : null;
