export type JobListingScrapeRunStatus = "pending" | "completed" | "failed";

export type JobListingScrapeRun = {
  id: string;
  jobId: string;
  sourceUrl: string;
  status: JobListingScrapeRunStatus;
  httpStatus: number | null;
  plainText: string;
  error: string;
  startedAt: string;
  completedAt: string;
};

export type JobListingAiRequest = {
  id: string;
  jobId: string;
  scrapeRunId: string | null;
  provider: string;
  model: string;
  systemPrompt: string;
  userMessage: string;
  requestPayloadJson: Record<string, unknown>;
  createdAt: string;
};

export type JobListingAiResponseStatus = "success" | "error";

export type JobListingAiResponse = {
  id: string;
  requestId: string;
  model: string;
  status: JobListingAiResponseStatus;
  rawResponse: string;
  parsedResponseJson: Record<string, unknown> | null;
  errorMessage: string;
  usageInputTokens: number | null;
  usageOutputTokens: number | null;
  createdAt: string;
};

export type JobListingAiExchange = {
  id: string;
  jobId: string;
  scrapeRunId: string | null;
  requestId: string;
  responseId: string;
  createdAt: string;
};

/**
 * One bullet line for optional Supabase `job_*` mirror rows, built from the Anthropic sections
 * response (same `exchangeId` as `job_listing_ai_exchanges` for that pass). Canonical sections
 * payload is `parsed_response_json` on `job_listing_ai_responses` in Supabase.
 */
export type JobListingStructuredBulletRow = {
  id: string;
  jobId: string;
  scrapeRunId: string;
  exchangeId: string;
  body: string;
  sortOrder: number;
  createdAt: string;
};
