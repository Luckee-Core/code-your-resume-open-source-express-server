/**
 * Aggregate row counts per job_id from a list of { job_id } records.
 */
export const countRowsByJobId = (
  rows: Array<{ job_id: string }>
): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const id = row.job_id;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
};
