import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Create a pending ICP Studio chat request (user message).
 */
export const insertUserBackgroundStudioRequest = async (
  supabase: SupabaseClient,
  params: {
    id: string;
    userId: string;
    profileId: string;
    content: string;
  },
): Promise<void> => {
  const now = new Date().toISOString();
  const { error } = await supabase.from('user_background_studio_requests').insert({
    id: params.id,
    user_id: params.userId,
    profile_id: params.profileId,
    content: params.content,
    status: 'pending',
    created_at: now,
    updated_at: now,
  });

  if (error) {
    console.error('❌ insertUserBackgroundStudioRequest:', error);
    throw new Error(error.message);
  }
};
