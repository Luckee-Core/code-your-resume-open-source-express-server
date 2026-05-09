import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Link Job Studio request to exchange/response after AI completes.
 */
export const updateJobStudioRequestCompletion = async (
  supabase: SupabaseClient,
  requestId: string,
  params: {
    exchangeId: string;
    responseId: string;
    status: "completed" | "failed";
  },
): Promise<void> => {
  const { error } = await supabase
    .from("job_studio_requests")
    .update({
      exchange_id: params.exchangeId,
      response_id: params.responseId,
      status: params.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) {
    console.error("❌ updateJobStudioRequestCompletion:", error);
    throw new Error(error.message);
  }
};
