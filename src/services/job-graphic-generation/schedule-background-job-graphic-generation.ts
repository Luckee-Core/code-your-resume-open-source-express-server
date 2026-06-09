/**
 * Runs a long-running generation + persistence task without blocking the HTTP response.
 *
 * @param label - Log label (e.g. endpoint + job id)
 * @param work - Async pipeline (Cursor agent, persist graphic, etc.)
 */
export const scheduleBackgroundJobGraphicGeneration = (
  label: string,
  work: () => Promise<void>,
): void => {
  void work().catch((error: unknown) => {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`❌ ${label} background generation failed:`, msg);
  });
};
