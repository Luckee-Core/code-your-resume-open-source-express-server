import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  JobListingAiExchange,
  JobListingAiRequest,
  JobListingAiResponse,
} from "../../data/job-listing/types";
import { getSupabaseCrmMirrorClient } from "../supabase/get-supabase-crm-mirror-client";

const scrapeRunIdOrNull = (id: string | null): string | null =>
  id && id.trim() ? id.trim() : null;

const requireJobListingSupabaseClient = (): SupabaseClient => {
  const client = getSupabaseCrmMirrorClient();
  if (!client) {
    throw new Error(
      "Job listing AI ledger is stored only in Supabase. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.example).",
    );
  }
  return client;
};

/**
 * Inserts one `job_listing_ai_requests` row. Requires Supabase env; throws on PostgREST error.
 */
export const syncJobListingAiRequestToSupabase = async (row: JobListingAiRequest): Promise<void> => {
  const client = requireJobListingSupabaseClient();
  const { error } = await client.from("job_listing_ai_requests").insert({
    id: row.id,
    job_id: row.jobId,
    scrape_run_id: scrapeRunIdOrNull(row.scrapeRunId),
    provider: row.provider,
    model: row.model,
    system_prompt: row.systemPrompt,
    user_message: row.userMessage,
    request_payload_json: row.requestPayloadJson,
    created_at: row.createdAt,
  });
  if (error) {
    console.error("❌ Supabase job_listing_ai_requests insert", error.message, error);
    throw new Error(`job_listing_ai_requests insert failed: ${error.message}`);
  }
  console.log("📤 Supabase: job_listing_ai_requests", { id: row.id, jobId: row.jobId });
};

/**
 * Inserts one `job_listing_ai_responses` row. Requires Supabase env; throws on PostgREST error.
 */
export const syncJobListingAiResponseToSupabase = async (row: JobListingAiResponse): Promise<void> => {
  const client = requireJobListingSupabaseClient();
  const { error } = await client.from("job_listing_ai_responses").insert({
    id: row.id,
    request_id: row.requestId,
    model: row.model,
    status: row.status,
    raw_response: row.rawResponse,
    parsed_response_json: row.parsedResponseJson,
    error_message: row.errorMessage,
    usage_input_tokens: row.usageInputTokens,
    usage_output_tokens: row.usageOutputTokens,
    created_at: row.createdAt,
  });
  if (error) {
    console.error("❌ Supabase job_listing_ai_responses insert", error.message, error);
    throw new Error(`job_listing_ai_responses insert failed: ${error.message}`);
  }
  console.log("📤 Supabase: job_listing_ai_responses", { id: row.id, requestId: row.requestId });
};

/**
 * Inserts one `job_listing_ai_exchanges` row. Requires Supabase env; throws on PostgREST error.
 */
export const syncJobListingAiExchangeToSupabase = async (row: JobListingAiExchange): Promise<void> => {
  const client = requireJobListingSupabaseClient();
  const { error } = await client.from("job_listing_ai_exchanges").insert({
    id: row.id,
    job_id: row.jobId,
    scrape_run_id: scrapeRunIdOrNull(row.scrapeRunId),
    request_id: row.requestId,
    response_id: row.responseId,
    created_at: row.createdAt,
  });
  if (error) {
    console.error("❌ Supabase job_listing_ai_exchanges insert", error.message, error);
    throw new Error(`job_listing_ai_exchanges insert failed: ${error.message}`);
  }
  console.log("📤 Supabase: job_listing_ai_exchanges", { id: row.id, jobId: row.jobId });
};
