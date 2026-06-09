/**
 * Estimates USD cost from token counts using Haiku pricing.
 */
export const estimateAnthropicCostUsd = (
  inputTokens: number | null,
  outputTokens: number | null,
  _modelUsed: string | null,
): number => {
  const input = typeof inputTokens === 'number' ? inputTokens : 0;
  const output = typeof outputTokens === 'number' ? outputTokens : 0;
  return (input / 1_000_000) * 1 + (output / 1_000_000) * 5;
};
