/** API row shape: one exchange ledger entry + computed USD estimate (not a DB table). */
export type ListedExchangeRow = {
  exchangeId: string;
  logicalKey: string;
  flowLabel: string;
  status: string;
  modelUsed: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  estimatedCostUsd: number;
  occurredAt: string;
  contextLabel: string;
  sourceId: string | null;
  jobId: string | null;
};

export type ListRegistryExchangesInput = {
  limit?: number;
  sourceId?: string;
  jobId?: string;
};

export type ListRegistryExchangesResult = {
  rows: ListedExchangeRow[];
  summary: { count: number; totalEstimatedCostUsd: number };
};
