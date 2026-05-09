import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Create a pending Job Studio chat request (user message).
 */
export const insertJobStudioRequest = async (
  supabase: SupabaseClient,
  params: {
    id: string;
    jobId: string;
    userId: string;
    content: string;
  },
): Promise<void> => {
  const now = new Date().toISOString();
  const { error } = await supabase.from("job_studio_requests").insert({
    id: params.id,
    job_id: params.jobId,
    user_id: params.userId,
    content: params.content,
    status: "pending",
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error("❌ insertJobStudioRequest:", error);
    throw new Error(error.message);
  }
};
