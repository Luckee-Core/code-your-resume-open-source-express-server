import { SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { getMaxSortOrderForUserBackgroundSegment } from './max-sort-order-for-segment';
import { insertUserBackgroundSegmentItem } from './insert-user-background-segment-item';
import { updateUserBackgroundSegmentItem } from './update-user-background-segment-item';
import { updateUserBackgroundSegmentSuggestionStatus } from './update-user-background-segment-suggestion-status';
import { syncUserBackgroundVersionSectionsFromSegmentItems } from './sync-user-background-version-sections-from-segment-items';
import { INITIAL_USER_BACKGROUND_SECTIONS_JSON } from './initial-sections';

const VALID_KEYS = new Set<string>(INITIAL_USER_BACKGROUND_SECTIONS_JSON.map((s) => s.key));

/**
 * Apply a pending coach suggestion: mutate segment items and refresh denormalized section bodies.
 */
export const acceptUserBackgroundSegmentSuggestion = async (
  supabase: SupabaseClient,
  params: {
    suggestionId: string;
    userId: string;
    profileId: string;
    segmentKey: string;
    title: string;
    body: string | null;
    op: 'add' | 'update';
    targetItemId: string | null;
    exchangeId: string;
  },
): Promise<void> => {
  if (!VALID_KEYS.has(params.segmentKey)) {
    throw new Error('Invalid segment key');
  }

  if (params.op === 'add') {
    const max = await getMaxSortOrderForUserBackgroundSegment(supabase, params.profileId, params.segmentKey);
    await insertUserBackgroundSegmentItem(supabase, {
      id: uuidv4(),
      profileId: params.profileId,
      segmentKey: params.segmentKey,
      sortOrder: max + 1,
      title: params.title.trim() || params.segmentKey,
      body: params.body,
      status: 'active',
      sourceExchangeId: params.exchangeId,
    });
  } else if (params.op === 'update') {
    if (!params.targetItemId) {
      throw new Error('targetItemId required for update');
    }
    await updateUserBackgroundSegmentItem(supabase, params.targetItemId, {
      title: params.title.trim() || undefined,
      body: params.body,
      sourceExchangeId: params.exchangeId,
    });
  }

  await updateUserBackgroundSegmentSuggestionStatus(supabase, params.suggestionId, 'accepted');
  await syncUserBackgroundVersionSectionsFromSegmentItems(supabase, params.profileId, params.userId);
};
